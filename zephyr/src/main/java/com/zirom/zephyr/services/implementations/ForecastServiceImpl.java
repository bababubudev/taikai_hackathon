package com.zirom.zephyr.services.implementations;

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
    public List<ForecastMetrics> getAllByCoordinates(double latitude, double longitude) {
        return forecastRepository.getAllByPoint_LatitudeAndPoint_Longitude(latitude, longitude);
    }
}
