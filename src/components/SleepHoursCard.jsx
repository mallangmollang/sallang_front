export default function SleepHoursCard({ hours = 0, onChange }) {
  const atLeast = hours >= 12;
  const display = atLeast ? "12시간 이상" : `${hours}시간`;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 p-4 h-[20vh] border-2 border-neutral-200 p-4 shadow-[0_2px_0_#eee]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span>🌙</span>
          <h2 className="font-semibold">어제 수면 시간</h2>
        </div>
        <p className="text-indigo-600 font-extrabold">{display}</p>
      </div>

      <input
        type="range"
        min={0}
        max={12}
        step={1}
        value={Math.min(12, Number(hours) || 0)}
        onChange={(e) => onChange(Math.min(12, Number(e.target.value)))}
        className="w-full accent-purple-500"
      />

      <p className="mt-3 text-sm text-neutral-400">권장: 7~9시간</p>
    </div>
  );
}
