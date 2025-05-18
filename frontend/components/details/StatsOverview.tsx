import { useEffect } from "react";
import GeneralCard from "./ui/GeneralCard";
import { FaCloud, FaWind, FaTemperatureLow, FaBuffer } from "react-icons/fa";
import { IoWaterSharp } from "react-icons/io5";
import { GiPollenDust } from "react-icons/gi";
import { TbUvIndex } from "react-icons/tb";
import { useWeatherData } from "@/providers/WeatherDataContext";
import { Location, MetricTypes } from "@/lib/types";
import { calculateAQI, getMetricInfo } from "@/lib/utils"
import PollenCard from "./ui/PollenCard";

interface StatsOverviewProps {
  userLocation?: Location | null;
}

function StatsOverview({ userLocation }: StatsOverviewProps) {
  const { weatherData, loading, error, fetchDataForLocation } = useWeatherData();
  const { aqi, mainPollutant, value, unit } = calculateAQI(weatherData);

  useEffect(() => {
    if (userLocation && !loading) {
      fetchDataForLocation(userLocation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation, fetchDataForLocation]);

  const uvData = weatherData[MetricTypes.UV];
  const fineParticlesData = weatherData[MetricTypes.PM25];
  const pressureData = weatherData[MetricTypes.SURFACE_PRESSURE];
  const temperatureData = weatherData[MetricTypes.TEMPERATURE];

  const pm25 = weatherData[MetricTypes.PM25];
  const pm10 = weatherData[MetricTypes.PM10_CONCENTRATION];
  const o3 = weatherData[MetricTypes.O3_CONCENTRATION];
  const no2 = weatherData[MetricTypes.NO2_CONCENTRATION];

  const uv = uvData ? uvData.value.toFixed(2) : "N/A";
  const fineParticles = fineParticlesData ? (fineParticlesData.value * 10E9).toFixed(2) : "N/A";
  const pressure = pressureData ? (pressureData.value / 100).toFixed(2) : "N/A";
  const temperature = temperatureData ? (temperatureData.value - 273.15).toFixed(1) : "N/A";

  const convertUvToIndex = (uv: number): number => {
    // 1 UVI ≈ 0.025 mW/cm² of UV radiation
    // Clamp result to 0 decimal places for standard UV Index scale
    if (isNaN(uv) || uv < 0) return 0;
    const newUv = uv * 4;
    return Math.round(newUv / 0.025);
  };

  const getAirPollutionStatus = (aqi: number): { output: string, bg: string, col: string, img?: string } => {
    if (aqi <= 50) return { output: "Good", bg: "bg-primary", col: "text-primary-content" };
    if (aqi <= 100) return { output: "Moderate", bg: "bg-warning", col: "text-warning-content" };
    return { output: "Bad", bg: "bg-error", col: "text-error-content", img: "/general-images/overview_2.webp" };
  }

  const aqiStatus = getAirPollutionStatus(aqi);

  return (
    <div className="grid gap-4">
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          {loading ?
            <>
              <span className="loading loading-spinner loading-xl text-primary"></span>
              <p className="text-sm md:text-lg animate-pulse italic">Gathering data...</p>
            </> :
            <h3 className="text-2xl font-semibold">Statistics</h3>
          }
          {error &&
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          }
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div className={`rounded-box relative overflow-hidden text-primary-content w-full shadow-lg ${aqiStatus.bg} ${aqiStatus.col}`}>
          <div className="absolute top-0 right-0 h-full w-1/2 z-0"
            style={{
              clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)",
              backgroundImage: aqiStatus.img ? `url(${aqiStatus.img})` : "url('/general-images/overview.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}>
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="px-4 pt-4 grid items-center grid-cols-[6rem_1fr]">
              <div className="rounded-box text-center glass p-4">
                <p className="text-4xl">{aqi}</p>
                <p className="text-xs">AQI*</p>
              </div>
              <h3 className="text-2xl p-4">
                {aqiStatus.output}
              </h3>
            </div>
            <div className="px-4 divider divider-vertical divider-neutral opacity-30 max-w-7/12"></div>
            <div className="px-4 pb-4 flex justify-between items-center">
              <div className="p-0">
                <h3 className="text-xl font-light">Main Pollutant </h3>
                <span className="text-xl font-bold">{mainPollutant}</span>
              </div>
              <div className="p-2 rounded-box glass text-center">
                <p className="text-lg text-white font-bold">{value} {unit}</p>
              </div>
            </div>
            <div className="p-2 m-2 mt-auto rounded-box lg:px-16 flex gap-2 justify-between glass">
              <div className="btn btn-lg btn-ghost glass"><FaCloud /> {loading ? "..." : "14"}</div>
              <div className="btn btn-lg btn-ghost glass"><FaWind /> {loading ? "..." : "6.7"}</div>
              <div className="btn btn-lg btn-ghost glass"><IoWaterSharp /> {loading ? "..." : "61"}</div>
            </div>
          </div>
        </div>
        <div className="grid gap-2 shadow-md">
          <div className="collapse collapse-plus bg-base-300 border border-base-300">
            <input type="radio" name="accordion" defaultChecked />
            <div className="collapse-title font-semibold">Pollutant Summary</div>
            <div className="collapse-content">
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-4 bg-base-100 rounded-box p-2 shadow-md">
                  <div>
                    <h3 className="text-2xl">O<sub>3</sub></h3>
                    <p className="text-sm opacity-30">Ozone</p>
                  </div>
                  <div className="badge badge-info badge-soft">{o3?.value.toFixed(2) + " " + getMetricInfo(MetricTypes.O3_CONCENTRATION).unit}</div>
                </div>
                <div className="grid gap-4 bg-base-100 rounded-box p-2 shadow-md">
                  <div>
                    <h3 className="text-2xl">NO<sub>2</sub></h3>
                    <p className="text-sm opacity-30">Nitrogen Dioxide</p>
                  </div>
                  <div className="badge badge-info badge-soft">{no2?.value.toFixed(2) + " " + getMetricInfo(MetricTypes.NO2_CONCENTRATION).unit}</div>
                </div>
                <div className="grid gap-4 bg-base-100 rounded-box p-2 shadow-md">
                  <div>
                    <h3 className="text-2xl">PM2.5</h3>
                    <p className="text-sm opacity-30">Fine Particles (&#8804;2.5µm)</p>
                  </div>
                  <div className="badge badge-info badge-soft">{(Number(pm25?.value) * 1e9).toFixed() + " " + getMetricInfo(MetricTypes.PM25).unit}</div>
                </div>
                <div className="grid gap-4 bg-base-100 rounded-box p-2 shadow-md">
                  <div>
                    <h3 className="text-2xl">PM10</h3>
                    <p className="text-sm opacity-30">Coarse particles (≤10µm)</p>
                  </div>
                  <div className="badge badge-info badge-soft">{pm10?.value.toFixed(2) + " " + getMetricInfo(MetricTypes.PM10_CONCENTRATION).unit}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="collapse collapse-plus bg-base-300 border border-base-300">
            <input type="radio" name="accordion" />
            <div className="collapse-title font-semibold">Current Health Focus</div>
            <div className="collapse-content flex flex-wrap gap-2">
              <div className="badge badge-info">
                Asthma
              </div>
              <div className="badge badge-warning">
                Pollen Allergy
              </div>
            </div>
          </div>

          <div className="collapse collapse-plus bg-base-300 border border-base-300">
            <input type="radio" name="accordion" />
            <div className="collapse-title font-semibold">AQI Summary</div>
            <div className="collapse-content">
              <div className="alert alert-info shadow-lg flex p-2">
                <div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 className="font-bold text-lg">What is AQI?</h3>
                  </div>
                  <p className="text-sm overflow-y-auto max-h-42 lg:max-h-24 pr-2">
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-start">
        <PollenCard />
        <div className="grid grid-cols-2 gap-2 gap-y-4">
          <GeneralCard
            description="Temperature"
            measurement={loading ? "..." : temperature}
            unit="°C"
            icon={FaTemperatureLow}
            color="bg-primary/30"
          />
          <GeneralCard
            description="UV Index"
            measurement={loading ? "..." : convertUvToIndex(Number(uv)).toString()}
            unit={"UI"}
            icon={TbUvIndex}
            color="bg-info/30"
          />
          <GeneralCard
            description="Pressure"
            measurement={loading ? "..." : pressure}
            unit="hPa"
            icon={FaBuffer}
            color="bg-secondary/30"
          />
          <GeneralCard
            description="Fine Particles"
            measurement={loading ? "..." : fineParticles}
            unit={<>µg/m<sup>3</sup></>}
            icon={GiPollenDust}
            color="bg-warning/30"
          />
        </div>
      </div>
    </div>
  );
}

export default StatsOverview;
