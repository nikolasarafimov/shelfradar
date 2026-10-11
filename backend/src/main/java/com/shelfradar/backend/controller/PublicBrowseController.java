package com.shelfradar.backend.controller;

import com.shelfradar.backend.dto.publicsearch.PublicProductDetailResponse;
import com.shelfradar.backend.dto.publicsearch.PublicStoreDetailResponse;
import com.shelfradar.backend.service.PublicBrowseService;
import jakarta.validation.constraints.Positive;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
@Validated
public class PublicBrowseController {

    private final PublicBrowseService publicBrowseService;

    public PublicBrowseController(
            PublicBrowseService publicBrowseService
    ) {
        this.publicBrowseService = publicBrowseService;
    }

    @GetMapping("/products/{productId}")
    public PublicProductDetailResponse getProduct(
            @PathVariable
            @Positive
            Long productId
    ) {
        return publicBrowseService.getProduct(productId);
    }

    @GetMapping("/stores/{storeId}")
    public PublicStoreDetailResponse getStore(
            @PathVariable
            @Positive
            Long storeId
    ) {
        return publicBrowseService.getStore(storeId);
    }
}