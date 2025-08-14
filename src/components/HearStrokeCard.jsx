import { useEffect, useId, useState } from "react";

export default function HearStrokeCard({
  riskScore = 0,
  temperatureC = 0,
  ai_advice = "",
}) {
  const score = Math.max(0, Math.min(100, Number(riskScore) || 0));

  const vb = 200;
  const r = 80;
  const stroke = 10;
  const C = 2 * Math.PI * r;

  const [animScore, setAnimScore] = useState(0);
  useEffect(() => {
    setAnimScore(0); // 0으로 초기화
    const id = requestAnimationFrame(() => {
      // 다음 프레임에 목표치로
      setAnimScore(score);
    });
    return () => cancelAnimationFrame(id);
  }, [score]);

  const offset = C - C * (animScore / 100);

  const safe = score <= 50;
  const grad = safe ? ["#10B981", "#22C55E"] : ["#EF4444", "#F97316"];
  const level =
    score <= 30
      ? "낮음"
      : score <= 50
      ? "주의"
      : score <= 70
      ? "위험"
      : "매우 위험";
  const levelColor = safe ? "text-emerald-600" : "text-orange-500";
  const gid = useId();

  return (
    <section className="flex flex-col gap-6 p-5 border-2 border-neutral-200 rounded-2xl">
      <h2 className="text-xl font-extrabold text-center">
        현재 온열질환 위험도
      </h2>

      <div
        className="relative grid place-items-center mx-auto"
        style={{ width: "70vw", height: "70vw" }}
      >
        <svg viewBox={`0 0 ${vb} ${vb}`} className="w-full h-full">
          <defs>
            <linearGradient
              id={`ring-${gid}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={grad[0]} />
              <stop offset="100%" stopColor={grad[1]} />
            </linearGradient>
          </defs>

          <g transform={`translate(${vb / 2} ${vb / 2}) rotate(-90)`}>
            <circle
              r={r}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            <circle
              r={r}
              fill="none"
              stroke={`url(#ring-${gid})`}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${C} ${C}`}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1.2s ease" }} // ← 핵심
            />
          </g>
        </svg>

        <div className="absolute text-center">
          <div className="text-5xl font-extrabold leading-none">{score}</div>
          <div className={`mt-1 text-lg font-semibold ${levelColor}`}>
            {level}
          </div>
        </div>
      </div>

      <p className="text-center text-gray-500">
        온열지수 <span className="font-semibold">{temperatureC}°C</span>{" "}
        기준으로 분석된 결과입니다
      </p>

      <div className="mx-auto w-full max-w-md">
        <div className="p-[2px] rounded-xl bg-gradient-to-r from-orange-200 to-orange-300">
          <div className="flex justify-center items-center gap-2 rounded-[0.75rem] bg-orange-50 px-4 py-3 text-orange-600 text-sm">
            <span className="text-lg">💡</span>
            <span className="leading-snug">
              {ai_advice || "수분 섭취를 늘리고 그늘에서 휴식을 취하세요"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
