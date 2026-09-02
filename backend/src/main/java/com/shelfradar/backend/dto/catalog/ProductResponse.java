package com.shelfradar.backend.dto.catalog;

import java.time.Instant;

public record ProductResponse(

        Long id,

        String name,

        String description,

        String imageUrl,

        BrandResponse brand,

        CategoryResponse category,

        Instant createdAt
) {
}