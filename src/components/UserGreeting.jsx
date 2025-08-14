export default function UserGreeting({
  name = "",
  subtitle = "오늘도 안전한 하루 되세요",
  className = "",
}) {
  const first = name?.trim()?.[0] ?? "?";

  return (
    <div className={`flex justify-between items-center px-2.5 ${className}`}>
      <div className="flex flex-col gap-0.5">
        <p className="text-lg font-bold truncate">안녕하세요, {name}님</p>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>

      <div
        className="flex w-12 h-12 justify-center items-center rounded-full
                        bg-gradient-to-r from-orange-400 to-orange-500
                        shrink-0 text-lg font-bold text-white"
      >
        {first}
      </div>
    </div>
  );
}
