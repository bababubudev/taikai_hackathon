import { MetricTypes, SeverityStatus } from "@/lib/types";
import { useWeatherData } from "@/providers/WeatherDataContext";
import { FaLeaf } from "react-icons/fa";
import { GiWheat, GiFallingLeaf, GiGrass, GiOlive, GiFlowerPot } from "react-icons/gi";
import { TbPlant } from "react-icons/tb";

interface PollenOverviewProps {
  className?: string;
}

// Pollen type data mapping
const pollenTypes = [
  {
    type: MetricTypes.ALDER_POLLEN,
    name: "Alder",
    icon: FaLeaf,
    color: "bg-green-700",
    thresholds: { low: 0.05, medium: 0.3, high: 1.0 }
  },
  {
    type: MetricTypes.BIRCH_POLLEN,
    name: "Birch",
    icon: GiFallingLeaf,
    color: "bg-green-500",
    thresholds: { low: 30, medium: 90, high: 500 }
  },
  {
    type: MetricTypes.GRASS_POLLEN,
    name: "Grass",
    icon: GiGrass,
    color: "bg-emerald-500",
    thresholds: { low: 0.1, medium: 0.5, high: 2.0 }
  },
  {
    type: MetricTypes.MUGWORT_POLLEN,
    name: "Mugwort",
    icon: GiWheat,
    color: "bg-amber-600",
    thresholds: { low: 0.000000000001, medium: 0.0000000001, high: 0.00000001 }
  },
  {
    type: MetricTypes.OLIVE_POLLEN,
    name: "Olive",
    icon: GiOlive,
    color: "bg-lime-700",
    thresholds: { low: 0.0005, medium: 0.005, high: 0.05 }
  },
  {
    type: MetricTypes.RAGWEED_POLLEN,
    name: "Ragweed",
    icon: GiFlowerPot,
    color: "bg-yellow-600",
    thresholds: { low: 0.0000000001, medium: 0.000000001, high: 0.0000001 }
  }
];

// Helper functions for pollen data
const calculatePollenSeverity = (value: number, thresholds: { low: number, medium: number, high: number }): SeverityStatus => {
  if (value >= thresholds.high) return SeverityStatus.HIGH;
  if (value >= thresholds.medium) return SeverityStatus.MEDIUM;
  if (value >= thresholds.low) return SeverityStatus.LOW;
  return SeverityStatus.NONE;
};

const getSeverityLabel = (status: SeverityStatus): string => {
  switch (status) {
    case SeverityStatus.HIGH: return "High";
    case SeverityStatus.MEDIUM: return "Medium";
    case SeverityStatus.LOW: return "Low";
    default: return "None";
  }
};

const getSeverityColor = (status: SeverityStatus): string => {
  switch (status) {
    case SeverityStatus.HIGH: return "bg-error text-error-content";
    case SeverityStatus.MEDIUM: return "bg-warning text-warning-content";
    case SeverityStatus.LOW: return "bg-success text-success-content";
    default: return "bg-base-300 text-base-content";
  }
};

const formatPollenValue = (value: number): string => {
  if (value < 0.001) {
    return value.toExponential(2);
  }
  return value.toFixed(value < 0.1 ? 3 : 2);
};

const calculatePollenIndex = (pollenData: { type: MetricTypes, value: number, severity: SeverityStatus }[]): number => {
  // Weight factors for different severity levels
  const weights = {
    [SeverityStatus.NONE]: 0,
    [SeverityStatus.LOW]: 1,
    [SeverityStatus.MEDIUM]: 2,
    [SeverityStatus.HIGH]: 3
  };

  // Calculate weighted sum of pollen severity
  const sum = pollenData.reduce((acc, pollen) => {
    return acc + weights[pollen.severity];
  }, 0);

  // Normalize to 0-10 scale
  const maxPossible = Object.values(weights).length * Math.max(...Object.values(weights));
  return Math.round((sum / (pollenData.length * maxPossible)) * 10);
};

function PollenOverview({ className = "" }: PollenOverviewProps) {
  const { weatherData, loading } = useWeatherData();

  // Process pollen data
  const pollenData = pollenTypes.map(pollenType => {
    const data = weatherData[pollenType.type];
    const value = data?.value || 0;
    const severity = calculatePollenSeverity(value, pollenType.thresholds);

    return {
      ...pollenType,
      value,
      severity,
      severityLabel: getSeverityLabel(severity),
      severityColor: getSeverityColor(severity)
    };
  });

  // Calculate overall pollen index (0-10 scale)
  const pollenIndex = calculatePollenIndex(pollenData);

  // Determine overall pollen status
  let overallStatus: SeverityStatus = SeverityStatus.NONE;
  let statusLabel = "Low";
  let statusColor = "bg-success text-success-content";

  if (pollenIndex >= 7) {
    overallStatus = SeverityStatus.HIGH;
    statusLabel = "High";
    statusColor = "bg-error text-error-content";
  } else if (pollenIndex >= 4) {
    overallStatus = SeverityStatus.MEDIUM;
    statusLabel = "Medium";
    statusColor = "bg-warning text-warning-content";
  } else if (pollenIndex >= 1) {
    overallStatus = SeverityStatus.LOW;
    statusLabel = "Low";
    statusColor = "bg-success text-success-content";
  }

  return (
    <div className={`grid gap-4 ${className}`}>
      <h2 className="text-2xl font-semibold">Pollen Overview</h2>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-[1fr_2fr]">
        {/* Pollen Index Card */}
        <div className={`card shadow-lg ${statusColor}`}>
          <div className="card-body">
            <div className="flex flex-col justify-between items-center">
              <div className="flex items-center gap-2">
                <TbPlant className="text-2xl" />
                <h3 className="card-title">Pollen Index</h3>
              </div>
              <div className="badge badge-lg badge-soft">{statusLabel}</div>
            </div>

            <div className="flex flex-col items-center justify-center h-32">
              <div className="text-6xl font-bold mb-2">{pollenIndex}</div>
              <div className="text-sm opacity-80">Scale: 0-10</div>
            </div>

            <div className="flex justify-center card-actions mt-2">
              <div className="glass rounded-box p-2">
                <span className="text-sm">
                  {overallStatus === SeverityStatus.HIGH && "High pollen levels. Take precautions if you have allergies."}
                  {overallStatus === SeverityStatus.MEDIUM && "Moderate pollen levels. Monitor symptoms if sensitive."}
                  {overallStatus === SeverityStatus.LOW && "Low pollen levels. Generally favorable for allergy sufferers."}
                  {overallStatus === SeverityStatus.NONE && "Very low pollen count today."}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pollen Types Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {pollenData.map((pollen) => (
            <div key={pollen.type} className="card bg-base-300 shadow-sm">
              <div className="card-body p-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 text-3xl rounded-full ${pollen.color} text-white`}>
                    <pollen.icon />
                  </div>
                  <h3 className="text-sm font-medium">{pollen.name}</h3>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className={`badge ${pollen.severityColor}`}>
                    {pollen.severityLabel}
                  </div>
                  <div className="text-xs opacity-70">
                    {loading ? "..." : formatPollenValue(pollen.value)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="alert bg-info bg-opacity-10 text-info-content text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 className="font-bold">Important Note</h3>
          <div className="text-xs">Pollen levels can change rapidly with weather conditions. Forecasts are most accurate for the current day.</div>
        </div>
      </div>
    </div>
  );
}

export default PollenOverview;