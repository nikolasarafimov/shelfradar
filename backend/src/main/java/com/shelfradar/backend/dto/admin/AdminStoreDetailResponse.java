package com.shelfradar.backend.dto.admin;

import java.math.BigDecimal;
import java.time.Instant;

public record AdminStoreDetailResponse(
        AdminStoreResponse store,
        long totalProducts,
        long availableProducts,
        long inStockProducts,
        long lowStockProducts,
        long outOfStockProducts,
        long totalUnits,
        BigDecimal inventoryValue,
        Instant lastInventoryUpdate
) {
}