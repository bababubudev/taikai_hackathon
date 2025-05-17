import { JSX } from "react";
import GeneralCard from "./ui/GeneralCard";
import { FaWeight, FaTemperatureLow } from "react-icons/fa";
import { GiPollenDust } from "react-icons/gi";

interface StatsOverviewProps {
  airIndex: number;
  pollutant: string;
  pollutantValue: number;
  pollutantUnit?: string | JSX.Element;
}

function StatsOverview({ airIndex, pollutant, pollutantValue, pollutantUnit }: StatsOverviewProps) {
  const getAirPollutionStatus = (): { output: string, bg: string, col: string, img?: string } => {
    if (airIndex <= 30) {
      return { output: "Good", bg: "bg-primary", col: "text-primary-content", };
    }
    else if (airIndex > 30 && airIndex <= 50) {
      return { output: "Moderate", bg: "bg-warning", col: "text-warning-content" };
    }
    else {
      return { output: "Bad", bg: "bg-error", col: "text-error-content", img: "/general-images/overview_2.webp" };
    }
  }

  return (
    <div className="grid gap-4">
      <div className={`rounded-box relative overflow-hidden text-primary-content w-full shadow-lg ${getAirPollutionStatus().bg} ${getAirPollutionStatus().col}`}>
        <div className="absolute top-0 right-0 h-full w-1/2 z-0"
          style={{
            clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)",
            backgroundImage: getAirPollutionStatus().img ? `url(${getAirPollutionStatus().img})` : "url('/general-images/overview.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}>
        </div>
        <div className="relative z-10">
          <div className="px-4 pt-4 grid items-center grid-cols-[6rem_1fr]">
            <div className="rounded-box text-center bg-base-200/30 p-4">
              <p className="text-xl">{airIndex}</p>
              <p className="text-xs">AQI</p>
            </div>
            <h3 className="text-2xl p-4">
              {getAirPollutionStatus().output}
            </h3>
          </div>
          <div className="px-4 divider divider-vertical divider-neutral opacity-30"></div>
          <div className="px-4 pb-4 flex justify-between items-center">
            <h3 className="text-xl">Main pollutant: <span className="uppercase font-bold">{pollutant}</span></h3>
            <div className="p-2 rounded-box glass border-2 border-neutral/30">
              <p className="text-xl text-white font-bold">{pollutantValue} {pollutantUnit}</p>
            </div>
          </div>
          <div className="p-2 px-16 flex rounded-b-box justify-between bg-base-content">
            <div className="badge badge-ghost">14</div>
            <div className="badge badge-ghost">6.7</div>
            <div className="badge badge-ghost">61</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <GeneralCard
          description="Prabesh weight"
          measurement="58"
          unit="KG"
          icon={FaWeight}
          color="bg-secondary/30"
        />
        <GeneralCard
          description="Tampere"
          measurement="16"
          unit="°C"
          icon={FaTemperatureLow}
          color="bg-primary/30"
        />
        <GeneralCard
          description="Fine Particles (≤ 2.5 µm)"
          measurement="4.4"
          unit={<>µg/m<sup>3</sup></>}
          icon={GiPollenDust}
          color="bg-base-content/30"
        />
      </div>
    </div>
  );
}

export default StatsOverview;