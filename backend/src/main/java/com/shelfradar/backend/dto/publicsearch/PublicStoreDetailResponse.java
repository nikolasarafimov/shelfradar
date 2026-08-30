package com.shelfradar.backend.dto.publicsearch;

import java.util.List;

public record PublicStoreDetailResponse(

        PublicStoreResponse store,

        List<PublicSearchResultResponse> inventory,

        int totalProducts,

        int availableProducts

) {
}