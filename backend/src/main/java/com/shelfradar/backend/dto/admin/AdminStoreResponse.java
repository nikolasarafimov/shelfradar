package com.shelfradar.backend.dto.admin;

import com.shelfradar.backend.entity.enums.StoreStatus;

import java.math.BigDecimal;
import java.time.Instant;

public record AdminStoreResponse(

        Long id,

        String name,

        String address,

        String city,

        BigDecimal latitude,

        BigDecimal longitude,

        String phone,

        String workingHours,

        StoreStatus status,

        AdminOwnerResponse owner,

        Instant createdAt

) {
}