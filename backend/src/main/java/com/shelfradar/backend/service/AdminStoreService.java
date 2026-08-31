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
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class AdminStoreService {

    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final AppUserRepository appUserRepository;
    private final AdminStoreSearchRepository adminStoreSearchRepository;
    private final AdminStoreMapper adminStoreMapper;


    public AdminStoreService(
            StoreRepository storeRepository,
            ProductRepository productRepository,
            InventoryRepository inventoryRepository,
            AppUserRepository appUserRepository,
            AdminStoreSearchRepository adminStoreSearchRepository,
            AdminStoreMapper adminStoreMapper
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


        List<AdminStoreResponse>
                pendingPreview =
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
            Long storeId,
            StoreStatus status
    ) {

        Store store =
                findStore(
                        storeId
                );


        store.setStatus(
                status
        );


        storeRepository.save(
                store
        );


        return getStore(
                storeId
        );
    }


    @Transactional
    public AdminStoreDetailResponse updateStore(
            Long storeId,
            AdminStoreUpdateRequest request
    ) {

        Store store =
                findStore(
                        storeId
                );


        AppUser owner =
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


        store.setName(
                request.name().trim()
        );

        store.setAddress(
                request.address().trim()
        );

        store.setCity(
                request.city().trim()
        );

        store.setLatitude(
                request.latitude()
        );

        store.setLongitude(
                request.longitude()
        );

        store.setPhone(
                normalizeNullable(
                        request.phone()
                )
        );

        store.setWorkingHours(
                normalizeNullable(
                        request.workingHours()
                )
        );

        store.setOwner(
                owner
        );


        storeRepository.save(
                store
        );


        return getStore(
                storeId
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


        BigDecimal value =
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
                        .max(
                                Comparator.naturalOrder()
                        )
                        .orElse(null);


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
                value,
                lastUpdate
        );
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
}