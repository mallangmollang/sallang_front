import { useEffect, useState } from "react";

const STEP_ML = 100;
const STORAGE_KEY = () => `activity:${new Date().toISOString().slice(0, 10)}`;

export default function ConditionCard() {
  const [waterMl, setWaterMl] = useState(0);
  const [mealDone, setMealDone] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY());
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (typeof saved.waterIntakeMl === "number")
        setWaterMl(saved.waterIntakeMl);
      if (typeof saved.mealCompleted === "boolean")
        setMealDone(saved.mealCompleted);
    } catch {
      console.log("Error");
    }
  }, []);

  useEffect(() => {
    try {
      const prev = JSON.parse(localStorage.getItem(STORAGE_KEY()) || "{}");
      const next = {
        ...prev,
        waterIntakeMl: waterMl,
        mealCompleted: mealDone,
      };
      localStorage.setItem(STORAGE_KEY(), JSON.stringify(next));
    } catch {
      console.log("Error");
    }
  }, [waterMl, mealDone]);

  const waterDisplay = waterMl === 0 ? "0ml" : `${waterMl.toLocaleString()}ml`;

  const addWater = () => setWaterMl((v) => Math.max(0, v + STEP_ML));

  return (
    <div className="flex flex-col gap-6 p-5 border-2 border-neutral-200 rounded-2xl">
      <h2 className="text-xl font-extrabold text-center">오늘의 컨디션</h2>

      <div className="flex gap-3 px-2">
        <button
          type="button"
          onClick={addWater}
          className="flex-1 h-28 p-3 rounded-2xl border-2 bg-blue-50/40 border-blue-300 hover:bg-blue-50 transition"
        >
          <div className="flex h-full flex-col items-center justify-center gap-1">
            <span className="text-2xl">💧</span>
            <span className="text-sm font-bold">물</span>
            <span className="text-blue-600 font-extrabold">{waterDisplay}</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setMealDone((v) => !v)}
          className={`flex-1 h-28 p-3 rounded-2xl border-2 transition
            ${
              mealDone
                ? "bg-green-50/40 border-green-300"
                : "bg-gray-50 border-gray-300 hover:bg-gray-100"
            }`}
        >
          <div className="flex h-full flex-col items-center justify-center gap-1">
            <span className="text-2xl">🍚</span>
            <span className="text-sm font-bold">식사</span>
            <span
              className={`${
                mealDone ? "text-green-600" : "text-gray-500"
              } font-extrabold`}
            >
              {mealDone ? "완료" : "미완료"}
            </span>
          </div>
        </button>
      </div>
      <button className="flex items-center justify-center w-full h-[5vh] bg-neutral-300 rounded-xl text-white text-lg font-bold">
        상세 입력하기
      </button>
    </div>
  );
}
