package com.zirom.zephyr.repositories;

import com.zirom.zephyr.domain.entities.ForecastMetrics;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ForecastRepository extends JpaRepository<ForecastMetrics, Integer> {

    List<ForecastMetrics> getAllByPoint_LatitudeAndPoint_Longitude(double latitude, double longitude);
}
