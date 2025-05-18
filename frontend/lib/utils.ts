import { MetricTypes, ZephyrData } from "./types";
export function getMetricInfo(type: MetricTypes | string): { displayName: string; unit: string } {
  switch (type) {
    case MetricTypes.UV:
      return { displayName: "UV Index", unit: "" };
    case MetricTypes.TEMPERATURE:
      return { displayName: "Temperature", unit: "°C" };
    case MetricTypes.SURFACE_PRESSURE:
      return { displayName: "Surface Pressure", unit: "hPa" };
    case MetricTypes.CO_CONCENTRATION:
      return { displayName: "Carbon Monoxide (CO)", unit: "ppm" };
    case MetricTypes.PM25:
      return { displayName: "PM2.5", unit: "µg/m³" };
    case MetricTypes.PM10_CONCENTRATION:
      return { displayName: "PM10", unit: "µg/m³" };
    case MetricTypes.NO2_CONCENTRATION:
      return { displayName: "Nitrogen Dioxide (NO₂)", unit: "ppb" };
    case MetricTypes.O3_CONCENTRATION:
      return { displayName: "Ozone (O₃)", unit: "ppb" };
    case MetricTypes.SO2_CONCENTRATION:
      return { displayName: "Sulfur Dioxide (SO₂)", unit: "ppb" };
    case MetricTypes.ALDER_POLLEN:
      return { displayName: "Alder Pollen", unit: "grains/m³" };
    case MetricTypes.BIRCH_POLLEN:
      return { displayName: "Birch Pollen", unit: "grains/m³" };
    case MetricTypes.GRASS_POLLEN:
      return { displayName: "Grass Pollen", unit: "grains/m³" };
    case MetricTypes.MUGWORT_POLLEN:
      return { displayName: "Mugwort Pollen", unit: "grains/m³" };
    case MetricTypes.OLIVE_POLLEN:
      return { displayName: "Olive Pollen", unit: "grains/m³" };
    case MetricTypes.RAGWEED_POLLEN:
      return { displayName: "Ragweed Pollen", unit: "grains/m³" };
    case MetricTypes.NMVOC_CONCENTRATION:
      return { displayName: "NMVOC Concentration", unit: "ppm" };
    default:
      return {
        displayName: type
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()),
        unit: "",
      };
  }
}

