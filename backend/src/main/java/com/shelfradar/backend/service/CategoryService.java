package com.shelfradar.backend.service;

import com.shelfradar.backend.dto.catalog.CatalogNameRequest;
import com.shelfradar.backend.dto.catalog.CategoryResponse;
import com.shelfradar.backend.entity.Category;
import com.shelfradar.backend.exception.DuplicateResourceException;
import com.shelfradar.backend.exception.ResourceInUseException;
import com.shelfradar.backend.exception.ResourceNotFoundException;
import com.shelfradar.backend.mapper.CatalogMapper;
import com.shelfradar.backend.repository.CategoryRepository;
import com.shelfradar.backend.repository.ProductRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CatalogMapper catalogMapper;

    public CategoryService(
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            CatalogMapper catalogMapper
    ) {
        this.categoryRepository =
                categoryRepository;

        this.productRepository =
                productRepository;

        this.catalogMapper =
                catalogMapper;
    }

    public List<CategoryResponse> getAll() {

        return categoryRepository
                .findAll(
                        Sort.by(
                                Sort.Direction.ASC,
                                "name"
                        )
                )
                .stream()
                .map(
                        catalogMapper::toCategoryResponse
                )
                .toList();
    }

    public CategoryResponse getById(
            Long id
    ) {

        return catalogMapper.toCategoryResponse(
                findEntity(id)
        );
    }

    @Transactional
    public CategoryResponse create(
            CatalogNameRequest request
    ) {

        String name =
                normalizeName(
                        request.name()
                );

        if (
                categoryRepository
                        .existsByNameIgnoreCase(name)
        ) {

            throw new DuplicateResourceException(
                    "A category with this name already exists."
            );
        }

        Category category =
                new Category();

        category.setName(name);

        return catalogMapper.toCategoryResponse(
                categoryRepository.save(
                        category
                )
        );
    }

    @Transactional
    public CategoryResponse update(
            Long id,
            CatalogNameRequest request
    ) {

        Category category =
                findEntity(id);

        String name =
                normalizeName(
                        request.name()
                );

        categoryRepository
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
                                    "A category with this name already exists."
                            );
                        }
                );

        category.setName(name);

        return catalogMapper.toCategoryResponse(
                category
        );
    }

    @Transactional
    public void delete(
            Long id
    ) {

        Category category =
                findEntity(id);

        if (
                productRepository
                        .existsByCategory_Id(id)
        ) {

            throw new ResourceInUseException(
                    "This category cannot be deleted because products still use it."
            );
        }

        categoryRepository.delete(
                category
        );
    }

    private Category findEntity(
            Long id
    ) {

        return categoryRepository
                .findById(id)
                .orElseThrow(
                        () ->
                                new ResourceNotFoundException(
                                        "Category not found."
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