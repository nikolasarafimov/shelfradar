package com.shelfradar.backend.dto.store;

import com.shelfradar.backend.entity.enums.StockStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record InventoryCreateRequest(

        @NotNull
        Long productId,

        @NotNull
        @DecimalMin(
                value = "0.00",
                inclusive = true
        )
        BigDecimal price,

        @NotNull
        @Min(0)
        Integer quantity,

        @NotNull
        StockStatus status

) {
}