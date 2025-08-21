// MetricCard.jsx
export default function MetricCard({ title, items, icon }) {
  return (
    <div className="flex flex-row h-full w-full min-w-0 p-3 rounded-[12px] border-2 border-violet-200 bg-white items-start justify-between">
      {/* 왼쪽 텍스트 영역 */}
      <div className="flex flex-col min-w-0">
        <p className="text-sm font-bold text-gray-900 break-words">{title}</p>
        {items.map((item, idx) => (
          <p
            key={idx}
            className={`${
              item.size === "lg" ? "text-sm" : "text-xs"
            } font-bold ${item.color || "text-gray-500"} break-words`}
          >
            {item.label && <>{item.label}: </>}
            {item.value}
          </p>
        ))}
      </div>

      {/* 오른쪽 아이콘 */}
      {icon && (
        <div className="flex-shrink-0 ml-2">
          <img src={icon} alt="card icon" className="w-9 h-9" />
        </div>
      )}
    </div>
  );
}
