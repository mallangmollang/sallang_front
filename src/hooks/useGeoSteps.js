import { useEffect, useRef, useState } from "react";

// 두 좌표 사이 거리(m)
function haversine(a, b) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

const stepLengthFromHeight = (heightCm) =>
  heightCm ? 0.415 * (heightCm / 100) : 0.7;

export default function useGeoSteps({
  heightCm,
  minAccuracy = 50,
  minMoveM = 3,
  minSpeed = 0.3,
  pauseWhenHidden = true,
} = {}) {
  const [coords, setCoords] = useState(null);
  const [distanceM, setDistanceM] = useState(0);
  const [steps, setSteps] = useState(0);
  const [restMinutes, setRestMinutes] = useState(0);
  const [error, setError] = useState(null);
  const [watching, setWatching] = useState(false);

  const watchIdRef = useRef(null);
  const lastFix = useRef(null);
  const lastTs = useRef(null);
  const restAccMs = useRef(0);

  const opts = { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 };

  const handleFix = (pos) => {
    const now = Date.now();
    const fix = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracy: pos.coords.accuracy ?? null,
      timestamp: pos.timestamp,
    };
    setCoords(fix);

    if (!lastFix.current) {
      lastFix.current = fix;
      lastTs.current = now;
      return;
    }

    if (fix.accuracy && fix.accuracy > minAccuracy) {
      lastTs.current = now;
      return;
    }

    const dtMs = Math.max(1, now - (lastTs.current ?? now));
    const d = haversine(lastFix.current, fix);
    const speed = (d / dtMs) * 1000;
    const moved = d >= minMoveM && speed >= minSpeed;

    if (moved) {
      setDistanceM((prev) => prev + d);
      restAccMs.current = 0;
      setRestMinutes(0);
    } else {
      restAccMs.current += dtMs;
      setRestMinutes(Math.floor(restAccMs.current / 60000));
    }

    lastFix.current = fix;
    lastTs.current = now;
  };

  const start = () => {
    if (!navigator.geolocation || watchIdRef.current) return;
    setError(null);

    // 첫 좌표 빠르게
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const now = Date.now();
        const fix = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy ?? null,
          timestamp: pos.timestamp,
        };
        setCoords(fix);
        lastFix.current = fix;
        lastTs.current = now;
      },
      (err) => setError(err),
      opts
    );

    // 지속 추적
    const id = navigator.geolocation.watchPosition(
      handleFix,
      (err) => {
        setError(err);
        setWatching(false);
      },
      opts
    );
    watchIdRef.current = id;
    setWatching(true);
  };

  const stop = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setWatching(false);
    }
  };

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!pauseWhenHidden) return;
    const onVis = () => {
      if (document.visibilityState === "hidden") stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pauseWhenHidden]);

  useEffect(() => {
    const stepLen = stepLengthFromHeight(heightCm);
    setSteps(Math.max(0, Math.round(distanceM / stepLen)));
  }, [distanceM, heightCm]);

  const reset = () => {
    setDistanceM(0);
    setSteps(0);
    restAccMs.current = 0;
    setRestMinutes(0);
    lastFix.current = null;
    lastTs.current = null;
  };

  return {
    coords,
    distanceM,
    steps,
    restMinutes,
    error,
    watching,
    start,
    stop,
    reset,
  };
}
