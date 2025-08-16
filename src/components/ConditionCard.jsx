import WaterIntakeCard from "./WaterIntakeCard";
import SleepHoursCard from "./SleepHoursCard";

export default function ConditionCard({
  waterMl,
  addWater,
  subWater,
  sleepHours,
  sleepAtLeast,
  setSleep,
}) {
  return (
    <section className="flex flex-col gap-4 p-5 border-2 border-neutral-200 rounded-2xl">
      <h2 className="text-xl font-extrabold text-center">오늘의 컨디션</h2>
      <WaterIntakeCard waterMl={waterMl} onAdd={addWater} onSub={subWater} />
      <SleepHoursCard
        hours={sleepHours}
        atLeast={sleepAtLeast}
        onChange={setSleep}
      />
    </section>
  );
}
