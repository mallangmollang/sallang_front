import { useEffect, useState } from "react";
import InfoLogo from "../assets/InfoLogo.svg";

const DEFAULT_TIPS = [
  "오후 2~4시는 가장 더운 시간대입니다. 그늘/실내에서 휴식하세요.",
  "작업 중 20분마다 물 1컵(200ml) 섭취, 카페인·알코올은 피하세요.",
  "통풍 잘 되는 밝은색 옷과 모자 또는 양산을 사용하세요.",
  "야외 작업은 가능하면 오전/저녁 시간대로 조정하세요.",
  "땀을 많이 흘렸다면 물과 함께 전해질도 보충하세요.",
  "어지럼·메스꺼움·근육경련 느끼면 즉시 중단하고 시원한 곳으로 이동하세요.",
  "밀폐된 공간에 오래 머무르지 말고 자주 환기하세요.",
  "목·겨드랑이·사타구니 등 큰 혈관 부위를 차갑게 식히세요.",
  "습도 높으면 체감온도↑ 실내 습도 40~60% 유지 권장.",
  "자외선이 강한 날은 차단제 바르고 물을 더 자주 마시세요.",
];

export default function TipCard({
  tips = DEFAULT_TIPS,
  avoidRepeatInSession = true,
  className = "",
}) {
  const [tip, setTip] = useState("");

  useEffect(() => {
    const pick = () => Math.floor(Math.random() * tips.length);

    if (!avoidRepeatInSession) {
      setTip(tips[pick()]);
      return;
    }

    const key = "tip:lastIndex";
    const last = sessionStorage.getItem(key);
    let idx = pick();
    if (tips.length > 1 && last !== null) {
      let tries = 0;
      while (String(idx) === last && tries < 8) {
        idx = pick();
        tries++;
      }
    }
    sessionStorage.setItem(key, String(idx));
    setTip(tips[idx]);
  }, [tips, avoidRepeatInSession]);

  return (
    <div className={`flex p-1 items-center ${className}`}>
      <div className="flex w-full p-4 gap-3 items-center rounded-2xl bg-green-50 border-2 border-green-400">
        <img src={InfoLogo} alt="정보" className="w-6 h-6 shrink-0" />
        <div className="flex flex-col">
          <p className="text-base font-bold text-green-700 mb-1">
            오늘의 건강 팁
          </p>
          <p className="text-sm text-green-900 leading-relaxed">{tip}</p>
        </div>
      </div>
    </div>
  );
}
