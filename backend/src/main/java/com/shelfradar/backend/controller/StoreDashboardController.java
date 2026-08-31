package com.shelfradar.backend.controller;

import com.shelfradar.backend.dto.store.OwnerDashboardResponse;
import com.shelfradar.backend.dto.store.StoreDashboardResponse;
import com.shelfradar.backend.service.StoreDashboardService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/store")
public class StoreDashboardController {

    private final StoreDashboardService
            storeDashboardService;


    public StoreDashboardController(
            StoreDashboardService storeDashboardService
    ) {
        this.storeDashboardService =
                storeDashboardService;
    }


    @GetMapping("/dashboard")
    public OwnerDashboardResponse getOwnerDashboard(
            Authentication authentication
    ) {

        return storeDashboardService
                .getOwnerDashboard(
                        authentication.getName()
                );
    }


    @GetMapping("/stores/{storeId}/dashboard")
    public StoreDashboardResponse getStoreDashboard(
            Authentication authentication,
            @PathVariable Long storeId
    ) {

        return storeDashboardService
                .getStoreDashboard(
                        authentication.getName(),
                        storeId
                );
    }
}