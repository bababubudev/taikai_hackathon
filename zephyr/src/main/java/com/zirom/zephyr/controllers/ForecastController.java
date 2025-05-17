package com.zirom.zephyr.controllers;

import com.zirom.zephyr.domain.MetricType;
import com.zirom.zephyr.domain.dtos.ForecastResponse;
import com.zirom.zephyr.domain.entities.ForecastMetrics;
import com.zirom.zephyr.mappers.ForecastMapper;
import com.zirom.zephyr.repositories.ForecastRepository;
import com.zirom.zephyr.services.ForecastService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path="/api/v1/data")
@RequiredArgsConstructor
public class ForecastController {

    private final ForecastService forecastService;
    private final ForecastMapper forecastMapper;

    @GetMapping
    public ResponseEntity<List<ForecastResponse>> getAll(
            @RequestParam double latMin,
            @RequestParam double lngMin,
            @RequestParam double latMax,
            @RequestParam double lngMax,
            @RequestParam Integer forecastHour,
            @RequestParam(required = false) MetricType metricType
    ) {
        List<ForecastMetrics> forecastData = forecastService.getAllByCoordinates(latMin, lngMin, latMax, lngMax, forecastHour, metricType);
        List<ForecastResponse> forecastDataDto = forecastData.stream().map(forecastMapper::toDto).toList();
        return ResponseEntity.ok(forecastDataDto);
    }
}
