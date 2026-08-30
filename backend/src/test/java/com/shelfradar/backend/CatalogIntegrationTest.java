package com.shelfradar.backend;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.transaction.TestTransaction;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@Rollback
class CatalogIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void adminShouldReadProducts()
            throws Exception {

        String token =
                login(
                        "admin@shelfradar.local",
                        "Admin123!"
                );

        mockMvc.perform(
                        get(
                                "/api/admin/catalog/products"
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
    void adminShouldCreateBrand()
            throws Exception {

        String token =
                login(
                        "admin@shelfradar.local",
                        "Admin123!"
                );

        String name =
                "Test Brand " +
                        UUID.randomUUID();

        mockMvc.perform(
                        post(
                                "/api/admin/catalog/brands"
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
                                          "name": "%s"
                                        }
                                        """.formatted(name)
                                )
                )
                .andExpect(
                        status().isCreated()
                )
                .andExpect(
                        jsonPath(
                                "$.name"
                        ).value(name)
                );
    }

    @Test
    void duplicateBrandShouldReturnConflict()
            throws Exception {

        String token =
                login(
                        "admin@shelfradar.local",
                        "Admin123!"
                );

        String name =
                "Duplicate " +
                        UUID.randomUUID();

        String body =
                """
                {
                  "name": "%s"
                }
                """.formatted(name);

        mockMvc.perform(
                        post(
                                "/api/admin/catalog/brands"
                        )
                                .header(
                                        "Authorization",
                                        "Bearer " + token
                                )
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(body)
                )
                .andExpect(
                        status().isCreated()
                );

        mockMvc.perform(
                        post(
                                "/api/admin/catalog/brands"
                        )
                                .header(
                                        "Authorization",
                                        "Bearer " + token
                                )
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(body)
                )
                .andExpect(
                        status().isConflict()
                );
    }

    @Test
    void blankBrandShouldReturnBadRequest()
            throws Exception {

        String token =
                login(
                        "admin@shelfradar.local",
                        "Admin123!"
                );

        mockMvc.perform(
                        post(
                                "/api/admin/catalog/brands"
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
                                          "name": ""
                                        }
                                        """
                                )
                )
                .andExpect(
                        status().isBadRequest()
                )
                .andExpect(
                        jsonPath(
                                "$.fieldErrors.name"
                        ).exists()
                );
    }

    @Test
    void storeOwnerShouldNotManageCatalog()
            throws Exception {

        String token =
                login(
                        "marko@shelfradar.local",
                        "Store123!"
                );

        mockMvc.perform(
                        get(
                                "/api/admin/catalog/products"
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

        String result =
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
                result,
                "$.accessToken"
        );
    }
}