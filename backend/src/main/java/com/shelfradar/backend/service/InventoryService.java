package com.shelfradar.backend.service;

import com.shelfradar.backend.dto.catalog.PageResponse;
import com.shelfradar.backend.dto.store.InventoryCreateRequest;
import com.shelfradar.backend.dto.store.InventoryResponse;
import com.shelfradar.backend.dto.store.InventoryUpdateRequest;
import com.shelfradar.backend.entity.Inventory;
import com.shelfradar.backend.entity.Product;
import com.shelfradar.backend.entity.Store;
import com.shelfradar.backend.entity.enums.AuditAction;
import com.shelfradar.backend.entity.enums.AuditEntityType;
import com.shelfradar.backend.entity.enums.StockStatus;
import com.shelfradar.backend.exception.DuplicateResourceException;
import com.shelfradar.backend.exception.InvalidInventoryStateException;
import com.shelfradar.backend.exception.ResourceNotFoundException;
import com.shelfradar.backend.mapper.StoreMapper;
import com.shelfradar.backend.repository.InventoryRepository;
import com.shelfradar.backend.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Locale;
import java.util.Objects;

@Service
@Transactional(readOnly = true)
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final StoreService storeService;
    private final StoreMapper storeMapper;
    private final AuditService auditService;

    public InventoryService(
            InventoryRepository inventoryRepository,
            ProductRepository productRepository,
            StoreService storeService,
            StoreMapper storeMapper,
            AuditService auditService
    ) {
        this.inventoryRepository =
                inventoryRepository;

        this.productRepository =
                productRepository;

        this.storeService =
                storeService;

        this.storeMapper =
                storeMapper;

        this.auditService =
                auditService;
    }

    public PageResponse<InventoryResponse> getInventory(
            String email,
            Long storeId,
            String query,
            int page,
            int size,
            String sort
    ) {

        storeService.findOwnedStore(
                email,
                storeId
        );

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        resolveSort(
                                sort
                        )
                );

        String normalizedQuery =
                query == null
                        ? ""
                        : query.trim();

        Page<Inventory> result;

        if (normalizedQuery.isEmpty()) {

            result =
                    inventoryRepository
                            .findByStoreId(
                                    storeId,
                                    pageable
                            );

        } else {

            result =
                    inventoryRepository
                            .searchForStore(
                                    storeId,
                                    normalizedQuery,
                                    pageable
                            );
        }

        return PageResponse.from(
                result.map(
                        storeMapper
                                ::toInventoryResponse
                )
        );
    }

    @Transactional
    public InventoryResponse create(
            String email,
            Long storeId,
            InventoryCreateRequest request
    ) {

        Store store =
                storeService.findOwnedStore(
                        email,
                        storeId
                );

        Product product =
                productRepository
                        .findById(
                                request.productId()
                        )
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Product not found."
                                        )
                        );

        if (
                inventoryRepository
                        .existsByStoreIdAndProductId(
                                storeId,
                                product.getId()
                        )
        ) {

            throw new DuplicateResourceException(
                    "This product is already present in the store inventory."
            );
        }

        validateStatus(
                request.quantity(),
                request.status()
        );

        Inventory inventory =
                new Inventory();

        inventory.setStore(
                store
        );

        inventory.setProduct(
                product
        );

        inventory.setPrice(
                request.price()
        );

        inventory.setQuantity(
                request.quantity()
        );

        inventory.setStatus(
                request.status()
        );

        Inventory saved =
                inventoryRepository.save(
                        inventory
                );

        auditService.record(
                email,
                AuditAction.INVENTORY_CREATED,
                AuditEntityType.INVENTORY,
                saved.getId(),
                store,
                product,
                "Created inventory item. Price="
                        + saved.getPrice()
                        + ", quantity="
                        + saved.getQuantity()
                        + ", status="
                        + saved.getStatus()
        );

        return storeMapper
                .toInventoryResponse(
                        saved
                );
    }

    @Transactional
    public InventoryResponse update(
            String email,
            Long storeId,
            Long inventoryId,
            InventoryUpdateRequest request
    ) {

        storeService.findOwnedStore(
                email,
                storeId
        );

        Inventory inventory =
                inventoryRepository
                        .findByIdAndStoreId(
                                inventoryId,
                                storeId
                        )
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Inventory item not found."
                                        )
                        );

        validateStatus(
                request.quantity(),
                request.status()
        );

        BigDecimal oldPrice =
                inventory.getPrice();

        Integer oldQuantity =
                inventory.getQuantity();

        StockStatus oldStatus =
                inventory.getStatus();

        boolean changed =
                !sameDecimal(
                        oldPrice,
                        request.price()
                )
                        ||
                        !Objects.equals(
                                oldQuantity,
                                request.quantity()
                        )
                        ||
                        oldStatus != request.status();

        if (!changed) {
            return storeMapper
                    .toInventoryResponse(
                            inventory
                    );
        }

        inventory.setPrice(
                request.price()
        );

        inventory.setQuantity(
                request.quantity()
        );

        inventory.setStatus(
                request.status()
        );

        Inventory saved =
                inventoryRepository.save(
                        inventory
                );

        auditService.record(
                email,
                AuditAction.INVENTORY_UPDATED,
                AuditEntityType.INVENTORY,
                saved.getId(),
                saved.getStore(),
                saved.getProduct(),
                "Price "
                        + oldPrice
                        + " -> "
                        + saved.getPrice()
                        + "; quantity "
                        + oldQuantity
                        + " -> "
                        + saved.getQuantity()
                        + "; status "
                        + oldStatus
                        + " -> "
                        + saved.getStatus()
        );

        return storeMapper
                .toInventoryResponse(
                        saved
                );
    }

    @Transactional
    public void delete(
            String email,
            Long storeId,
            Long inventoryId
    ) {

        storeService.findOwnedStore(
                email,
                storeId
        );

        Inventory inventory =
                inventoryRepository
                        .findByIdAndStoreId(
                                inventoryId,
                                storeId
                        )
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Inventory item not found."
                                        )
                        );

        auditService.record(
                email,
                AuditAction.INVENTORY_DELETED,
                AuditEntityType.INVENTORY,
                inventory.getId(),
                inventory.getStore(),
                inventory.getProduct(),
                "Removed inventory item. Price="
                        + inventory.getPrice()
                        + ", quantity="
                        + inventory.getQuantity()
                        + ", status="
                        + inventory.getStatus()
        );

        inventoryRepository.delete(
                inventory
        );
    }

    private void validateStatus(
            Integer quantity,
            StockStatus status
    ) {

        if (quantity == null) {

            throw new InvalidInventoryStateException(
                    "Quantity is required."
            );
        }

        if (status == null) {

            throw new InvalidInventoryStateException(
                    "Stock status is required."
            );
        }

        if (quantity < 0) {

            throw new InvalidInventoryStateException(
                    "Quantity cannot be negative."
            );
        }

        if (
                quantity == 0 &&
                        status != StockStatus.OUT_OF_STOCK
        ) {

            throw new InvalidInventoryStateException(
                    "A product with quantity 0 must be OUT_OF_STOCK."
            );
        }

        if (
                quantity > 0 &&
                        status == StockStatus.OUT_OF_STOCK
        ) {

            throw new InvalidInventoryStateException(
                    "A product with quantity greater than 0 cannot be OUT_OF_STOCK."
            );
        }
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

    private Sort resolveSort(
            String value
    ) {

        if (
                value == null ||
                        value.isBlank()
        ) {
            return Sort.by(
                    Sort.Order.asc(
                            "product.name"
                    ),
                    Sort.Order.asc(
                            "id"
                    )
            );
        }

        return switch (
                value
                        .trim()
                        .toLowerCase(
                                Locale.ROOT
                        )
                ) {
            case "nameasc" ->
                    Sort.by(
                            Sort.Order.asc(
                                    "product.name"
                            ),
                            Sort.Order.asc(
                                    "id"
                            )
                    );

            case "nameza", "namedesc" ->
                    Sort.by(
                            Sort.Order.desc(
                                    "product.name"
                            ),
                            Sort.Order.asc(
                                    "id"
                            )
                    );

            case "priceasc" ->
                    Sort.by(
                            Sort.Order.asc(
                                    "price"
                            ),
                            Sort.Order.asc(
                                    "id"
                            )
                    );

            case "pricedesc" ->
                    Sort.by(
                            Sort.Order.desc(
                                    "price"
                            ),
                            Sort.Order.asc(
                                    "id"
                            )
                    );

            case "updateddesc" ->
                    Sort.by(
                            Sort.Order.desc(
                                    "updatedAt"
                            ),
                            Sort.Order.desc(
                                    "id"
                            )
                    );

            default ->
                    Sort.by(
                            Sort.Order.asc(
                                    "product.name"
                            ),
                            Sort.Order.asc(
                                    "id"
                            )
                    );
        };
    }
}