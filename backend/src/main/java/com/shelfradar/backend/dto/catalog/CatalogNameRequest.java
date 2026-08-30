package com.shelfradar.backend.dto.catalog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CatalogNameRequest(

        @NotBlank(
                message = "Name is required."
        )
        @Size(
                max = 120,
                message = "Name cannot exceed 120 characters."
        )
        String name

) {
}