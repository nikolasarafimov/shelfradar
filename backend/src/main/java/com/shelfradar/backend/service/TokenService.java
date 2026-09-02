package com.shelfradar.backend.service;

import com.shelfradar.backend.config.JwtProperties;
import com.shelfradar.backend.entity.AppUser;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class TokenService {

    private final JwtEncoder jwtEncoder;
    private final JwtProperties jwtProperties;

    public TokenService(
            JwtEncoder jwtEncoder,
            JwtProperties jwtProperties
    ) {
        this.jwtEncoder = jwtEncoder;
        this.jwtProperties = jwtProperties;
    }

    public IssuedToken issueToken(
            AppUser user
    ) {

        Instant now =
                Instant.now();

        Instant expiresAt =
                now.plus(
                        jwtProperties.expirationMinutes(),
                        ChronoUnit.MINUTES
                );

        JwtClaimsSet claims =
                JwtClaimsSet
                        .builder()

                        .issuer(
                                jwtProperties.issuer()
                        )

                        .issuedAt(now)

                        .expiresAt(expiresAt)

                        .subject(
                                user.getEmail()
                        )

                        .claim(
                                "userId",
                                user.getId()
                        )

                        .claim(
                                "roles",
                                List.of(
                                        user.getRole().name()
                                )
                        )

                        .build();

        String token =
                jwtEncoder
                        .encode(
                                JwtEncoderParameters.from(
                                        claims
                                )
                        )
                        .getTokenValue();

        long expiresInSeconds =
                jwtProperties.expirationMinutes()
                        * 60;

        return new IssuedToken(
                token,
                expiresAt,
                expiresInSeconds
        );
    }

    public record IssuedToken(

            String value,

            Instant expiresAt,

            long expiresInSeconds
    ) {
    }
}