package com.shelfradar.backend.service;

import com.shelfradar.backend.dto.admin.AdminDashboardResponse;
import com.shelfradar.backend.dto.admin.AdminOwnerResponse;
import com.shelfradar.backend.dto.admin.AdminStoreDetailResponse;
import com.shelfradar.backend.dto.admin.AdminStoreFiltersResponse;
import com.shelfradar.backend.dto.admin.AdminStoreResponse;
import com.shelfradar.backend.dto.admin.AdminStoreUpdateRequest;
import com.shelfradar.backend.dto.catalog.PageResponse;
import com.shelfradar.backend.entity.AppUser;
import com.shelfradar.backend.entity.Inventory;
import com.shelfradar.backend.entity.Store;
import com.shelfradar.backend.entity.enums.AuditAction;
import com.shelfradar.backend.entity.enums.AuditEntityType;
import com.shelfradar.backend.entity.enums.StockStatus;
import com.shelfradar.backend.entity.enums.StoreStatus;
import com.shelfradar.backend.entity.enums.UserRole;
import com.shelfradar.backend.exception.ResourceNotFoundException;
import com.shelfradar.backend.mapper.AdminStoreMapper;
import com.shelfradar.backend.repository.AdminStoreSearchRepository;
import com.shelfradar.backend.repository.AppUserRepository;
import com.shelfradar.backend.repository.InventoryRepository;
import com.shelfradar.backend.repository.ProductRepository;
import com.shelfradar.backend.repository.StoreRepository;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@Service
@Transactional(readOnly = true)
public class AdminStoreService {

    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final AppUserRepository appUserRepository;
    private final AdminStoreSearchRepository adminStoreSearchRepository;
    private final AdminStoreMapper adminStoreMapper;
    private final AuditService auditService;


    public AdminStoreService(
            StoreRepository storeRepository,
            ProductRepository productRepository,
            InventoryRepository inventoryRepository,
            AppUserRepository appUserRepository,
            AdminStoreSearchRepository adminStoreSearchRepository,
            AdminStoreMapper adminStoreMapper,
            AuditService auditService
    ) {

        this.storeRepository =
                storeRepository;

        this.productRepository =
                productRepository;

        this.inventoryRepository =
                inventoryRepository;

        this.appUserRepository =
                appUserRepository;

        this.adminStoreSearchRepository =
                adminStoreSearchRepository;

        this.adminStoreMapper =
                adminStoreMapper;

        this.auditService =
                auditService;
    }


    public AdminDashboardResponse getDashboard() {

        long totalStores =
                storeRepository.count();


        long activeStores =
                storeRepository.countByStatus(
                        StoreStatus.ACTIVE
                );


        long pendingStores =
                storeRepository.countByStatus(
                        StoreStatus.PENDING
                );


        long inactiveStores =
                storeRepository.countByStatus(
                        StoreStatus.INACTIVE
                );


        long totalProducts =
                productRepository.count();


        long storeOwners =
                appUserRepository.countByRole(
                        UserRole.STORE_OWNER
                );


        long inventoryItems =
                inventoryRepository.count();


        long lowStockItems =
                inventoryRepository.countByStatus(
                        StockStatus.LOW_STOCK
                );


        long outOfStockItems =
                inventoryRepository.countByStatus(
                        StockStatus.OUT_OF_STOCK
                );


        Long totalUnitsValue =
                inventoryRepository
                        .sumTotalUnits();


        BigDecimal inventoryValue =
                inventoryRepository
                        .sumInventoryValue();


        List<AdminStoreResponse> pendingPreview =
                storeRepository
                        .findTop5ByStatusOrderByCreatedAtAsc(
                                StoreStatus.PENDING
                        )
                        .stream()
                        .map(
                                adminStoreMapper
                                        ::toResponse
                        )
                        .toList();


        return new AdminDashboardResponse(
                totalStores,
                activeStores,
                pendingStores,
                inactiveStores,
                totalProducts,
                storeOwners,
                inventoryItems,
                lowStockItems,
                outOfStockItems,
                totalUnitsValue == null
                        ? 0
                        : totalUnitsValue,
                inventoryValue == null
                        ? BigDecimal.ZERO
                        : inventoryValue,
                pendingPreview
        );
    }


