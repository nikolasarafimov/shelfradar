package com.shelfradar.backend.repository;

import com.shelfradar.backend.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BrandRepository
        extends JpaRepository<Brand, Long> {

    Optional<Brand> findByNameIgnoreCase(
            String name
    );

    boolean existsByNameIgnoreCase(
            String name
    );
}