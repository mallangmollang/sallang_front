import { useEffect, useMemo, useRef, useState } from "react";

const joinUrl = (base, path) =>
  base ? `${String(base).replace(/\/$/, "")}${path}` : path;

const round = (n, p = 3) => Math.round(n * 10 ** p) / 10 ** p;

export default function useWeather({
  coords,
  intervalMs = 600_000, // 10분
} = {}) {
  const apiBase = import.meta.env.VITE_API_URL ?? "";
  const endpoint = useMemo(() => joinUrl(apiBase, "/api/weather"), [apiBase]);

  const [state, setState] = useState({
    temperature: null,
    humidityPercentage: null,
    uvIndex: null,
    loading: false,
    error: null,
  });

  const timerRef = useRef(null);
  const inflightRef = useRef(false);
  const lastFetchAtRef = useRef(0);
  const lastKeyRef = useRef("");

  const lat = coords?.latitude ?? null;
  const lon = coords?.longitude ?? null;

  // 좌표는 너무 민감하게 변동하니 0.001도(약 100m) 단위로 라운딩해서 키로 사용
  const coordKey = useMemo(
    () =>
      lat != null && lon != null ? `${round(lat, 3)},${round(lon, 3)}` : "",
    [lat, lon]
  );

  const fetchWeather = async () => {
    if (!coordKey || inflightRef.current) return;

    inflightRef.current = true;
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lon }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const d = json?.data ?? json;

      setState({
        temperature: d?.temperature ?? null,
        humidityPercentage: d?.humidityPercentage ?? null,
        uvIndex: d?.uvIndex ?? null,
        loading: false,
        error: null,
      });

      lastFetchAtRef.current = Date.now();
      lastKeyRef.current = coordKey;
    } catch (err) {
      // 실패해도 무한 요청 방지를 위해 약한 백오프
      lastFetchAtRef.current = Date.now() - (intervalMs - 30_000);
      setState((s) => ({ ...s, loading: false, error: err }));
      console.warn("useWeather fetch failed:", err);
    } finally {
      inflightRef.current = false;
    }
  };

  useEffect(() => {
    // 좌표가 새 키로 바뀌면 즉시 1회만 호출
    if (coordKey && coordKey !== lastKeyRef.current) {
      fetchWeather();
    }

    // 기존 타이머 정리 후 새로 구성 (중복 방지)
    if (timerRef.current) clearInterval(timerRef.current);

    // 10초마다 "갱신 필요 여부"만 확인하고, 실제 호출은 10분 경과시에만
    timerRef.current = setInterval(() => {
      const stale = Date.now() - lastFetchAtRef.current >= intervalMs;
      if (stale) fetchWeather();
    }, 10_000);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        const stale = Date.now() - lastFetchAtRef.current >= intervalMs;
        if (stale) fetchWeather();
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      document.removeEventListener("visibilitychange", onVisible);
    };
    // endpoint/coordKey/intervalMs가 바뀔 때만 재설정
  }, [endpoint, coordKey, intervalMs]);

  return state;
}
