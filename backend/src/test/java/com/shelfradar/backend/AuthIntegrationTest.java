package com.shelfradar.backend;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void healthShouldRemainPublic()
            throws Exception {

        mockMvc.perform(
                        get("/api/health")
                )
                .andExpect(
                        status().isOk()
                );
    }

    @Test
    void adminShouldBeAbleToLogin()
            throws Exception {

        mockMvc.perform(
                        post("/api/auth/login")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(
                                        """
                                        {
                                          "email": "admin@shelfradar.local",
                                          "password": "Admin123!"
                                        }
                                        """
                                )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath(
                                "$.accessToken"
                        ).isNotEmpty()
                )
                .andExpect(
                        jsonPath(
                                "$.tokenType"
                        ).value("Bearer")
                )
                .andExpect(
                        jsonPath(
                                "$.user.role"
                        ).value("ADMIN")
                );
    }

    @Test
    void invalidPasswordShouldReturnUnauthorized()
            throws Exception {

        mockMvc.perform(
                        post("/api/auth/login")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(
                                        """
                                        {
                                          "email": "admin@shelfradar.local",
                                          "password": "incorrect"
                                        }
                                        """
                                )
                )
                .andExpect(
                        status().isUnauthorized()
                );
    }

    @Test
    void meShouldRequireAuthentication()
            throws Exception {

        mockMvc.perform(
                        get("/api/auth/me")
                )
                .andExpect(
                        status().isUnauthorized()
                );
    }

    @Test
    void adminShouldAccessAdminEndpoint()
            throws Exception {

        String token =
                loginAndGetToken(
                        "admin@shelfradar.local",
                        "Admin123!"
                );

        mockMvc.perform(
                        get("/api/admin/access")
                                .header(
                                        "Authorization",
                                        "Bearer " + token
                                )
                )
                .andExpect(
                        status().isOk()
                );
    }

    @Test
    void adminShouldNotAccessStoreEndpoint()
            throws Exception {

        String token =
                loginAndGetToken(
                        "admin@shelfradar.local",
                        "Admin123!"
                );

        mockMvc.perform(
                        get("/api/store/access")
                                .header(
                                        "Authorization",
                                        "Bearer " + token
                                )
                )
                .andExpect(
                        status().isForbidden()
                );
    }

    @Test
    void storeOwnerShouldAccessStoreEndpoint()
            throws Exception {

        String token =
                loginAndGetToken(
                        "marko@shelfradar.local",
                        "Store123!"
                );

        mockMvc.perform(
                        get("/api/store/access")
                                .header(
                                        "Authorization",
                                        "Bearer " + token
                                )
                )
                .andExpect(
                        status().isOk()
                );
    }

    @Test
    void storeOwnerShouldNotAccessAdminEndpoint()
            throws Exception {

        String token =
                loginAndGetToken(
                        "marko@shelfradar.local",
                        "Store123!"
                );

        mockMvc.perform(
                        get("/api/admin/access")
                                .header(
                                        "Authorization",
                                        "Bearer " + token
                                )
                )
                .andExpect(
                        status().isForbidden()
                );
    }

    private String loginAndGetToken(
            String email,
            String password
    ) throws Exception {

        String body =
                """
                {
                  "email": "%s",
                  "password": "%s"
                }
                """.formatted(
                        email,
                        password
                );

        MvcResult result =
                mockMvc.perform(
                                post("/api/auth/login")
                                        .contentType(
                                                MediaType.APPLICATION_JSON
                                        )
                                        .content(body)
                        )
                        .andExpect(
                                status().isOk()
                        )
                        .andReturn();

        return JsonPath.read(
                result
                        .getResponse()
                        .getContentAsString(),
                "$.accessToken"
        );
    }
}