export default function SelectButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-row w-[174px] h-[55px] items-center justify-center px-4 py-1 overflow-hidden rounded-[12px] border-2 border-solid
        text-sm font-bold 
        bg-white border-neutral-300 text-black
        hover:bg-orange-100 hover:border-orange-500 hover:text-orange-500
      `}
    >
      {label}
    </button>
  );
}
