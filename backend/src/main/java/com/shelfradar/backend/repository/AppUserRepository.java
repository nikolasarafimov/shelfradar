package com.shelfradar.backend.repository;

import com.shelfradar.backend.entity.AppUser;
import com.shelfradar.backend.entity.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    long countByRole(
            UserRole role
    );

    Optional<AppUser> findByIdAndRole(
            Long id,
            UserRole role
    );

    List<AppUser> findByRoleOrderByFullNameAsc(
            UserRole role
    );
}