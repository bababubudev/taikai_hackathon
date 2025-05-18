package com.zirom.zephyr.repositories;

import com.zirom.zephyr.domain.MetricType;
import com.zirom.zephyr.domain.entities.ForecastMetrics;
import com.zirom.zephyr.domain.entities.ForecastPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ForecastRepository extends JpaRepository<ForecastMetrics, Integer> {

    List<ForecastMetrics> getAllByPoint_LatitudeBetweenAndPoint_LongitudeBetweenAndPoint_ForecastHour(double pointLatitudeAfter, double pointLatitudeBefore, double pointLongitudeAfter, double pointLongitudeBefore, Integer forecastHour);

    List<ForecastMetrics> getAllByPoint_LatitudeBetweenAndPoint_LongitudeBetweenAndPoint_ForecastHourAndMetricType(double pointLatitudeAfter, double pointLatitudeBefore, double pointLongitudeAfter, double pointLongitudeBefore, Integer forecastHour, MetricType metricType);

    @Query(value = """

        WITH nearest_point_uv AS (
        SELECT latitude, longitude
        FROM forecast_points fp
        JOIN forecast_metrics fm ON fm.point_id = fp.id
        WHERE fm.metric_type = 'uv'
        ORDER BY
            earth_distance(
                ll_to_earth(69.9, 19),
                ll_to_earth(latitude, longitude)
            )
        LIMIT 1
    ),
    nearest_point_other AS (
        SELECT latitude, longitude
        FROM forecast_points fp
        JOIN forecast_metrics fm ON fm.point_id = fp.id
        WHERE fm.metric_type = 'so2_conc'
        ORDER BY
            earth_distance(
                ll_to_earth(:lat, :lng),
                ll_to_earth(latitude, longitude)
            )
        LIMIT 1
    )
    SELECT fm.*
    FROM forecast_metrics fm
    JOIN forecast_points fp ON fm.point_id = fp.id
    JOIN nearest_point_uv np ON fp.latitude = np.latitude AND fp.longitude = np.longitude
    WHERE fp.forecast_hour = 2
    
    UNION ALL
    
    SELECT fm.*
    FROM forecast_metrics fm
    JOIN forecast_points fp ON fm.point_id = fp.id
    JOIN nearest_point_other np ON fp.latitude = np.latitude AND fp.longitude = np.longitude
    WHERE fp.forecast_hour = :forecastHour;
    """, nativeQuery = true)
    List<ForecastMetrics> findAllMetricsForNearestPoint(@Param("lat") double lat, @Param("lng") double lng, @Param("forecastHour") int forecastHour);

    @Query(value = """
    WITH nearest_point AS (
        SELECT latitude, longitude
        FROM forecast_points fp
        JOIN forecast_metrics fm ON fm.point_id = fp.id
        WHERE fm.metric_type=:metricType
        ORDER BY
            earth_distance(
                ll_to_earth(:lat, :lng),
                ll_to_earth(latitude, longitude)
            )
        LIMIT 1
    )
    SELECT fm.*
    FROM forecast_metrics fm
    JOIN forecast_points fp ON fm.point_id = fp.id
    JOIN nearest_point np ON fp.latitude = np.latitude AND fp.longitude = np.longitude
    WHERE fp.forecast_hour = :forecastHour AND fm.metric_type = :metricType
    """, nativeQuery = true)
    List<ForecastMetrics> findOneMetricForNearestPoint(@Param("lat") double lat, @Param("lng") double lng, @Param("forecastHour") int forecastHour, @Param("metricType") String metricType);
}
