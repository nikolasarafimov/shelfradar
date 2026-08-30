package com.shelfradar.backend.dto.publicsearch;

public record NearbySearchHit(

        Long inventoryId,

        double distanceKm

) {
}