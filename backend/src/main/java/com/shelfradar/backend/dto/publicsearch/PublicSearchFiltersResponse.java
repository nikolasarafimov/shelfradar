package com.shelfradar.backend.dto.publicsearch;

import com.shelfradar.backend.dto.catalog.BrandResponse;
import com.shelfradar.backend.dto.catalog.CategoryResponse;
import com.shelfradar.backend.entity.enums.StockStatus;

import java.util.List;

public record PublicSearchFiltersResponse(

        List<BrandResponse> brands,

        List<CategoryResponse> categories,

        List<String> cities,

        List<StockStatus> statuses
) {
}