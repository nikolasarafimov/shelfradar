package com.shelfradar.backend.dto.store;

import com.shelfradar.backend.dto.catalog.ProductResponse;
import com.shelfradar.backend.entity.enums.StockStatus;

import java.math.BigDecimal;
import java.time.Instant;

public record InventoryResponse(

        Long id,

        Long storeId,

        ProductResponse product,

        BigDecimal price,

        Integer quantity,

        StockStatus status,

        Instant updatedAt

) {
}