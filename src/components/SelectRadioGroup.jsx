import { useCallback } from "react";

export default function SelectRadioGroup({
  value,
  onChange,
  options = [],
  name,
  className = "",
  optionClassName = "",
}) {
  const handleKeyDown = useCallback(
    (e, idx) => {
      if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
      e.preventDefault();
      const nextIndex =
        e.key === "ArrowRight"
          ? (idx + 1) % options.length
          : (idx - 1 + options.length) % options.length;
      onChange?.(options[nextIndex]?.value);
    },
    [onChange, options]
  );

  return (
    <div
      role="radiogroup"
      aria-label={name}
      className={["flex flex-row gap-1", className].join(" ")}
    >
      {options.map((opt, idx) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange?.(opt.value)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            tabIndex={selected ? 0 : -1}
            className={[
              "flex flex-row w-[174px] h-[55px] items-center justify-center",
              "px-4 py-1 overflow-hidden rounded-[12px] border-2 border-solid",
              "text-sm font-bold transition-colors duration-150",
              selected
                ? "bg-orange-100 border-orange-500 text-orange-500"
                : "bg-white border-neutral-300 text-black",
              "cursor-pointer",
              optionClassName,
            ].join(" ")}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
