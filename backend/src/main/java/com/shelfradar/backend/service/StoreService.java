package com.shelfradar.backend.service;

import com.shelfradar.backend.dto.store.StoreResponse;
import com.shelfradar.backend.dto.store.StoreUpdateRequest;
import com.shelfradar.backend.entity.AppUser;
import com.shelfradar.backend.entity.Store;
import com.shelfradar.backend.entity.enums.AuditAction;
import com.shelfradar.backend.entity.enums.AuditEntityType;
import com.shelfradar.backend.exception.ResourceNotFoundException;
import com.shelfradar.backend.mapper.StoreMapper;
import com.shelfradar.backend.repository.AppUserRepository;
import com.shelfradar.backend.repository.StoreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

@Service
@Transactional(readOnly = true)
public class StoreService {

    private final StoreRepository storeRepository;
    private final AppUserRepository appUserRepository;
    private final StoreMapper storeMapper;
    private final AuditService auditService;

    public StoreService(
            StoreRepository storeRepository,
            AppUserRepository appUserRepository,
            StoreMapper storeMapper,
            AuditService auditService
    ) {

        this.storeRepository =
                storeRepository;

        this.appUserRepository =
                appUserRepository;

        this.storeMapper =
                storeMapper;

        this.auditService =
                auditService;
    }

    public List<StoreResponse> getOwnedStores(
            String email
    ) {

        AppUser owner =
                findUser(
                        email
                );

        return storeRepository
                .findByOwnerIdOrderByNameAsc(
                        owner.getId()
                )
                .stream()
                .map(
                        storeMapper
                                ::toStoreResponse
                )
                .toList();
    }

    public StoreResponse getOwnedStore(
            String email,
            Long storeId
    ) {

        AppUser owner =
                findUser(
                        email
                );

        Store store =
                findOwnedStore(
                        storeId,
                        owner.getId()
                );

        return storeMapper
                .toStoreResponse(
                        store
                );
    }

    @Transactional
    public StoreResponse updateOwnedStore(
            String email,
            Long storeId,
            StoreUpdateRequest request
    ) {

        AppUser owner =
                findUser(
                        email
                );

        Store store =
                findOwnedStore(
                        storeId,
                        owner.getId()
                );

        String newName =
                normalizeRequired(
                        request.name()
                );

        String newAddress =
                normalizeRequired(
                        request.address()
                );

        String newCity =
                normalizeRequired(
                        request.city()
                );

        BigDecimal newLatitude =
                request.latitude();

        BigDecimal newLongitude =
                request.longitude();

        String newPhone =
                normalizeOptional(
                        request.phone()
                );

        String newWorkingHours =
                normalizeOptional(
                        request.workingHours()
                );

        String auditDetails =
                buildProfileUpdateDetails(
                        store,
                        newName,
                        newAddress,
                        newCity,
                        newLatitude,
                        newLongitude,
                        newPhone,
                        newWorkingHours
                );

        store.setName(
                newName
        );

        store.setAddress(
                newAddress
        );

        store.setCity(
                newCity
        );

        store.setLatitude(
                newLatitude
        );

        store.setLongitude(
                newLongitude
        );

        store.setPhone(
                newPhone
        );

        store.setWorkingHours(
                newWorkingHours
        );

        if (auditDetails != null) {

            auditService.record(
                    email,
                    AuditAction.STORE_PROFILE_UPDATED,
                    AuditEntityType.STORE,
                    store.getId(),
                    store,
                    null,
                    auditDetails
            );
        }

        return storeMapper
                .toStoreResponse(
                        store
                );
    }

    Store findOwnedStore(
            String email,
            Long storeId
    ) {

        AppUser owner =
                findUser(
                        email
                );

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

    private String buildProfileUpdateDetails(
            Store store,
            String newName,
            String newAddress,
            String newCity,
            BigDecimal newLatitude,
            BigDecimal newLongitude,
            String newPhone,
            String newWorkingHours
    ) {

        List<String> changes =
                new ArrayList<>();

        if (
                !Objects.equals(
                        store.getName(),
                        newName
                )
        ) {

            changes.add(
                    "name \""
                            + store.getName()
                            + "\" -> \""
                            + newName
                            + "\""
            );
        }

        if (
                !Objects.equals(
                        store.getAddress(),
                        newAddress
                )
        ) {

            changes.add(
                    "address \""
                            + store.getAddress()
                            + "\" -> \""
                            + newAddress
                            + "\""
            );
        }

        if (
                !Objects.equals(
                        store.getCity(),
                        newCity
                )
        ) {

            changes.add(
                    "city \""
                            + store.getCity()
                            + "\" -> \""
                            + newCity
                            + "\""
            );
        }

        if (
                !sameDecimal(
                        store.getLatitude(),
                        newLatitude
                )
        ) {

            changes.add(
                    "latitude "
                            + store.getLatitude()
                            + " -> "
                            + newLatitude
            );
        }

        if (
                !sameDecimal(
                        store.getLongitude(),
                        newLongitude
                )
        ) {

            changes.add(
                    "longitude "
                            + store.getLongitude()
                            + " -> "
                            + newLongitude
            );
        }

        if (
                !Objects.equals(
                        store.getPhone(),
                        newPhone
                )
        ) {

            changes.add(
                    "phone "
                            + formatNullable(
                            store.getPhone()
                    )
                            + " -> "
                            + formatNullable(
                            newPhone
                    )
            );
        }

        if (
                !Objects.equals(
                        store.getWorkingHours(),
                        newWorkingHours
                )
        ) {

            changes.add(
                    "working hours "
                            + formatNullable(
                            store.getWorkingHours()
                    )
                            + " -> "
                            + formatNullable(
                            newWorkingHours
                    )
            );
        }

        if (changes.isEmpty()) {
            return null;
        }

        return "Store profile updated: "
                + String.join(
                "; ",
                changes
        )
                + ".";
    }

    private boolean sameDecimal(
            BigDecimal first,
            BigDecimal second
    ) {

        if (
                first == null &&
                        second == null
        ) {
            return true;
        }


        if (
                first == null ||
                        second == null
        ) {
            return false;
        }


        return first.compareTo(
                second
        ) == 0;
    }

    private String formatNullable(
            String value
    ) {

        return value == null
                ? "null"
                : "\""
                + value
                + "\"";
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