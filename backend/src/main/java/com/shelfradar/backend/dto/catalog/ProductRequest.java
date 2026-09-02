package com.shelfradar.backend.dto.catalog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record ProductRequest(

        @NotBlank(
                message = "Product name is required."
        )
        @Size(
                max = 200,
                message = "Product name cannot exceed 200 characters."
        )
        String name,

        @Size(
                max = 5000,
                message = "Description cannot exceed 5000 characters."
        )
        String description,

        @Size(
                max = 1000,
                message = "Image URL cannot exceed 1000 characters."
        )
        String imageUrl,

        @NotNull(
                message = "Brand is required."
        )
        @Positive(
                message = "Brand ID must be positive."
        )
        Long brandId,

        @NotNull(
                message = "Category is required."
        )
        @Positive(
                message = "Category ID must be positive."
        )
        Long categoryId
) {
}