package com.shelfradar.backend.dto.publicsearch;

import com.shelfradar.backend.dto.catalog.ProductResponse;

import java.math.BigDecimal;
import java.util.List;

public record PublicProductDetailResponse(

        ProductResponse product,

        List<PublicSearchResultResponse> offers,

        BigDecimal lowestPrice,

        int totalStores,

        int availableStores
) {
}