export default function MealStatusCard({ mealDone, onToggle }) {
  return (
    <section className="rounded-2xl border-2 border-neutral-200 p-4 shadow-[0_2px_0_#eee]">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-green-600">🍽️</span>
        <h2 className="font-semibold">오늘 식사하셨나요?</h2>
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={mealDone}
        className={`w-full rounded-2xl border-2 px-4 py-4 text-center text-base transition
            ${
              mealDone
                ? "border-green-400 bg-green-50 text-green-700"
                : "border-neutral-300 bg-white text-neutral-400 hover:bg-neutral-50"
            }`}
      >
        {mealDone ? "식사 완료" : "식사하지 않음"}
      </button>
    </section>
  );
}
