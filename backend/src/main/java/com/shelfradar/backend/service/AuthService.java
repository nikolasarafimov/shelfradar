package com.shelfradar.backend.service;

import com.shelfradar.backend.dto.auth.AuthResponse;
import com.shelfradar.backend.dto.auth.AuthUserResponse;
import com.shelfradar.backend.dto.auth.LoginRequest;
import com.shelfradar.backend.entity.AppUser;
import com.shelfradar.backend.exception.InvalidCredentialsException;
import com.shelfradar.backend.repository.AppUserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final AppUserRepository appUserRepository;
    private final TokenService tokenService;

    public AuthService(
            AuthenticationManager authenticationManager,
            AppUserRepository appUserRepository,
            TokenService tokenService
    ) {
        this.authenticationManager =
                authenticationManager;

        this.appUserRepository =
                appUserRepository;

        this.tokenService =
                tokenService;
    }

    public AuthResponse login(
            LoginRequest request
    ) {

        String normalizedEmail =
                request.email()
                        .trim()
                        .toLowerCase(Locale.ROOT);

        try {

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            normalizedEmail,
                            request.password()
                    )
            );

        } catch (AuthenticationException exception) {

            throw new InvalidCredentialsException();
        }

        AppUser user =
                appUserRepository
                        .findByEmailIgnoreCase(
                                normalizedEmail
                        )
                        .orElseThrow(
                                InvalidCredentialsException::new
                        );

        TokenService.IssuedToken issuedToken =
                tokenService.issueToken(user);

        return new AuthResponse(
                issuedToken.value(),
                "Bearer",
                issuedToken.expiresInSeconds(),
                AuthUserResponse.from(user)
        );
    }

    public AuthUserResponse getCurrentUser(
            String email
    ) {

        AppUser user =
                appUserRepository
                        .findByEmailIgnoreCase(email)
                        .orElseThrow(
                                InvalidCredentialsException::new
                        );

        return AuthUserResponse.from(user);
    }
}