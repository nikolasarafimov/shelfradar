package com.shelfradar.backend.controller;

import com.shelfradar.backend.dto.catalog.BrandResponse;
import com.shelfradar.backend.dto.catalog.CatalogNameRequest;
import com.shelfradar.backend.service.BrandService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(
        "/api/admin/catalog/brands"
)
public class AdminBrandController {

    private final BrandService brandService;

    public AdminBrandController(
            BrandService brandService
    ) {
        this.brandService =
                brandService;
    }

    @GetMapping
    public List<BrandResponse> getAll() {

        return brandService.getAll();
    }

    @GetMapping("/{id}")
    public BrandResponse getById(
            @PathVariable
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

        return brandService.create(
                request
        );
    }

    @PutMapping("/{id}")
    public BrandResponse update(
            @PathVariable
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
    @ResponseStatus(
            HttpStatus.NO_CONTENT
    )
    public void delete(
            @PathVariable
            Long id
    ) {

        brandService.delete(id);
    }
}