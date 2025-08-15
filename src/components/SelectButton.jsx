export default function SelectButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-row w-[174px] h-[55px] items-center px-4 py-1 overflow-hidden rounded-[12px] border-2 border-solid
        text-sm font-bold
        ${
          active
            ? "bg-orange-100 border-orange-500 text-orange-500"
            : "bg-white border-neutral-300 text-black"
        }
        `}
    >
      {label}
    </button>
  );
}
