package com.shelfradar.backend.security;

import com.shelfradar.backend.entity.AppUser;
import com.shelfradar.backend.repository.AppUserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class ShelfRadarUserDetailsService
        implements UserDetailsService {

    private final AppUserRepository appUserRepository;

    public ShelfRadarUserDetailsService(
            AppUserRepository appUserRepository
    ) {
        this.appUserRepository = appUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(
            String email
    ) throws UsernameNotFoundException {

        AppUser user =
                appUserRepository
                        .findByEmailIgnoreCase(email)
                        .orElseThrow(
                                () -> new UsernameNotFoundException(
                                        "User not found."
                                )
                        );

        return User
                .withUsername(user.getEmail())
                .password(user.getPasswordHash())
                .roles(user.getRole().name())
                .build();
    }
}