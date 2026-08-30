package com.shelfradar.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class PublicSearchIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void publicSearchShouldWorkWithoutAuthentication()
            throws Exception {

        mockMvc.perform(
                        get(
                                "/api/public/search"
                        )
                                .param(
                                        "q",
                                        "Coca-Cola"
                                )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath(
                                "$.content"
                        ).isArray()
                )
                .andExpect(
                        jsonPath(
                                "$.content[0].product.name"
                        ).exists()
                )
                .andExpect(
                        jsonPath(
                                "$.content[0].store.name"
                        ).exists()
                )
                .andExpect(
                        jsonPath(
                                "$.content[0].price"
                        ).exists()
                );
    }

    @Test
    void cheapestCocaColaShouldComeFirst()
            throws Exception {

        mockMvc.perform(
                        get(
                                "/api/public/search"
                        )
                                .param(
                                        "q",
                                        "Coca-Cola Original 1L"
                                )
                                .param(
                                        "sort",
                                        "priceAsc"
                                )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath(
                                "$.content[0].price"
                        ).value(
                                70.0
                        )
                );
    }

    @Test
    void stockStatusFilterShouldWork()
            throws Exception {

        mockMvc.perform(
                        get(
                                "/api/public/search"
                        )
                                .param(
                                        "status",
                                        "IN_STOCK"
                                )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath(
                                "$.content[0].status"
                        ).value(
                                "IN_STOCK"
                        )
                );
    }

    @Test
    void publicFiltersShouldWorkWithoutAuthentication()
            throws Exception {

        mockMvc.perform(
                        get(
                                "/api/public/filters"
                        )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath(
                                "$.brands"
                        ).isArray()
                )
                .andExpect(
                        jsonPath(
                                "$.categories"
                        ).isArray()
                )
                .andExpect(
                        jsonPath(
                                "$.cities"
                        ).isArray()
                )
                .andExpect(
                        jsonPath(
                                "$.statuses"
                        ).isArray()
                );
    }

    @Test
    void invalidPageShouldReturnBadRequest()
            throws Exception {

        mockMvc.perform(
                        get(
                                "/api/public/search"
                        )
                                .param(
                                        "page",
                                        "-1"
                                )
                )
                .andExpect(
                        status().isBadRequest()
                );
    }
}