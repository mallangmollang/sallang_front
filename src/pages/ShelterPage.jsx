import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShelterCard from "../components/ShelterCard";

const joinUrl = (base, path) =>
  base ? `${String(base).replace(/\/$/, "")}${path}` : path;

function toNum(v) {
  if (v == null) return null;
  const n = typeof v === "string" ? parseFloat(v) : Number(v);
  return Number.isFinite(n) ? n : null;
}

// 두 좌표 사이 직선거리(m)
function haversine(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
}

function useMyCoords() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(new Error("이 기기에서 위치를 사용할 수 없어요."));
      return;
    }
    const opts = { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 };

    // 첫 좌표 한 번만
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: pos.coords.accuracy ?? null,
        });
      },
      (err) => setError(err),
      opts
    );
  }, []);

  return { coords, error };
}

export default function ShelterPage() {
  const navigate = useNavigate();

  const { coords, error: geoErr } = useMyCoords();

  const apiBase = import.meta.env.VITE_API_URL ?? "";
  const endpoint = useMemo(() => joinUrl(apiBase, "/api/restarea"), [apiBase]);

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const abortRef = useRef(null);

  // 응답 → 카드 매핑(+거리 계산/정렬)
  const mapAndSort = (arr, me) => {
    const out = (arr || []).map((it) => {
      const lat = toNum(it.lat ?? it.latitude);
      const lon = toNum(it.lon ?? it.longitude);

      let dist = toNum(it.distance ?? it.distanceM ?? it["distance_m"]);

      if (
        dist == null &&
        me &&
        Number.isFinite(me.lat) &&
        Number.isFinite(me.lon) &&
        Number.isFinite(lat) &&
        Number.isFinite(lon) &&
        !(lat === 0 && lon === 0)
      ) {
        dist = haversine(me.lat, me.lon, lat, lon);
      }

      return {
        id: it.placeId ?? it.id ?? `${lat ?? "?"},${lon ?? "?"}`,
        name: it.name ?? "(이름 없음)",
        category: "쉼터",
        roadAddress: it.address ?? it.roadAddress ?? "",
        phone: it.phone ?? "",
        distanceM: dist ?? null,
        position:
          Number.isFinite(lat) &&
          Number.isFinite(lon) &&
          !(lat === 0 && lon === 0)
            ? { lat, lng: lon }
            : null,
      };
    });

    // 거리 오름차순(거리 없는 항목은 뒤로)
    out.sort((a, b) => {
      if (a.distanceM == null && b.distanceM == null) return 0;
      if (a.distanceM == null) return 1;
      if (b.distanceM == null) return -1;
      return a.distanceM - b.distanceM;
    });

    return out;
  };

  const fetchList = async () => {
    if (!coords?.lat || !coords?.lon) return;
    if (abortRef.current) abortRef.current.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setLoading(true);
    setErrMsg("");
    try {
      const url = `${endpoint}?lat=${encodeURIComponent(
        coords.lat
      )}&lon=${encodeURIComponent(coords.lon)}`;

      const res = await fetch(url, { signal: ac.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      const mapped = mapAndSort(json, { lat: coords.lat, lon: coords.lon });
      setList(mapped);
      setErrMsg("");
    } catch (e) {
      if (e.name === "AbortError") return;
      setErrMsg(e.message || "쉼터 목록을 가져오지 못했습니다.");
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  useEffect(() => {
    if (coords?.lat && coords?.lon) fetchList();
  }, [coords?.lat, coords?.lon, endpoint]);

  return (
    <div className="max-w-screen-sm mx-auto p-4">
      <header className="sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 grid place-items-center rounded-full text-2xl"
            aria-label="뒤로가기"
          >
            ←
          </button>
          <h1 className="text-lg text-center w-full font-bold">근처 쉼터</h1>
          <button className="w-9 h-9"></button>
        </div>
        <div className="h-px bg-neutral-200" />
      </header>

      {(errMsg || geoErr) && (
        <div className="mt-3 rounded-xl bg-red-50 text-red-700 px-4 py-3">
          {geoErr
            ? geoErr.message
            : `쉼터 목록을 가져오지 못했습니다. (${errMsg})`}
        </div>
      )}

      <div className="flex flex-col gap-4 py-4">
        {loading && list.length === 0 && (
          <div className="text-center text-sm text-neutral-500 py-6">
            불러오는 중…
          </div>
        )}

        {list.map((s) => (
          <ShelterCard key={s.id} {...s} />
        ))}

        {!loading && list.length === 0 && !errMsg && (
          <div className="text-center text-sm text-neutral-500 py-6">
            근처에 표시할 쉼터가 없어요.
          </div>
        )}
      </div>
    </div>
  );
}
