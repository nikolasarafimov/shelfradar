package com.shelfradar.backend.dto.publicsearch;

import java.math.BigDecimal;

public record PublicStoreResponse(

        Long id,

        String name,

        String address,

        String city,

        BigDecimal latitude,

        BigDecimal longitude,

        String phone,

        String workingHours
) {
}