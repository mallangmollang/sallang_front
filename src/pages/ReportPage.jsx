import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import onBoardingIcon1 from "../assets/onBoardingIcon/onBoardingIcon1.svg";
import CheckIcon from "../assets/checkIcon.svg";
import number_1 from "../assets/number_1.svg";
import number_2 from "../assets/number_2.svg";
import number_3 from "../assets/number_3.svg";
import WorkRestBar from "../components/WorkRestBar";
import MetricCard from "../components/MetricCard";
import HealthScoreCard from "../components/HealthScoreCard";
import AiAnalysisCard from "../components/AiAnalysisCard";
import TomorrowSuggestionsCard from "../components/TomorrowSuggestionsCard";
import weatherIcon from "../assets/weatherIcon.svg";
import waterIntakeIcon from "../assets/waterIntakeIcon.svg";
import stepIcon from "../assets/stepIcon.svg";

const fmtInt = (n, unit = "") =>
  Number.isFinite(n) ? n.toLocaleString() + unit : "-";
const fmtTemp = (t) => (Number.isFinite(t) ? `${Math.round(t)}°C` : "-");
const fmtPercent = (p) => (Number.isFinite(p) ? `${Math.round(p)}%` : "-");

function mapSuggestions(arr = []) {
  const icons = [number_1, number_2, number_3];
  const colors = ["green", "blue", "purple"];
  return arr.slice(0, 3).map((text, i) => ({
    icon: icons[i] ?? number_1,
    title: text,
    description: "",
    color: colors[i] ?? "green",
  }));
}

export default function ReportPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [report, setReport] = useState(() => state?.report ?? null);
  useEffect(() => {
    if (state?.report) return;
    try {
      const raw = localStorage.getItem("report:last");
      if (raw) setReport(JSON.parse(raw));
    } catch {
      console.log("error");
    }
  }, [state?.report]);

  const parsed = useMemo(() => {
    const r = report ?? {};
    const weather = r.weather ?? {};
    const raw = r.raw ?? {};
    const health = r.health ?? {};
    const scores = health.scores ?? {};
    return {
      date: r.date ?? "-",
      temperature: weather.temperature,
      humidity: weather.humidity,
      steps: raw.steps,
      waterIntake: raw.waterIntake,
      workMinutes: raw.workMinutes,
      restMinutes: raw.restMinutes,
      hydrationScore: scores.hydration,
      restScore: scores.rest,
      symptomScore: scores.symptom,
      analysisComments: Array.isArray(health.analysisComments)
        ? health.analysisComments
        : [],
      tomorrowSuggestions: Array.isArray(health.tomorrowSuggestions)
        ? health.tomorrowSuggestions
        : [],
    };
  }, [report]);

  const totalHealthScore = useMemo(() => {
    const vals = [
      parsed.hydrationScore,
      parsed.restScore,
      parsed.symptomScore,
    ].filter((n) => Number.isFinite(n));
    if (!vals.length) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }, [parsed]);

  if (!report) {
    return (
      <div className="max-w-screen-sm mx-auto bg-white">
        <PageHeader title="일일 건강 리포트" />
        <div className="p-6 text-center text-neutral-500">
          리포트 데이터가 없어요.
          <br />
          메인에서 <b>리포트 생성하기</b>를 눌러 생성해 주세요.
          <div className="mt-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-lg bg-neutral-200"
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-sm mx-auto bg-white">
      <PageHeader title="일일 건강 리포트" />

      <div className="flex flex-col w-full justify-start bg-neutral-50 items-center gap-5 px-4 pb-15">
        <div className="grid grid-cols-3 w-full gap-3 auto-rows-fr pt-3 items-stretch">
          <MetricCard
            title="날씨"
            items={[
              { label: "평균 온도", value: fmtTemp(parsed.temperature) },
              { label: "평균 습도", value: fmtPercent(parsed.humidity) },
            ]}
            icon={weatherIcon}
          />
          <MetricCard
            title="수분 섭취"
            items={[{ label: "총", value: fmtInt(parsed.waterIntake, "ml") }]}
            icon={waterIntakeIcon}
          />
          <MetricCard
            title="걸음 수"
            items={[{ label: "총", value: fmtInt(parsed.steps) + "걸음" }]}
            icon={stepIcon}
          />
        </div>

        <div className="w-full px-6 py-4 border-2 border-red-200 bg-white rounded-[12px]">
          <p className="text-base font-bold text-black mb-3">
            총 노동시간 / 휴식시간 분석
          </p>
          <WorkRestBar
            workMinutes={Number(parsed.workMinutes) || 0}
            restMinutes={Number(parsed.restMinutes) || 0}
          />
        </div>

        <HealthScoreCard
          totalScore={totalHealthScore}
          details={[
            { label: "수분 섭취", score: Number(parsed.hydrationScore) || 0 },
            { label: "휴식 관리", score: Number(parsed.restScore) || 0 },
            { label: "증상 관리", score: Number(parsed.symptomScore) || 0 },
          ]}
        />

        <AiAnalysisCard
          icon={onBoardingIcon1}
          title="AI 건강 분석"
          messages={
            parsed.analysisComments.length
              ? parsed.analysisComments
              : ["오늘 데이터 분석 코멘트가 제공되지 않았어요."]
          }
        />

        <TomorrowSuggestionsCard
          CheckIcon={CheckIcon}
          suggestions={
            parsed.tomorrowSuggestions.length
              ? mapSuggestions(parsed.tomorrowSuggestions)
              : mapSuggestions([
                  "수분 섭취 알림 간격을 조금 더 촘촘히 해보세요.",
                  "오후 피크 시간대(예: 14~16시)에 짧은 휴식을 꼭 넣으세요.",
                  "자외선 노출 시간에는 그늘/모자/선크림을 활용하세요.",
                ])
          }
        />
      </div>
    </div>
  );
}