    public PageResponse<AdminStoreResponse> searchStores(
            String query,
            StoreStatus status,
            String city,
            int page,
            int size,
            String sort
    ) {

        Page<Store> stores =
                adminStoreSearchRepository
                        .search(
                                query,
                                status,
                                city,
                                page,
                                size,
                                sort
                        );


        return PageResponse.from(
                stores.map(
                        adminStoreMapper
                                ::toResponse
                )
        );
    }


    public AdminStoreFiltersResponse getFilters() {

        return new AdminStoreFiltersResponse(
                storeRepository
                        .findDistinctCities(),
                Arrays.asList(
                        StoreStatus.values()
                )
        );
    }


    public List<AdminOwnerResponse> getStoreOwners() {

        return appUserRepository
                .findByRoleOrderByFullNameAsc(
                        UserRole.STORE_OWNER
                )
                .stream()
                .map(
                        adminStoreMapper
                                ::toOwnerResponse
                )
                .toList();
    }


    public AdminStoreDetailResponse getStore(
            Long storeId
    ) {

        Store store =
                findStore(
                        storeId
                );


        List<Inventory> inventory =
                inventoryRepository
                        .findDetailedByStoreIdOrderByUpdatedAtDesc(
                                storeId
                        );


        return buildDetail(
                store,
                inventory
        );
    }


    @Transactional
    public AdminStoreDetailResponse changeStatus(
            String actorEmail,
            Long storeId,
            StoreStatus status
    ) {

        Store store =
                findStore(
                        storeId
                );


        StoreStatus previousStatus =
                store.getStatus();


        if (previousStatus == status) {

            return buildDetail(
                    store,
                    inventoryRepository
                            .findDetailedByStoreIdOrderByUpdatedAtDesc(
                                    storeId
                            )
            );
        }


        store.setStatus(
                status
        );


        Store savedStore =
                storeRepository.save(
                        store
                );


        auditService.record(
                actorEmail,
                AuditAction.STORE_STATUS_CHANGED,
                AuditEntityType.STORE,
                savedStore.getId(),
                savedStore,
                null,
                "Status "
                        + previousStatus
                        + " -> "
                        + savedStore.getStatus()
        );


        return buildDetail(
                savedStore,
                inventoryRepository
                        .findDetailedByStoreIdOrderByUpdatedAtDesc(
                                storeId
                        )
        );
    }


