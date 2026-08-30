package com.shelfradar.backend.service;

import com.shelfradar.backend.dto.catalog.BrandResponse;
import com.shelfradar.backend.dto.catalog.CatalogNameRequest;
import com.shelfradar.backend.entity.Brand;
import com.shelfradar.backend.exception.DuplicateResourceException;
import com.shelfradar.backend.exception.ResourceInUseException;
import com.shelfradar.backend.exception.ResourceNotFoundException;
import com.shelfradar.backend.mapper.CatalogMapper;
import com.shelfradar.backend.repository.BrandRepository;
import com.shelfradar.backend.repository.ProductRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class BrandService {

    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;
    private final CatalogMapper catalogMapper;

    public BrandService(
            BrandRepository brandRepository,
            ProductRepository productRepository,
            CatalogMapper catalogMapper
    ) {
        this.brandRepository = brandRepository;
        this.productRepository = productRepository;
        this.catalogMapper = catalogMapper;
    }

    public List<BrandResponse> getAll() {

        return brandRepository
                .findAll(
                        Sort.by(
                                Sort.Direction.ASC,
                                "name"
                        )
                )
                .stream()
                .map(
                        catalogMapper::toBrandResponse
                )
                .toList();
    }

    public BrandResponse getById(
            Long id
    ) {

        return catalogMapper.toBrandResponse(
                findEntity(id)
        );
    }

    @Transactional
    public BrandResponse create(
            CatalogNameRequest request
    ) {

        String name =
                normalizeName(
                        request.name()
                );

        if (
                brandRepository
                        .existsByNameIgnoreCase(name)
        ) {

            throw new DuplicateResourceException(
                    "A brand with this name already exists."
            );
        }

        Brand brand =
                new Brand();

        brand.setName(name);

        return catalogMapper.toBrandResponse(
                brandRepository.save(brand)
        );
    }

    @Transactional
    public BrandResponse update(
            Long id,
            CatalogNameRequest request
    ) {

        Brand brand =
                findEntity(id);

        String name =
                normalizeName(
                        request.name()
                );

        brandRepository
                .findByNameIgnoreCase(name)
                .filter(
                        existing ->
                                !existing
                                        .getId()
                                        .equals(id)
                )
                .ifPresent(
                        existing -> {
                            throw new DuplicateResourceException(
                                    "A brand with this name already exists."
                            );
                        }
                );

        brand.setName(name);

        return catalogMapper.toBrandResponse(
                brand
        );
    }

    @Transactional
    public void delete(
            Long id
    ) {

        Brand brand =
                findEntity(id);

        if (
                productRepository
                        .existsByBrand_Id(id)
        ) {

            throw new ResourceInUseException(
                    "This brand cannot be deleted because products still use it."
            );
        }

        brandRepository.delete(brand);
    }

    private Brand findEntity(
            Long id
    ) {

        return brandRepository
                .findById(id)
                .orElseThrow(
                        () ->
                                new ResourceNotFoundException(
                                        "Brand not found."
                                )
                );
    }

    private String normalizeName(
            String value
    ) {

        return value
                .trim()
                .replaceAll(
                        "\\s+",
                        " "
                );
    }
}