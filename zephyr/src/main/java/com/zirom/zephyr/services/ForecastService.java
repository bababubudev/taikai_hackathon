package com.zirom.zephyr.services;

import com.zirom.zephyr.domain.MetricType;
import com.zirom.zephyr.domain.entities.ForecastMetrics;

import java.util.List;

public interface ForecastService {
    List<ForecastMetrics> getAllByCoordinates(double latMin, double lngMin, double latMax, double lngMax, Integer forecastHour, MetricType metricType);
}
