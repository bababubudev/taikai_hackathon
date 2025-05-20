import { useEffect, useState } from "react";
import { useWeatherData } from "@/providers/WeatherDataContext";
import { calculatePollenIndex, getPollenAdvice } from "@/lib/pollenUtils";
import { GiPollenDust, GiOakLeaf, GiFallingLeaf, GiGrass } from "react-icons/gi";
import { TbPlant } from "react-icons/tb";
import { FaLeaf, FaInfoCircle } from "react-icons/fa";
import { MetricTypes } from "@/lib/types";
import { IconType } from "react-icons";

type PollenMetric =
  | MetricTypes.ALDER_POLLEN
  | MetricTypes.BIRCH_POLLEN
  | MetricTypes.GRASS_POLLEN
  | MetricTypes.MUGWORT_POLLEN
  | MetricTypes.OLIVE_POLLEN
  | MetricTypes.RAGWEED_POLLEN;

const POLLEN_ICON_MAP: Record<PollenMetric, IconType> = {
  [MetricTypes.ALDER_POLLEN]: FaLeaf,
  [MetricTypes.BIRCH_POLLEN]: GiFallingLeaf,
  [MetricTypes.GRASS_POLLEN]: GiGrass,
  [MetricTypes.MUGWORT_POLLEN]: TbPlant,
  [MetricTypes.OLIVE_POLLEN]: GiOakLeaf,
  [MetricTypes.RAGWEED_POLLEN]: GiPollenDust
};

const getStatusColor = (index: number) => {
  if (index >= 7) return "bg-error text-error-content";
  if (index >= 4) return "bg-warning text-warning-content";
  if (index >= 1) return "bg-success text-success-content";
  return "bg-info text-info-content";
};

const getLevelBadgeColor = (index: number) => {
  if (index >= 7) return "badge-error";
  if (index >= 4) return "badge-warning";
  if (index >= 1) return "badge-success";
  return "badge-info";
};

const formatPollenValue = (value: number): string => {
  if (value === 0) return "0";
  if (value < 0.001) return value.toExponential(2);
  if (value < 0.1) return value.toFixed(3);
  if (value < 10) return value.toFixed(2);
  return value.toFixed(1);
};

function DetailedPollenView() {
  const { weatherData, loading } = useWeatherData();
  const [pollenData, setPollenData] = useState(() => calculatePollenIndex(weatherData));
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    if (!loading) {
      setPollenData(calculatePollenIndex(weatherData));
    }
  }, [weatherData, loading]);

  if (loading) {
    return <div className="flex justify-center p-8">Loading pollen data...</div>;
  }

  const { index, level, dominantPollen, individualPollens } = pollenData;
  const advice = getPollenAdvice(index);
  const statusColor = getStatusColor(index);

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <GiPollenDust className="text-yellow-500" />
          Pollen Report
        </h2>
        <button
          className="btn btn-circle btn-sm"
          onClick={() => setShowInfoModal(true)}
        >
          <FaInfoCircle />
        </button>
      </div>

      {/* Main Pollen Index Card */}
      <div className={`card shadow-xl ${statusColor}`}>
        <div className="card-body">
          <div className="flex justify-between">
            <h3 className="card-title">Pollen Index</h3>
            <div className={`badge badge-soft ${getLevelBadgeColor(index)}`}>{level}</div>
          </div>

          <div className="flex flex-col items-center justify-center py-6">
            <div className="glass radial-progress text-base-content" style={
              {
                "--value": index * 10,
                "--size": "8rem",
                "--thickness": "0.8rem"
              } as React.CSSProperties & Record<"--value" | "--size" | "--thickness", string | number>
            }>
              <span className="text-4xl font-bold">{index}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-center">
            <div className="grid text-center">
              <span className="font-light text-sm">Dominant Pollen</span>
              <span className="font-semibold text-lg">{dominantPollen}</span>
            </div>

            <div className="alert mt-2 bg-opacity-20">
              {advice}
            </div>
          </div>
        </div>
      </div>

      {/* Pollen Types Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Pollen Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(individualPollens).map(([key, pollen]) => {
            const Icon = POLLEN_ICON_MAP[key as PollenMetric] || GiPollenDust;
            const statusColor = getStatusColor(pollen.status * 2.5); // Convert severity to rough index equivalent

            return (
              <div key={key} className={`card shadow-md ${statusColor} bg-opacity-80`}>
                <div className="card-body p-4">
                  <div className="flex items-center gap-2">
                    <Icon className="text-xl" />
                    <h4 className="font-medium">{pollen.name}</h4>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm opacity-80">Level:</span>
                    <span className="font-bold">{formatPollenValue(pollen.value)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Information Modal */}
      {showInfoModal && (
        <div className="modal modal-open">
          <div className="modal-box bg-base-100 text-base-content">
            <h3 className="font-bold text-lg">About Pollen Index</h3>
            <p className="py-4">
              The pollen index is a scale from 0-10 that indicates the overall pollen concentration in the air:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="text-error font-semibold">High (7-10)</span>: High risk for allergy sufferers. Consider staying indoors.</li>
              <li><span className="text-warning font-semibold">Medium (4-6)</span>: Moderate risk. Take preventative medication if sensitive.</li>
              <li><span className="text-success font-semibold">Low (1-3)</span>: Low risk. Most people will not experience symptoms.</li>
              <li><span className="text-info font-semibold">Very Low (0)</span>: Minimal pollen in the air.</li>
            </ul>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowInfoModal(false)}>Close</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowInfoModal(false)}></div>
        </div>
      )}
    </div>
  );
}

export default DetailedPollenView;