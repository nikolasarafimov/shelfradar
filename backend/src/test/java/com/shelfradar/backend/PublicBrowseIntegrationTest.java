package com.shelfradar.backend;

import com.shelfradar.backend.entity.Product;
import com.shelfradar.backend.entity.Store;
import com.shelfradar.backend.entity.enums.StoreStatus;
import com.shelfradar.backend.repository.ProductRepository;
import com.shelfradar.backend.repository.StoreRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class PublicBrowseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private StoreRepository storeRepository;


    @Test
    void productDetailShouldWorkWithoutAuthentication()
            throws Exception {

        List<Product> products =
                productRepository
                        .findByNameContainingIgnoreCase(
                                "Coca-Cola Original 1L"
                        );

        Product product =
                products.get(0);


        mockMvc.perform(
                        get(
                                "/api/public/products/{id}",
                                product.getId()
                        )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath(
                                "$.product.name"
                        ).value(
                                "Coca-Cola Original 1L"
                        )
                )
                .andExpect(
                        jsonPath(
                                "$.offers"
                        ).isArray()
                )
                .andExpect(
                        jsonPath(
                                "$.availableStores"
                        ).value(
                                2
                        )
                )
                .andExpect(
                        jsonPath(
                                "$.lowestPrice"
                        ).value(
                                72.0
                        )
                );
    }


    @Test
    void productOffersShouldPlaceAvailableOffersBeforeOutOfStock()
            throws Exception {

        Product product =
                productRepository
                        .findByNameContainingIgnoreCase(
                                "Coca-Cola Original 1L"
                        )
                        .get(0);


        mockMvc.perform(
                        get(
                                "/api/public/products/{id}",
                                product.getId()
                        )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath(
                                "$.offers[0].status"
                        ).value(
                                "IN_STOCK"
                        )
                );
    }


    @Test
    void activeStoreDetailShouldWorkWithoutAuthentication()
            throws Exception {

        Store store =
                storeRepository
                        .findByStatus(
                                StoreStatus.ACTIVE
                        )
                        .stream()
                        .filter(
                                item ->
                                        item.getName()
                                                .equals(
                                                        "Market Center"
                                                )
                        )
                        .findFirst()
                        .orElseThrow();


        mockMvc.perform(
                        get(
                                "/api/public/stores/{id}",
                                store.getId()
                        )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath(
                                "$.store.name"
                        ).value(
                                "Market Center"
                        )
                )
                .andExpect(
                        jsonPath(
                                "$.inventory"
                        ).isArray()
                )
                .andExpect(
                        jsonPath(
                                "$.totalProducts"
                        ).isNumber()
                );
    }


    @Test
    void missingProductShouldReturnNotFound()
            throws Exception {

        mockMvc.perform(
                        get(
                                "/api/public/products/999999999"
                        )
                )
                .andExpect(
                        status().isNotFound()
                );
    }


    @Test
    void missingStoreShouldReturnNotFound()
            throws Exception {

        mockMvc.perform(
                        get(
                                "/api/public/stores/999999999"
                        )
                )
                .andExpect(
                        status().isNotFound()
                );
    }
}