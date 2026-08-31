package com.shelfradar.backend.controller;

import com.shelfradar.backend.dto.admin.AdminDashboardResponse;
import com.shelfradar.backend.dto.admin.AdminOwnerResponse;
import com.shelfradar.backend.dto.admin.AdminStoreDetailResponse;
import com.shelfradar.backend.dto.admin.AdminStoreFiltersResponse;
import com.shelfradar.backend.dto.admin.AdminStoreResponse;
import com.shelfradar.backend.dto.admin.AdminStoreStatusRequest;
import com.shelfradar.backend.dto.admin.AdminStoreUpdateRequest;
import com.shelfradar.backend.dto.catalog.PageResponse;
import com.shelfradar.backend.entity.enums.StoreStatus;
import com.shelfradar.backend.service.AdminStoreService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@Validated
public class AdminStoreController {

    private final AdminStoreService
            adminStoreService;


    public AdminStoreController(
            AdminStoreService adminStoreService
    ) {
        this.adminStoreService =
                adminStoreService;
    }


    @GetMapping("/dashboard")
    public AdminDashboardResponse getDashboard() {

        return adminStoreService
                .getDashboard();
    }


    @GetMapping("/stores")
    public PageResponse<AdminStoreResponse> searchStores(

            @RequestParam(required = false)
            String q,

            @RequestParam(required = false)
            StoreStatus status,

            @RequestParam(required = false)
            String city,

            @RequestParam(defaultValue = "0")
            @Min(0)
            int page,

            @RequestParam(defaultValue = "20")
            @Min(1)
            @Max(100)
            int size,

            @RequestParam(defaultValue = "newest")
            String sort
    ) {

        return adminStoreService
                .searchStores(
                        q,
                        status,
                        city,
                        page,
                        size,
                        sort
                );
    }


    @GetMapping("/stores/filters")
    public AdminStoreFiltersResponse getFilters() {

        return adminStoreService
                .getFilters();
    }


    @GetMapping("/stores/{storeId}")
    public AdminStoreDetailResponse getStore(

            @PathVariable
            @Positive
            Long storeId
    ) {

        return adminStoreService
                .getStore(
                        storeId
                );
    }


    @PutMapping("/stores/{storeId}")
    public AdminStoreDetailResponse updateStore(

            @PathVariable
            @Positive
            Long storeId,

            @Valid
            @RequestBody
            AdminStoreUpdateRequest request
    ) {

        return adminStoreService
                .updateStore(
                        storeId,
                        request
                );
    }


    @PatchMapping("/stores/{storeId}/status")
    public AdminStoreDetailResponse updateStatus(

            @PathVariable
            @Positive
            Long storeId,

            @Valid
            @RequestBody
            AdminStoreStatusRequest request
    ) {

        return adminStoreService
                .changeStatus(
                        storeId,
                        request.status()
                );
    }


    @GetMapping("/store-owners")
    public List<AdminOwnerResponse> getStoreOwners() {

        return adminStoreService
                .getStoreOwners();
    }
}