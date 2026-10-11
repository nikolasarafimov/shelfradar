package com.shelfradar.backend.controller;

import com.shelfradar.backend.dto.catalog.PageResponse;
import com.shelfradar.backend.dto.publicsearch.PublicSearchFiltersResponse;
import com.shelfradar.backend.dto.publicsearch.PublicSearchResultResponse;
import com.shelfradar.backend.entity.enums.StockStatus;
import com.shelfradar.backend.service.PublicSearchService;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
@Validated
public class PublicSearchController {

    private final PublicSearchService publicSearchService;

    public PublicSearchController(
            PublicSearchService publicSearchService
    ) {
        this.publicSearchService = publicSearchService;
    }

    @GetMapping("/search")
    public PageResponse<PublicSearchResultResponse> search(
            @RequestParam(required = false)
            String q,

            @RequestParam(required = false)
            @Positive
            Long brandId,

            @RequestParam(required = false)
            @Positive
            Long categoryId,

            @RequestParam(required = false)
            StockStatus status,

            @RequestParam(required = false)
            String city,

            @RequestParam(defaultValue = "0")
            @Min(0)
            int page,

            @RequestParam(defaultValue = "20")
            @Min(1)
            @Max(100)
            int size,

            @RequestParam(defaultValue = "priceAsc")
            String sort,

            @RequestParam(required = false)
            @DecimalMin("-90.0")
            @DecimalMax("90.0")
            Double latitude,

            @RequestParam(required = false)
            @DecimalMin("-180.0")
            @DecimalMax("180.0")
            Double longitude,

            @RequestParam(required = false)
            @Positive
            Double radiusKm
    ) {
        return publicSearchService.search(
                q,
                brandId,
                categoryId,
                status,
                city,
                page,
                size,
                sort,
                latitude,
                longitude,
                radiusKm
        );
    }

    @GetMapping("/filters")
    public PublicSearchFiltersResponse getFilters() {
        return publicSearchService.getFilters();
    }
}