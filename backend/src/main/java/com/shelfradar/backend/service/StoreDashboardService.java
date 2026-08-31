package com.shelfradar.backend.service;

import com.shelfradar.backend.dto.store.InventoryResponse;
import com.shelfradar.backend.dto.store.OwnerDashboardResponse;
import com.shelfradar.backend.dto.store.StoreDashboardResponse;
import com.shelfradar.backend.dto.store.StoreDashboardSummaryResponse;
import com.shelfradar.backend.entity.AppUser;
import com.shelfradar.backend.entity.Inventory;
import com.shelfradar.backend.entity.Store;
import com.shelfradar.backend.entity.enums.StockStatus;
import com.shelfradar.backend.exception.ResourceNotFoundException;
import com.shelfradar.backend.mapper.StoreMapper;
import com.shelfradar.backend.repository.AppUserRepository;
import com.shelfradar.backend.repository.InventoryRepository;
import com.shelfradar.backend.repository.StoreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class StoreDashboardService {

    private static final int ALERT_LIMIT = 10;
    private static final int RECENT_UPDATE_LIMIT = 5;

    private final AppUserRepository appUserRepository;
    private final StoreRepository storeRepository;
    private final InventoryRepository inventoryRepository;
    private final StoreService storeService;
    private final StoreMapper storeMapper;


    public StoreDashboardService(
            AppUserRepository appUserRepository,
            StoreRepository storeRepository,
            InventoryRepository inventoryRepository,
            StoreService storeService,
            StoreMapper storeMapper
    ) {
        this.appUserRepository =
                appUserRepository;

        this.storeRepository =
                storeRepository;

        this.inventoryRepository =
                inventoryRepository;

        this.storeService =
                storeService;

        this.storeMapper =
                storeMapper;
    }


    public OwnerDashboardResponse getOwnerDashboard(
            String email
    ) {

        AppUser owner =
                findUserByEmail(
                        email
                );


        List<Store> stores =
                storeRepository
                        .findByOwnerIdOrderByNameAsc(
                                owner.getId()
                        );


        if (stores.isEmpty()) {

            return new OwnerDashboardResponse(
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    BigDecimal.ZERO,
                    List.of()
            );
        }


        List<Long> storeIds =
                stores
                        .stream()
                        .map(
                                Store::getId
                        )
                        .toList();


        List<Inventory> inventory =
                inventoryRepository
                        .findDetailedByStoreIds(
                                storeIds
                        );


        Map<Long, List<Inventory>>
                inventoryByStore =
                inventory
                        .stream()
                        .collect(
                                Collectors.groupingBy(
                                        item ->
                                                item
                                                        .getStore()
                                                        .getId()
                                )
                        );


        List<StoreDashboardSummaryResponse>
                summaries =
                stores
                        .stream()
                        .map(
                                store ->
                                        buildSummary(
                                                store,
                                                inventoryByStore
                                                        .getOrDefault(
                                                                store.getId(),
                                                                List.of()
                                                        )
                                        )
                        )
                        .toList();


        long totalProducts =
                summaries
                        .stream()
                        .mapToLong(
                                StoreDashboardSummaryResponse
                                        ::totalProducts
                        )
                        .sum();


        long availableProducts =
                summaries
                        .stream()
                        .mapToLong(
                                StoreDashboardSummaryResponse
                                        ::availableProducts
                        )
                        .sum();


        long lowStockProducts =
                summaries
                        .stream()
                        .mapToLong(
                                StoreDashboardSummaryResponse
                                        ::lowStockProducts
                        )
                        .sum();


        long outOfStockProducts =
                summaries
                        .stream()
                        .mapToLong(
                                StoreDashboardSummaryResponse
                                        ::outOfStockProducts
                        )
                        .sum();


        long totalUnits =
                summaries
                        .stream()
                        .mapToLong(
                                StoreDashboardSummaryResponse
                                        ::totalUnits
                        )
                        .sum();


        BigDecimal inventoryValue =
                summaries
                        .stream()
                        .map(
                                StoreDashboardSummaryResponse
                                        ::inventoryValue
                        )
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );


        return new OwnerDashboardResponse(
                stores.size(),
                totalProducts,
                availableProducts,
                lowStockProducts,
                outOfStockProducts,
                totalUnits,
                inventoryValue,
                summaries
        );
    }


    public StoreDashboardResponse getStoreDashboard(
            String email,
            Long storeId
    ) {

        Store store =
                storeService.findOwnedStore(
                        email,
                        storeId
                );


        List<Inventory> inventory =
                inventoryRepository
                        .findDetailedByStoreIdOrderByUpdatedAtDesc(
                                storeId
                        );


        DashboardMetrics metrics =
                calculateMetrics(
                        inventory
                );


        List<InventoryResponse> alerts =
                inventory
                        .stream()
                        .filter(
                                this::needsAttention
                        )
                        .sorted(
                                Comparator
                                        .comparingInt(
                                                this::alertRank
                                        )
                                        .thenComparing(
                                                Inventory::getUpdatedAt,
                                                Comparator.reverseOrder()
                                        )
                        )
                        .limit(
                                ALERT_LIMIT
                        )
                        .map(
                                storeMapper
                                        ::toInventoryResponse
                        )
                        .toList();


        List<InventoryResponse> recentUpdates =
                inventory
                        .stream()
                        .limit(
                                RECENT_UPDATE_LIMIT
                        )
                        .map(
                                storeMapper
                                        ::toInventoryResponse
                        )
                        .toList();


        return new StoreDashboardResponse(
                storeMapper.toStoreResponse(
                        store
                ),
                metrics.totalProducts(),
                metrics.availableProducts(),
                metrics.inStockProducts(),
                metrics.lowStockProducts(),
                metrics.outOfStockProducts(),
                metrics.totalUnits(),
                metrics.inventoryValue(),
                metrics.lastUpdatedAt(),
                alerts,
                recentUpdates
        );
    }


    private StoreDashboardSummaryResponse buildSummary(
            Store store,
            List<Inventory> inventory
    ) {

        DashboardMetrics metrics =
                calculateMetrics(
                        inventory
                );


        return new StoreDashboardSummaryResponse(
                storeMapper.toStoreResponse(
                        store
                ),
                metrics.totalProducts(),
                metrics.availableProducts(),
                metrics.inStockProducts(),
                metrics.lowStockProducts(),
                metrics.outOfStockProducts(),
                metrics.totalUnits(),
                metrics.inventoryValue(),
                metrics.lastUpdatedAt()
        );
    }


    private DashboardMetrics calculateMetrics(
            List<Inventory> inventory
    ) {

        long totalProducts =
                inventory.size();


        long inStockProducts =
                inventory
                        .stream()
                        .filter(
                                item ->
                                        item.getStatus() ==
                                                StockStatus.IN_STOCK
                        )
                        .count();


        long lowStockProducts =
                inventory
                        .stream()
                        .filter(
                                item ->
                                        item.getStatus() ==
                                                StockStatus.LOW_STOCK
                        )
                        .count();


        long outOfStockProducts =
                inventory
                        .stream()
                        .filter(
                                item ->
                                        item.getStatus() ==
                                                StockStatus.OUT_OF_STOCK
                        )
                        .count();


        long availableProducts =
                inStockProducts +
                        lowStockProducts;


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


        Instant lastUpdatedAt =
                inventory
                        .stream()
                        .map(
                                Inventory::getUpdatedAt
                        )
                        .max(
                                Comparator.naturalOrder()
                        )
                        .orElse(null);


        return new DashboardMetrics(
                totalProducts,
                availableProducts,
                inStockProducts,
                lowStockProducts,
                outOfStockProducts,
                totalUnits,
                inventoryValue,
                lastUpdatedAt
        );
    }


    private boolean needsAttention(
            Inventory inventory
    ) {

        return inventory.getStatus() ==
                StockStatus.LOW_STOCK
                ||
                inventory.getStatus() ==
                        StockStatus.OUT_OF_STOCK;
    }


    private int alertRank(
            Inventory inventory
    ) {

        if (
                inventory.getStatus() ==
                        StockStatus.OUT_OF_STOCK
        ) {
            return 0;
        }

        return 1;
    }


    private AppUser findUserByEmail(
            String email
    ) {

        return appUserRepository
                .findByEmailIgnoreCase(
                        email.trim()
                )
                .orElseThrow(
                        () ->
                                new ResourceNotFoundException(
                                        "User not found."
                                )
                );
    }


    private record DashboardMetrics(

            long totalProducts,

            long availableProducts,

            long inStockProducts,

            long lowStockProducts,

            long outOfStockProducts,

            long totalUnits,

            BigDecimal inventoryValue,

            Instant lastUpdatedAt

    ) {
    }
}