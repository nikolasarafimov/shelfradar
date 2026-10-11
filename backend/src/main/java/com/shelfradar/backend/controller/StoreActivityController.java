package com.shelfradar.backend.controller;

import com.shelfradar.backend.dto.audit.AuditLogResponse;
import com.shelfradar.backend.dto.catalog.PageResponse;
import com.shelfradar.backend.service.StoreActivityService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/store")
@Validated
public class StoreActivityController {

    private final StoreActivityService storeActivityService;

    public StoreActivityController(
            StoreActivityService storeActivityService
    ) {
        this.storeActivityService = storeActivityService;
    }

    @GetMapping("/stores/{storeId}/activity")
    public PageResponse<AuditLogResponse> getStoreActivity(
            Authentication authentication,

            @PathVariable
            @Positive
            Long storeId,

            @RequestParam(defaultValue = "0")
            @Min(0)
            int page,

            @RequestParam(defaultValue = "20")
            @Min(1)
            @Max(100)
            int size
    ) {
        return storeActivityService.getStoreActivity(
                authentication.getName(),
                storeId,
                page,
                size
        );
    }
}