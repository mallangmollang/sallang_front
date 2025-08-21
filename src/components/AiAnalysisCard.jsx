// AiAnalysisCard.jsx
export default function AiAnalysisCard({ icon, title, messages }) {
  return (
    <div className="w-full flex flex-row items-start px-4 py-1 bg-white border-2 border-orange-300 rounded-[12px]">
      {/* 아이콘 영역 */}
      <div className="relative w-[44px] h-[167px] pr-12">
        <div className="absolute left-[7px] top-[28px] w-[37px] h-[37px]">
          <img src={icon} alt={`${title} 아이콘`} className="w-full h-full" />
        </div>
      </div>

      {/* 텍스트 영역 */}
      <div className="flex flex-col w-full items-start gap-3 px-1 py-5">
        <p className="text-lg font-extrabold text-orange-700">{title}</p>
        <ul className="list-disc list-inside space-y-1 text-xs font-bold text-orange-500">
          {messages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
