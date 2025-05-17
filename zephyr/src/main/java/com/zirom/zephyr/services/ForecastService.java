package com.zirom.zephyr.services;

import com.zirom.zephyr.domain.MetricType;
import com.zirom.zephyr.domain.entities.ForecastMetrics;

import java.util.List;

public interface ForecastService {
    List<ForecastMetrics> getAllByCoordinates(double lat, double lng, Integer forecastHour, MetricType metricType);
}
