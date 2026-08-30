package com.shelfradar.backend.controller;

import com.shelfradar.backend.dto.auth.AuthResponse;
import com.shelfradar.backend.dto.auth.AuthUserResponse;
import com.shelfradar.backend.dto.auth.LoginRequest;
import com.shelfradar.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(
            AuthService authService
    ) {
        this.authService =
                authService;
    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid
            @RequestBody
            LoginRequest request
    ) {

        return authService.login(request);
    }

    @GetMapping("/me")
    public AuthUserResponse currentUser(
            Authentication authentication
    ) {

        return authService.getCurrentUser(
                authentication.getName()
        );
    }
}