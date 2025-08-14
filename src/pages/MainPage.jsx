import UserGreeting from "../components/UserGreeting";
import InfoCard from "../components/InfoCard";
import HearStrokeCard from "../components/HearStrokeCard";
import ConditionCard from "../components/ConditionCard";
import TipCard from "../components/TipCard";
const MainPage = () => {
  return (
    <div className="flex flex-col gap-5 p-4">
      <UserGreeting name="이동윤" />
      <InfoCard temperatureC="32" humidityPercentage="62" stepsCount="12234" />
      <HearStrokeCard
        riskScore={99}
        temperatureC={32}
        ai_advice="수분 섭취를 늘리고 그늘에서 휴식하세요"
      />
      <ConditionCard />
      <button className="flex items-center justify-center w-full h-[5vh] bg-orange-300 rounded-xl text-white text-lg font-bold">
        근처 쉼터 보기
      </button>
      <button className="flex items-center justify-center w-full h-[5vh] bg-orange-300  rounded-xl text-white text-lg font-bold">
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
