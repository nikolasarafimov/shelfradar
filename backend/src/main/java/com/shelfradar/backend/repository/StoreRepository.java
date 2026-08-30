package com.shelfradar.backend.repository;

import com.shelfradar.backend.entity.Store;
import com.shelfradar.backend.entity.enums.StoreStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StoreRepository
        extends JpaRepository<Store, Long> {

    List<Store> findByCityIgnoreCase(
            String city
    );

    List<Store> findByStatus(
            StoreStatus status
    );

    List<Store> findByOwnerId(
            Long ownerId
    );

    List<Store> findByOwnerIdOrderByNameAsc(
            Long ownerId
    );

    Optional<Store> findByIdAndOwnerId(
            Long id,
            Long ownerId
    );

    Optional<Store> findByIdAndStatus(
            Long id,
            StoreStatus status
    );

    @Query("""
            SELECT DISTINCT s.city
            FROM Store s
            WHERE s.status = :status
            ORDER BY s.city ASC
            """)
    List<String> findDistinctCitiesByStatus(
            @Param("status")
            StoreStatus status
    );
}