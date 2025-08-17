export default function WaterIntakeCard({
  waterMl,
  onAdd,
  onSub,
  gaugeMax = 800,
}) {
  const pct = Math.min(1, waterMl / gaugeMax) * 100;

  return (
    <div className="flex flex-col justify-between rounded-2xl border-2 border-neutral-200 p-4 h-[20vh] shadow-[0_2px_0_#eee]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>💧</span>
          <h2 className="font-semibold">수분 섭취</h2>
        </div>
        <div className="text-blue-700 font-extrabold">
          {waterMl.toLocaleString()}ml
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={onSub}
          className="w-10 h-10 grid place-items-center rounded-full bg-neutral-200 text-neutral-600"
          aria-label="물 -100ml"
        >
          –
        </button>

        <div className="flex-1">
          <div className="h-3 rounded-full bg-neutral-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 transition-[width] duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <button
          onClick={onAdd}
          className="w-10 h-10 grid place-items-center rounded-full bg-blue-600 text-white"
          aria-label="물 +100ml"
        >
          +
        </button>
      </div>

      <p className="mt-3 text-sm text-neutral-400">권장: 하루 8잔 이상</p>
    </div>
  );
}
