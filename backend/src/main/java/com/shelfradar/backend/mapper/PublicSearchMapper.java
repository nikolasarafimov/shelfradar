package com.shelfradar.backend.mapper;

import com.shelfradar.backend.dto.publicsearch.PublicSearchResultResponse;
import com.shelfradar.backend.dto.publicsearch.PublicStoreResponse;
import com.shelfradar.backend.entity.Inventory;
import com.shelfradar.backend.entity.Store;
import org.springframework.stereotype.Component;

@Component
public class PublicSearchMapper {

    private final CatalogMapper catalogMapper;

    public PublicSearchMapper(
            CatalogMapper catalogMapper
    ) {
        this.catalogMapper = catalogMapper;
    }


    public PublicSearchResultResponse toSearchResult(
            Inventory inventory
    ) {

        return toSearchResult(
                inventory,
                null
        );
    }


    public PublicSearchResultResponse toSearchResult(
            Inventory inventory,
            Double distanceKm
    ) {

        Double roundedDistance =
                distanceKm == null
                        ? null
                        : Math.round(
                        distanceKm * 1000.0
                ) / 1000.0;

        return new PublicSearchResultResponse(
                inventory.getId(),

                catalogMapper.toProductResponse(
                        inventory.getProduct()
                ),

                toStoreResponse(
                        inventory.getStore()
                ),

                inventory.getPrice(),
                inventory.getQuantity(),
                inventory.getStatus(),
                inventory.getUpdatedAt(),
                roundedDistance
        );
    }


    public PublicStoreResponse toStoreResponse(
            Store store
    ) {

        return new PublicStoreResponse(
                store.getId(),
                store.getName(),
                store.getAddress(),
                store.getCity(),
                store.getLatitude(),
                store.getLongitude(),
                store.getPhone(),
                store.getWorkingHours()
        );
    }
}