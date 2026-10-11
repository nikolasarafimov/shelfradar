package com.shelfradar.backend.mapper;

import com.shelfradar.backend.dto.admin.AdminOwnerResponse;
import com.shelfradar.backend.dto.admin.AdminStoreResponse;
import com.shelfradar.backend.entity.AppUser;
import com.shelfradar.backend.entity.Store;
import org.springframework.stereotype.Component;

@Component
public class AdminStoreMapper {

    public AdminStoreResponse toResponse(
            Store store
    ) {
        return new AdminStoreResponse(
                store.getId(),
                store.getName(),
                store.getAddress(),
                store.getCity(),
                store.getLatitude(),
                store.getLongitude(),
                store.getPhone(),
                store.getWorkingHours(),
                store.getStatus(),
                toOwnerResponse(
                        store.getOwner()
                ),
                store.getCreatedAt()
        );
    }

    public AdminOwnerResponse toOwnerResponse(
            AppUser owner
    ) {
        return new AdminOwnerResponse(
                owner.getId(),
                owner.getFullName(),
                owner.getEmail()
        );
    }
}