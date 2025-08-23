export function todayYYYYMMDD(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function DailyReport({
  profile,
  coords,
  steps = 0,
  waterMl = 0,
  sleepHours = 0,
  restMinutes = 0,
  medications = [],
  workMinutes = 0,
  restWindows = [],
  riskWindows = [],
  date = todayYYYYMMDD(),
}) {
  const sexMap = {
    남성: "male",
    여성: "female",
    male: "male",
    female: "female",
  };
  const sex = sexMap[profile?.gender] ?? "unknown";

  const meds =
    medications.length && typeof medications[0] === "object"
      ? medications.filter((m) => m.taken).map((m) => m.name)
      : medications;

  return {
    lat: coords?.latitude ?? 0,
    lon: coords?.longitude ?? 0,
    date,
    height: Number(profile?.heightCm ?? 0),
    weight: Number(profile?.weightKg ?? 0),
    sex,
    chronicConditions: profile?.conditions ?? [],

    steps: Number(steps ?? 0),
    sleepMinutes: Math.max(0, Math.round((sleepHours ?? 0) * 60)),
    waterIntake: Number(waterMl ?? 0),

    workMinutes: Number(workMinutes ?? 0),
    restMinutes: Number(restMinutes ?? 0),

    medications: meds,

    restWindows,
    riskWindows,
  };
}
