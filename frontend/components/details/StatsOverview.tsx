import { JSX } from "react";
import GeneralCard from "./ui/GeneralCard";
import { FaCloud, FaWind, FaTemperatureLow, FaBuffer } from "react-icons/fa";
import { IoWaterSharp } from "react-icons/io5";
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
      <div className="grid gap-4 grid-cols-1 md:grid-cols-[2fr_1fr]">
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
            <div className="px-4 divider divider-vertical divider-neutral opacity-30 max-w-7/12"></div>
            <div className="px-4 pb-4 flex justify-between items-center">
              <h3 className="text-xl">Main pollutant: <span className="uppercase font-bold">{pollutant}</span></h3>
              <div className="p-2 rounded-box glass">
                <p className="text-lg text-white font-bold">{pollutantValue} {pollutantUnit}</p>
              </div>
            </div>
            <div className="p-2 lg:px-16 flex gap-2 justify-between glass">
              <div className="btn btn-lg btn-ghost glass"><FaCloud /> 14</div>
              <div className="btn btn-lg btn-ghost glass"><FaWind /> 6.7</div>
              <div className="btn btn-lg btn-ghost glass"><IoWaterSharp /> 61</div>
            </div>
          </div>
        </div>
        <div className="shadow-md">
          <div className="alert alert-info shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                />
              </svg>
              <div>
                <h3 className="font-bold text-lg">🌬️ What is the Air Quality Index (AQI)?</h3>
                <p className="text-sm">
                  The Air Quality Index (AQI) is a scale used to measure and report daily air quality. It indicates how clean or
                  polluted the air is, and what health effects might be a concern. The AQI ranges from 0 to 500—lower values
                  mean cleaner air, while higher values indicate more pollution. Sensitive groups should be especially mindful of
                  high AQI levels.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <GeneralCard
          description="Pressure"
          measurement="1015.0"
          unit="hPa"
          icon={FaBuffer}
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