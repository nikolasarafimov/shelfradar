package com.shelfradar.backend.repository;

import com.shelfradar.backend.entity.Store;
import com.shelfradar.backend.entity.enums.StoreStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StoreRepository
        extends JpaRepository<Store, Long> {

    List<Store> findByCityIgnoreCase(String city);

    List<Store> findByStatus(StoreStatus status);

    List<Store> findByOwnerId(Long ownerId);
}