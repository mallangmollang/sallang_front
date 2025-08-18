import PageHeader from "../components/PageHeader";
import onBoardingIcon1 from "../assets/onBoardingIcon/onBoardingIcon1.svg";
import CheckIcon from "../assets/checkIcon.svg";
import number_1 from "../assets/number_1.svg";
import number_2 from "../assets/number_2.svg";
import number_3 from "../assets/number_3.svg";

export default function ReportPage() {
  return (
    <div className="max-w-screen-sm mx-auto bg-white">
      {/* header */}
      <PageHeader title="일일 건강 리포트" />
      {/* content */}
      <div className="flex flex-col w-full justify-start bg-neutral-50 items-center gap-4 px-4 pb-20">
        {/* 하루 지표 */}
        <div
          className="flex flex-row w-full justify-start items-start 
        gap-2 pt-2 overflow-hidden"
        >
          {/* 날씨 */}
          <div
            className="flex flex-col flex-1 items-start h-[90px] 
          p-3 rounded-[12px] bg-white"
          >
            <p className="text-sm font-bold text-zinc-950">날씨</p>
            <p className="text-xs font-bold  text-gray-500">흐림</p>
            <p className="text-xs font-bold  text-gray-500">
              평균 온도: 섭씨 27도
            </p>
          </div>
          {/* 수분 */}
          <div
            className="flex flex-col flex-1 items-start h-[90px] 
          p-3 rounded-[12px] 
          bg-white"
          >
            <p className="text-sm font-bold text-zinc-950">수분</p>
            <p className="text-sm font-bold text-zinc-950">섭취량</p>
            <p className="text-xs font-bold  text-gray-500">1200ml</p>
          </div>
          {/* 걸음 수 */}
          <div
            className="flex flex-col flex-1 items-start h-[90px] 
          px-3 pt-3 pb-4 rounded-[12px] bg-white"
          >
            <p className="text-sm font-bold text-zinc-950">걸음 수</p>
            <p className="text-xs font-bold  text-gray-500">10320</p>
          </div>
        </div>
        {/* 노동 시간 분석 */}
        <div
          className="w-full flex flex-col items-center px-6 py-4 
        bg-white rounded-[12px]"
        >
          <div className="w-full flex flex-col items-start justify-start gap-1 overflow-hidden">
            <p className="text-base font-bold text-black">
              총 노동시간 / 휴식시간 분석
            </p>
          </div>
        </div>
        {/* 오늘의 건강 점수 */}
        <div
          className="w-full flex flex-col items-center px-4 py-1
        border-2 border-blue-600 bg-white rounded-[12px]"
        >
          <div className="w-full flex flex-col items-center justify-center gap-[1px] px-1 py-5 overflow-hidden">
            <p className="text-base font-bold text-black">오늘의 건강 점수</p>
            <p className="text-xs font-bold text-gray-500">점수: 85</p>
            <p className="text-xs font-bold text-gray-500">건강 상태: 양호</p>
          </div>
        </div>
        {/* AI 건강 분석 */}
        <div
          className="w-full flex flex-row items-start px-4 py-1 
        bg-white border-2 border-orange-600 rounded-[12px]"
        >
          <div className="relative w-[44px] h-[167px] pr-12 gap-1 overflow-hidden">
            <div className="absolute left-[7px] top-[28px] w-[37px] h-[37px] overflow-hidden">
              <img
                src={onBoardingIcon1}
                alt="AI 건강 분석 아이콘"
                className="w-full h-full"
              />
            </div>
          </div>
          {/* AI 건강 분석 */}
          <div
            className="flex flex-col w-full items-start justify-start 
          bg-white gap-[1px] px-1 py-5 overflow-hidden"
          >
            <div className="flex flex-col gap-[10px] overflow-hidden">
              <p className="text-lg font-extrabold text-orange-700">
                AI 건강 분석
              </p>
            </div>
            <div className="flex flex-row gap-[10px] justify-center items-center">
              <p className="text-xs font-bold text-orange-500">
                오늘 위험도가 평균보다 15% 높았습니다 14:00-16:00 시간대의
                휴식이 부족했습니다 수분 섭취량이 권장량의 75% 수준입니다 내일은
                더 자주 휴식을 취하시길 권장합니다
              </p>
            </div>
          </div>
        </div>
        {/* 내일을 위한 제안 */}
        <div
          className="flex flex-col w-full items-center gap-2 px-6 py-6 
        bg-white border-2 border-amber-400 rounded-[12px]"
        >
          {/* title */}
          <div className="w-full flex flex-row items-center gap-2 overflow-hidden">
            <div className="w-4 h-4 overflow-hidden">
              <img
                src={CheckIcon}
                alt="체크 아이콘"
                className="w-full h-full"
              />
            </div>
            <p className="text-base font-bold text-black">내일을 위한 제안</p>
          </div>
          {/* content */}
          <div className="flex flex-col w-full gap-2 items-center">
            <div
              className="flex flex-row items-center justify-start w-full
          gap-1 px-[14px] overflow-hidden rounded-lg bg-green-50"
            >
              <img
                src={number_1}
                alt="1번 아이콘"
                className="w-6 h-6 px-1 gap-[10px]"
              />
              <div className="flex flex-col items-start justify-center px-2 py-4">
                <p className="text-sm font-semibold text-green-700">
                  수분 섭취 알림 간격 단축
                </p>
                <p className="text-sm font-medium text-green-600">
                  30분에서 20분으로 조정 권장
                </p>
              </div>
            </div>
            <div
              className="flex flex-row items-center justify-start w-full
          gap-1 px-[14px] overflow-hidden rounded-lg bg-blue-50"
            >
              <img
                src={number_2}
                alt="2번 아이콘"
                className="w-6 h-6 px-1 gap-[10px]"
              />
              <div className="flex flex-col items-start justify-center px-2 py-4">
                <p className="text-sm font-semibold text-blue-700">
                  오후 2시 필수 휴식
                </p>
                <p className="text-sm font-medium text-blue-600">
                  최고 위험 시간대 15분 휴식
                </p>
              </div>
            </div>
            <div
              className="flex flex-row items-center justify-start w-full
          gap-1 px-[14px] overflow-hidden rounded-lg bg-purple-50"
            >
              <img
                src={number_3}
                alt="3번 아이콘"
                className="w-6 h-6 px-1 gap-[10px]"
              />
              <div className="flex flex-col items-start justify-center px-2 py-4">
                <p className="text-sm font-semibold text-purple-700">
                  선크림 재도포 알림
                </p>
                <p className="text-sm font-medium text-purple-600">
                  2시간마다 자외선 차단 필요
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
