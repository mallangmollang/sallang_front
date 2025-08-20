// WorkRestBar.jsx
export default function WorkRestBar({ workMinutes = 0, restMinutes = 0 }) {
  const total = Math.max(workMinutes + restMinutes, 0);
  const workRatio = total ? (workMinutes / total) * 100 : 0;
  const restRatio = total ? (restMinutes / total) * 100 : 0;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 진행바 */}
      <div className="w-full h-2 rounded-[8px] bg-neutral-200 overflow-hidden flex">
        <div
          className="h-full bg-orange-400"
          style={{ width: `${workRatio}%` }}
          aria-label="작업 시간 비율"
          role="img"
        />
        <div
          className="h-full bg-orange-300"
          style={{ width: `${restRatio}%` }}
          aria-label="휴식 시간 비율"
          role="img"
        />
      </div>

      {/* 라벨/값 */}
      <div className="flex items-center justify-between pt-1">
        <p className="text-sm text-black">작업 시간</p>
        <p className="text-sm font-extrabold text-orange-400">
          {Math.floor(workMinutes / 60)}시간 {workMinutes % 60}분
        </p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-black">휴식 시간</p>
        <p className="text-sm font-extrabold text-orange-300">
          {Math.floor(restMinutes / 60)}시간 {restMinutes % 60}분
        </p>
      </div>

      <div className="w-full h-px bg-gray-300" />

      <div className="flex items-center justify-between pb-1">
        <p className="text-sm text-black">총 시간</p>
        <p className="text-sm font-extrabold text-black">
          {Math.floor(total / 60)}시간 {total % 60}분
        </p>
      </div>
    </div>
  );
}
