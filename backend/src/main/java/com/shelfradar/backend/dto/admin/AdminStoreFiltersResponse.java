package com.shelfradar.backend.dto.admin;

import com.shelfradar.backend.entity.enums.StoreStatus;

import java.util.List;

public record AdminStoreFiltersResponse(
        List<String> cities,
        List<StoreStatus> statuses
) {
}