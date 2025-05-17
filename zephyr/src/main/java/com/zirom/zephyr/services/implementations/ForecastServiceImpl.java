package com.zirom.zephyr.services.implementations;

import com.zirom.zephyr.domain.MetricType;
import com.zirom.zephyr.domain.entities.ForecastMetrics;
import com.zirom.zephyr.repositories.ForecastRepository;
import com.zirom.zephyr.services.ForecastService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ForecastServiceImpl implements ForecastService {

    private final ForecastRepository forecastRepository;

    @Override
    public List<ForecastMetrics> getAllByCoordinates(double lat, double lng, Integer forecastHour, MetricType metricType) {
        if (metricType == null)
            return forecastRepository.findAllMetricsForNearestPoint(lat, lng, forecastHour);
        System.out.println(metricType);
        return forecastRepository.findOneMetricForNearestPoint(lat, lng, forecastHour, metricType.name());
    }
}
