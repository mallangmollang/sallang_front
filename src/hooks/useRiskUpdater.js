import { useEffect, useMemo, useRef, useState } from "react";

const joinUrl = (base, path) =>
  base ? `${String(base).replace(/\/$/, "")}${path}` : path;

export default function useRiskUpdater({
  active = true,
  payloadBuilder,
  intervalMs = 300_000, // 5분
  sendImmediately = true,
  pauseWhenHidden = true,
  retryMsIfNoPayload = 2_000, // payload 없으면 2초 후 재시도
  retryMsIfError = 15_000,
  cacheKey = "risk:last",
} = {}) {
  const endpoint = useMemo(() => {
    const base = import.meta.env.VITE_API_URL ?? "";
    return joinUrl(base, "/api/risk/calculate");
  }, []);

  const [state, setState] = useState({
    riskScore: null,
    temperature: null,
    humidityPercentage: null,
    uvIndex: null,
    ai_advice: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const inflight = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!cacheKey) return;
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) {
        const cached = JSON.parse(raw);
        if (cached && typeof cached === "object") setState(cached);
      }
    } catch {
      console.log("err");
    }
  }, [cacheKey]);

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };
  const scheduleNext = (delay) => {
    clearTimer();
    timerRef.current = setTimeout(run, delay);
  };

  const run = async () => {
    if (!active || inflight.current) return;

    const body = payloadBuilder?.();
    if (!body) {
      // 아직 coords/hydrated 준비 전 ⇒ 짧게 재시도
      scheduleNext(retryMsIfNoPayload);
      return;
    }

    inflight.current = true;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const rr = json?.data?.realtimeRisk ?? {};

      const next = {
        riskScore: rr?.heatstrokeRiskScore ?? 0,
        temperature: rr?.temperature ?? null,
        humidityPercentage: rr?.humidityPercentage ?? null,
        uvIndex: rr?.uvIndex ?? null,
        ai_advice: json?.ai_advice ?? "",
      };
      setState(next);

      // 캐시 저장
      if (cacheKey) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(next));
        } catch {
          console.log("err");
        }
      }

      scheduleNext(intervalMs);
    } catch (e) {
      setError(e);
      scheduleNext(retryMsIfError);
    } finally {
      setLoading(false);
      inflight.current = false;
    }
  };

  useEffect(() => {
    clearTimer();
    if (!active) return;
    if (sendImmediately) run();
    else scheduleNext(intervalMs);
    return clearTimer;
  }, [active, endpoint, intervalMs, sendImmediately]);

  useEffect(() => {
    if (!pauseWhenHidden) return;
    const onVis = () => {
      if (document.visibilityState === "hidden") {
        clearTimer();
      } else if (document.visibilityState === "visible" && active) {
        scheduleNext(0);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [active, pauseWhenHidden]);

  return { ...state, loading, error, refresh: run };
}
