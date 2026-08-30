package com.shelfradar.backend.repository;

import com.shelfradar.backend.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository
        extends JpaRepository<Inventory, Long> {

    List<Inventory> findByStoreId(Long storeId);

    List<Inventory> findByProductId(Long productId);

    Optional<Inventory> findByStoreIdAndProductId(
            Long storeId,
            Long productId
    );
}