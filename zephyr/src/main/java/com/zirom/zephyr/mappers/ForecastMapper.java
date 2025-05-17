package com.zirom.zephyr.mappers;

import com.zirom.zephyr.domain.dtos.ForecastResponse;
import com.zirom.zephyr.domain.entities.ForecastMetrics;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ForecastMapper {
    public ForecastResponse toDto(ForecastMetrics forecastMetrics);
}
