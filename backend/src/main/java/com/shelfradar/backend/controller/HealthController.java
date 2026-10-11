package com.shelfradar.backend.controller;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final JdbcTemplate jdbcTemplate;

    public HealthController(
            JdbcTemplate jdbcTemplate
    ) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new LinkedHashMap<>();

        try {
            Integer databaseCheck = jdbcTemplate.queryForObject(
                    "SELECT 1",
                    Integer.class
            );

            boolean databaseUp =
                    Integer.valueOf(1).equals(databaseCheck);

            if (!databaseUp) {
                response.put("status", "DOWN");
                response.put("database", "DOWN");
                response.put("postgis", "UNKNOWN");

                return ResponseEntity
                        .status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body(response);
            }

            try {
                String postgisVersion =
                        jdbcTemplate.queryForObject(
                                "SELECT PostGIS_Version()",
                                String.class
                        );

                boolean postgisUp =
                        postgisVersion != null
                                && !postgisVersion.isBlank();

                response.put(
                        "status",
                        postgisUp ? "UP" : "DOWN"
                );
                response.put("database", "UP");
                response.put(
                        "postgis",
                        postgisUp ? "UP" : "DOWN"
                );

                return ResponseEntity
                        .status(
                                postgisUp
                                        ? HttpStatus.OK
                                        : HttpStatus.SERVICE_UNAVAILABLE
                        )
                        .body(response);

            } catch (DataAccessException exception) {
                response.put("status", "DOWN");
                response.put("database", "UP");
                response.put("postgis", "DOWN");

                return ResponseEntity
                        .status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body(response);
            }

        } catch (DataAccessException exception) {
            response.put("status", "DOWN");
            response.put("database", "DOWN");
            response.put("postgis", "UNKNOWN");

            return ResponseEntity
                    .status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(response);
        }
    }
}