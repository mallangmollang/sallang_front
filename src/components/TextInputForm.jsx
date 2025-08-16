import closeIcon from "../assets/closeIcon.svg";

export default function TextInputForm({
  value,
  onChange,
  placeholder = "",
  onClear,
}) {
  return (
    <div
      className="
          flex flex-row items-center
          w-full
          h-[44px]
          px-4 py-3
          rounded-lg
          bg-neutral-100 border border-neutral-300
          overflow-hidden
        "
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="
        w-full text-sm font-medium text-black placeholder-neutral-400"
        aria-label={placeholder || "텍스트 입력"}
      />

      {/* 값이 있을 때만 클리어 버튼 표시 */}
      {!!value && (
        <button
          type="button"
          onClick={() => onClear?.()}
          aria-label="입력 내용 지우기"
        >
          <img
            src={closeIcon}
            alt="닫기 아이콘"
            className="w-5 h-5 cursor-pointer"
          />
        </button>
      )}
    </div>
  );
}
