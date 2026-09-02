package com.shelfradar.backend.controller;

import com.shelfradar.backend.dto.audit.AdminAnalyticsResponse;
import com.shelfradar.backend.dto.audit.AuditLogResponse;
import com.shelfradar.backend.dto.catalog.PageResponse;
import com.shelfradar.backend.entity.enums.AuditAction;
import com.shelfradar.backend.entity.enums.AuditEntityType;
import com.shelfradar.backend.service.AdminAnalyticsService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@Validated
public class AdminAnalyticsController {

    private final AdminAnalyticsService
            adminAnalyticsService;

    public AdminAnalyticsController(
            AdminAnalyticsService adminAnalyticsService
    ) {
        this.adminAnalyticsService =
                adminAnalyticsService;
    }

    @GetMapping("/analytics")
    public AdminAnalyticsResponse getAnalytics() {

        return adminAnalyticsService
                .getAnalytics();
    }

    @GetMapping("/audit")
    public PageResponse<AuditLogResponse> getAuditLog(

            @RequestParam(required = false)
            String q,

            @RequestParam(required = false)
            AuditAction action,

            @RequestParam(required = false)
            AuditEntityType entityType,

            @RequestParam(required = false)
            Long storeId,

            @RequestParam(defaultValue = "0")
            @Min(0)
            int page,

            @RequestParam(defaultValue = "20")
            @Min(1)
            @Max(100)
            int size
    ) {

        return adminAnalyticsService
                .searchAuditLog(
                        q,
                        action,
                        entityType,
                        storeId,
                        page,
                        size
                );
    }
}