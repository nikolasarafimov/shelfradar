package com.shelfradar.backend.dto.publicsearch;

import java.util.List;

public record NearbySearchPage(

        List<NearbySearchHit> content,

        long totalElements

) {
}