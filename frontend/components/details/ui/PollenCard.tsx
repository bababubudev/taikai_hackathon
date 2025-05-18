import { useState } from "react";
import { GiPollenDust } from "react-icons/gi";
import { FaArrowRight } from "react-icons/fa";
import { useWeatherData } from "@/providers/WeatherDataContext";
import DetailedPollenView from "./DetailedPollenView";
import { calculatePollenIndex } from "@/lib/pollenUtils";

interface PollenCardProps {
  className?: string;
}

function PollenCard({ className = "" }: PollenCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { weatherData, loading } = useWeatherData();

  const pollenData = calculatePollenIndex(weatherData);
  const { index, level, dominantPollen } = pollenData;

  // Determine card color based on pollen level
  const getCardColor = () => {
    if (index >= 7) return "bg-error text-error-content bg-opacity-20";
    if (index >= 4) return "bg-warning text-warning-content bg-opacity-20";
    if (index >= 1) return "bg-success text-success-content bg-opacity-20";
    return "bg-info text-info-content bg-opacity-20";
  };

  // Determine badge color based on pollen level
  const getBadgeColor = () => {
    if (index >= 7) return "badge-error";
    if (index >= 4) return "badge-warning";
    if (index >= 1) return "badge-success";
    return "badge-info";
  };

  return (
    <div className={`card shadow-lg ${getCardColor()} ${className}`}>
      {showDetails ? (
        <div className="card-body p-4">
          <DetailedPollenView />
          <div className="card-actions justify-center mt-4">
            <button
              className="btn btn-sm w-full"
              onClick={() => setShowDetails(false)}
            >
              Show Less
            </button>
          </div>
        </div>
      ) : (
        <div className="card-body p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <GiPollenDust className="text-2xl text-yellow-500" />
              <h2 className="card-title">Pollen Index</h2>
            </div>
            <div className={`badge badge-soft ${getBadgeColor()}`}>
              {loading ? "..." : level}
            </div>
          </div>

          <div className="flex justify-between items-center py-3">
            <div className="flex items-center gap-3">
              <div className="glass radial-progress text-current" style={{ "--value": index * 10, "--size": "3rem", "--thickness": "0.4rem" } as any}>
                <span className="text-lg font-bold">{loading ? "..." : index}</span>
              </div>
              <div className="grid">
                <span className="text-sm font-medium">Scale: 0-10</span>
                <span className="text-xs opacity-70">Today&apos;s Level</span>
              </div>
            </div>

            <div className="grid text-right">
              <div className="text-sm font-medium">Dominant</div>
              <div className="text-xs opacity-70">{loading ? "..." : dominantPollen}</div>
            </div>
          </div>

          <div className="card-actions">
            <button
              className="btn btn-sm btn-outline w-full"
              onClick={() => setShowDetails(true)}
            >
              View Detailed Report <FaArrowRight className="ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PollenCard;