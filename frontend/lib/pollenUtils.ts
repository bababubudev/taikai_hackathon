import { MetricTypes, SeverityStatus, ZephyrData } from "@/lib/types";

// Helper types for pollen calculation
interface PollenInfo {
  name: string;
  value: number;
  status: SeverityStatus;
  unit: string;
}

interface PollenIndexResult {
  index: number;         // 0-10 scale
  level: string;         // "Low", "Medium", "High"
  dominantPollen: string;
  individualPollens: Record<string, PollenInfo>;
}

/**
 * Define thresholds for pollen concentration levels based on health impact
 */
const POLLEN_THRESHOLDS = {
  [MetricTypes.ALDER_POLLEN]: { low: 0.05, medium: 0.3, high: 1.0, unit: "grains/m³" },
  [MetricTypes.BIRCH_POLLEN]: { low: 30, medium: 90, high: 500, unit: "grains/m³" },
  [MetricTypes.GRASS_POLLEN]: { low: 0.1, medium: 0.5, high: 2.0, unit: "grains/m³" },
  [MetricTypes.MUGWORT_POLLEN]: { low: 0.000000000001, medium: 0.0000000001, high: 0.00000001, unit: "grains/m³" },
  [MetricTypes.OLIVE_POLLEN]: { low: 0.0005, medium: 0.005, high: 0.05, unit: "grains/m³" },
  [MetricTypes.RAGWEED_POLLEN]: { low: 0.0000000001, medium: 0.000000001, high: 0.0000001, unit: "grains/m³" }
};

/**
 * Friendly names for pollen types
 */
const POLLEN_NAMES = {
  [MetricTypes.ALDER_POLLEN]: "Alder",
  [MetricTypes.BIRCH_POLLEN]: "Birch",
  [MetricTypes.GRASS_POLLEN]: "Grass",
  [MetricTypes.MUGWORT_POLLEN]: "Mugwort",
  [MetricTypes.OLIVE_POLLEN]: "Olive",
  [MetricTypes.RAGWEED_POLLEN]: "Ragweed"
};

/**
 * Calculate pollen index and detailed information from weather data
 *
 * @param weatherData - The weather data containing pollen metrics
 * @returns PollenIndexResult with overall index and detailed info
 */
export function calculatePollenIndex(weatherData: Record<string, ZephyrData | null>): PollenIndexResult {
  // Process each pollen type
  const individualPollens: Record<string, PollenInfo> = {};
  let highestSeverity = SeverityStatus.NONE;
  let dominantPollenType = "";
  let dominantPollenRatio = 0;

  // Process available pollen data
  Object.entries(POLLEN_THRESHOLDS).forEach(([metricType, threshold]) => {
    const data = weatherData[metricType as MetricTypes];

    if (data) {
      // Determine severity based on thresholds rather than API status
      let status = SeverityStatus.NONE;
      const value = data.value;

      if (value >= threshold.high) {
        status = SeverityStatus.HIGH;
      } else if (value >= threshold.medium) {
        status = SeverityStatus.MEDIUM;
      } else if (value >= threshold.low) {
        status = SeverityStatus.LOW;
      }

      // Store pollen info
      individualPollens[metricType] = {
        name: POLLEN_NAMES[metricType as keyof typeof POLLEN_NAMES],
        value,
        status,
        unit: threshold.unit
      };

      // Update highest severity and dominant pollen
      if (status > highestSeverity) {
        highestSeverity = status;
      }

      // Calculate relative potency for determining dominant pollen
      // (normalized to threshold values)
      const relativeValue = value / threshold.medium;
      if (relativeValue > dominantPollenRatio) {
        dominantPollenRatio = relativeValue;
        dominantPollenType = metricType as MetricTypes;
      }
    }
  });

  // Calculate overall pollen index (0-10 scale)
  const severityWeights = {
    [SeverityStatus.NONE]: 0,
    [SeverityStatus.LOW]: 1,
    [SeverityStatus.MEDIUM]: 2,
    [SeverityStatus.HIGH]: 3
  };

  // Calculate weighted sum and normalize
  let totalWeight = 0;
  let pollenCount = 0;

  Object.values(individualPollens).forEach(pollen => {
    totalWeight += severityWeights[pollen.status];
    pollenCount++;
  });

  // Calculate index on 0-10 scale
  let index = 0;
  if (pollenCount > 0) {
    // Max possible weight per pollen is 3 (HIGH)
    index = Math.round((totalWeight / (pollenCount * 3)) * 10);
  }

  // Set overall level
  let level = "Low";
  if (index >= 7) {
    level = "High";
  } else if (index >= 4) {
    level = "Medium";
  }

  return {
    index,
    level,
    dominantPollen: dominantPollenType ? POLLEN_NAMES[dominantPollenType as keyof typeof POLLEN_NAMES] : "None",
    individualPollens
  };
}

/**
 * Get a descriptive message based on pollen index
 */
export function getPollenAdvice(index: number): string {
  if (index >= 8) {
    return "Very high pollen levels. Consider staying indoors and using air purifiers if you have allergies.";
  } else if (index >= 6) {
    return "High pollen levels. Take medication before symptoms start and limit outdoor activities.";
  } else if (index >= 4) {
    return "Moderate pollen levels. Keep windows closed and monitor symptoms if you're sensitive.";
  } else if (index >= 2) {
    return "Low pollen levels. Generally favorable conditions for most allergy sufferers.";
  } else {
    return "Very low pollen count today. Excellent conditions for outdoor activities.";
  }
}