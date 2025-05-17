package com.zirom.zephyr.domain.dtos;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ForecastPointDto {
    private Integer id;
    private Integer forecastHour;
    private double latitude;
    private double longitude;
}
