package com.shelfradar.backend.dto.store;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record StoreDashboardResponse(

        StoreResponse store,

        long totalProducts,

        long availableProducts,

        long inStockProducts,

        long lowStockProducts,

        long outOfStockProducts,

        long totalUnits,

        BigDecimal inventoryValue,

        Instant lastUpdatedAt,

        List<InventoryResponse> alerts,

        List<InventoryResponse> recentUpdates
) {
}