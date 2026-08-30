package com.shelfradar.backend.controller;

import com.shelfradar.backend.dto.catalog.PageResponse;
import com.shelfradar.backend.dto.publicsearch.PublicSearchFiltersResponse;
import com.shelfradar.backend.dto.publicsearch.PublicSearchResultResponse;
import com.shelfradar.backend.entity.enums.StockStatus;
import com.shelfradar.backend.service.PublicSearchService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
@Validated
public class PublicSearchController {

    private final PublicSearchService
            publicSearchService;

    public PublicSearchController(
            PublicSearchService publicSearchService
    ) {
        this.publicSearchService =
                publicSearchService;
    }

    @GetMapping("/search")
    public PageResponse<PublicSearchResultResponse>
    search(

            @RequestParam(
                    required = false
            )
            String q,

            @RequestParam(
                    required = false
            )
            Long brandId,

            @RequestParam(
                    required = false
            )
            Long categoryId,

            @RequestParam(
                    required = false
            )
            StockStatus status,

            @RequestParam(
                    required = false
            )
            String city,

            @RequestParam(
                    defaultValue = "0"
            )
            @Min(0)
            int page,

            @RequestParam(
                    defaultValue = "20"
            )
            @Min(1)
            @Max(100)
            int size,

            @RequestParam(
                    defaultValue = "priceAsc"
            )
            String sort
    ) {

        return publicSearchService.search(
                q,
                brandId,
                categoryId,
                status,
                city,
                page,
                size,
                sort
        );
    }

    @GetMapping("/filters")
    public PublicSearchFiltersResponse
    getFilters() {

        return publicSearchService
                .getFilters();
    }
}