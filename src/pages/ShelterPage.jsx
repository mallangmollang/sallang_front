import { useNavigate } from "react-router-dom";
import ShelterCard from "../components/ShelterCard";

const dummy = [
  {
    id: 1,
    name: "GS25 대구경대로점",
    category: "상업시설",
    roadAddress: "대구 북구 경대로7길 41",
    phone: "053-000-0000",
    distanceM: 150,
    position: { lat: 35.88852, lng: 128.61033 },
  },
  {
    id: 2,
    name: "CU 경대점",
    category: "상업시설",
    roadAddress: "대구 북구 대학로 00",
    phone: "053-111-2222",
    distanceM: 310,
    position: { lat: 35.8879, lng: 128.6098 },
  },
];

const STEP_ML = 100;
const MAX_GAUGE_ML = 800;
const TODAY_KEY = () => `activity:${new Date().toISOString().slice(0, 10)}`;

export default function ShelterPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-screen-sm mx-auto  p-4">
      <header className="sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 grid place-items-center rounded-full text-2xl"
            aria-label="뒤로가기"
          >
            ←
          </button>
          <h1 className="text-lg text-center w-full font-bold">근처 쉼터 </h1>
          <button className="w-9 h-9 grid "></button>
        </div>
        <div className="h-px bg-neutral-200" />
      </header>
      <div className="flex flex-col gap-4 py-4">
        {dummy.map((s) => (
          <ShelterCard key={s.id} {...s} />
        ))}
      </div>
    </div>
  );
}
