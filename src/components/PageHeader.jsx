import { useNavigate } from "react-router-dom";
import goBackIcon from "../assets/goBackButtonImg.svg";

export default function PageHeader({ title, onBack }) {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));

  return (
    <header className="sticky top-0 z-10 bg-white">
      <div className="grid grid-cols-[auto_1fr_auto] items-center h-12 px-3">
        <button
          onClick={handleBack}
          className="w-9 h-9 grid place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
          aria-label="뒤로가기"
          type="button"
        >
          <img src={goBackIcon} alt="" className="w-5 h-5" />
        </button>

        {/* 가운데: 타이틀 (항상 정중앙) */}
        <h1 className="text-lg font-bold text-center">{title}</h1>

        {/* 오른쪽: 아이콘 자리 */}
        <div className="w-9 h-9" aria-hidden="true" />
      </div>

      {/* 하단 구분선 */}
      <div className="h-px bg-neutral-200" />
    </header>
  );
}
