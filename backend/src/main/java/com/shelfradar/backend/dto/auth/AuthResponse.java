package com.shelfradar.backend.dto.auth;

public record AuthResponse(

        String accessToken,

        String tokenType,

        long expiresInSeconds,

        AuthUserResponse user

) {
}