"use client";

import MapComponent from "../MapComponent";
import GeneralCard from "./ui/GeneralCard";
import { useEffect, useState } from "react";
import { MetricTypes, SeverityStatus, ZephyrData } from "@/lib/types";
import { DataBySeverity, fetchWeatherData, processWeatherDataBySeverity } from "@/services/data";

interface MapViewProps {
  isLoading: boolean;
  userLocation: { lat: number, lng: number } | null;
}

function MapView({ isLoading, userLocation = null }: MapViewProps) {
  const [currentDetail, setCurrentDetail] = useState<MetricTypes>(MetricTypes.UV);
  const [forecastHour, setForecastHour] = useState(1);
  const [weatherData, setWeatherData] = useState<DataBySeverity | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!userLocation) return;
      setLoadingData(true);
      try {
        const data = await fetchWeatherData({
          lat: userLocation.lat,
          lng: userLocation.lng,
          forecastHour,
          metricType: currentDetail,
        });
        setWeatherData(processWeatherDataBySeverity(data));
        setError(null);
      } catch (err) {
        console.error("Failed to fetch weather data", err);
        setError("Failed to fetch weather data");
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, [currentDetail, forecastHour, userLocation]);

  const getCurrentStatus = (): { value: number; status: SeverityStatus } => {
    if (!weatherData) return { value: 0, status: SeverityStatus.LOW };

    const findInSeverity = (
      severityData: ZephyrData[],
      severityStatus: SeverityStatus
    ) => {
      const match = severityData.find((item) => item.metricType === currentDetail);
      return match ? { value: match.value, status: severityStatus } : null;
    };

    return (
      findInSeverity(weatherData.high, SeverityStatus.HIGH) ||
      findInSeverity(weatherData.medium, SeverityStatus.MEDIUM) ||
      findInSeverity(weatherData.low, SeverityStatus.LOW) || {
        value: 0,
        status: SeverityStatus.LOW,
      }
    );
  };

  const currentStatus = getCurrentStatus().status;

  const getPopupMessage = () => {
    switch (currentStatus) {
      case SeverityStatus.HIGH:
        return "High UV alert! Apply sunscreen.";
      case SeverityStatus.MEDIUM:
        return "Moderate UV in your area. Sunscreen recommended";
      case SeverityStatus.LOW:
        return "Low UV in your area";
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

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForecastHour(Number(e.target.value));
  };

  return (
    <div className="relative min-h-[320px]">
      <div className="flex justify-between mb-4">
        <div className="flex gap-2 items-center">
          {loadingData &&
            <>
              <span className="loading loading-spinner loading-xl text-primary"></span>
              <p className="text-lg animate-pulse italic">Gathering data...</p>
            </>
          }
        </div>
        <select
          defaultValue="Pick a forecast hour"
          onChange={handleHourChange}
          className="select"
        >
          <option disabled={true}>Pick a forecast hour</option>
          {[1, 2, 3, 4, 5, 6].map(hour => (
            <option key={hour} value={hour}>Hour {hour}</option>
          ))}
        </select>
      </div>
      {!isLoading ? (
        <div className="grid lg:grid-cols-[2fr_1fr] grid-cols-1 gap-4">
          <MapComponent
            position={userLocation || [61.4971, 23.7526]}
            value={getCurrentStatus().value}
            status={getCurrentStatus().status}
            statusMessage={getPopupMessage()}
          />

          <div className="grid gap-4 shadow-md">
            <div className="collapse collapse-plus bg-base-300 min-w-xs border border-base-300">
              <input type="radio" name="accordion" defaultChecked onChange={() => setCurrentDetail(MetricTypes.UV)} />
              <div className="collapse-title font-semibold">UV Index Summary</div>
              <div className="collapse-content space-y-4">
                <GeneralCard
                  description="Current UV Level"
                  measurement={getCurrentStatus().value.toFixed(2)}
                  unit={<>mW/cm<sup>2</sup></>}
                />
                <div role="alert" className={`alert ${getCurrentAlertType()} alert-soft`}>
                  <span>{getPopupMessage()}</span>
                </div>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-300 border border-base-300">
              <input type="radio" name="accordion" onChange={() => setCurrentDetail(MetricTypes.SURFACE_PRESSURE)} />
              <div className="collapse-title font-semibold">Surface Pressure</div>
              <div className="collapse-content text-sm">
                <GeneralCard
                  description="Surface Pressure"
                  measurement={getCurrentStatus().value.toFixed(2)}
                  unit={"hPa"}
                  color="bg-blue-600/30"
                />
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-300 border border-base-300">
              <input type="radio" name="accordion" onChange={() => setCurrentDetail(MetricTypes.PM25)} />
              <div className="collapse-title font-semibold">Particulate Matters</div>
              <div className="collapse-content text-sm">
                <GeneralCard
                  description="Fine Particles (≤ 2.5 µm)"
                  measurement={getCurrentStatus().value.toFixed(2)}
                  unit={<>µg/m<sup>3</sup></>}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      )}
    </div>
  );
}

export default MapView;