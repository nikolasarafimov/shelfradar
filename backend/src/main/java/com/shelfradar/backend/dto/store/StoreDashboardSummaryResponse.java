package com.shelfradar.backend.dto.store;

import java.math.BigDecimal;
import java.time.Instant;

public record StoreDashboardSummaryResponse(

        StoreResponse store,

        long totalProducts,

        long availableProducts,

        long inStockProducts,

        long lowStockProducts,

        long outOfStockProducts,

        long totalUnits,

        BigDecimal inventoryValue,

        Instant lastUpdatedAt
) {
}