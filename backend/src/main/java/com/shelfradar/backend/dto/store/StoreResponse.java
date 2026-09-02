package com.shelfradar.backend.dto.store;

import com.shelfradar.backend.entity.enums.StoreStatus;

import java.math.BigDecimal;
import java.time.Instant;

public record StoreResponse(

        Long id,

        String name,

        String address,

        String city,

        BigDecimal latitude,

        BigDecimal longitude,

        String phone,

        String workingHours,

        StoreStatus status,

        Instant createdAt
) {
}