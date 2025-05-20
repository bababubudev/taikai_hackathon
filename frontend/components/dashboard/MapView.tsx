"use client";

import MapComponent from "../MapComponent";
import GeneralCard from "./ui/GeneralCard";
import { useEffect, useState } from "react";
import { MetricTypes, SeverityStatus } from "@/lib/types";
import { useWeatherData } from "@/providers/WeatherDataContext";
import { TbUvIndex } from "react-icons/tb";
import { FaTemperatureLow, FaBuffer, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";
import { GiPollenDust } from "react-icons/gi";
import TimeSelector from "./ui/TimeSelector";

interface MapViewProps {
  isLoading: boolean;
  userLocation: { lat: number, lng: number } | null;
}

const NORMALS = {
  [MetricTypes.TEMPERATURE]: { avg: 283.15, threshold: 5 }, // 10°C ±5
  [MetricTypes.UV]: { avg: 0.2, threshold: 0.1 },
  [MetricTypes.SURFACE_PRESSURE]: { avg: 101325, threshold: 1000 },
  [MetricTypes.PM25]: { threshold: 10E-9 }, // 10 µg/m3
};

function MapView({ isLoading, userLocation = null }: MapViewProps) {
  const { weatherData, loading, error, fetchDataForLocation, currentForecastHour, setForecastHour } = useWeatherData();
  const [currentDetail, setCurrentDetail] = useState<MetricTypes>(MetricTypes.PM25);
  const [showAllRecommendations, setShowAllRecommendations] = useState(false);

  useEffect(() => {
    if (userLocation && !loading) {
      fetchDataForLocation(userLocation, currentForecastHour);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation, currentForecastHour, fetchDataForLocation]);

  const getCurrentStatus = (): { value: number; status: SeverityStatus } => {
    const currentData = weatherData[currentDetail];
    if (!currentData) return { value: 0, status: SeverityStatus.NONE };

    return {
      value: currentData.value,
      status: currentData.status,
    };
  };

  const { status } = getCurrentStatus();
  const currentStatus = status;

  const getPopupMessage = () => {
    switch (currentDetail) {
      case MetricTypes.UV:
        switch (status) {
          case SeverityStatus.HIGH:
            return "High UV alert! Apply sunscreen and avoid midday sun.";
          case SeverityStatus.MEDIUM:
            return "Moderate UV levels. Sunscreen recommended.";
          case SeverityStatus.LOW:
            return "Low UV index. Minimal sun protection needed.";
          default:
            return "UV data unavailable.";
        }
      case MetricTypes.PM25:
        switch (status) {
          case SeverityStatus.HIGH:
            return "Air quality is poor. Avoid outdoor activities.";
          case SeverityStatus.MEDIUM:
            return "Moderate pollution. Sensitive groups should be cautious.";
          case SeverityStatus.LOW:
            return "Air quality is good.";
          default:
            return "PM2.5 data unavailable.";
        }
      case MetricTypes.SURFACE_PRESSURE:
        switch (status) {
          case SeverityStatus.HIGH:
            return "Pressure difference is high.";
          case SeverityStatus.MEDIUM:
            return "Minor pressure fluctuations. Could cause trouble to sensitive individuals";
          case SeverityStatus.LOW:
            return "Pressure difference is nominal.";
          default:
            return "Pressure data unavailable.";
        }
      case MetricTypes.TEMPERATURE:
        const tempCelsius = temperatureData ? temperatureData.value - 273.15 : null;

        if (tempCelsius === null) {
          return "Temperature data unavailable.";
        }

        if (tempCelsius > 30) {
          return `Outside temperature is very hot. Stay hydrated, seek shade, and limit outdoor activities during peak hours.`;
        } else if (tempCelsius > 25) {
          return `Outside temperature is hotter than normal. Stay hydrated and take breaks from the heat when needed.`;
        } else if (tempCelsius > 20) {
          return `Outside temperature is warmer than normal. Comfortable conditions for most outdoor activities.`;
        } else if (tempCelsius > 10) {
          return `Outside temperature is milder than normal. Light clothing may be sufficient.`;
        } else if (tempCelsius > 0) {
          return `Outside temperature is a bit cooler than normal. Consider wearing layers for comfort.`;
        } else if (tempCelsius > -10) {
          return `Outside temperature is colder than normal. Dress warmly and protect extremities.`;
        } else {
          return `Outside temperature is very cold. Limit time outdoors and wear appropriate winter clothing.`;
        }
      default:
        return "No data available.";
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

  const getNameAndNote = (): { note: string, type: string } => {
    switch (currentDetail) {
      case MetricTypes.UV:
        return {
          note: "High UV can cause skin damage and eye injuries. Use sunscreen and protective clothing.",
          type: "UV Index Summary",
        };
      case MetricTypes.PM25:
        return {
          note: "Prolonged exposure to fine particles may cause respiratory or heart conditions.",
          type: "Particulate Matters"
        };
      case MetricTypes.SURFACE_PRESSURE:
        return {
          note: "Sudden pressure changes might trigger migraines or joint pain for sensitive individuals.",
          type: "Surface Pressure",
        };
      case MetricTypes.TEMPERATURE:
        return {
          note: "Extreme temperatures may lead to heatstroke or hypothermia if not properly addressed.",
          type: "Temperature",
        };
      default:
        return {
          note: "",
          type: "",
        };
    }
  };

  const convertUvToIndex = (uv: number): number => {
    // 1 UVI ≈ 0.025 mW/cm² of UV radiation
    // Clamp result to 0 decimal places for standard UV Index scale
    if (isNaN(uv) || uv < 0) return 0;
    const newUv = uv * 2;
    return Math.round(newUv / 0.025);
  };

  const uvData = weatherData[MetricTypes.UV];
  const fineParticlesData = weatherData[MetricTypes.PM25];
  const pressureData = weatherData[MetricTypes.SURFACE_PRESSURE];
  const temperatureData = weatherData[MetricTypes.TEMPERATURE];

  const uv = uvData ? uvData.value : "N/A";
  const fineParticles = fineParticlesData ? (fineParticlesData.value * 10E9).toFixed(2) : "N/A";
  const pressure = pressureData ? (pressureData.value / 100).toFixed(2) : "N/A";
  const temperature = temperatureData ? (temperatureData.value - 273.15).toFixed(1) : "N/A";

  // Enhanced Health Summary with Scientific Basis
  const getCombinedHealthSummary = () => {
    if (isNaN(Number(uv)) || isNaN(Number(fineParticles)) || isNaN(Number(pressure)) || isNaN(Number(temperature)))
      return { message: "", riskScore: 0, recommendations: [] };

    const risks: {
      factor: string;
      message: string;
      score: number;
      recommendations: string[]
    }[] = [];

    // Temperature Analysis
    // Using WHO thermal comfort guidelines and heat/cold stress thresholds
    if (Number(temperature)) {
      const tempValue = Number(temperature);
      const deviation = tempValue - (NORMALS[MetricTypes.TEMPERATURE].avg - 273.15);

      if (tempValue >= 35) {
        risks.push({
          factor: "Extreme Heat",
          message: `🌡️ Extreme heat conditions of ${tempValue.toFixed(1)}°C. Heat-related illnesses are possible.`,
          score: 3,
          recommendations: [
            "Stay in air-conditioned spaces",
            "Drink plenty of fluids",
            "Avoid outdoor activities during peak hours",
            "Check on vulnerable individuals"
          ]
        });
      } else if (tempValue >= 30) {
        risks.push({
          factor: "High Heat",
          message: `🌡️ Elevated temperatures of ${tempValue.toFixed(1)}°C may cause heat stress in susceptible individuals.`,
          score: 2,
          recommendations: [
            "Increase fluid intake",
            "Take regular breaks in shade",
            "Wear lightweight clothing"
          ]
        });
      } else if (tempValue <= 0) {
        risks.push({
          factor: "Cold Conditions",
          message: `🌡️ Cold conditions of ${tempValue.toFixed(1)}°C may pose hypothermia risk to vulnerable populations.`,
          score: 2,
          recommendations: [
            "Wear layers of warm clothing",
            "Keep extremities covered",
            "Maintain indoor heating"
          ]
        });
      } else if (Math.abs(deviation) > NORMALS[MetricTypes.TEMPERATURE].threshold) {
        risks.push({
          factor: "Temperature Variation",
          message: `🌡️ Temperature is ${deviation > 0 ? "above" : "below"} seasonal average by ${Math.abs(deviation).toFixed(1)}°C.`,
          score: 1,
          recommendations: [
            deviation > 0 ? "Increase fluid intake" : "Dress in appropriate layers",
            "Adjust indoor climate control accordingly"
          ]
        });
      }
    }

    // UV Index Analysis
    // Based on WHO UV Index guidelines
    if (!isNaN(Number(uv))) {
      const uvIndex = convertUvToIndex(Number(uv));

      if (uvIndex >= 11) {
        risks.push({
          factor: "Extreme UV",
          message: "☀️ Extreme UV radiation levels. Significant skin and eye damage can occur rapidly.",
          score: 3,
          recommendations: [
            "Avoid sun exposure between 10am and 4pm",
            "Apply SPF 50+ sunscreen every 2 hours",
            "Wear protective clothing and UV-blocking sunglasses",
            "Seek shade consistently"
          ]
        });
      } else if (uvIndex >= 8) {
        risks.push({
          factor: "Very High UV",
          message: "☀️ Very high UV radiation levels present significant risk of harm from unprotected sun exposure.",
          score: 2,
          recommendations: [
            "Apply SPF 30+ sunscreen every 2 hours",
            "Wear hat, sunglasses and protective clothing",
            "Reduce midday sun exposure"
          ]
        });
      } else if (uvIndex >= 6) {
        risks.push({
          factor: "High UV",
          message: "☀️ High UV radiation levels require sun protection measures.",
          score: 1,
          recommendations: [
            "Apply SPF 30+ sunscreen",
            "Wear protective clothing",
            "Seek shade during midday hours"
          ]
        });
      } else if (uvIndex >= 3) {
        risks.push({
          factor: "Moderate UV",
          message: "☀️ Moderate UV radiation levels. Some protection recommended for extended outdoor activities.",
          score: 0.5,
          recommendations: [
            "Apply SPF 15+ sunscreen for extended exposure",
            "Wear sunglasses on bright days"
          ]
        });
      }
    }

    // PM2.5 Analysis
    // Based on EPA and WHO air quality guidelines
    if (!isNaN(Number(fineParticles))) {
      const pm25Value = Number(fineParticles);

      if (pm25Value >= 35.5) {
        risks.push({
          factor: "Unhealthy PM2.5",
          message: "🌫️ Fine particulate matter (PM2.5) levels are unhealthy and may cause respiratory symptoms in sensitive groups.",
          score: 3,
          recommendations: [
            "Limit outdoor physical activities",
            "Consider using air purifiers indoors",
            "Keep windows closed",
            "People with respiratory or heart conditions should take extra precautions"
          ]
        });
      } else if (pm25Value >= 12.1) {
        risks.push({
          factor: "Moderate PM2.5",
          message: "🌫️ Moderate fine particulate matter (PM2.5) levels may affect unusually sensitive individuals.",
          score: 1,
          recommendations: [
            "Unusually sensitive people should consider reducing prolonged outdoor exertion",
            "Close windows during peak traffic hours"
          ]
        });
      } else if (pm25Value > NORMALS[MetricTypes.PM25].threshold) {
        risks.push({
          factor: "Elevated PM2.5",
          message: "🌫️ Fine particulate matter (PM2.5) levels are slightly elevated but generally acceptable.",
          score: 0.5,
          recommendations: [
            "No special precautions needed for general population",
            "Sensitive individuals may want to monitor symptoms"
          ]
        });
      }
    }

    // Pressure Analysis
    // Based on barometric pressure effects on health research
    if (!isNaN(Number(pressure))) {
      const pressureValue = Number(pressure);
      const pressureInHpa = pressureValue;
      const delta = Math.abs(pressureInHpa - NORMALS[MetricTypes.SURFACE_PRESSURE].avg / 100);

      if (delta > 15) {
        risks.push({
          factor: "Significant Pressure Change",
          message: "📉 Significant barometric pressure changes may trigger migraines, joint pain, or cardiovascular stress in sensitive individuals.",
          score: 2,
          recommendations: [
            "Monitor symptoms if you have pressure-sensitive conditions",
            "Stay hydrated",
            "Consider preventative medication if prescribed for pressure-triggered conditions"
          ]
        });
      } else if (delta > 8) {
        risks.push({
          factor: "Moderate Pressure Change",
          message: "📉 Moderate barometric pressure changes may affect individuals with pressure-sensitive conditions.",
          score: 1,
          recommendations: [
            "Be aware of potential symptom triggers",
            "Maintain regular medication schedule if applicable"
          ]
        });
      }
    }

    // Compound Effects (Multiple factors) - research-supported synergistic effects
    if (Number(temperature) > 25 && Number(fineParticles) > 12) {
      risks.push({
        factor: "Heat-Pollution Compound Effect",
        message: "⚠️ Combined high temperature and air pollution may exacerbate respiratory and cardiovascular symptoms.",
        score: 2,
        recommendations: [
          "Limit outdoor physical activity",
          "Stay in air-conditioned environments when possible",
          "Increase fluid intake",
          "Monitor symptoms if you have pre-existing respiratory or cardiovascular conditions"
        ]
      });
    }

    if (convertUvToIndex(Number(uv)) >= 6 && Number(temperature) > 28) {
      risks.push({
        factor: "UV-Heat Compound Effect",
        message: "⚠️ Combined high UV and temperature increases risk of heat-related illness and sunburn.",
        score: 2,
        recommendations: [
          "Seek shade frequently",
          "Apply high SPF sunscreen regularly",
          "Increase fluid intake beyond normal levels",
          "Plan outdoor activities for early morning or evening"
        ]
      });
    }

    // Calculate overall risk score
    let overallRiskScore = 0;
    const allRecommendations: string[] = [];

    risks.forEach(risk => {
      overallRiskScore += risk.score;
      risk.recommendations.forEach(rec => {
        if (!allRecommendations.includes(rec)) {
          allRecommendations.push(rec);
        }
      });
    });

    // Determine summary message based on risk factors
    let summaryMessage = "";
    if (risks.length === 0) {
      summaryMessage = "✅ Current environmental conditions pose minimal health risks. All measured parameters are within favorable ranges.";
    } else {
      const riskMessages = risks.map(r => r.message);
      summaryMessage = riskMessages.join(" ");
    }

    // Normalize risk score to 0-10 scale for consistent display
    const normalizedScore = Math.min(10, Math.ceil(overallRiskScore * 1.5));

    return {
      message: summaryMessage,
      riskScore: normalizedScore,
      recommendations: allRecommendations
    };
  };

  const handleHourChange = (hour: number) => {
    setForecastHour(hour);
  };

  const combinedSummary = getCombinedHealthSummary();
  const displayRecommendations = showAllRecommendations ?
    combinedSummary.recommendations :
    combinedSummary.recommendations.slice(0, 3);

  // Function to get the risk level description
  const getRiskLevelDescription = (score: number): string => {
    if (score >= 8) return "High";
    if (score >= 4) return "Moderate";
    if (score >= 1) return "Low";
    return "Minimal";
  };

  return (
    <div className="relative min-h-[320px]">
      <div className="flex justify-between mb-4">
        <div className="flex gap-2 items-center">
          {(loading) ?
            <>
              <span className="loading loading-spinner loading-xl text-primary"></span>
              <p className="text-sm md:text-lg animate-pulse italic">Gathering data...</p>
            </> :
            <h3 className="text-2xl font-semibold">My Location</h3>
          }
          {error &&
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          }
        </div>
        <TimeSelector
          currentHour={currentForecastHour}
          onChange={handleHourChange}
        />
      </div>
      {(!isLoading || weatherData[MetricTypes.UV]) ? (
        <div className="grid lg:grid-cols-[2fr_1fr] grid-cols-1 gap-4">
          <MapComponent
            position={userLocation || [61.4971, 23.7526]}
            currentDetail={getNameAndNote().type}
            value={getCurrentStatus().value}
            status={getCurrentStatus().status}
            statusMessage={getPopupMessage()}
          />

          <div className="grid gap-4 shadow-md">
            <div className="collapse collapse-plus bg-base-300 border border-base-300">
              <input type="radio" name="accordion" onChange={() => setCurrentDetail(MetricTypes.UV)} />
              <div className="collapse-title font-semibold">UV Index Summary</div>
              <div className="collapse-content space-y-4">
                <GeneralCard
                  description="Current UV Index"
                  measurement={convertUvToIndex(Number(uv)).toString()}
                  unit={"UVI"}
                  icon={TbUvIndex}
                />
                <div role="alert" className={`alert ${getCurrentAlertType()} alert-soft`}>
                  <span>{getPopupMessage()}</span>
                </div>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-300 border border-base-300">
              <input type="radio" name="accordion" onChange={() => setCurrentDetail(MetricTypes.SURFACE_PRESSURE)} />
              <div className="collapse-title font-semibold">Surface Pressure</div>
              <div className="collapse-content space-y-4 text-sm">
                <GeneralCard
                  description="Surface Pressure"
                  measurement={pressure.toString()}
                  unit={"hPa"}
                  color="bg-blue-600/30"
                  icon={FaBuffer}
                />
                <div role="alert" className={`alert ${getCurrentAlertType()} alert-soft`}>
                  <span>{getPopupMessage()}</span>
                </div>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-300 border border-base-300">
              <input type="radio" name="accordion" defaultChecked onChange={() => setCurrentDetail(MetricTypes.PM25)} />
              <div className="collapse-title font-semibold">Particulate Matters</div>
              <div className="collapse-content space-y-4 text-sm">
                <GeneralCard
                  description="Fine Particles"
                  measurement={fineParticles}
                  unit={<>µg/m<sup>3</sup></>}
                  icon={GiPollenDust}
                />
                <div role="alert" className={`alert ${getCurrentAlertType()} alert-soft`}>
                  <span>{getPopupMessage()}</span>
                </div>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-300 border border-base-300">
              <input type="radio" name="accordion" onChange={() => setCurrentDetail(MetricTypes.TEMPERATURE)} />
              <div className="collapse-title font-semibold">Temperature</div>
              <div className="collapse-content space-y-4 text-sm">
                <GeneralCard
                  description="Temperature"
                  measurement={temperature.toString()}
                  unit={"°C"}
                  color="bg-blue-600/30"
                  icon={FaTemperatureLow}
                />
                <div role="alert" className={`alert ${getCurrentAlertType()} alert-soft`}>
                  <span>{getPopupMessage()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      )}

      <div className="mt-6 p-4 border border-base-300 bg-base-200 rounded-lg shadow-sm space-y-2">
        <div className="flex justify-between gap-2 items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FaExclamationTriangle className={`${combinedSummary.riskScore >= 4 ? "text-warning" : "text-success"}`} />
            Health Assessment
          </h3>
          <div className={`badge badge-soft min-w-24 ${combinedSummary.riskScore >= 8
            ? "badge-error"
            : combinedSummary.riskScore >= 4
              ? "badge-warning"
              : combinedSummary.riskScore >= 1
                ? "badge-success"
                : "badge-info"
            }`}>
            Risk: {getRiskLevelDescription(combinedSummary.riskScore)}
          </div>
        </div>

        {combinedSummary.message ? (
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body p-3">
              <h4 className="text-sm font-medium">Assessment</h4>
              <div className="text-sm text-base-content/80 leading-relaxed">
                {combinedSummary.message.split(" ").map((word, idx) => {
                  return word.includes("⚠️") || word.includes("📉") || word.includes("🌫️") || word.includes("☀️") || word.includes("🌡️")
                    ? <strong key={idx} className="text-warning">{word} </strong>
                    : <span key={idx}>{word} </span>;
                })}
              </div>

              {combinedSummary.recommendations.length > 0 && (
                <>
                  <div className="divider my-1"></div>
                  <h4 className="text-sm font-medium">Recommendations</h4>
                  <ul className="text-sm space-y-1 ml-1">
                    {displayRecommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-success">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>

                  {combinedSummary.recommendations.length > 3 && (
                    <button
                      className="btn btn-xs btn-ghost mt-1"
                      onClick={() => setShowAllRecommendations(!showAllRecommendations)}
                    >
                      {showAllRecommendations ? "Show less" : `Show ${combinedSummary.recommendations.length - 3} more recommendations`}
                    </button>
                  )}
                </>
              )}

              <div className="mt-2 flex items-center text-xs text-base-content/60">
                <FaInfoCircle className="mr-1" />
                <span>Assessment based on WHO and EPA guidelines</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="alert alert-info alert-soft text-sm">
            <span>No significant health concerns detected. Enjoy your day!</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapView;