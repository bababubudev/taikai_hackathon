package com.zirom.zephyr.services;

import com.zirom.zephyr.domain.entities.ForecastMetrics;

import java.util.List;

public interface ForecastService {
    List<ForecastMetrics> getAllByCoordinates(double latitude, double longitude);
}
