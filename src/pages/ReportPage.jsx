import PageHeader from "../components/PageHeader";
import onBoardingIcon1 from "../assets/onBoardingIcon/onBoardingIcon1.svg";
import CheckIcon from "../assets/checkIcon.svg";
import number_1 from "../assets/number_1.svg";
import number_2 from "../assets/number_2.svg";
import number_3 from "../assets/number_3.svg";
import WorkRestBar from "../components/WorkRestBar";
import MetricCard from "../components/MetricCard";
import HealthScoreCard from "../components/HealthScoreCard";
import AiAnalysisCard from "../components/AiAnalysisCard";
import TomorrowSuggestionsCard from "../components/TomorrowSuggestionsCard";

export default function ReportPage() {
  return (
    <div className="max-w-screen-sm mx-auto bg-white">
      {/* header */}
      <PageHeader title="일일 건강 리포트" />

      {/* content */}
      <div className="flex flex-col w-full justify-start bg-neutral-50 items-center gap-4 px-4 pb-20">
        {/* 하루 지표 */}
        <div className="flex flex-row w-full justify-start items-start gap-2 pt-2 overflow-hidden">
          <MetricCard
            title="날씨"
            items={[
              { label: "평균 온도", value: "섭씨 27도" },
              { label: "평균 습도", value: "87%" },
            ]}
          />
          <MetricCard title="수분 섭취량" items={[{ value: "1200ml" }]} />
          <MetricCard title="걸음 수" items={[{ value: "10320" }]} />
        </div>

        {/* 노동 시간 분석 */}
        <div className="w-full px-6 py-4 bg-white rounded-[12px]">
          <p className="text-base font-bold text-black mb-3">
            총 노동시간 / 휴식시간 분석
          </p>
          <WorkRestBar workMinutes={480} restMinutes={120} />
        </div>
        <HealthScoreCard
          totalScore={80}
          details={[
            { label: "수분 섭취", score: 85 },
            { label: "휴식 관리", score: 75 },
            { label: "증상 관리", score: 90 },
          ]}
        />

        {/* AI 건강 분석 */}
        <AiAnalysisCard
          icon={onBoardingIcon1}
          title="AI 건강 분석"
          messages={[
            "오늘 위험도가 평균보다 15% 높았습니다.",
            "14:00-16:00 시간대의 휴식이 부족했습니다.",
            "수분 섭취량이 권장량의 75% 수준입니다.",
            "내일은 더 자주 휴식을 취하시길 권장합니다.",
          ]}
        />

        {/* 내일을 위한 제안 */}
        <TomorrowSuggestionsCard
          CheckIcon={CheckIcon}
          suggestions={[
            {
              icon: number_1,
              title: "수분 섭취 알림 간격 단축",
              description: "30분에서 20분으로 조정 권장",
              color: "green",
            },
            {
              icon: number_2,
              title: "오후 2시 필수 휴식",
              description: "최고 위험 시간대 15분 휴식",
              color: "blue",
            },
            {
              icon: number_3,
              title: "선크림 재도포 알림",
              description: "2시간마다 자외선 차단 필요",
              color: "purple",
            },
          ]}
        />
      </div>
    </div>
  );
}
