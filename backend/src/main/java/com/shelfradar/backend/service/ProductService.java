package com.shelfradar.backend.service;

import com.shelfradar.backend.dto.catalog.PageResponse;
import com.shelfradar.backend.dto.catalog.ProductRequest;
import com.shelfradar.backend.dto.catalog.ProductResponse;
import com.shelfradar.backend.entity.Brand;
import com.shelfradar.backend.entity.Category;
import com.shelfradar.backend.entity.Product;
import com.shelfradar.backend.exception.DuplicateResourceException;
import com.shelfradar.backend.exception.ResourceNotFoundException;
import com.shelfradar.backend.mapper.CatalogMapper;
import com.shelfradar.backend.repository.BrandRepository;
import com.shelfradar.backend.repository.CategoryRepository;
import com.shelfradar.backend.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final CatalogMapper catalogMapper;

    public ProductService(
            ProductRepository productRepository,
            BrandRepository brandRepository,
            CategoryRepository categoryRepository,
            CatalogMapper catalogMapper
    ) {
        this.productRepository =
                productRepository;

        this.brandRepository =
                brandRepository;

        this.categoryRepository =
                categoryRepository;

        this.catalogMapper =
                catalogMapper;
    }

    public PageResponse<ProductResponse> getAll(
            String query,
            int page,
            int size,
            String sort
    ) {

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        resolveSort(
                                sort
                        )
                );

        Page<Product> products;

        if (
                query == null ||
                        query.isBlank()
        ) {

            products =
                    productRepository
                            .findAll(
                                    pageable
                            );

        } else {

            products =
                    productRepository
                            .findByNameContainingIgnoreCase(
                                    query.trim(),
                                    pageable
                            );
        }

        return PageResponse.from(
                products.map(
                        catalogMapper
                                ::toProductResponse
                )
        );
    }

    public ProductResponse getById(
            Long id
    ) {

        return catalogMapper.toProductResponse(
                findEntity(
                        id
                )
        );
    }

    @Transactional
    public ProductResponse create(
            ProductRequest request
    ) {

        String name =
                normalizeName(
                        request.name()
                );

        Brand brand =
                findBrand(
                        request.brandId()
                );

        Category category =
                findCategory(
                        request.categoryId()
                );

        if (
                productRepository
                        .existsByNameIgnoreCaseAndBrand_IdAndCategory_Id(
                                name,
                                brand.getId(),
                                category.getId()
                        )
        ) {

            throw new DuplicateResourceException(
                    "This product already exists for the selected brand and category."
            );
        }

        Product product =
                new Product();

        product.setName(
                name
        );

        product.setDescription(
                normalizeOptional(
                        request.description()
                )
        );

        product.setImageUrl(
                normalizeOptional(
                        request.imageUrl()
                )
        );

        product.setBrand(
                brand
        );

        product.setCategory(
                category
        );

        Product saved =
                productRepository.save(
                        product
                );

        return catalogMapper.toProductResponse(
                saved
        );
    }

    @Transactional
    public ProductResponse update(
            Long id,
            ProductRequest request
    ) {

        Product product =
                findEntity(
                        id
                );

        String name =
                normalizeName(
                        request.name()
                );

        Brand brand =
                findBrand(
                        request.brandId()
                );

        Category category =
                findCategory(
                        request.categoryId()
                );

        if (
                productRepository
                        .existsByNameIgnoreCaseAndBrand_IdAndCategory_IdAndIdNot(
                                name,
                                brand.getId(),
                                category.getId(),
                                id
                        )
        ) {

            throw new DuplicateResourceException(
                    "This product already exists for the selected brand and category."
            );
        }

        product.setName(
                name
        );

        product.setDescription(
                normalizeOptional(
                        request.description()
                )
        );

        product.setImageUrl(
                normalizeOptional(
                        request.imageUrl()
                )
        );

        product.setBrand(
                brand
        );

        product.setCategory(
                category
        );

        return catalogMapper.toProductResponse(
                product
        );
    }

    @Transactional
    public void delete(
            Long id
    ) {

        Product product =
                findEntity(
                        id
                );

        productRepository.delete(
                product
        );
    }

    private Product findEntity(
            Long id
    ) {

        return productRepository
                .findById(
                        id
                )
                .orElseThrow(
                        () ->
                                new ResourceNotFoundException(
                                        "Product not found."
                                )
                );
    }

    private Brand findBrand(
            Long id
    ) {

        return brandRepository
                .findById(
                        id
                )
                .orElseThrow(
                        () ->
                                new ResourceNotFoundException(
                                        "Brand not found."
                                )
                );
    }

    private Category findCategory(
            Long id
    ) {

        return categoryRepository
                .findById(
                        id
                )
                .orElseThrow(
                        () ->
                                new ResourceNotFoundException(
                                        "Category not found."
                                )
                );
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
                            "name"
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
                                    "name"
                            ),
                            Sort.Order.asc(
                                    "id"
                            )
                    );

            case "namedesc" ->
                    Sort.by(
                            Sort.Order.desc(
                                    "name"
                            ),
                            Sort.Order.asc(
                                    "id"
                            )
                    );

            case "newest" ->
                    Sort.by(
                            Sort.Order.desc(
                                    "createdAt"
                            ),
                            Sort.Order.desc(
                                    "id"
                            )
                    );

            case "oldest" ->
                    Sort.by(
                            Sort.Order.asc(
                                    "createdAt"
                            ),
                            Sort.Order.asc(
                                    "id"
                            )
                    );

            default ->
                    Sort.by(
                            Sort.Order.asc(
                                    "name"
                            ),
                            Sort.Order.asc(
                                    "id"
                            )
                    );
        };
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

    private String normalizeOptional(
            String value
    ) {

        if (value == null) {
            return null;
        }

        String trimmed =
                value.trim();

        return trimmed.isEmpty()
                ? null
                : trimmed;
    }
}