import { useEffect } from "react";
import UserGreeting from "../components/UserGreeting";
import InfoCard from "../components/InfoCard";
import HearStrokeCard from "../components/HearStrokeCard";
import ConditionCard from "../components/ConditionCard";
import TipCard from "../components/TipCard";
import { useNavigate } from "react-router-dom";
import useGeoSteps from "../hooks/useGeoSteps";
import useTenMinutePoster from "../hooks/useTenMinutePoster";
import { useDailyActivity } from "../hooks/useDailyActivity";

const MainPage = () => {
  const navigate = useNavigate();
  const activity = useDailyActivity();
  const { waterMl, hydrated, sleepHours, addWater, subWater, setSleep } =
    activity;

  const physicalInfo = { age: 35, weightKg: 75, heightCm: 175, gender: "male" };
  const { coords, steps, restMinutes } = useGeoSteps({
    heightCm: physicalInfo.heightCm,
  });

  // 10분마다 전송 (sleepAtLeast 제외)
  useTenMinutePoster({
    endpoint: `${import.meta.env.VITE_API_URL}/live`,
    payloadBuilder: () => {
      if (!coords || !hydrated) return null;
      return {
        latitude: coords.latitude,
        longitude: coords.longitude,
        physicalInfo,
        currentActivity: {
          stepsCount: steps,
          waterIntakeMl: waterMl,
          restDurationMinutes: restMinutes,
          sleepHours,
        },
      };
    },
    intervalMs: 600_000,
    sendImmediately: true,
  });

  useEffect(() => {
    if (!coords || !hydrated) return;
    const payload = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      physicalInfo,
      currentActivity: {
        stepsCount: steps,
        waterIntakeMl: waterMl,
        restDurationMinutes: restMinutes,
        sleepHours,
      },
    };
    fetch(`${import.meta.env.VITE_API_URL}/live`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((e) => console.warn("first post failed", e));
  }, [coords, hydrated, steps, waterMl, restMinutes, sleepHours]);

  return (
    <div className="flex flex-col gap-5 p-4">
      <UserGreeting name="이동윤" />
      <InfoCard temperatureC="32" humidityPercentage="62" stepsCount={steps} />
      <HearStrokeCard
        riskScore={60}
        temperatureC={32}
        ai_advice="수분 섭취를 늘리고 그늘에서 휴식하세요"
      />

      <ConditionCard
        waterMl={waterMl}
        addWater={addWater}
        subWater={subWater}
        sleepHours={sleepHours}
        setSleep={setSleep}
      />

      <div className="flex justify-between">
        <button
          onClick={() => navigate("/shelter")}
          className="flex items-center justify-center w-[45vw] h-[10vh] bg-orange-300 rounded-xl text-white text-lg font-bold"
        >
          근처 쉼터 보기
        </button>
        <button className="flex items-center justify-center w-[45vw] h-[10vh] bg-orange-300 rounded-xl text-white text-lg font-bold">
          내 약 관리하기
        </button>
      </div>

      <button
        onClick={() => navigate("/report")}
        className="flex items-center justify-center w-full h-[5vh] bg-orange-300  rounded-xl text-white text-lg font-bold"
      >
        리포트 생성하기
      </button>
      <TipCard />
      <button className="flex items-center justify-center w-full h-[7vh] bg-orange-400 rounded-2xl text-white text-lg font-bold">
        작업 시작
      </button>
    </div>
  );
};

export default MainPage;
