// MetricCard.jsx
export default function MetricCard({ title, items }) {
  return (
    <div className="flex flex-col flex-1 items-start h-[90px] p-3 rounded-[12px] bg-white">
      <p className="text-sm font-bold text-zinc-950">{title}</p>
      {items.map((item, idx) => (
        <p
          key={idx}
          className={`${item.size === "lg" ? "text-sm" : "text-xs"} font-bold ${
            item.color || "text-gray-500"
          }`}
        >
          {item.label && <>{item.label}: </>}
          {item.value}
        </p>
      ))}
    </div>
  );
}
