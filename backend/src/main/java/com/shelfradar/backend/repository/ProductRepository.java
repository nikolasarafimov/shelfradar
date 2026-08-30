package com.shelfradar.backend.repository;

import com.shelfradar.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository
        extends JpaRepository<Product, Long> {

    List<Product> findByNameContainingIgnoreCase(
            String name
    );

    @EntityGraph(
            attributePaths = {
                    "brand",
                    "category"
            }
    )
    Page<Product> findByNameContainingIgnoreCase(
            String name,
            Pageable pageable
    );

    @EntityGraph(
            attributePaths = {
                    "brand",
                    "category"
            }
    )
    @Override
    Page<Product> findAll(
            Pageable pageable
    );

    @EntityGraph(
            attributePaths = {
                    "brand",
                    "category"
            }
    )
    @Override
    Optional<Product> findById(
            Long id
    );

    boolean existsByNameIgnoreCaseAndBrand_IdAndCategory_Id(
            String name,
            Long brandId,
            Long categoryId
    );

    boolean existsByNameIgnoreCaseAndBrand_IdAndCategory_IdAndIdNot(
            String name,
            Long brandId,
            Long categoryId,
            Long id
    );

    boolean existsByBrand_Id(
            Long brandId
    );

    boolean existsByCategory_Id(
            Long categoryId
    );
}