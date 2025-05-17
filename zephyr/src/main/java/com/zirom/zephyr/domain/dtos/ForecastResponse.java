package com.zirom.zephyr.domain.dtos;

import com.zirom.zephyr.domain.MetricType;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ForecastResponse {
    private Integer id;
    private ForecastPointDto point;
    private MetricType metricType;
    private double value;
    private Integer status;
}
