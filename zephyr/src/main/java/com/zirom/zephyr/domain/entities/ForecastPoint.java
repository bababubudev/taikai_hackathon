package com.zirom.zephyr.domain.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name="forecast_points")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ForecastPoint {
    @Id
    private Integer id;

    private Integer forecastHour;

    private double latitude;

    private double longitude;
}
