package com.shelfradar.backend.dto.store;

import java.math.BigDecimal;
import java.util.List;

public record OwnerDashboardResponse(

        long totalStores,

        long totalProducts,

        long availableProducts,

        long lowStockProducts,

        long outOfStockProducts,

        long totalUnits,

        BigDecimal inventoryValue,

        List<StoreDashboardSummaryResponse> stores
) {
}