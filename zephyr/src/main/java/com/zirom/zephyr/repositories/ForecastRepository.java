package com.zirom.zephyr.repositories;

import com.zirom.zephyr.domain.MetricType;
import com.zirom.zephyr.domain.entities.ForecastMetrics;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ForecastRepository extends JpaRepository<ForecastMetrics, Integer> {

    List<ForecastMetrics> getAllByPoint_LatitudeBetweenAndPoint_LongitudeBetweenAndPoint_ForecastHour(double pointLatitudeAfter, double pointLatitudeBefore, double pointLongitudeAfter, double pointLongitudeBefore, Integer forecastHour);

    List<ForecastMetrics> getAllByPoint_LatitudeBetweenAndPoint_LongitudeBetweenAndPoint_ForecastHourAndMetricType(double pointLatitudeAfter, double pointLatitudeBefore, double pointLongitudeAfter, double pointLongitudeBefore, Integer forecastHour, MetricType metricType);
}
