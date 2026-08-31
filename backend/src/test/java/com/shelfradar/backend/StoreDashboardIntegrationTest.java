package com.shelfradar.backend;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import com.shelfradar.backend.entity.Inventory;
import com.shelfradar.backend.entity.Store;
import com.shelfradar.backend.entity.enums.StockStatus;
import com.shelfradar.backend.repository.InventoryRepository;
import com.shelfradar.backend.repository.StoreRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class StoreDashboardIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private InventoryRepository inventoryRepository;


    @Test
    void ownerDashboardShouldOnlyContainOwnedStores()
            throws Exception {

        String token =
                login(
                        "marko@shelfradar.local",
                        "Store123!"
                );


        mockMvc.perform(
                        get(
                                "/api/store/dashboard"
                        )
                                .header(
                                        "Authorization",
                                        "Bearer " + token
                                )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath(
                                "$.totalStores"
                        ).value(
                                1
                        )
                )
                .andExpect(
                        jsonPath(
                                "$.stores[0].store.name"
                        ).value(
                                "Market Center"
                        )
                );
    }


    @Test
    void storeDashboardMetricsShouldMatchInventory()
            throws Exception {

        Store store =
                storeRepository
                        .findAll()
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


        List<Inventory> inventory =
                inventoryRepository
                        .findByStoreId(
                                store.getId()
                        );


        long expectedTotal =
                inventory.size();


        long expectedLowStock =
                inventory
                        .stream()
                        .filter(
                                item ->
                                        item.getStatus() ==
                                                StockStatus.LOW_STOCK
                        )
                        .count();


        long expectedOutOfStock =
                inventory
                        .stream()
                        .filter(
                                item ->
                                        item.getStatus() ==
                                                StockStatus.OUT_OF_STOCK
                        )
                        .count();


        long expectedUnits =
                inventory
                        .stream()
                        .mapToLong(
                                Inventory::getQuantity
                        )
                        .sum();


        BigDecimal expectedValue =
                inventory
                        .stream()
                        .map(
                                item ->
                                        item
                                                .getPrice()
                                                .multiply(
                                                        BigDecimal.valueOf(
                                                                item.getQuantity()
                                                        )
                                                )
                        )
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );


        String token =
                login(
                        "marko@shelfradar.local",
                        "Store123!"
                );


        mockMvc.perform(
                        get(
                                "/api/store/stores/{storeId}/dashboard",
                                store.getId()
                        )
                                .header(
                                        "Authorization",
                                        "Bearer " + token
                                )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath(
                                "$.totalProducts"
                        ).value(
                                expectedTotal
                        )
                )
                .andExpect(
                        jsonPath(
                                "$.lowStockProducts"
                        ).value(
                                expectedLowStock
                        )
                )
                .andExpect(
                        jsonPath(
                                "$.outOfStockProducts"
                        ).value(
                                expectedOutOfStock
                        )
                )
                .andExpect(
                        jsonPath(
                                "$.totalUnits"
                        ).value(
                                expectedUnits
                        )
                )
                .andExpect(
                        jsonPath(
                                "$.inventoryValue"
                        ).value(
                                expectedValue.doubleValue()
                        )
                )
                .andExpect(
                        jsonPath(
                                "$.alerts"
                        ).isArray()
                )
                .andExpect(
                        jsonPath(
                                "$.recentUpdates"
                        ).isArray()
                );
    }


    @Test
    void ownerShouldNotAccessAnotherOwnersDashboard()
            throws Exception {

        Store elenaStore =
                storeRepository
                        .findAll()
                        .stream()
                        .filter(
                                store ->
                                        store.getName()
                                                .equals(
                                                        "Fresh Market Aerodrom"
                                                )
                        )
                        .findFirst()
                        .orElseThrow();


        String token =
                login(
                        "marko@shelfradar.local",
                        "Store123!"
                );


        mockMvc.perform(
                        get(
                                "/api/store/stores/{storeId}/dashboard",
                                elenaStore.getId()
                        )
                                .header(
                                        "Authorization",
                                        "Bearer " + token
                                )
                )
                .andExpect(
                        status().isNotFound()
                );
    }


    @Test
    void adminShouldNotUseStoreOwnerDashboard()
            throws Exception {

        String token =
                login(
                        "admin@shelfradar.local",
                        "Admin123!"
                );


        mockMvc.perform(
                        get(
                                "/api/store/dashboard"
                        )
                                .header(
                                        "Authorization",
                                        "Bearer " + token
                                )
                )
                .andExpect(
                        status().isForbidden()
                );
    }


    private String login(
            String email,
            String password
    ) throws Exception {

        String response =
                mockMvc.perform(
                                post(
                                        "/api/auth/login"
                                )
                                        .contentType(
                                                MediaType.APPLICATION_JSON
                                        )
                                        .content(
                                                """
                                                {
                                                  "email": "%s",
                                                  "password": "%s"
                                                }
                                                """.formatted(
                                                        email,
                                                        password
                                                )
                                        )
                        )
                        .andExpect(
                                status().isOk()
                        )
                        .andReturn()
                        .getResponse()
                        .getContentAsString();


        JsonNode json =
                objectMapper.readTree(
                        response
                );


        return json
                .get(
                        "accessToken"
                )
                .asText();
    }
}