package com.shelfradar.backend.service;

import com.shelfradar.backend.dto.catalog.BrandResponse;
import com.shelfradar.backend.dto.catalog.CategoryResponse;
import com.shelfradar.backend.dto.catalog.PageResponse;
import com.shelfradar.backend.dto.publicsearch.PublicSearchFiltersResponse;
import com.shelfradar.backend.dto.publicsearch.PublicSearchResultResponse;
import com.shelfradar.backend.entity.enums.StockStatus;
import com.shelfradar.backend.entity.enums.StoreStatus;
import com.shelfradar.backend.mapper.CatalogMapper;
import com.shelfradar.backend.mapper.PublicSearchMapper;
import com.shelfradar.backend.repository.BrandRepository;
import com.shelfradar.backend.repository.CategoryRepository;
import com.shelfradar.backend.repository.PublicSearchRepository;
import com.shelfradar.backend.repository.StoreRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class PublicSearchService {

    private final PublicSearchRepository
            publicSearchRepository;

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
            BrandRepository brandRepository,
            CategoryRepository categoryRepository,
            StoreRepository storeRepository,
            PublicSearchMapper publicSearchMapper,
            CatalogMapper catalogMapper
    ) {
        this.publicSearchRepository =
                publicSearchRepository;

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
            String sort
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
}