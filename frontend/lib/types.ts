export enum SeverityStatus {
  NONE = -1,
  LOW,
  MEDIUM,
  HIGH,
}

export enum MetricTypes {
  UV = "uv",
  TEMPERATURE = "tm",
  SURFACE_PRESSURE = "sp",
  PM25 = "pm2p5"
};

export interface ZephyrData {
  id: number;
  point: Point;
  metricType: MetricTypes;
  value: number;
  status: SeverityStatus;
}

export interface Point {
  id: number;
  forecastHour: number;
  latitude: number;
  longitude: number;
}