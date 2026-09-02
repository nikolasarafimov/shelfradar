package com.shelfradar.backend.dto.publicsearch;

import com.shelfradar.backend.dto.catalog.ProductResponse;
import com.shelfradar.backend.entity.enums.StockStatus;

import java.math.BigDecimal;
import java.time.Instant;

public record PublicSearchResultResponse(

        Long inventoryId,

        ProductResponse product,

        PublicStoreResponse store,

        BigDecimal price,

        Integer quantity,

        StockStatus status,

        Instant updatedAt,

        Double distanceKm
) {
}