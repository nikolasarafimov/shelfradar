package com.shelfradar.backend.service;

import com.shelfradar.backend.dto.catalog.BrandResponse;
import com.shelfradar.backend.dto.catalog.CategoryResponse;
import com.shelfradar.backend.dto.catalog.PageResponse;
import com.shelfradar.backend.dto.publicsearch.NearbySearchHit;
import com.shelfradar.backend.dto.publicsearch.NearbySearchPage;
import com.shelfradar.backend.dto.publicsearch.PublicSearchFiltersResponse;
import com.shelfradar.backend.dto.publicsearch.PublicSearchResultResponse;
import com.shelfradar.backend.entity.Inventory;
import com.shelfradar.backend.entity.enums.StockStatus;
import com.shelfradar.backend.entity.enums.StoreStatus;
import com.shelfradar.backend.exception.InvalidLocationException;
import com.shelfradar.backend.mapper.CatalogMapper;
import com.shelfradar.backend.mapper.PublicSearchMapper;
import com.shelfradar.backend.repository.BrandRepository;
import com.shelfradar.backend.repository.CategoryRepository;
import com.shelfradar.backend.repository.InventoryRepository;
import com.shelfradar.backend.repository.NearbySearchRepository;
import com.shelfradar.backend.repository.PublicSearchRepository;
import com.shelfradar.backend.repository.StoreRepository;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class PublicSearchService {

    private final PublicSearchRepository
            publicSearchRepository;

    private final NearbySearchRepository
            nearbySearchRepository;

    private final InventoryRepository
            inventoryRepository;

    private final BrandRepository
            brandRepository;

    private final CategoryRepository
            categoryRepository;

    private final StoreRepository
            storeRepository;

    private final PublicSearchMapper
            publicSearchMapper;

    private final CatalogMapper
            catalogMapper;


    public PublicSearchService(
            PublicSearchRepository publicSearchRepository,
            NearbySearchRepository nearbySearchRepository,
            InventoryRepository inventoryRepository,
            BrandRepository brandRepository,
            CategoryRepository categoryRepository,
            StoreRepository storeRepository,
            PublicSearchMapper publicSearchMapper,
            CatalogMapper catalogMapper
    ) {

        this.publicSearchRepository =
                publicSearchRepository;

        this.nearbySearchRepository =
                nearbySearchRepository;

        this.inventoryRepository =
                inventoryRepository;

        this.brandRepository =
                brandRepository;

        this.categoryRepository =
                categoryRepository;

        this.storeRepository =
                storeRepository;

        this.publicSearchMapper =
                publicSearchMapper;

        this.catalogMapper =
                catalogMapper;
    }


    public PageResponse<PublicSearchResultResponse>
    search(
            String query,
            Long brandId,
            Long categoryId,
            StockStatus status,
            String city,
            int page,
            int size,
            String sort,
            Double latitude,
            Double longitude,
            Double radiusKm
    ) {

        validateLocation(
                latitude,
                longitude,
                radiusKm,
                sort
        );


        if (
                latitude == null &&
                        longitude == null
        ) {

            var result =
                    publicSearchRepository.search(
                            query,
                            brandId,
                            categoryId,
                            status,
                            city,
                            page,
                            size,
                            sort
                    );

            return PageResponse.from(
                    result.map(
                            publicSearchMapper
                                    ::toSearchResult
                    )
            );
        }


        NearbySearchPage nearbyPage =
                nearbySearchRepository.search(
                        query,
                        brandId,
                        categoryId,
                        status,
                        city,
                        page,
                        size,
                        sort,
                        latitude,
                        longitude,
                        radiusKm
                );


        List<Long> inventoryIds =
                nearbyPage
                        .content()
                        .stream()
                        .map(
                                NearbySearchHit
                                        ::inventoryId
                        )
                        .toList();


        if (inventoryIds.isEmpty()) {

            var emptyPage =
                    new PageImpl<PublicSearchResultResponse>(
                            List.of(),
                            PageRequest.of(
                                    page,
                                    size
                            ),
                            nearbyPage
                                    .totalElements()
                    );

            return PageResponse.from(
                    emptyPage
            );
        }


        List<Inventory> inventories =
                inventoryRepository
                        .findDetailedByIds(
                                inventoryIds
                        );


        Map<Long, Inventory> inventoryById =
                inventories
                        .stream()
                        .collect(
                                Collectors.toMap(
                                        Inventory::getId,
                                        Function.identity()
                                )
                        );


        List<PublicSearchResultResponse>
                content =
                nearbyPage
                        .content()
                        .stream()
                        .map(
                                hit -> {

                                    Inventory inventory =
                                            inventoryById.get(
                                                    hit.inventoryId()
                                            );

                                    if (inventory == null) {

                                        throw new IllegalStateException(
                                                "Inventory result disappeared during search."
                                        );
                                    }

                                    return publicSearchMapper
                                            .toSearchResult(
                                                    inventory,
                                                    hit.distanceKm()
                                            );
                                }
                        )
                        .toList();


        var resultPage =
                new PageImpl<>(
                        content,
                        PageRequest.of(
                                page,
                                size
                        ),
                        nearbyPage
                                .totalElements()
                );


        return PageResponse.from(
                resultPage
        );
    }


    public PublicSearchFiltersResponse
    getFilters() {

        List<BrandResponse> brands =
                brandRepository
                        .findAll(
                                Sort.by(
                                        Sort.Direction.ASC,
                                        "name"
                                )
                        )
                        .stream()
                        .map(
                                catalogMapper
                                        ::toBrandResponse
                        )
                        .toList();


        List<CategoryResponse> categories =
                categoryRepository
                        .findAll(
                                Sort.by(
                                        Sort.Direction.ASC,
                                        "name"
                                )
                        )
                        .stream()
                        .map(
                                catalogMapper
                                        ::toCategoryResponse
                        )
                        .toList();


        List<String> cities =
                storeRepository
                        .findDistinctCitiesByStatus(
                                StoreStatus.ACTIVE
                        );


        return new PublicSearchFiltersResponse(
                brands,
                categories,
                cities,
                Arrays.asList(
                        StockStatus.values()
                )
        );
    }


    private void validateLocation(
            Double latitude,
            Double longitude,
            Double radiusKm,
            String sort
    ) {

        boolean hasLatitude =
                latitude != null;

        boolean hasLongitude =
                longitude != null;


        if (
                hasLatitude !=
                        hasLongitude
        ) {

            throw new InvalidLocationException(
                    "Both latitude and longitude are required."
            );
        }


        if (hasLatitude) {

            if (
                    !Double.isFinite(latitude) ||
                            latitude < -90.0 ||
                            latitude > 90.0
            ) {

                throw new InvalidLocationException(
                        "Latitude must be between -90 and 90."
                );
            }


            if (
                    !Double.isFinite(longitude) ||
                            longitude < -180.0 ||
                            longitude > 180.0
            ) {

                throw new InvalidLocationException(
                        "Longitude must be between -180 and 180."
                );
            }
        }


        if (radiusKm != null) {

            if (!hasLatitude) {

                throw new InvalidLocationException(
                        "Location is required when using a radius filter."
                );
            }


            if (
                    !Double.isFinite(radiusKm) ||
                            radiusKm <= 0.0 ||
                            radiusKm > 100.0
            ) {

                throw new InvalidLocationException(
                        "Radius must be greater than 0 and at most 100 km."
                );
            }
        }


        if (
                sort != null &&
                        sort.equalsIgnoreCase(
                                "distanceAsc"
                        ) &&
                        !hasLatitude
        ) {

            throw new InvalidLocationException(
                    "Location is required when sorting by distance."
            );
        }
    }
}