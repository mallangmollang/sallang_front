import { useNavigate } from "react-router-dom";
import Icon1 from "../assets/onBoardingIcon/onBoardingIcon1.svg";
import Icon2 from "../assets/onBoardingIcon/onBoardingIcon2.svg";
import Icon3 from "../assets/onBoardingIcon/onBoardingIcon3.svg";
import Icon4 from "../assets/onBoardingIcon/onBoardingIcon4.svg";

const OnBoardingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center gap-4 px-4 pt-32 pb-8">
      <div className="flex items-center justify-center text-6xl font-bold text-orange-400">
        Sallang
      </div>
      <div className="flex flex-col justify-center items-center px-5 p-2 gap-4">
        <p className="text-2xl font-bold">살랑에 오신 것을 환영합니다</p>
        <div className="gap-3 px-4 items-center">
          <p className="flex justify-center items-center text-center text-lg font-medium text-neutral-500">
            대구의 무더위로부터 당신을 지켜드리는
          </p>
          <p className="flex justify-center items-center text-center text-lg font-medium text-neutral-500">
            스마트 온열질환 예방 서비스입니다
          </p>
        </div>
      </div>
      <section className="flex flex-col items-center p-[10px] rounded-[8px] border-2 border-orange-200">
        {/*  주요 기능 frame1 */}
        <div className="flex items-center gap-1 px-4 py-[9px]">
          <div className="flex items-center gap-[10px] px-1 pr-0">
            <p className="text-xl font-bold leading-[28px] text-orange-700">
              주요 기능
            </p>
          </div>
        </div>
        <div className="flex items-center gap-[10px] px-4 py-3 w-[339px] h-[48px] rounded-lg">
          <div className="flex items-center justify-center">
            <img src={Icon1} alt="위험도 아이콘" className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-2 w-[251px] h-[24px] overflow-hidden">
            <p className="text-base font-semibold text-orange-500">
              AI 기반 온열질환 위험도 분석
            </p>
          </div>
        </div>
        <div className="flex items-center gap-[10px] px-4 py-3 w-[339px] h-[48px] rounded-lg">
          <div className="flex items-center justify-center">
            <img src={Icon2} alt="쉼터 아이콘" className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-2 w-[251px] h-[24px] overflow-hidden">
            <p className="text-base font-semibold text-orange-500">
              실시간 무더위쉼터 추천
            </p>
          </div>
        </div>
        <div className="flex items-center gap-[10px] px-4 py-3 w-[339px] h-[48px] rounded-lg">
          <div className="flex items-center justify-center">
            <img src={Icon3} alt="개인 맞춤 아이콘" className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-2 w-[251px] h-[24px] overflow-hidden">
            <p className="text-base font-semibold text-orange-500">
              개인 맞춤 건강 알림
            </p>
          </div>
        </div>
        <div className="flex items-center gap-[10px] px-4 py-3 w-[339px] h-[48px] rounded-lg">
          <div className="flex items-center justify-center">
            <img src={Icon4} alt="리포트 아이콘" className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-2 w-[251px] h-[24px] overflow-hidden">
            <p className="text-base font-semibold text-orange-500">
              일일 건강 리포트
            </p>
          </div>
        </div>
      </section>
      <button
        onClick={() => navigate("/login")}
        className="
          flex items-center justify-center gap-[10px]
          w-[329px] h-[61px]
          px-[10px] py-[8px]
          rounded-[12px]
          bg-orange-400
          text-lg font-bold text-white
          overflow-hidden
          hover:bg-orange-500
          cursor-pointer
          transition-colors duration-100
        "
      >
        시작하기
      </button>
    </div>
  );
};
export default OnBoardingPage;
