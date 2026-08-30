package com.shelfradar.backend;

import com.shelfradar.backend.entity.Product;
import com.shelfradar.backend.entity.enums.StoreStatus;
import com.shelfradar.backend.repository.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class CoreDataIntegrationTest {

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void seedDataShouldBeAvailable() {

        assertThat(appUserRepository.count())
                .isGreaterThanOrEqualTo(4);

        assertThat(brandRepository.count())
                .isGreaterThanOrEqualTo(5);

        assertThat(categoryRepository.count())
                .isGreaterThanOrEqualTo(4);

        assertThat(productRepository.count())
                .isGreaterThanOrEqualTo(6);

        assertThat(storeRepository.count())
                .isGreaterThanOrEqualTo(3);

        assertThat(inventoryRepository.count())
                .isGreaterThanOrEqualTo(12);
    }

    @Test
    void shouldFindCocaColaProducts() {

        List<Product> products =
                productRepository
                        .findByNameContainingIgnoreCase(
                                "coca-cola"
                        );

        assertThat(products)
                .isNotEmpty();

        assertThat(products)
                .extracting(Product::getName)
                .contains(
                        "Coca-Cola Original 1L",
                        "Coca-Cola Zero 1.5L"
                );
    }

    @Test
    void shouldFindActiveStores() {

        var stores =
                storeRepository.findByStatus(
                        StoreStatus.ACTIVE
                );

        assertThat(stores)
                .hasSizeGreaterThanOrEqualTo(3);
    }

    @Test
    void everySeededStoreShouldHavePostgisLocation() {

        Integer storesWithoutLocation =
                jdbcTemplate.queryForObject(
                        """
                        SELECT COUNT(*)
                        FROM stores
                        WHERE location IS NULL
                        """,
                        Integer.class
                );

        assertThat(storesWithoutLocation)
                .isZero();
    }

    @Test
    void shouldCalculateDistanceUsingPostgis() {

        Double distance =
                jdbcTemplate.queryForObject(
                        """
                        SELECT ST_Distance(
                            location,
                            ST_SetSRID(
                                ST_MakePoint(
                                    21.4254,
                                    41.9981
                                ),
                                4326
                            )::geography
                        )
                        FROM stores
                        WHERE name = 'Market Center'
                        """,
                        Double.class
                );

        assertThat(distance)
                .isNotNull()
                .isLessThan(1.0);
    }
}