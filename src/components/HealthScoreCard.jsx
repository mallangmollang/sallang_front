// HealthScoreCard.jsx
export default function HealthScoreCard({ totalScore, details }) {
  return (
    <div className="w-full flex flex-col items-center px-4 py-1 border-2 border-blue-300 bg-white rounded-[12px]">
      {/* 총점 */}
      <div className="w-full flex flex-row justify-between items-center px-2 py-3">
        <p className="text-lg font-extrabold text-blue-700">오늘의 건강 점수</p>
        <p className="text-3xl font-extrabold text-blue-700">{totalScore}점</p>
      </div>

      {/* 세부 점수 */}
      <div className="w-full flex flex-col">
        {details.map((item, idx) => (
          <div key={idx} className="flex flex-row justify-between px-1 py-3">
            <p className="text-base font-medium text-blue-700">{item.label}</p>
            <p className="text-base font-semibold text-blue-700">
              {item.score}점
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
