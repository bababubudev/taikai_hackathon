"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Location, MetricTypes, ZephyrData } from "@/lib/types";

interface WeatherContextType {
  weatherData: Record<MetricTypes, ZephyrData | null>;
  loading: boolean;
  error: string | null;
  fetchDataForLocation: (location: Location, forecastHour?: number) => Promise<void>;
  fetchDataForMetric: (metricType: MetricTypes, location: Location, forecastHour?: number) => Promise<ZephyrData | null>;
  setForecastHour: (hour: number) => void;
  currentForecastHour: number;
}

const WeatherDataContext = createContext<WeatherContextType | undefined>(undefined);

interface WeatherDataProviderProps {
  children: ReactNode;
  initialLocation?: Location;
  initialForecastHour?: number;
}

export function WeatherDataProvider({
  children,
  initialLocation,
  initialForecastHour = 1
}: WeatherDataProviderProps) {
  const [weatherData, setWeatherData] = useState<Record<MetricTypes, ZephyrData | null>>({
    [MetricTypes.UV]: null,
    [MetricTypes.TEMPERATURE]: null,
    [MetricTypes.SURFACE_PRESSURE]: null,
    [MetricTypes.PM25]: null,
    [MetricTypes.CO_CONCENTRATION]: null,
    [MetricTypes.ALDER_POLLEN]: null,
    [MetricTypes.BIRCH_POLLEN]: null,
    [MetricTypes.GRASS_POLLEN]: null,
    [MetricTypes.MUGWORT_POLLEN]: null,
    [MetricTypes.OLIVE_POLLEN]: null,
    [MetricTypes.RAGWEED_POLLEN]: null,
    [MetricTypes.NMVOC_CONCENTRATION]: null,
    [MetricTypes.NO2_CONCENTRATION]: null,
    [MetricTypes.O3_CONCENTRATION]: null,
    [MetricTypes.PM10_CONCENTRATION]: null,
    [MetricTypes.SO2_CONCENTRATION]: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentForecastHour, setCurrentForecastHour] = useState(initialForecastHour);

  const API_BASE_URL = "https://zephyr.190304.xyz/api/v1/data";

  const fetchDataForMetric = useCallback(async (
    metricType: MetricTypes,
    location: Location,
    forecastHour: number = currentForecastHour
  ): Promise<ZephyrData | null> => {
    try {
      const url = `${API_BASE_URL}?lng=${location.lng}&lat=${location.lat}&forecastHour=${forecastHour}&metricType=${metricType}`;

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Failed to fetch ${metricType} data: ${res.status}`);
      }

      const data = await res.json() as ZephyrData[];

      return data && data.length > 0 ? data[0] : null;
    } catch (err) {
      console.error(`Error fetching ${metricType} data:`, err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      return null;
    }
  }, [currentForecastHour]);

  const fetchDataForLocation = useCallback(async (
    location: Location,
    forecastHour: number = currentForecastHour
  ): Promise<void> => {
    if (!location || typeof location.lat !== "number" || typeof location.lng !== "number") {
      setError("Invalid location data");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE_URL}?lng=${location.lng}&lat=${location.lat}&forecastHour=${forecastHour}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status}`);
      }

      const data = await res.json() as ZephyrData[];

      const newWeatherData = data.reduce((acc, item) => {
        acc[item.metricType] = item;
        return acc;
      }, {} as Record<MetricTypes, ZephyrData | null>);

      setWeatherData(newWeatherData);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  }, [currentForecastHour]);


  useEffect(() => {
    if (initialLocation) {
      fetchDataForLocation(initialLocation, currentForecastHour);
    }
  }, [initialLocation, currentForecastHour, fetchDataForLocation]);

  return (
    <WeatherDataContext.Provider
      value={{
        weatherData,
        loading,
        error,
        fetchDataForLocation,
        fetchDataForMetric,
        setForecastHour: setCurrentForecastHour,
        currentForecastHour
      }}
    >
      {children}
    </WeatherDataContext.Provider>
  );
}

export function useWeatherData() {
  const context = useContext(WeatherDataContext);

  if (context === undefined) {
    throw new Error("useWeatherData must be used within a WeatherDataProvider");
  }

  return context;
}