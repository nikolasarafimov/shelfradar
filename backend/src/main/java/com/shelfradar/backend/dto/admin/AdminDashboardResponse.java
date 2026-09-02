package com.shelfradar.backend.dto.admin;

import java.math.BigDecimal;
import java.util.List;

public record AdminDashboardResponse(

        long totalStores,

        long activeStores,

        long pendingStores,

        long inactiveStores,

        long totalProducts,

        long storeOwners,

        long inventoryItems,

        long lowStockItems,

        long outOfStockItems,

        long totalUnits,

        BigDecimal inventoryValue,

        List<AdminStoreResponse> pendingStorePreview
) {
}