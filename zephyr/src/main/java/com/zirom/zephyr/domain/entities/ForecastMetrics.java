package com.zirom.zephyr.domain.entities;

import com.zirom.zephyr.domain.MetricType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="forecast_metrics")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ForecastMetrics {
    @Id
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "point_id", nullable = false)
    private ForecastPoint point;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private MetricType metricType;

    @Column(nullable = false)
    private double value;

    @Column(nullable = false)
    private Integer status;
}
