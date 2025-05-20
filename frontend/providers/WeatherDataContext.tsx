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

const createEmptyWeatherData = (): Record<MetricTypes, ZephyrData | null> => {
  const data: Partial<Record<MetricTypes, ZephyrData | null>> = {};
  Object.values(MetricTypes).forEach(metric => {
    data[metric] = null;
  });
  return data as Record<MetricTypes, ZephyrData | null>;
};

export function WeatherDataProvider({
  children,
  initialLocation,
  initialForecastHour = 1
}: WeatherDataProviderProps) {
  const getCurrentHour = () => {
    return initialForecastHour !== undefined ? initialForecastHour : new Date().getHours();
  };

  const [weatherData, setWeatherData] = useState<Record<MetricTypes, ZephyrData | null>>(createEmptyWeatherData());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentForecastHour, setCurrentForecastHour] = useState(getCurrentHour());

  const setForecastHour = useCallback((hour: number) => {
    // Ensure hour is within valid range (0-23)
    const validHour = Math.max(0, Math.min(23, hour));
    setCurrentForecastHour(validHour);
  }, []);

  const API_BASE_URL = "https://zephyr.190304.xyz/api/v1/data";

  const [responseCache, setResponseCache] = useState<Map<string, { data: ZephyrData[], timestamp: number }>>(new Map());
  const CACHE_EXPIRY = 5 * 60 * 1000;

  const fetchDataForMetric = useCallback(async (
    metricType: MetricTypes,
    location: Location,
    forecastHour: number = currentForecastHour
  ): Promise<ZephyrData | null> => {
    try {
      const url = `${API_BASE_URL}?lng=${location.lng}&lat=${location.lat}&forecastHour=${forecastHour}&metricType=${metricType}`;
      const cacheKey = `${url}`;
      const cachedResponse = responseCache.get(cacheKey);
      const now = Date.now();

      if (cachedResponse && (now - cachedResponse.timestamp) < CACHE_EXPIRY) {
        return cachedResponse.data.length > 0 ? cachedResponse.data[0] : null;
      }

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Failed to fetch ${metricType} data: ${res.status}`);
      }

      const data = await res.json() as ZephyrData[];
      setResponseCache(prev => {
        const newCache = new Map(prev);
        newCache.set(cacheKey, { data, timestamp: now });
        return newCache;
      });

      return data && data.length > 0 ? data[0] : null;
    } catch (err) {
      console.error(`Error fetching ${metricType} data:`, err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      return null;
    }
  }, [CACHE_EXPIRY, currentForecastHour, responseCache]);

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

      const cacheKey = `${url}`;
      const cachedResponse = responseCache.get(cacheKey);
      const now = Date.now();

      if (cachedResponse && (now - cachedResponse.timestamp) < CACHE_EXPIRY) {
        const newWeatherData = cachedResponse.data.reduce((acc, item) => {
          acc[item.metricType] = item;
          return acc;
        }, createEmptyWeatherData());

        setWeatherData(newWeatherData);
        setLoading(false);
        return;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status}`);
      }

      const data = await res.json() as ZephyrData[];

      setResponseCache(prev => {
        const newCache = new Map(prev);
        newCache.set(cacheKey, { data, timestamp: now });

        return newCache;
      });

      const newWeatherData = data.reduce((acc, item) => {
        acc[item.metricType] = item;
        return acc;
      }, createEmptyWeatherData());

      setWeatherData(newWeatherData);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  }, [CACHE_EXPIRY, currentForecastHour, responseCache]);


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
        setForecastHour,
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