"use client";

import MapComponent from "../MapComponent";
import GeneralCard from "./ui/GeneralCard";
import { useEffect, useState } from "react";
import { MetricTypes, SeverityStatus } from "@/lib/types";
import { useWeatherData } from "@/providers/WeatherDataContext";
import { TbUvIndex } from "react-icons/tb";
import { FaTemperatureLow, FaBuffer } from "react-icons/fa";
import { GiPollenDust } from "react-icons/gi";

interface MapViewProps {
  isLoading: boolean;
  userLocation: { lat: number, lng: number } | null;
}

const NORMALS = {
  [MetricTypes.TEMPERATURE]: { avg: 283.15, threshold: 5 }, // 10°C ±5
  [MetricTypes.UV]: { avg: 0.2, threshold: 0.1 },
  [MetricTypes.SURFACE_PRESSURE]: { avg: 101325, threshold: 1000 },
  [MetricTypes.PM25]: { threshold: 10E-9 }, // 10 µg/m3
};

function MapView({ isLoading, userLocation = null }: MapViewProps) {
  const { weatherData, loading, error, fetchDataForLocation, currentForecastHour, setForecastHour } = useWeatherData();
  const [currentDetail, setCurrentDetail] = useState<MetricTypes>(MetricTypes.PM25);

  useEffect(() => {
    if (userLocation && !loading) {
      fetchDataForLocation(userLocation, currentForecastHour);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation, currentForecastHour, fetchDataForLocation]);

  const getCurrentStatus = (): { value: number; status: SeverityStatus } => {
    const currentData = weatherData[currentDetail];
    if (!currentData) return { value: 0, status: SeverityStatus.NONE };

    return {
      value: currentData.value,
      status: currentData.status,
    };
  };

  const { status } = getCurrentStatus();
  const currentStatus = status;

  const getPopupMessage = () => {
    switch (currentDetail) {
      case MetricTypes.UV:
        switch (status) {
          case SeverityStatus.HIGH:
            return "High UV alert! Apply sunscreen and avoid midday sun.";
          case SeverityStatus.MEDIUM:
            return "Moderate UV levels. Sunscreen recommended.";
          case SeverityStatus.LOW:
            return "Low UV index. Minimal sun protection needed.";
          default:
            return "UV data unavailable.";
        }
      case MetricTypes.PM25:
        switch (status) {
          case SeverityStatus.HIGH:
            return "Air quality is poor. Avoid outdoor activities.";
          case SeverityStatus.MEDIUM:
            return "Moderate pollution. Sensitive groups should be cautious.";
          case SeverityStatus.LOW:
            return "Air quality is good.";
          default:
            return "PM2.5 data unavailable.";
        }
      case MetricTypes.SURFACE_PRESSURE:
        switch (status) {
          case SeverityStatus.HIGH:
            return "Pressure difference is high.";
          case SeverityStatus.MEDIUM:
            return "Minor pressure fluctuations. Could cause trouble to sensitive individuals";
          case SeverityStatus.LOW:
            return "Pressure difference is nominal.";
          default:
            return "Pressure data unavailable.";
        }
      case MetricTypes.TEMPERATURE:
        switch (status) {
          case SeverityStatus.HIGH:
            return "High temperature. Stay hydrated and avoid heat exposure.";
          case SeverityStatus.MEDIUM:
            return "Warm weather. Stay comfortable.";
          case SeverityStatus.LOW:
            return "Cool or cold. Dress accordingly.";
          default:
            return "Temperature data unavailable.";
        }
      default:
        return "No data available.";
    }
  };

  const getCurrentAlertType = () => {
    switch (currentStatus) {
      case SeverityStatus.HIGH:
        return "alert-error";
      case SeverityStatus.MEDIUM:
        return "alert-warning";
      case SeverityStatus.LOW:
        return "alert-success";
      default:
        return "alert-info";
    }
  };

  const getNameAndNote = (): { note: string, type: string } => {
    switch (currentDetail) {
      case MetricTypes.UV:
        return {
          note: "High UV can cause skin damage and eye injuries. Use sunscreen and protective clothing.",
          type: "UV Index Summary",
        };
      case MetricTypes.PM25:
        return {
          note: "Prolonged exposure to fine particles may cause respiratory or heart conditions.",
          type: "Particulate Matters"
        };
      case MetricTypes.SURFACE_PRESSURE:
        return {
          note: "Sudden pressure changes might trigger migraines or joint pain for sensitive individuals.",
          type: "Surface Pressure",
        };
      case MetricTypes.TEMPERATURE:
        return {
          note: "Extreme temperatures may lead to heatstroke or hypothermia if not properly addressed.",
          type: "Temperature",
        };
      default:
        return {
          note: "",
          type: "",
        };
    }
  };

  const convertUvToIndex = (uv: number): number => {
    // 1 UVI ≈ 0.025 mW/cm² of UV radiation
    // Clamp result to 0 decimal places for standard UV Index scale
    if (isNaN(uv) || uv < 0) return 0;
    const newUv = uv * 2;
    return Math.round(newUv / 0.025);
  };

  const uvData = weatherData[MetricTypes.UV];
  const fineParticlesData = weatherData[MetricTypes.PM25];
  const pressureData = weatherData[MetricTypes.SURFACE_PRESSURE];
  const temperatureData = weatherData[MetricTypes.TEMPERATURE];

  const uv = uvData ? uvData.value : "N/A";
  const fineParticles = fineParticlesData ? (fineParticlesData.value * 10E9).toFixed(2) : "N/A";
  const pressure = pressureData ? (pressureData.value / 100).toFixed(2) : "N/A";
  const temperature = temperatureData ? (temperatureData.value - 273.15).toFixed(1) : "N/A";

  const getCombinedHealthSummary = () => {
    if (isNaN(Number(uv)) || isNaN(Number(fineParticles)) || isNaN(Number(pressure)) || isNaN(Number(temperature))) return { message: "", riskScore: 0 };

    const messages: string[] = [];
    let riskScore = 0;

    // Temperature Analysis
    if (Number(temperature)) {
      const deviation = Number(temperature) - (NORMALS[MetricTypes.TEMPERATURE].avg - 273.15);
      if (Math.abs(deviation) > NORMALS[MetricTypes.TEMPERATURE].threshold) {
        messages.push(`🌡️ It's ${deviation > 0 ? "hotter" : "colder"} than usual by about ${Math.abs(deviation).toFixed(1)}°C.`);
        riskScore += 1;
      }
    }

    // UV Index
    if (Number(uv) > NORMALS[MetricTypes.UV].threshold) {
      messages.push("☀️ UV levels are elevated. Skin protection is advised.");
      riskScore += 1;
    }

    // PM2.5
    if (Number(fineParticles) > NORMALS[MetricTypes.PM25].threshold) {
      messages.push("🌫️ Air contains fine particles. Sensitive individuals should limit outdoor exposure.");
      riskScore += 2;
    }

    // Pressure
    if (Number(pressure)) {
      const delta = Math.abs(Number(pressure) - NORMALS[MetricTypes.SURFACE_PRESSURE].avg);
      if (delta > NORMALS[MetricTypes.SURFACE_PRESSURE].threshold) {
        messages.push("📉 Pressure shifts may cause discomfort for people with migraines or joint issues.");
        riskScore += 1;
      }
    }

    if (Number(temperature) > 25 && Number(fineParticles) > NORMALS[MetricTypes.PM25].threshold) {
      messages.push("⚠️ High heat and air pollution may worsen symptoms for asthmatics or people with respiratory conditions.");
      riskScore += 2;
    }

    if (messages.length === 0) {
      return { message: "✅ Today's weather poses minimal health risks. Stay safe and enjoy your day!", riskScore: 0 };
    }

    return { message: messages.join(" "), riskScore };
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedHour = Number(e.target.value);
    setForecastHour(selectedHour);
  };

  const combinedSummary = getCombinedHealthSummary();

  return (
    <div className="relative min-h-[320px]">
      <div className="flex justify-between mb-4">
        <div className="flex gap-2 items-center">
          {(loading) ?
            <>
              <span className="loading loading-spinner loading-xl text-primary"></span>
              <p className="text-sm md:text-lg animate-pulse italic">Gathering data...</p>
            </> :
            <h3 className="text-2xl font-semibold">My Location</h3>
          }
          {error &&
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          }
        </div>
        <select
          value={currentForecastHour}
          onChange={handleHourChange}
          className="select max-w-1/2 lg:max-w-none"
        >
          <option disabled={true}>Pick a forecast hour</option>
          {[1, 2, 3, 4, 5, 6].map(hour => (
            <option key={hour} value={hour}>Hour {hour}</option>
          ))}
        </select>
      </div>
      {(!isLoading || weatherData[MetricTypes.UV]) ? (
        <div className="grid lg:grid-cols-[2fr_1fr] grid-cols-1 gap-4">
          <MapComponent
            position={userLocation || [61.4971, 23.7526]}
            currentDetail={getNameAndNote().type}
            value={getCurrentStatus().value}
            status={getCurrentStatus().status}
            statusMessage={getPopupMessage()}
          />

          <div className="grid gap-4 shadow-md">
            <div className="collapse collapse-plus bg-base-300 border border-base-300">
              <input type="radio" name="accordion" onChange={() => setCurrentDetail(MetricTypes.UV)} />
              <div className="collapse-title font-semibold">UV Index Summary</div>
              <div className="collapse-content space-y-4">
                <GeneralCard
                  description="Current UV Index"
                  measurement={convertUvToIndex(Number(uv)).toString()}
                  unit={"UVI"}
                  icon={TbUvIndex}
                />
                <div role="alert" className={`alert ${getCurrentAlertType()} alert-soft`}>
                  <span>{getPopupMessage()}</span>
                </div>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-300 border border-base-300">
              <input type="radio" name="accordion" onChange={() => setCurrentDetail(MetricTypes.SURFACE_PRESSURE)} />
              <div className="collapse-title font-semibold">Surface Pressure</div>
              <div className="collapse-content space-y-4 text-sm">
                <GeneralCard
                  description="Surface Pressure"
                  measurement={pressure.toString()}
                  unit={"hPa"}
                  color="bg-blue-600/30"
                  icon={FaBuffer}
                />
                <div role="alert" className={`alert ${getCurrentAlertType()} alert-soft`}>
                  <span>{getPopupMessage()}</span>
                </div>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-300 border border-base-300">
              <input type="radio" name="accordion" defaultChecked onChange={() => setCurrentDetail(MetricTypes.PM25)} />
              <div className="collapse-title font-semibold">Particulate Matters</div>
              <div className="collapse-content space-y-4 text-sm">
                <GeneralCard
                  description="Fine Particles"
                  measurement={fineParticles}
                  unit={<>µg/m<sup>3</sup></>}
                  icon={GiPollenDust}
                />
                <div role="alert" className={`alert ${getCurrentAlertType()} alert-soft`}>
                  <span>{getPopupMessage()}</span>
                </div>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-300 border border-base-300">
              <input type="radio" name="accordion" onChange={() => setCurrentDetail(MetricTypes.TEMPERATURE)} />
              <div className="collapse-title font-semibold">Temperature</div>
              <div className="collapse-content space-y-4 text-sm">
                <GeneralCard
                  description="Temperature"
                  measurement={temperature.toString()}
                  unit={"°C"}
                  color="bg-blue-600/30"
                  icon={FaTemperatureLow}
                />
                <div role="alert" className={`alert ${getCurrentAlertType()} alert-soft`}>
                  <span>{getPopupMessage()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      )}

      <div className="mt-6 p-4 border border-base-300 bg-base-200 rounded-lg shadow-sm space-y-2">
        <div className="flex justify-between gap-2 items-center">
          <h3 className="text-lg font-semibold">Combined Health Impact</h3>
          <div className={`badge badge-soft min-w-24 ${combinedSummary.riskScore >= 4
            ? "badge-error"
            : combinedSummary.riskScore >= 2
              ? "badge-warning"
              : "badge-success"
            }`}>
            Risk: {combinedSummary.riskScore}
          </div>
        </div>

        {combinedSummary.message ? (
          <div className="text-sm text-base-content/80 leading-relaxed">
            {combinedSummary.message.split(" ").map((word, idx) => {
              return word.includes("⚠️") || word.includes("📉") || word.includes("🌫️") || word.includes("☀️") || word.includes("🌡️")
                ? <strong key={idx} className="text-warning">{word} </strong>
                : <span key={idx}>{word} </span>;
            })}
          </div>
        ) : (
          <div className="alert alert-info alert-soft text-sm">
            <span>No significant health concerns detected. Enjoy your day!</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapView;