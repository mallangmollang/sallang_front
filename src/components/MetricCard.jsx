// MetricCard.jsx
export default function MetricCard({ title, items }) {
  return (
    <div className="flex flex-col h-full w-full min-w-0 p-3 rounded-[12px] border-2 border-violet-200 bg-white">
      <p className="text-sm font-bold text-gray-900 break-words">{title}</p>
      {items.map((item, idx) => (
        <p
          key={idx}
          className={`${item.size === "lg" ? "text-sm" : "text-xs"} font-bold ${
            item.color || "text-gray-500"
          } break-words`}
        >
          {item.label && <>{item.label}: </>}
          {item.value}
        </p>
      ))}
    </div>
  );
}
