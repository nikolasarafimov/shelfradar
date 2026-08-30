package com.shelfradar.backend.controller;

import com.shelfradar.backend.dto.catalog.PageResponse;
import com.shelfradar.backend.dto.catalog.ProductResponse;
import com.shelfradar.backend.service.ProductService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(
        "/api/store/catalog/products"
)
@Validated
public class StoreCatalogController {

    private final ProductService productService;

    public StoreCatalogController(
            ProductService productService
    ) {
        this.productService =
                productService;
    }

    @GetMapping
    public PageResponse<ProductResponse> getProducts(

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
                    defaultValue = "50"
            )
            @Min(1)
            @Max(100)
            int size
    ) {

        return productService.getAll(
                q,
                page,
                size,
                "nameAsc"
        );
    }
}