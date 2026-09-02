package com.shelfradar.backend.controller;

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

    public HealthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public Map<String, Object> health() {

        Integer databaseCheck =
                jdbcTemplate.queryForObject(
                        "SELECT 1",
                        Integer.class
                );

        String postgisVersion =
                jdbcTemplate.queryForObject(
                        "SELECT PostGIS_Version()",
                        String.class
                );

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("status", "UP");

        response.put(
                "database",
                databaseCheck != null && databaseCheck == 1
                        ? "UP"
                        : "DOWN"
        );

        response.put("postgis", postgisVersion);
        return response;
    }
}