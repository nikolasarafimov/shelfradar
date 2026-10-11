package com.shelfradar.backend.controller;

import com.shelfradar.backend.dto.catalog.BrandResponse;
import com.shelfradar.backend.dto.catalog.CatalogNameRequest;
import com.shelfradar.backend.service.BrandService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/catalog/brands")
@Validated
public class AdminBrandController {

    private final BrandService brandService;

    public AdminBrandController(
            BrandService brandService
    ) {
        this.brandService = brandService;
    }

    @GetMapping
    public List<BrandResponse> getAll() {
        return brandService.getAll();
    }

    @GetMapping("/{id}")
    public BrandResponse getById(
            @PathVariable
            @Positive
            Long id
    ) {
        return brandService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BrandResponse create(
            @Valid
            @RequestBody
            CatalogNameRequest request
    ) {
        return brandService.create(request);
    }

    @PutMapping("/{id}")
    public BrandResponse update(
            @PathVariable
            @Positive
            Long id,

            @Valid
            @RequestBody
            CatalogNameRequest request
    ) {
        return brandService.update(
                id,
                request
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable
            @Positive
            Long id
    ) {
        brandService.delete(id);
    }
}