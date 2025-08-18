import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import TextInputForm from "../components/TextInputForm";
import SelectToggle from "../components/SelectToggle";
import SelectRadioGroup from "../components/SelectRadioGroup";
import useLoginFormStorage, {
  LOGIN_FORM_STORAGE_KEY,
} from "../hooks/useLoginFormStorage";

const LoginPage = () => {
  const navigate = useNavigate();
  const { load, save, clear } = useLoginFormStorage(LOGIN_FORM_STORAGE_KEY);

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
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");

  useEffect(() => {
    const data = load();
    if (!data) return;
    setName(data.name ?? null);
    setGender(data.gender ?? null);
    setHeight(
      typeof data.height === "number" ? String(data.height) : data.height ?? ""
    );
    setWeight(
      typeof data.weight === "number" ? String(data.weight) : data.weight ?? ""
    );
    setConditions({
      당뇨병: !!data.conditions?.당뇨병,
      고혈압: !!data.conditions?.고혈압,
      심장병: !!data.conditions?.심장병,
      신장병: !!data.conditions?.신장병,
      기타: !!data.conditions?.기타,
      없음: !!data.conditions?.없음,
    });
    setEtcText(data.etcText ?? "");
    if (data.birthdate) {
      const [y, m, d] = String(data.birthdate).split("-");
      setBirthYear(y ?? "");
      setBirthMonth(m ?? "");
      setBirthDay(d ?? "");
    }
  }, [load]);

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
  const pad2 = (n) => String(n).padStart(2, "0");
  const isValidDate = (y, m, d) => {
    if (!(numeric(y) && numeric(m) && numeric(d))) return false;
    const yy = Number(y),
      mm = Number(m),
      dd = Number(d);
    const now = new Date();
    if (yy < 1900 || yy > now.getFullYear()) return false;
    if (mm < 1 || mm > 12) return false;
    const last = new Date(yy, mm, 0).getDate();
    if (dd < 1 || dd > last) return false;
    const dateObj = new Date(`${yy}-${pad2(mm)}-${pad2(dd)}T00:00:00`);
    return dateObj <= now;
  };

  // 생년월일 유효성 검사
  const isValidDOB = useMemo(
    () => isValidDate(birthYear, birthMonth, birthDay),
    [birthYear, birthMonth, birthDay]
  );

  const isValid = useMemo(() => {
    const hasName = name.trim().length > 0;
    const hasGender = gender === "남성" || gender === "여성";
    const hasHeight =
      numeric(height) && Number(height) > 0 && Number(height) < 300;
    const hasWeight =
      numeric(weight) && Number(weight) > 0 && Number(weight) < 500;
    const etcOk =
      !conditions.기타 || (conditions.기타 && etcText.trim().length > 0);
    return (
      hasName && hasGender && isValidDOB && hasHeight && hasWeight && etcOk
    );
  }, [name, gender, isValidDOB, height, weight, conditions.기타, etcText]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const birthDate = new Date(
      Number(birthYear),
      Number(birthMonth) - 1,
      Number(birthDay)
    );

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    const snapshot = {
      name: name.trim(),
      gender,
      height: Number(height),
      weight: Number(weight),
      conditions,
      etcText: etcText.trim(),
      age,
    };

    const ok = save(snapshot);
    if (ok) navigate("/main");
  };

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
        <div className="flex flex-col h-[100px] items-start justify-start gap-1">
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
            onChange={setGender}
            className="flex w-[361px] items-center gap-1"
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
        {/* 생년월일 */}
        <div className="flex flex-col h-[105px] justify-start items-start gap-1">
          <div className="flex flex-row gap-[10px] justify-start items-start overflow-hidden">
            <p className="text-xs font-semibold text-black">생년월일</p>
          </div>
          <div className="flex w-[361px] items-center gap-1">
            <div className="w-[120px]">
              <TextInputForm
                value={birthYear ?? ""}
                onChange={setBirthYear}
                onClear={() => setBirthYear("")}
                placeholder="YYYY"
                maxLength={4}
                inputMode="numeric"
                aria-label="출생 연도"
              />
            </div>
            <div className="w-[110px]">
              <TextInputForm
                value={birthMonth}
                onChange={setBirthMonth}
                onClear={() => setBirthMonth("")}
                placeholder="MM"
                maxLength={2}
                inputMode="numeric"
                aria-label="출생 월"
              />
            </div>
            <div className="w-[110px]">
              <TextInputForm
                value={birthDay}
                onChange={setBirthDay}
                onClear={() => setBirthDay("")}
                placeholder="DD"
                maxLength={2}
                inputMode="numeric"
                aria-label="출생 일"
              />
            </div>
          </div>

          {submitted && !isValidDOB && (
            <p className="text-xs font-semibold text-red-500">
              올바른 생년월일을 입력해주세요.
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
          type="submit"
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
