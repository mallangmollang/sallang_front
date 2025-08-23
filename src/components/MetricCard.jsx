export default function MetricCard({ title, items = [], icon }) {
  return (
    <div className="w-full h-full min-w-0 px-3 py-3 rounded-2xl border border-violet-200 bg-white shadow-sm flex items-start justify-between min-h-[120px]">
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p
            className="font-semibold text-gray-900 break-words leading-snug
                      text-[clamp(12px,3.4vw,14px)]"
          >
            {title}
          </p>
          {icon && (
            <div className="shrink-0 w-9 h-9 ml-2 grid place-items-center">
              <img
                src={icon}
                alt=""
                aria-hidden="true"
                className="w-8 h-8 opacity-90"
                draggable={false}
              />
            </div>
          )}
        </div>

        <div className="mt-1.5 space-y-1.5">
          {items.map((item, idx) => (
            <div key={idx} className="min-w-0">
              {item.label && (
                <span
                  className="mr-1  text-gray-500 align-baseline
                                 text-[clamp(11px,3.0vw,13px)]"
                >
                  {item.label}
                  {item.label.endsWith(":") ? "" : ":"}
                </span>
              )}
              <span
                className={[
                  item.size === "lg"
                    ? "text-[clamp(16px,4.2vw,20px)] font-extrabold"
                    : "text-[clamp(12px,3.4vw,14px)] font-semibold",
                  item.color || "text-gray-900",
                  "tabular-nums tracking-tight align-baseline break-words",
                ].join(" ")}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
