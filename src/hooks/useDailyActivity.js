import { useEffect, useRef, useState } from "react";

// 로컬 타임존 기준 YYYY-MM-DD
function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `activity:${y}-${m}-${day}`;
}

export function useDailyActivity() {
  const [waterMl, setWaterMl] = useState(0);
  // 식사 여부는 이미 UI에서 제거했지만, 훅을 쓰던 코드가 있을 수 있어 남겨둡니다(미사용이면 안전히 무시됨)
  const [mealDone, setMealDone] = useState(false);
  const [sleepHours, setSleepHours] = useState(0);

  const [KEY, setKEY] = useState(() => todayKey());
  const hydratedRef = useRef(false);
  const [hydrated, setHydrated] = useState(false);

  // 자정/포커스/가시성 복귀 시 키 갱신
  useEffect(() => {
    const refresh = () => setKEY(todayKey());

    const scheduleMidnightTick = () => {
      const now = new Date();
      const next = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        1
      );
      const id = setTimeout(() => {
        refresh();
        midnightId.current = scheduleMidnightTick();
      }, next - now);
      return id;
    };

    const midnightId = { current: null };
    midnightId.current = scheduleMidnightTick();

    const onVisible = () => document.visibilityState === "visible" && refresh();
    const onFocus = () => refresh();

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onFocus);
    return () => {
      clearTimeout(midnightId.current);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  // 1) 로드
  useEffect(() => {
    hydratedRef.current = false;
    setHydrated(false);
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (typeof saved.waterIntakeMl === "number")
          setWaterMl(saved.waterIntakeMl);
        if (typeof saved.mealCompleted === "boolean")
          setMealDone(saved.mealCompleted);
        if (typeof saved.sleepHours === "number")
          setSleepHours(saved.sleepHours);
        // saved.sleepAtLeast 는 더 이상 사용하지 않음(무시)
      } else {
        setWaterMl(0);
        setMealDone(false);
        setSleepHours(0);
      }
    } catch (e) {
      console.warn("load failed", e);
    } finally {
      hydratedRef.current = true;
      setHydrated(true);
    }
  }, [KEY]);

  // 2) 저장 — water + mealDone(있으면) + sleepHours 만 저장
  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      const prev = JSON.parse(localStorage.getItem(KEY) || "{}");
      const next = {
        ...prev,
        waterIntakeMl: waterMl,
        mealCompleted: mealDone,
        sleepHours, // ✅ atLeast 저장 안 함
      };
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch (e) {
      console.warn("save failed", e);
    }
  }, [KEY, waterMl, mealDone, sleepHours]);

  // 액션
  const addWater = () => setWaterMl((v) => Math.max(0, v + 100));
  const subWater = () => setWaterMl((v) => Math.max(0, v - 100));
  const toggleMeal = () => setMealDone((v) => !v);
  const setSleep = (h) => setSleepHours(h); // ✅ atLeast 처리 없음(표시는 컴포넌트에서)

  return {
    waterMl,
    addWater,
    subWater,
    mealDone, // 쓰지 않으면 무시
    toggleMeal, // 쓰지 않으면 무시
    sleepHours,
    setSleep,
    hydrated,
    KEY,
  };
}
