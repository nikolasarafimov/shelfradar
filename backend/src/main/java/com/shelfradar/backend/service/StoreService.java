package com.shelfradar.backend.service;

import com.shelfradar.backend.dto.store.StoreResponse;
import com.shelfradar.backend.dto.store.StoreUpdateRequest;
import com.shelfradar.backend.entity.AppUser;
import com.shelfradar.backend.entity.Store;
import com.shelfradar.backend.exception.ResourceNotFoundException;
import com.shelfradar.backend.mapper.StoreMapper;
import com.shelfradar.backend.repository.AppUserRepository;
import com.shelfradar.backend.repository.StoreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@Transactional(readOnly = true)
public class StoreService {

    private final StoreRepository storeRepository;
    private final AppUserRepository appUserRepository;
    private final StoreMapper storeMapper;

    public StoreService(
            StoreRepository storeRepository,
            AppUserRepository appUserRepository,
            StoreMapper storeMapper
    ) {
        this.storeRepository =
                storeRepository;

        this.appUserRepository =
                appUserRepository;

        this.storeMapper =
                storeMapper;
    }

    public List<StoreResponse> getOwnedStores(
            String email
    ) {

        AppUser owner =
                findUser(email);

        return storeRepository
                .findByOwnerIdOrderByNameAsc(
                        owner.getId()
                )
                .stream()
                .map(
                        storeMapper::toStoreResponse
                )
                .toList();
    }

    public StoreResponse getOwnedStore(
            String email,
            Long storeId
    ) {

        AppUser owner =
                findUser(email);

        return storeMapper.toStoreResponse(
                findOwnedStore(
                        storeId,
                        owner.getId()
                )
        );
    }

    @Transactional
    public StoreResponse updateOwnedStore(
            String email,
            Long storeId,
            StoreUpdateRequest request
    ) {

        AppUser owner =
                findUser(email);

        Store store =
                findOwnedStore(
                        storeId,
                        owner.getId()
                );

        store.setName(
                normalizeRequired(
                        request.name()
                )
        );

        store.setAddress(
                normalizeRequired(
                        request.address()
                )
        );

        store.setCity(
                normalizeRequired(
                        request.city()
                )
        );

        store.setLatitude(
                request.latitude()
        );

        store.setLongitude(
                request.longitude()
        );

        store.setPhone(
                normalizeOptional(
                        request.phone()
                )
        );

        store.setWorkingHours(
                normalizeOptional(
                        request.workingHours()
                )
        );

        return storeMapper.toStoreResponse(
                store
        );
    }

    Store findOwnedStore(
            String email,
            Long storeId
    ) {

        AppUser owner =
                findUser(email);

        return findOwnedStore(
                storeId,
                owner.getId()
        );
    }

    private Store findOwnedStore(
            Long storeId,
            Long ownerId
    ) {

        return storeRepository
                .findByIdAndOwnerId(
                        storeId,
                        ownerId
                )
                .orElseThrow(
                        () ->
                                new ResourceNotFoundException(
                                        "Store not found."
                                )
                );
    }

    private AppUser findUser(
            String email
    ) {

        String normalizedEmail =
                email
                        .trim()
                        .toLowerCase(
                                Locale.ROOT
                        );

        return appUserRepository
                .findByEmailIgnoreCase(
                        normalizedEmail
                )
                .orElseThrow(
                        () ->
                                new ResourceNotFoundException(
                                        "User not found."
                                )
                );
    }

    private String normalizeRequired(
            String value
    ) {

        return value
                .trim()
                .replaceAll(
                        "\\s+",
                        " "
                );
    }

    private String normalizeOptional(
            String value
    ) {

        if (value == null) {
            return null;
        }

        String result =
                value.trim();

        return result.isEmpty()
                ? null
                : result;
    }
}