package com.shelfradar.backend.controller;

import com.shelfradar.backend.dto.catalog.PageResponse;
import com.shelfradar.backend.dto.store.InventoryCreateRequest;
import com.shelfradar.backend.dto.store.InventoryResponse;
import com.shelfradar.backend.dto.store.InventoryUpdateRequest;
import com.shelfradar.backend.dto.store.StoreResponse;
import com.shelfradar.backend.dto.store.StoreUpdateRequest;
import com.shelfradar.backend.service.InventoryService;
import com.shelfradar.backend.service.StoreService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/store/stores")
@Validated
public class StoreOwnerController {

    private final StoreService storeService;
    private final InventoryService inventoryService;

    public StoreOwnerController(
            StoreService storeService,
            InventoryService inventoryService
    ) {
        this.storeService = storeService;
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public List<StoreResponse> getMyStores(
            Authentication authentication
    ) {
        return storeService.getOwnedStores(
                authentication.getName()
        );
    }

    @GetMapping("/{storeId}")
    public StoreResponse getStore(
            Authentication authentication,

            @PathVariable
            @Positive
            Long storeId
    ) {
        return storeService.getOwnedStore(
                authentication.getName(),
                storeId
        );
    }

    @PutMapping("/{storeId}")
    public StoreResponse updateStore(
            Authentication authentication,

            @PathVariable
            @Positive
            Long storeId,

            @Valid
            @RequestBody
            StoreUpdateRequest request
    ) {
        return storeService.updateOwnedStore(
                authentication.getName(),
                storeId,
                request
        );
    }

    @GetMapping("/{storeId}/inventory")
    public PageResponse<InventoryResponse> getInventory(
            Authentication authentication,

            @PathVariable
            @Positive
            Long storeId,

            @RequestParam(required = false)
            String q,

            @RequestParam(defaultValue = "0")
            @Min(0)
            int page,

            @RequestParam(defaultValue = "20")
            @Min(1)
            @Max(100)
            int size,

            @RequestParam(defaultValue = "nameAsc")
            String sort
    ) {
        return inventoryService.getInventory(
                authentication.getName(),
                storeId,
                q,
                page,
                size,
                sort
        );
    }

    @PostMapping("/{storeId}/inventory")
    @ResponseStatus(HttpStatus.CREATED)
    public InventoryResponse createInventory(
            Authentication authentication,

            @PathVariable
            @Positive
            Long storeId,

            @Valid
            @RequestBody
            InventoryCreateRequest request
    ) {
        return inventoryService.create(
                authentication.getName(),
                storeId,
                request
        );
    }

    @PutMapping("/{storeId}/inventory/{inventoryId}")
    public InventoryResponse updateInventory(
            Authentication authentication,

            @PathVariable
            @Positive
            Long storeId,

            @PathVariable
            @Positive
            Long inventoryId,

            @Valid
            @RequestBody
            InventoryUpdateRequest request
    ) {
        return inventoryService.update(
                authentication.getName(),
                storeId,
                inventoryId,
                request
        );
    }

    @DeleteMapping("/{storeId}/inventory/{inventoryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInventory(
            Authentication authentication,

            @PathVariable
            @Positive
            Long storeId,

            @PathVariable
            @Positive
            Long inventoryId
    ) {
        inventoryService.delete(
                authentication.getName(),
                storeId,
                inventoryId
        );
    }
}