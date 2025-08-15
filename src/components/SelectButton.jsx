import { useState } from "react";

export default function SelectButton({ label, onClick, onChange }) {
  const [selected, setSelected] = useState(false);
  const handleClick = () => {
    const next = !selected;
    setSelected(next);
    onChange?.(next);
    onClick?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={[
        "flex flex-row w-[174px] h-[55px] items-center justify-center",
        "px-4 py-1 overflow-hidden rounded-[12px] border-2 border-solid",
        "text-sm font-bold",
        selected
          ? "bg-orange-100 border-orange-500 text-orange-500"
          : "bg-white border-neutral-300 text-black",
        // "hover:bg-orange-100 hover:border-orange-500 hover:text-orange-500",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
