import { ZephyrData } from "@/lib/types";
import { formatMetricValue } from "@/services/data";

interface SeveritySectionProps {
  title: string;
  data: ZephyrData[];
  severityClass: string;
}

export default function SeveritySection({ title, data, severityClass }: SeveritySectionProps) {
  if (!data || data.length === 0) {
    return (
      <div className={`p-4 rounded ${severityClass}`}>
        <h2 className="font-bold mb-2">{title}</h2>
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded ${severityClass}`}>
      <h2 className="font-bold mb-2">{title}</h2>
      <ul>
        {data.map(item => (
          <li key={item.id} className="mb-2 border-b pb-2">
            <div><strong>Metric:</strong> {item.metricType}</div>
            <div><strong>Value:</strong> {formatMetricValue(item.metricType, item.value)}</div>
            <div><strong>Forecast Hour:</strong> {item.point.forecastHour}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}