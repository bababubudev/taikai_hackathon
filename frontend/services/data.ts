import { MetricTypes, SeverityStatus, ZephyrData } from "@/lib/types";

const API_ENDPOINT = "https://zephyr.190304.xyz/api/v1/data";

export type DataBySeverity = {
  low: ZephyrData[],
  medium: ZephyrData[],
  high: ZephyrData[]
};

export interface GroupedByHour {
  [hour: number]: {
    [metricType: string]: ZephyrData[];
  };
}

export interface FetchOptions {
  lat: number;
  lng: number;
  metricType: string;
  forecastHour: number;
}

export const getSeverityDescription = (status: SeverityStatus) => {
  switch (status) {
    case SeverityStatus.HIGH:
      return "High";
    case SeverityStatus.MEDIUM:
      return "Medium";
    case SeverityStatus.LOW:
      return "Low";
    default:
      return "Unknown";
  }
};

export async function fetchWeatherData(options: FetchOptions = {} as FetchOptions): Promise<ZephyrData[]> {
  const { lat, lng, metricType, forecastHour } = options;

  try {
    const queryParams = new URLSearchParams();
    if (lng !== undefined) queryParams.append("lng", lng.toString());
    if (lat !== undefined) queryParams.append("lat", lat.toString());
    if (forecastHour !== undefined) queryParams.append("forecastHour", forecastHour.toString());
    if (metricType !== undefined) queryParams.append("metricType", metricType);

    const url = `${API_ENDPOINT}?${queryParams.toString()}`;
    console.log(url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching weather data: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    throw error;
  }
}

export function processWeatherDataBySeverity(data: ZephyrData[]): DataBySeverity {
  const result: DataBySeverity = {
    low: [],
    medium: [],
    high: []
  };

  data.forEach(item => {
    switch (item.status) {
      case SeverityStatus.LOW:
        result.low.push(item);
        break;
      case SeverityStatus.MEDIUM:
        result.medium.push(item);
        break;
      case SeverityStatus.HIGH:
        result.high.push(item);
        break;
      default:
        break;
    }
  });

  return result;
}

export function formatMetricValue(metricType: MetricTypes, value: number) {
  switch (metricType) {
    case MetricTypes.UV:
      return value.toFixed(2);
    case MetricTypes.TEMPERATURE:
      return (value - 273.15).toFixed(1) + "°C";
    case MetricTypes.SURFACE_PRESSURE:
      return (value / 100).toFixed(1) + " hPa";
    case MetricTypes.PM25:
      return value.toExponential(2) + " µg/m³";
    default:
      return value.toString();
  }
}

export async function getGroupedWeatherData() {
  try {
    const data: ZephyrData[] = await fetchWeatherData();

    const groupedByHour: GroupedByHour = {};

    data.forEach(item => {
      const hour = item.point.forecastHour;
      if (!groupedByHour[hour]) {
        groupedByHour[hour] = {};
      }

      if (!groupedByHour[hour][item.metricType]) {
        groupedByHour[hour][item.metricType] = [];
      }

      groupedByHour[hour][item.metricType].push(item);
    });

    return groupedByHour;
  } catch (error) {
    console.error("Failed to get grouped weather data:", error);
    throw error;
  }
}