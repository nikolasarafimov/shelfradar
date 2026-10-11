package com.shelfradar.backend.dto.auth;

import com.shelfradar.backend.entity.AppUser;
import com.shelfradar.backend.entity.enums.UserRole;

public record AuthUserResponse(
        Long id,
        String fullName,
        String email,
        UserRole role
) {

    public static AuthUserResponse from(
            AppUser user
    ) {
        return new AuthUserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );
    }
}