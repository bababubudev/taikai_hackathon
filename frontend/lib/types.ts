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
  CO_CONCENTRATION = "co_conc",
  PM25 = "pm2p5",
  ALDER_POLLEN = "apg_conc",
  BIRCH_POLLEN = "bpg_conc",
  GRASS_POLLEN = "gpg_conc",
  MUGWORT_POLLEN = "mpg_conc",
  OLIVE_POLLEN = "opg_conc",
  RAGWEED_POLLEN = "rwpg_conc",
  NMVOC_CONCENTRATION = "nmvoc_conc",
  NO2_CONCENTRATION = "no2_conc",
  O3_CONCENTRATION = "o3_conc",
  PM10_CONCENTRATION = "pm10_conc",
  SO2_CONCENTRATION = "so2_conc",
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

export interface Location {
  lat: number;
  lng: number;
}