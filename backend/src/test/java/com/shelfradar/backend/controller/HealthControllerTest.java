package com.shelfradar.backend.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HealthControllerTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    @InjectMocks
    private HealthController healthController;

    @Test
    void shouldReportHealthyApplication() {

        when(
                jdbcTemplate.queryForObject(
                        "SELECT 1",
                        Integer.class
                )
        ).thenReturn(1);

        when(
                jdbcTemplate.queryForObject(
                        "SELECT PostGIS_Version()",
                        String.class
                )
        ).thenReturn("PostGIS Test Version");

        Map<String, Object> result =
                healthController.health();

        assertEquals(
                "UP",
                result.get("status")
        );

        assertEquals(
                "UP",
                result.get("database")
        );

        assertEquals(
                "PostGIS Test Version",
                result.get("postgis")
        );
    }
}