package com.zirom.zephyr.repositories;

import com.zirom.zephyr.domain.MetricType;
import com.zirom.zephyr.domain.entities.ForecastMetrics;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ForecastRepository extends JpaRepository<ForecastMetrics, Integer> {

    List<ForecastMetrics> getAllByPoint_LatitudeBetweenAndPoint_LongitudeBetween(double pointLatitudeAfter, double pointLatitudeBefore, double pointLongitudeAfter, double pointLongitudeBefore);

    List<ForecastMetrics> getAllByPoint_LatitudeBetweenAndPoint_LongitudeBetweenAndMetricType(double pointLatitudeAfter, double pointLatitudeBefore, double pointLongitudeAfter, double pointLongitudeBefore, MetricType metricType);
}
