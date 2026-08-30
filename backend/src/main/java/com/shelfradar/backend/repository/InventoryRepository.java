package com.shelfradar.backend.repository;

import com.shelfradar.backend.entity.Inventory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository
        extends JpaRepository<Inventory, Long> {

    List<Inventory> findByStoreId(
            Long storeId
    );

    List<Inventory> findByProductId(
            Long productId
    );

    Optional<Inventory> findByStoreIdAndProductId(
            Long storeId,
            Long productId
    );

    boolean existsByStoreIdAndProductId(
            Long storeId,
            Long productId
    );

    @EntityGraph(
            attributePaths = {
                    "product",
                    "product.brand",
                    "product.category"
            }
    )
    Optional<Inventory> findByIdAndStoreId(
            Long id,
            Long storeId
    );

    @EntityGraph(
            attributePaths = {
                    "product",
                    "product.brand",
                    "product.category"
            }
    )
    Page<Inventory> findByStoreId(
            Long storeId,
            Pageable pageable
    );

    @EntityGraph(
            attributePaths = {
                    "product",
                    "product.brand",
                    "product.category"
            }
    )
    @Query("""
            SELECT i
            FROM Inventory i
            WHERE i.store.id = :storeId
              AND LOWER(i.product.name)
                  LIKE LOWER(CONCAT('%', :query, '%'))
            """)
    Page<Inventory> searchForStore(
            @Param("storeId")
            Long storeId,

            @Param("query")
            String query,

            Pageable pageable
    );
}