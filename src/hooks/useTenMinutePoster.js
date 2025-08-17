import { useEffect, useRef } from "react";

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** 지정한 간격으로 payloadBuilder()의 결과를 POST. null을 반환하면 스킵 */
export default function useTenMinutePoster({
  endpoint,
  payloadBuilder,
  intervalMs = 600_000,
  sendImmediately = true,
}) {
  const timerRef = useRef(null);

  useEffect(() => {
    const tick = async () => {
      try {
        const payload = payloadBuilder?.();
        if (!payload) return;
        await postJSON(endpoint, payload);
      } catch (e) {
        console.warn("post failed", e);
      }
    };

    if (sendImmediately) tick();
    timerRef.current = setInterval(tick, intervalMs);

    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(timerRef.current);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [endpoint, intervalMs, payloadBuilder, sendImmediately]);
}
