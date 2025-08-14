import SunLogo from "../assets/lucide--sun.svg";
import WaterLogo from "../assets/WaterLogo.svg";
import StepLogo from "../assets/StepLogo.svg";

export default function InfoCard({
  temperatureC = "",
  humidityPercentage = "",
  stepsCount = "",
}) {
  return (
    <div className="flex p-1 gap-2.5 items-center justify-between">
      <div className="flex w-[30vw] h-[10vh] p-3 items-center justify-between rounded-2xl bg-orange-50 border border-orange-200">
        <div className="leading-tight">
          <p className="text-sm font-bold text-orange-700">온도</p>
          <p className="text-lg font-extrabold">{temperatureC}°C</p>
        </div>
        <img src={SunLogo} alt="SunLogo" className=" w-9 h-9 object-contain" />
      </div>

      <div className="flex w-[30vw] h-[10vh] p-3 items-center justify-between rounded-2xl bg-orange-50 border border-orange-200">
        <div className="leading-tight">
          <p className="text-sm font-bold  text-orange-700">습도</p>
          <p className="text-lg font-extrabold">{humidityPercentage}%</p>
        </div>
        <img
          src={WaterLogo}
          alt="WaterLogo"
          className=" w-8 h-8 object-contain"
        />
      </div>

      <div className="flex w-[30vw] h-[10vh] p-3 items-center justify-between rounded-2xl bg-orange-50 border border-orange-200">
        <div className="leading-tight">
          <p className="text-sm font-bold  text-orange-700">걸음 수</p>
          <p className="text-lg font-extrabold">
            {Number(stepsCount)?.toLocaleString?.() ?? stepsCount}
          </p>
        </div>
        <img
          src={StepLogo}
          alt="StepLogo"
          className=" w-6 h-6 object-contain"
        />
      </div>
    </div>
  );
}