export function calculateAQI(pollutants: Partial<Record<MetricTypes, ZephyrData | null>>): {
  aqi: number;
  mainPollutant: string;
  value: number;
  unit: string;
} {
  const AQI_BREAKPOINTS = {
    "pm2p5": [
      { c_low: 0.0, c_high: 12.0, aqi_low: 0, aqi_high: 50 },
      { c_low: 12.1, c_high: 35.4, aqi_low: 51, aqi_high: 100 },
      { c_low: 35.5, c_high: 55.4, aqi_low: 101, aqi_high: 150 },
      { c_low: 55.5, c_high: 150.4, aqi_low: 151, aqi_high: 200 },
      { c_low: 150.5, c_high: 250.4, aqi_low: 201, aqi_high: 300 },
      { c_low: 250.5, c_high: 350.4, aqi_low: 301, aqi_high: 400 },
      { c_low: 350.5, c_high: 500.4, aqi_low: 401, aqi_high: 500 },
    ],
    "pm10_conc": [
      { c_low: 0, c_high: 54, aqi_low: 0, aqi_high: 50 },
      { c_low: 55, c_high: 154, aqi_low: 51, aqi_high: 100 },
      { c_low: 155, c_high: 254, aqi_low: 101, aqi_high: 150 },
      { c_low: 255, c_high: 354, aqi_low: 151, aqi_high: 200 },
      { c_low: 355, c_high: 424, aqi_low: 201, aqi_high: 300 },
      { c_low: 425, c_high: 504, aqi_low: 301, aqi_high: 400 },
      { c_low: 505, c_high: 604, aqi_low: 401, aqi_high: 500 },
    ],
    "no2_conc": [
      { c_low: 0, c_high: 53, aqi_low: 0, aqi_high: 50 },
      { c_low: 54, c_high: 100, aqi_low: 51, aqi_high: 100 },
      { c_low: 101, c_high: 360, aqi_low: 101, aqi_high: 150 },
      { c_low: 361, c_high: 649, aqi_low: 151, aqi_high: 200 },
      { c_low: 650, c_high: 1249, aqi_low: 201, aqi_high: 300 },
      { c_low: 1250, c_high: 1649, aqi_low: 301, aqi_high: 400 },
      { c_low: 1650, c_high: 2049, aqi_low: 401, aqi_high: 500 },
    ],
    "o3_conc": [
      { c_low: 0.000, c_high: 0.054, aqi_low: 0, aqi_high: 50 },
      { c_low: 0.055, c_high: 0.070, aqi_low: 51, aqi_high: 100 },
      { c_low: 0.071, c_high: 0.085, aqi_low: 101, aqi_high: 150 },
      { c_low: 0.086, c_high: 0.105, aqi_low: 151, aqi_high: 200 },
      { c_low: 0.106, c_high: 0.200, aqi_low: 201, aqi_high: 300 },
      { c_low: 0.201, c_high: 0.404, aqi_low: 301, aqi_high: 400 },
      { c_low: 0.405, c_high: 0.604, aqi_low: 401, aqi_high: 500 },
    ],
    "co_conc": [
      { c_low: 0.0, c_high: 4.4, aqi_low: 0, aqi_high: 50 },
      { c_low: 4.5, c_high: 9.4, aqi_low: 51, aqi_high: 100 },
      { c_low: 9.5, c_high: 12.4, aqi_low: 101, aqi_high: 150 },
      { c_low: 12.5, c_high: 15.4, aqi_low: 151, aqi_high: 200 },
      { c_low: 15.5, c_high: 30.4, aqi_low: 201, aqi_high: 300 },
      { c_low: 30.5, c_high: 40.4, aqi_low: 301, aqi_high: 400 },
      { c_low: 40.5, c_high: 50.4, aqi_low: 401, aqi_high: 500 },
    ],
    "so2_conc": [
      { c_low: 0, c_high: 35, aqi_low: 0, aqi_high: 50 },
      { c_low: 36, c_high: 75, aqi_low: 51, aqi_high: 100 },
      { c_low: 76, c_high: 185, aqi_low: 101, aqi_high: 150 },
      { c_low: 186, c_high: 304, aqi_low: 151, aqi_high: 200 },
      { c_low: 305, c_high: 604, aqi_low: 201, aqi_high: 300 },
      { c_low: 605, c_high: 804, aqi_low: 301, aqi_high: 400 },
      { c_low: 805, c_high: 1004, aqi_low: 401, aqi_high: 500 },
    ],
  };

  const POLLEN_BREAKPOINTS = [
    { c_low: 0, c_high: 15, aqi_low: 0, aqi_high: 50 },
    { c_low: 16, c_high: 90, aqi_low: 51, aqi_high: 100 },
    { c_low: 91, c_high: 150, aqi_low: 101, aqi_high: 150 },
    { c_low: 151, c_high: 300, aqi_low: 151, aqi_high: 200 },
    { c_low: 301, c_high: 500, aqi_low: 201, aqi_high: 300 },
  ];

  const pollenTypes: MetricTypes[] = [
    MetricTypes.ALDER_POLLEN,
    MetricTypes.BIRCH_POLLEN,
    MetricTypes.GRASS_POLLEN,
    MetricTypes.MUGWORT_POLLEN,
    MetricTypes.OLIVE_POLLEN,
    MetricTypes.RAGWEED_POLLEN,
  ];

  const unitScaling: Record<string, number> = {
    pm2p5: 1e9,        // fractional g/m³ -> µg/m³
    pm10_conc: 1,      // already in µg/m³
    no2_conc: 1,       // assuming already in µg/m³ or consistent
    o3_conc: 1,
    co_conc: 1,        // check if mg/m³ or ppm, scale accordingly
    so2_conc: 1,       // as above
  };

  const scores: {
    type: MetricTypes;
    aqi: number;
    value: number;
  }[] = [];

  for (const [type, breakpoints] of Object.entries(AQI_BREAKPOINTS)) {
    const data = pollutants[type as MetricTypes];
    if (!data) continue;

    const scale = unitScaling[type] ?? 1;
    const value = data.value * scale;
    const bp = breakpoints.find(b => value >= b.c_low && value <= b.c_high);

    if (bp) {
      const aqi = ((bp.aqi_high - bp.aqi_low) / (bp.c_high - bp.c_low)) * (value - bp.c_low) + bp.aqi_low;
      scores.push({
        type: type as MetricTypes,
        aqi: Math.round(aqi),
        value: +value.toFixed(2),
      });
    }
  }

  for (const pollenType of pollenTypes) {
    const data = pollutants[pollenType];
    if (!data) continue;

    const value = data.value;
    const bp = POLLEN_BREAKPOINTS.find(b => value >= b.c_low && value <= b.c_high);

    if (bp) {
      const aqi = ((bp.aqi_high - bp.aqi_low) / (bp.c_high - bp.c_low)) * (value - bp.c_low) + bp.aqi_low;
      scores.push({
        type: pollenType,
        aqi: Math.round(aqi),
        value: +value.toFixed(2),
      });
    }
  }

  if (scores.length === 0) return { aqi: 0, mainPollutant: "Unknown", value: 0, unit: "" };

  const worst = scores.sort((a, b) => b.aqi - a.aqi)[0];
  const info = getMetricInfo(worst.type);

  return {
    aqi: worst.aqi,
    mainPollutant: info.displayName,
    value: worst.value,
    unit: info.unit,
  };
}
