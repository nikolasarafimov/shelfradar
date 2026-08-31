package com.shelfradar.backend.dto.admin;

import com.shelfradar.backend.entity.enums.StoreStatus;
import jakarta.validation.constraints.NotNull;

public record AdminStoreStatusRequest(

        @NotNull
        StoreStatus status

) {
}