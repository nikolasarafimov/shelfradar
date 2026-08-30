package com.shelfradar.backend;

import com.jayway.jsonpath.JsonPath;
import com.shelfradar.backend.entity.Inventory;
import com.shelfradar.backend.entity.Store;
import com.shelfradar.backend.repository.InventoryRepository;
import com.shelfradar.backend.repository.StoreRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class StoreInventoryIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Test
    void ownerShouldOnlySeeOwnStores()
            throws Exception {

        String token =
                login(
                        "marko@shelfradar.local",
                        "Store123!"
                );

        mockMvc.perform(
                        get(
                                "/api/store/stores"
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
                                "$[0].name"
                        ).value(
                                "Market Center"
                        )
                );
    }

    @Test
    void ownerShouldNotAccessAnotherOwnersStore()
            throws Exception {

        String token =
                login(
                        "marko@shelfradar.local",
                        "Store123!"
                );

        Store otherStore =
                storeRepository
                        .findAll()
                        .stream()
                        .filter(
                                store ->
                                        store
                                                .getName()
                                                .equals(
                                                        "Fresh Market Aerodrom"
                                                )
                        )
                        .findFirst()
                        .orElseThrow();

        mockMvc.perform(
                        get(
                                "/api/store/stores/{id}",
                                otherStore.getId()
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
    void ownerShouldReadOwnInventory()
            throws Exception {

        String token =
                login(
                        "marko@shelfradar.local",
                        "Store123!"
                );

        Store store =
                findStore(
                        "Market Center"
                );

        mockMvc.perform(
                        get(
                                "/api/store/stores/{id}/inventory",
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
                                "$.content"
                        ).isArray()
                );
    }

    @Test
    void quantityZeroWithInStockShouldFail()
            throws Exception {

        String token =
                login(
                        "marko@shelfradar.local",
                        "Store123!"
                );

        Store store =
                findStore(
                        "Market Center"
                );

        Inventory inventory =
                inventoryRepository
                        .findByStoreId(
                                store.getId()
                        )
                        .getFirst();

        mockMvc.perform(
                        put(
                                "/api/store/stores/{storeId}/inventory/{inventoryId}",
                                store.getId(),
                                inventory.getId()
                        )
                                .header(
                                        "Authorization",
                                        "Bearer " + token
                                )
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(
                                        """
                                        {
                                          "price": 72.00,
                                          "quantity": 0,
                                          "status": "IN_STOCK"
                                        }
                                        """
                                )
                )
                .andExpect(
                        status().isBadRequest()
                );
    }

    @Test
    void adminShouldNotUseStoreOwnerEndpoints()
            throws Exception {

        String token =
                login(
                        "admin@shelfradar.local",
                        "Admin123!"
                );

        mockMvc.perform(
                        get(
                                "/api/store/stores"
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

    private Store findStore(
            String name
    ) {

        return storeRepository
                .findAll()
                .stream()
                .filter(
                        store ->
                                store.getName()
                                        .equals(name)
                )
                .findFirst()
                .orElseThrow();
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

        return JsonPath.read(
                response,
                "$.accessToken"
        );
    }
}