    @Transactional
    public AdminStoreDetailResponse updateStore(
            String actorEmail,
            Long storeId,
            AdminStoreUpdateRequest request
    ) {

        Store store =
                findStore(
                        storeId
                );


        AppUser newOwner =
                appUserRepository
                        .findByIdAndRole(
                                request.ownerId(),
                                UserRole.STORE_OWNER
                        )
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Store owner not found."
                                        )
                        );


        /*
         * Capture the current owner before making any changes.
         */
        AppUser previousOwner =
                store.getOwner();

        Long previousOwnerId =
                previousOwner.getId();

        String previousOwnerEmail =
                previousOwner.getEmail();


        /*
         * Normalize the values that will actually be persisted.
         */
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
                normalizeNullable(
                        request.phone()
                );

        String newWorkingHours =
                normalizeNullable(
                        request.workingHours()
                );


        /*
         * Determine what changed BEFORE mutating the managed entity.
         */
        String profileAuditDetails =
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


        boolean ownerChanged =
                !Objects.equals(
                        previousOwnerId,
                        newOwner.getId()
                );


        /*
         * Apply the store configuration changes.
         */
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

        store.setOwner(
                newOwner
        );


        Store savedStore =
                storeRepository.save(
                        store
                );


        /*
         * Record profile changes only when one or more actual
         * profile fields changed.
         *
         * Changing only the owner must not produce a false
         * STORE_PROFILE_UPDATED audit row.
         */
        if (profileAuditDetails != null) {

            auditService.record(
                    actorEmail,
                    AuditAction.STORE_PROFILE_UPDATED,
                    AuditEntityType.STORE,
                    savedStore.getId(),
                    savedStore,
                    null,
                    profileAuditDetails
            );
        }


        /*
         * Owner reassignment is a separate business event and
         * therefore receives its own audit entry.
         */
        if (ownerChanged) {

            auditService.record(
                    actorEmail,
                    AuditAction.STORE_OWNER_CHANGED,
                    AuditEntityType.STORE,
                    savedStore.getId(),
                    savedStore,
                    null,
                    "Owner "
                            + previousOwnerEmail
                            + " -> "
                            + newOwner.getEmail()
            );
        }


        return buildDetail(
                savedStore,
                inventoryRepository
                        .findDetailedByStoreIdOrderByUpdatedAtDesc(
                                storeId
                        )
        );
    }


    private AdminStoreDetailResponse buildDetail(
            Store store,
            List<Inventory> inventory
    ) {

        long inStock =
                inventory
                        .stream()
                        .filter(
                                item ->
                                        item.getStatus() ==
                                                StockStatus.IN_STOCK
                        )
                        .count();


        long lowStock =
                inventory
                        .stream()
                        .filter(
                                item ->
                                        item.getStatus() ==
                                                StockStatus.LOW_STOCK
                        )
                        .count();


        long outOfStock =
                inventory
                        .stream()
                        .filter(
                                item ->
                                        item.getStatus() ==
                                                StockStatus.OUT_OF_STOCK
                        )
                        .count();


        long totalUnits =
                inventory
                        .stream()
                        .mapToLong(
                                Inventory::getQuantity
                        )
                        .sum();


        BigDecimal inventoryValue =
                inventory
                        .stream()
                        .map(
                                item ->
                                        item
                                                .getPrice()
                                                .multiply(
                                                        BigDecimal.valueOf(
                                                                item.getQuantity()
                                                        )
                                                )
                        )
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );


        Instant lastUpdate =
                inventory
                        .stream()
                        .map(
                                Inventory::getUpdatedAt
                        )
                        .filter(
                                Objects::nonNull
                        )
                        .max(
                                Comparator.naturalOrder()
                        )
                        .orElse(
                                null
                        );


        return new AdminStoreDetailResponse(
                adminStoreMapper.toResponse(
                        store
                ),
                inventory.size(),
                inStock + lowStock,
                inStock,
                lowStock,
                outOfStock,
                totalUnits,
                inventoryValue,
                lastUpdate
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
                    "name "
                            + formatNullable(
                            store.getName()
                    )
                            + " -> "
                            + formatNullable(
                            newName
                    )
            );
        }


        if (
                !Objects.equals(
                        store.getAddress(),
                        newAddress
                )
        ) {

            changes.add(
                    "address "
                            + formatNullable(
                            store.getAddress()
                    )
                            + " -> "
                            + formatNullable(
                            newAddress
                    )
            );
        }


        if (
                !Objects.equals(
                        store.getCity(),
                        newCity
                )
        ) {

            changes.add(
                    "city "
                            + formatNullable(
                            store.getCity()
                    )
                            + " -> "
                            + formatNullable(
                            newCity
                    )
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


        return "Administrator updated store profile: "
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


    private Store findStore(
            Long storeId
    ) {

        return storeRepository
                .findById(
                        storeId
                )
                .orElseThrow(
                        () ->
                                new ResourceNotFoundException(
                                        "Store not found."
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


    private String normalizeNullable(
            String value
    ) {

        if (
                value == null ||
                        value.isBlank()
        ) {
            return null;
        }


        return value.trim();
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
}