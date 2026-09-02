package com.shelfradar.backend.dto.audit;

public record StoreActivitySummaryResponse(

        Long storeId,

        String storeName,

        long actions
) {
}