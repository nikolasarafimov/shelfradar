package com.shelfradar.backend.controller;

import com.shelfradar.backend.dto.catalog.PageResponse;
import com.shelfradar.backend.dto.catalog.ProductRequest;
import com.shelfradar.backend.dto.catalog.ProductResponse;
import com.shelfradar.backend.service.ProductService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(
        "/api/admin/catalog/products"
)
@Validated
public class AdminProductController {

    private final ProductService productService;

    public AdminProductController(
            ProductService productService
    ) {
        this.productService =
                productService;
    }

    @GetMapping
    public PageResponse<ProductResponse> getAll(

            @RequestParam(
                    required = false
            )
            String q,

            @RequestParam(
                    defaultValue = "0"
            )
            @Min(0)
            int page,

            @RequestParam(
                    defaultValue = "20"
            )
            @Min(1)
            @Max(100)
            int size,

            @RequestParam(
                    defaultValue = "nameAsc"
            )
            String sort
    ) {

        return productService.getAll(
                q,
                page,
                size,
                sort
        );
    }

    @GetMapping("/{id}")
    public ProductResponse getById(
            @PathVariable
            Long id
    ) {

        return productService.getById(
                id
        );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse create(
            @Valid
            @RequestBody
            ProductRequest request
    ) {

        return productService.create(
                request
        );
    }

    @PutMapping("/{id}")
    public ProductResponse update(
            @PathVariable
            Long id,

            @Valid
            @RequestBody
            ProductRequest request
    ) {

        return productService.update(
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

        productService.delete(
                id
        );
    }
}