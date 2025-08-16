import { useNavigate } from "react-router-dom";
import goBackIcon from "../assets/goBackButtonImg.svg";

export default function PageHeader({ title, onBack }) {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));

  return (
    <header className="flex flex-row w-full h-[51px] items-center justify-between px-3 py-3 border border-zinc-300">
      <button onClick={handleBack} className="w-6 h-6 overflow-hidden">
        <img
          src={goBackIcon}
          alt="뒤로가기 아이콘"
          className="w-full h-full cursor-pointer"
        ></img>
      </button>
      <p className="text-lg font-semibold text-black">{title}</p>
      <div className="w-6 h-6 overflow-hidden"></div>
    </header>
  );
}
