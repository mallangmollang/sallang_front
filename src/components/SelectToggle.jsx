import { useCallback } from "react";

export default function SelectToggle({
  label,
  selected = false,
  onChange,
  disabled = false,
  classname = "",
}) {
  const handleClick = useCallback(() => {
    if (disabled) return;
    onChange?.(!selected);
  }, [disabled, onChange, selected]);
  const handleKeyDown = useCallback(
    (e) => {
      if (disabled) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onChange?.(!selected);
      }
    },
    [disabled, onChange, selected]
  );
  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={[
        "flex flex-row w-[174px] h-[55px] items-center justify-center",
        "px-4 py-1 overflow-hidden rounded-[12px] border-2 border-solid",
        "text-sm font-bold",
        selected
          ? "bg-orange-100 border-orange-500 text-orange-500"
          : "bg-white border-neutral-300 text-black",
        classname,
      ].join(" ")}
      disabled={disabled}
      aria-label={label}
    >
      {label}
    </button>
  );
}
