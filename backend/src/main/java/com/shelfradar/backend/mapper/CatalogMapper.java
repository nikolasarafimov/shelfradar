package com.shelfradar.backend.mapper;

import com.shelfradar.backend.dto.catalog.BrandResponse;
import com.shelfradar.backend.dto.catalog.CategoryResponse;
import com.shelfradar.backend.dto.catalog.ProductResponse;
import com.shelfradar.backend.entity.Brand;
import com.shelfradar.backend.entity.Category;
import com.shelfradar.backend.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class CatalogMapper {

    public BrandResponse toBrandResponse(
            Brand brand
    ) {
        return new BrandResponse(
                brand.getId(),
                brand.getName()
        );
    }

    public CategoryResponse toCategoryResponse(
            Category category
    ) {
        return new CategoryResponse(
                category.getId(),
                category.getName()
        );
    }

    public ProductResponse toProductResponse(
            Product product
    ) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getImageUrl(),
                toBrandResponse(
                        product.getBrand()
                ),
                toCategoryResponse(
                        product.getCategory()
                ),
                product.getCreatedAt()
        );
    }
}