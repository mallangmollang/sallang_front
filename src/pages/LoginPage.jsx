import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import PageHeader from "../components/PageHeader";
import TextInputForm from "../components/TextInputForm";
import SelectToggle from "../components/SelectToggle";
import SelectRadioGroup from "../components/SelectRadioGroup";

const LoginPage = () => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState(null);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [conditions, setConditions] = useState({
    당뇨병: false,
    고혈압: false,
    심장병: false,
    신장병: false,
    기타: false,
    없음: false,
  });
  const [etcText, setEtcText] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const toggleCondition = (key) => (next) => {
    setConditions((prev) => {
      if (key === "없음") {
        const cleared = Object.fromEntries(
          Object.keys(prev).map((k) => [k, false])
        );
        if (next) setEtcText("");
        return { ...cleared, 없음: next };
      }
      const nextState = {
        ...prev,
        [key]: next,
        없음: next ? false : prev.없음,
      };
      if (key === "기타" && !next) setEtcText("");
      return nextState;
    });
  };

  const numeric = (s) => s !== "" && !Number.isNaN(Number(s));
  const isValid = useMemo(() => {
    const hasName = name.trim().length > 0;
    const hasGender = gender === "남성" || gender === "여성";
    const hasHeight =
      numeric(height) && Number(height) > 0 && Number(height) < 300;
    const hasWeight =
      numeric(weight) && Number(weight) > 0 && Number(weight) < 500;
    // 기타가 켜졌는데 입력이 비어 있으면 유효하지 않음
    const etcOk =
      !conditions.기타 || (conditions.기타 && etcText.trim().length > 0);
    return hasName && hasGender && hasHeight && hasWeight && etcOk;
  }, [name, gender, height, weight, conditions.기타, etcText]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    // 여기서 수집/전송 로직 추가 가능
    navigate("/main");
  };

  const navigate = useNavigate();

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
      {/* Input Container */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[361px] h-[852px] items-center gap-4 overflow-hidden bg-white"
      >
        {/* 이름 */}
        <div className="flex flex-col h-[105px]items-start justify-start gap-1">
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
          {submitted && name.trim().length === 0 && (
            <p className="text-xs font-semibold text-red-500">
              이름을 입력해주세요.
            </p>
          )}
        </div>
        {/* 성별 */}
        <div className="flex flex-col h-[105px] justify-start items-start gap-1">
          <div className="flex flex-row gap-[10px] justify-start items-start overflow-hidden">
            <p className="text-xs font-semibold text-black">성별</p>
          </div>
          <SelectRadioGroup
            name="성별"
            value={gender ?? undefined}
            onChange={setGender} // 선택 변경 핸들러
            className="flex w-[361px] items-center gap-1" // 레이아웃 맞춤
            options={[
              { label: "남성", value: "남성" },
              { label: "여성", value: "여성" },
            ]}
          />
          {submitted && !(gender === "남성" || gender === "여성") && (
            <p className="font-semibold text-red-500 text-xs">
              성별을 선택해주세요.
            </p>
          )}
        </div>
        {/* 키, 몸무게 */}
        <div className="flex flex-row h-[110px] gap-1 items-start">
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
            {submitted &&
              (!numeric(height) ||
                Number(height) <= 0 ||
                Number(height) >= 300) && (
                <p className="font-semibold text-xs text-red-500 min-h-[16px]">
                  올바른 키를 입력해주세요.
                </p>
              )}
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
            {submitted &&
              (!numeric(weight) ||
                Number(weight) <= 0 ||
                Number(weight) >= 500) && (
                <p className="text-xs font-semibold text-red-500">
                  올바른 몸무게를 입력해주세요.
                </p>
              )}
          </div>
        </div>
        {/* 기저질환 */}
        <div className="h-[320px] justify-center items-start gap-1">
          {/* title */}
          <div className="flex flex-row gap-[10px] pb-1 justify-start items-start overflow-hidden">
            <p className="text-xs font-semibold text-black">기저질환</p>
          </div>
          {/* 기저질환 선택 토글 버튼 그룹 */}
          <div className="flex flex-wrap w-[361px] h-[198px] gap-x-1 gap-y-0 overflow-hidden">
            {["당뇨병", "고혈압", "심장병", "신장병", "기타", "없음"].map(
              (k) => (
                <SelectToggle
                  key={k}
                  label={k}
                  selected={conditions[k]}
                  onChange={toggleCondition(k)}
                />
              )
            )}
          </div>
          {/* 기타 입력 */}
          {conditions.기타 && (
            <TextInputForm
              value={etcText}
              onChange={setEtcText}
              onClear={() => setEtcText("")}
              placeholder="기타 질환을 입력하세요"
            />
          )}
          {conditions.기타 && submitted && etcText.trim().length === 0 && (
            <p className="text-red-500 text-xs font-semibold mt-1 gap-2">
              기타 질환명을 입력해주세요.
            </p>
          )}
        </div>
        {/* 제출 버튼 */}
        <button
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
      </form>
    </div>
  );
};
export default LoginPage;
