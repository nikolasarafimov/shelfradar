package com.shelfradar.backend.service;

import com.shelfradar.backend.dto.publicsearch.PublicProductDetailResponse;
import com.shelfradar.backend.dto.publicsearch.PublicSearchResultResponse;
import com.shelfradar.backend.dto.publicsearch.PublicStoreDetailResponse;
import com.shelfradar.backend.entity.Inventory;
import com.shelfradar.backend.entity.Product;
import com.shelfradar.backend.entity.Store;
import com.shelfradar.backend.entity.enums.StockStatus;
import com.shelfradar.backend.entity.enums.StoreStatus;
import com.shelfradar.backend.exception.ResourceNotFoundException;
import com.shelfradar.backend.mapper.CatalogMapper;
import com.shelfradar.backend.mapper.PublicSearchMapper;
import com.shelfradar.backend.repository.InventoryRepository;
import com.shelfradar.backend.repository.ProductRepository;
import com.shelfradar.backend.repository.StoreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class PublicBrowseService {

    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final InventoryRepository inventoryRepository;
    private final CatalogMapper catalogMapper;
    private final PublicSearchMapper publicSearchMapper;


    public PublicBrowseService(
            ProductRepository productRepository,
            StoreRepository storeRepository,
            InventoryRepository inventoryRepository,
            CatalogMapper catalogMapper,
            PublicSearchMapper publicSearchMapper
    ) {
        this.productRepository = productRepository;
        this.storeRepository = storeRepository;
        this.inventoryRepository = inventoryRepository;
        this.catalogMapper = catalogMapper;
        this.publicSearchMapper = publicSearchMapper;
    }


    public PublicProductDetailResponse getProduct(
            Long productId
    ) {

        Product product =
                productRepository
                        .findById(productId)
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Product not found."
                                        )
                        );


        List<Inventory> inventory =
                inventoryRepository
                        .findPublicOffersByProductId(
                                productId,
                                StoreStatus.ACTIVE
                        );


        List<Inventory> sortedInventory =
                inventory
                        .stream()
                        .sorted(
                                Comparator
                                        .comparingInt(
                                                this::availabilityRank
                                        )
                                        .thenComparing(
                                                Inventory::getPrice
                                        )
                                        .thenComparing(
                                                item ->
                                                        item
                                                                .getStore()
                                                                .getName(),
                                                String.CASE_INSENSITIVE_ORDER
                                        )
                        )
                        .toList();


        List<PublicSearchResultResponse> offers =
                sortedInventory
                        .stream()
                        .map(
                                publicSearchMapper
                                        ::toSearchResult
                        )
                        .toList();


        int availableStores =
                (int)
                        inventory
                                .stream()
                                .filter(
                                        this::isAvailable
                                )
                                .count();


        BigDecimal lowestPrice =
                inventory
                        .stream()
                        .filter(
                                this::isAvailable
                        )
                        .map(
                                Inventory::getPrice
                        )
                        .min(
                                BigDecimal::compareTo
                        )
                        .orElse(null);


        return new PublicProductDetailResponse(
                catalogMapper.toProductResponse(
                        product
                ),
                offers,
                lowestPrice,
                inventory.size(),
                availableStores
        );
    }


    public PublicStoreDetailResponse getStore(
            Long storeId
    ) {

        Store store =
                storeRepository
                        .findByIdAndStatus(
                                storeId,
                                StoreStatus.ACTIVE
                        )
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Store not found."
                                        )
                        );


        List<Inventory> inventory =
                inventoryRepository
                        .findPublicInventoryByStoreId(
                                storeId,
                                StoreStatus.ACTIVE
                        );


        List<PublicSearchResultResponse> inventoryResponses =
                inventory
                        .stream()
                        .map(
                                publicSearchMapper
                                        ::toSearchResult
                        )
                        .toList();


        int availableProducts =
                (int)
                        inventory
                                .stream()
                                .filter(
                                        this::isAvailable
                                )
                                .count();


        return new PublicStoreDetailResponse(
                publicSearchMapper
                        .toStoreResponse(
                                store
                        ),
                inventoryResponses,
                inventory.size(),
                availableProducts
        );
    }


    private boolean isAvailable(
            Inventory inventory
    ) {

        return inventory.getStatus() !=
                StockStatus.OUT_OF_STOCK;
    }


    private int availabilityRank(
            Inventory inventory
    ) {

        return inventory.getStatus() ==
                StockStatus.OUT_OF_STOCK
                ? 1
                : 0;
    }
}