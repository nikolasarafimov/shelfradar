package com.shelfradar.backend.mapper;

import com.shelfradar.backend.dto.store.InventoryResponse;
import com.shelfradar.backend.dto.store.StoreResponse;
import com.shelfradar.backend.entity.Inventory;
import com.shelfradar.backend.entity.Store;
import org.springframework.stereotype.Component;

@Component
public class StoreMapper {

    private final CatalogMapper catalogMapper;

    public StoreMapper(
            CatalogMapper catalogMapper
    ) {
        this.catalogMapper =
                catalogMapper;
    }

    public StoreResponse toStoreResponse(
            Store store
    ) {

        return new StoreResponse(
                store.getId(),
                store.getName(),
                store.getAddress(),
                store.getCity(),
                store.getLatitude(),
                store.getLongitude(),
                store.getPhone(),
                store.getWorkingHours(),
                store.getStatus(),
                store.getCreatedAt()
        );
    }

    public InventoryResponse toInventoryResponse(
            Inventory inventory
    ) {

        return new InventoryResponse(
                inventory.getId(),
                inventory.getStore().getId(),
                catalogMapper.toProductResponse(
                        inventory.getProduct()
                ),
                inventory.getPrice(),
                inventory.getQuantity(),
                inventory.getStatus(),
                inventory.getUpdatedAt()
        );
    }
}