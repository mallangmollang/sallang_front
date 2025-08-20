// TomorrowSuggestionsCard.jsx
import SuggestionItem from "./SuggestionItem.jsx";

export default function TomorrowSuggestionsCard({ suggestions, CheckIcon }) {
  return (
    <div className="flex flex-col w-full items-center gap-2 px-6 py-6 bg-white border-2 border-amber-400 rounded-[12px]">
      {/* 타이틀 */}
      <div className="w-full flex flex-row items-center gap-2">
        <div className="w-4 h-4">
          <img src={CheckIcon} alt="체크 아이콘" className="w-full h-full" />
        </div>
        <p className="text-base font-bold text-black">내일을 위한 제안</p>
      </div>

      {/* 아이템 리스트 */}
      <div className="flex flex-col w-full gap-2 items-center">
        {suggestions.map((s, idx) => (
          <SuggestionItem
            key={idx}
            icon={s.icon}
            title={s.title}
            description={s.description}
            color={s.color}
          />
        ))}
      </div>
    </div>
  );
}
