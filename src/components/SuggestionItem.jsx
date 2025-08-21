// SuggestionItem.jsx
export default function SuggestionItem({ icon, title, description, color }) {
  const bgColor = {
    green: "bg-green-50",
    blue: "bg-blue-50",
    purple: "bg-purple-50",
  }[color];

  const titleColor = {
    green: "text-green-700",
    blue: "text-blue-700",
    purple: "text-purple-700",
  }[color];

  const descColor = {
    green: "text-green-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
  }[color];

  return (
    <div
      className={`flex flex-row items-center justify-start w-full gap-1 px-[14px] overflow-hidden rounded-lg ${bgColor}`}
    >
      <img src={icon} alt="번호 아이콘" className="w-6 h-6 px-1" />
      <div className="flex flex-col items-start justify-center px-2 py-4">
        <p className={`text-sm font-semibold ${titleColor}`}>{title}</p>
        <p className={`text-sm font-medium ${descColor}`}>{description}</p>
      </div>
    </div>
  );
}
