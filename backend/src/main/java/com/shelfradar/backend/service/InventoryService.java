package com.shelfradar.backend.service;

import com.shelfradar.backend.dto.catalog.PageResponse;
import com.shelfradar.backend.dto.store.InventoryCreateRequest;
import com.shelfradar.backend.dto.store.InventoryResponse;
import com.shelfradar.backend.dto.store.InventoryUpdateRequest;
import com.shelfradar.backend.entity.Inventory;
import com.shelfradar.backend.entity.Product;
import com.shelfradar.backend.entity.Store;
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

@Service
@Transactional(readOnly = true)
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final StoreService storeService;
    private final StoreMapper storeMapper;

    public InventoryService(
            InventoryRepository inventoryRepository,
            ProductRepository productRepository,
            StoreService storeService,
            StoreMapper storeMapper
    ) {
        this.inventoryRepository =
                inventoryRepository;

        this.productRepository =
                productRepository;

        this.storeService =
                storeService;

        this.storeMapper =
                storeMapper;
    }

    public PageResponse<InventoryResponse>
    getInventory(
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
                        resolveSort(sort)
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

        inventory.setPrice(
                request.price()
        );

        inventory.setQuantity(
                request.quantity()
        );

        inventory.setStatus(
                request.status()
        );

        return storeMapper
                .toInventoryResponse(
                        inventory
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

        inventoryRepository.delete(
                inventory
        );
    }

    private void validateStatus(
            Integer quantity,
            StockStatus status
    ) {

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

    private Sort resolveSort(
            String value
    ) {

        if (value == null) {

            return Sort.by(
                    Sort.Direction.ASC,
                    "product.name"
            );
        }

        return switch (
                value
                        .trim()
                        .toLowerCase()
                ) {

            case "pricedesc" ->
                    Sort.by(
                            Sort.Direction.DESC,
                            "price"
                    );

            case "priceasc" ->
                    Sort.by(
                            Sort.Direction.ASC,
                            "price"
                    );

            case "updateddesc" ->
                    Sort.by(
                            Sort.Direction.DESC,
                            "updatedAt"
                    );

            case "nameza" ->
                    Sort.by(
                            Sort.Direction.DESC,
                            "product.name"
                    );

            default ->
                    Sort.by(
                            Sort.Direction.ASC,
                            "product.name"
                    );
        };
    }
}