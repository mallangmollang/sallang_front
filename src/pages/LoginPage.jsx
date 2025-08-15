import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PageHeader from "../components/PageHeader";
import SelectButton from "../components/SelectButton";
import TextInputForm from "../components/TextInputForm";

const LoginPage = () => {
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  return (
    <div
      className="
    flex flex-col           
    w-full min-h-screen     
    items-center            
    gap-5              
    bg-white                
    overflow-hidden         
    "
    >
      <PageHeader title="사용자 정보 입력" />
      <div className="flex flex-col w-[361px] h-[852px] items-center gap-5 overflow-hidden bg-white">
        {/* 이름 */}
        <div className="flex flex-col items-start justify-start gap-1">
          <div className="flex flex-row gap-[10px] overflow-hidden">
            <p className="text-xs font-semibold text-black">이름</p>
          </div>
          <div className="flex flex-row w-[361px] h-[44px] items-center">
            <TextInputForm
              value={name}
              onChange={(val) => setName(val)}
              onClear={() => setName("")}
              placeholder="이름을 입력하세요"
            />
          </div>
        </div>
        {/* 성별 */}
        <div className="flex flex-col h-[86px] justify-start items-start gap-1">
          <div className="flex flex-row gap-[10px] justify-start items-start overflow-hidden">
            <p className="text-xs font-semibold text-black">성별</p>
          </div>
          <div className="flex flex-row w-[361px] h-[66px] items-center gap-1">
            <SelectButton label="남성" />
            <SelectButton label="여성" />
          </div>
        </div>
        <div className="flex flex-row h-[68px] gap-1 items-center">
          <div className="flex flex-col w-[174px] justify-start items-start gap-1">
            <div className="flex flex-row gap-2 overflow-hidden">
              <p className="text-xs font-semibold text-black">키(cm)</p>
            </div>
            <TextInputForm
              value={height}
              onChange={(val) => setHeight(val)}
              onClear={() => setHeight("")}
              placeholder=""
            />
          </div>
          <div className="flex flex-col w-[177px] justify-start items-start gap-1">
            <div className="flex flex-row gap-2 overflow-hidden">
              <p className="text-xs font-semibold text-black">몸무게(kg)</p>
            </div>
            <TextInputForm
              value={weight}
              onChange={(val) => setWeight(val)}
              onClear={() => setWeight("")}
              placeholder=""
            />
          </div>
        </div>
        {/* 기저질환 */}
        <div className="flex flex-col h-[227px] justify-center items-start gap-1">
          <div className="flex flex-rpw gap-[10px] justify-start items-start overflow-hidden">
            <p className="text-xs font-semibold text-black">기저질환</p>
          </div>
          <div className="flex flex-wrap w-[361px] h-[198px] gap-x-1 gap-y-0 overflow-hidden">
            <SelectButton label="당뇨병" />
            <SelectButton label="고혈압" />
            <SelectButton label="심장병" />
            <SelectButton label="신장병" />
            <SelectButton label="기타" />
            <SelectButton label="없음" />
          </div>
        </div>
        <button
          onClick={() => navigate("/main")}
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
    </div>
  );
};
export default LoginPage;
