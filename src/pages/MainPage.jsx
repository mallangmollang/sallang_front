import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import UserGreeting from "../components/UserGreeting";
import InfoCard from "../components/InfoCard";
import HearStrokeCard from "../components/HearStrokeCard";
import ConditionCard from "../components/ConditionCard";
import TipCard from "../components/TipCard";
import HeatRiskTimeline from "../components/HeatRistTimeLine";

import useRiskUpdater from "../hooks/useRiskUpdater";
import useWeather from "../hooks/useWeather";
import useGeoSteps from "../hooks/useGeoSteps";
import { useDailyActivity } from "../hooks/useDailyActivity";
import { LOGIN_FORM_STORAGE_KEY } from "../hooks/useLoginFormStorage";

function todayStr(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function hhmm(ms = Date.now()) {
  const d = new Date(ms);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}
const joinUrl = (base, path) =>
  base ? `${String(base).replace(/\/$/, "")}${path}` : path;

function parseEtcList(text) {
  return Array.from(
    new Set(
      (text ?? "")
        .split(/[,\u3001、]/)
        .map((s) => s.trim())
        .filter(Boolean)
    )
  );
}
function mapChronicToApi(korArray = []) {
  const map = {
    당뇨병: "diabetes",
    고혈압: "hypertension",
    심장병: "heart_disease",
    신장병: "kidney_disease",
  };
  return korArray.map((k) => map[k] ?? k).filter(Boolean);
}
const apiBase = import.meta.env.VITE_API_URL ?? "";

const MODE_LABEL = Object.freeze({
  idle: "대기",
  work: "작업 중",
  rest: "휴식 중",
  ended: "종료",
});
function modePillClass(mode) {
  switch (mode) {
    case "idle":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "work":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "rest":
      return "bg-green-100 text-green-700 border-green-200";
    case "ended":
      return "bg-neutral-100 text-neutral-600 border-neutral-200";
    default:
      return "bg-neutral-100 text-neutral-600 border-neutral-200";
  }
}

function readProfileFromLoginStorage() {
  try {
    const raw = localStorage.getItem(LOGIN_FORM_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const sexMap = {
      남: "male",
      남성: "male",
      male: "male",
      여: "female",
      여성: "female",
      female: "female",
    };
    const sex = sexMap[data.gender] ?? "unknown";

    let korChronic = [];
    if (!data?.conditions?.없음) {
      const base = ["당뇨병", "고혈압", "심장병", "신장병"].filter(
        (k) => !!data?.conditions?.[k]
      );
      const extras =
        data?.conditions?.기타 && data?.etcText
          ? parseEtcList(data.etcText)
          : [];
      korChronic = base.concat(extras);
    }
    return {
      name: data.name ?? "사용자",
      heightCm: Number(data.height ?? 0),
      weightKg: Number(data.weight ?? 0),
      sex,
      chronicKor: korChronic,
      chronicConditions: mapChronicToApi(korChronic),
      age: Number.isFinite(Number(data.age)) ? Number(data.age) : 0,
    };
  } catch (err) {
    console.warn("readProfileFromLoginStorage failed:", err);
    return null;
  }
}

export default function MainPage() {
  const navigate = useNavigate();

  const profile = useMemo(() => readProfileFromLoginStorage(), []);

  const medications = useMemo(() => {
    try {
      const raw = localStorage.getItem("medications:v1");
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (err) {
      console.warn("load medications failed:", err);
      return [];
    }
  }, []);

  const { waterMl, hydrated, sleepHours, addWater, subWater, setSleep } =
    useDailyActivity();

  const physicalInfo = useMemo(
    () => ({
      heightCm: profile?.heightCm ?? 175,
      weightKg: profile?.weightKg ?? 70,
      gender: profile?.sex ?? "unknown",
      age: profile?.age ?? 0,
    }),
    [profile]
  );

  const {
    coords,
    steps,
    restMinutes: geoRestMinutes,
  } = useGeoSteps({
    heightCm: physicalInfo.heightCm,
  });

  const DAY = useMemo(() => todayStr(), []);
  const SESS_KEY = useMemo(() => `workrest:${DAY}`, [DAY]);
  const [session, setSession] = useState(() => {
    try {
      const raw = localStorage.getItem(SESS_KEY);
      return raw
        ? JSON.parse(raw)
        : {
            mode: "idle",
            workSec: 0,
            restSec: 0,
            workStart: null,
            restStart: null,
            restWindows: [],
          };
    } catch (err) {
      console.warn("load session failed:", err);
      return {
        mode: "idle",
        workSec: 0,
        restSec: 0,
        workStart: null,
        restStart: null,
        restWindows: [],
      };
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(SESS_KEY, JSON.stringify(session));
    } catch (err) {
      console.warn("save session failed:", err);
    }
  }, [SESS_KEY, session]);
  useEffect(() => {
    const id = setInterval(() => {
      setSession((s) => {
        const now = Date.now();
        if (s.mode === "work" && s.workStart) {
          const delta = Math.max(0, Math.floor((now - s.workStart) / 1000));
          return { ...s, workSec: s.workSec + delta, workStart: now };
        }
        if (s.mode === "rest" && s.restStart) {
          const delta = Math.max(0, Math.floor((now - s.restStart) / 1000));
          return { ...s, restSec: s.restSec + delta, restStart: now };
        }
        return s;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const weather = useWeather({ coords, intervalMs: 600_000 });

  const buildRiskRequest = useCallback(() => {
    if (!coords || !hydrated) return null;
    return {
      lat: coords.latitude,
      lon: coords.longitude,
      age: Number(profile?.age ?? physicalInfo.age ?? 0),
      weight: Number(profile?.weightKg ?? physicalInfo.weightKg ?? 0),
      height: Number(profile?.heightCm ?? physicalInfo.heightCm ?? 0),
      sex: profile?.sex ?? "unknown",
      chronicConditions: profile?.chronicConditions ?? [],
      steps: Number(steps ?? 0),
      waterIntake: Number(waterMl ?? 0),
      restMinutes: Number(geoRestMinutes ?? 0),
      sleepMinutes: Math.max(0, Math.round((sleepHours ?? 0) * 60)),
    };
  }, [
    coords,
    hydrated,
    profile,
    physicalInfo,
    steps,
    waterMl,
    geoRestMinutes,
    sleepHours,
  ]);

  const risk = useRiskUpdater({
    active: session.mode === "work" || session.mode === "rest",
    payloadBuilder: buildRiskRequest,
    intervalMs: 300_000,
    sendImmediately: true,
  });
  useEffect(() => {
    if (
      (session.mode === "work" || session.mode === "rest") &&
      hydrated &&
      coords
    ) {
      risk.refresh();
    }
  }, [hydrated, coords, session.mode]);
  const startWork = () => {
    setSession((s) =>
      s.mode === "work" ? s : { ...s, mode: "work", workStart: Date.now() }
    );
  };
  const startRest = () =>
    setSession((s) => {
      if (s.mode !== "work") return s;
      const now = Date.now();
      return {
        ...s,
        mode: "rest",
        restStart: now,
        workStart: null,
        restWindows: [...s.restWindows, { start: hhmm(now), end: null }],
      };
    });
  const endRest = () =>
    setSession((s) => {
      if (s.mode !== "rest") return s;
      const now = Date.now();
      const windows = [...s.restWindows];
      if (windows.length && windows[windows.length - 1].end == null) {
        windows[windows.length - 1] = {
          ...windows[windows.length - 1],
          end: hhmm(now),
        };
      }
      const extra = s.restStart
        ? Math.max(0, Math.floor((now - s.restStart) / 1000))
        : 0;
      return {
        ...s,
        mode: "work",
        workStart: now,
        restStart: null,
        restSec: s.restSec + extra,
        restWindows: windows,
      };
    });
  const endWork = () =>
    setSession((s) => {
      if (s.mode === "idle" || s.mode === "ended") return s;
      const now = Date.now();
      let workSec = s.workSec,
        restSec = s.restSec;
      const windows = [...(s.restWindows || [])];
      if (s.mode === "work" && s.workStart) {
        workSec += Math.max(0, Math.floor((now - s.workStart) / 1000));
      }
      if (s.mode === "rest" && s.restStart) {
        restSec += Math.max(0, Math.floor((now - s.restStart) / 1000));
        if (windows.length && windows[windows.length - 1].end == null) {
          windows[windows.length - 1] = {
            ...windows[windows.length - 1],
            end: hhmm(now),
          };
        }
      }
      return {
        mode: "ended",
        workSec,
        restSec,
        workStart: null,
        restStart: null,
        restWindows: windows,
      };
    });

  const [creatingReport, setCreatingReport] = useState(false);
  const handleCreateReport = async () => {
    if (creatingReport) return;
    setCreatingReport(true);

    const meds =
      medications.length && typeof medications[0] === "object"
        ? medications.filter((m) => m.taken).map((m) => m.name)
        : medications;

    const restWindowsForReport = (session.restWindows || []).map((w) =>
      w.end ? w : { ...w, end: hhmm(Date.now()) }
    );

    const body = {
      lat: coords?.latitude ?? 0,
      lon: coords?.longitude ?? 0,
      date: todayStr(),
      height: Number(profile?.heightCm ?? 0),
      weight: Number(profile?.weightKg ?? 0),
      sex: profile?.sex ?? "unknown",
      chronicConditions: profile?.chronicConditions ?? [],
      steps: Number(steps ?? 0),
      sleepMinutes: Math.max(0, Math.round((sleepHours ?? 0) * 60)),
      waterIntake: Number(waterMl ?? 0),
      workMinutes: Math.floor(session.workSec / 60),
      restMinutes: Math.floor(session.restSec / 60),
      medications: meds,
      restWindows: restWindowsForReport,
      workWindows: [],
      riskWindows: [],
    };

    try {
      const res = await fetch(joinUrl(apiBase, "/api/reports"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // 새로고침 대비 로컬 백업
      try {
        localStorage.setItem("report:last", JSON.stringify(data));
      } catch {
        console.log("error");
      }

      navigate("/report", { state: { report: data } });
    } catch (e) {
      console.warn("report post failed:", e);
      alert("리포트 생성 실패: " + (e.message || "네트워크 오류"));
    } finally {
      setCreatingReport(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 p-4">
      <UserGreeting name={profile?.name ?? "사용자"} />

      {/* 상단 지표: 날씨(우선) + 걸음 */}
      <InfoCard
        temperatureC={weather.temperature ?? risk.temperature ?? "-"}
        humidityPercentage={
          weather.humidityPercentage ?? risk.humidityPercentage ?? "-"
        }
        stepsCount={steps}
      />

      {/* 위험도 카드: /api/risk 결과 */}
      <HearStrokeCard
        riskScore={risk.riskScore ?? 0}
        temperatureC={risk.temperature ?? 0}
        ai_advice={risk.ai_advice || ""}
      />

      <ConditionCard
        waterMl={waterMl}
        addWater={addWater}
        subWater={subWater}
        sleepHours={sleepHours}
        setSleep={setSleep}
      />

      {/* 작업/휴식 요약 + 상태 배지 */}
      <div className="rounded-xl border border-neutral-200 px-6 py-3 flex items-center justify-between">
        <div className="text-sm text-neutral-600">
          <div>
            작업 시간:{" "}
            <span className="font-bold text-neutral-900">
              {Math.floor(session.workSec / 60)}분
            </span>
          </div>
          <div>
            휴식 시간:{" "}
            <span className="font-bold text-neutral-900">
              {Math.floor(session.restSec / 60)}분
            </span>
          </div>
        </div>
        <span
          className={[
            "text-xs inline-flex items-center border px-3 py-1.5 rounded-full whitespace-nowrap",
            modePillClass(session.mode),
          ].join(" ")}
        >
          {MODE_LABEL[session.mode] ?? session.mode}
        </span>
      </div>

      {session.mode === "idle" || session.mode === "ended" ? (
        <button
          onClick={startWork}
          className="flex items-center justify-center w-full h-[7vh] bg-orange-400 rounded-2xl text-white text-lg font-bold"
        >
          작업 시작
        </button>
      ) : session.mode === "work" ? (
        <div className="flex gap-3">
          <button
            onClick={startRest}
            className="flex-1 h-[7vh] bg-neutral-300 rounded-2xl text-white text-lg font-bold"
          >
            휴식 시작
          </button>
          <button
            onClick={endWork}
            className="flex-1 h-[7vh] bg-orange-500 rounded-2xl text-white text-lg font-bold"
          >
            작업 종료
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={endRest}
            className="flex-1 h-[7vh] bg-green-500 rounded-2xl text-white text-lg font-bold"
          >
            휴식 종료
          </button>
          <button
            onClick={endWork}
            className="flex-1 h-[7vh] bg-orange-500 rounded-2xl text-white text-lg font-bold"
          >
            작업 종료
          </button>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => navigate("/shelter")}
          className="flex items-center justify-center w-[45vw] h-[10vh] bg-orange-300 rounded-xl text-white text-lg font-bold"
        >
          근처 쉼터 보기
        </button>
        <button
          onClick={() => navigate("/medications")}
          className="flex items-center justify-center w-[45vw] h-[10vh] bg-orange-300 rounded-xl text-white text-lg font-bold"
        >
          내 약 관리하기
        </button>
      </div>

      <button
        onClick={handleCreateReport}
        disabled={creatingReport}
        className={`flex items-center justify-center w-full h-[5vh] rounded-xl text-white text-lg font-bold ${
          creatingReport ? "bg-orange-200" : "bg-orange-300"
        }`}
      >
        {creatingReport ? "생성 중…" : "리포트 생성하기"}
      </button>

      <TipCard />
    </div>
  );
}
