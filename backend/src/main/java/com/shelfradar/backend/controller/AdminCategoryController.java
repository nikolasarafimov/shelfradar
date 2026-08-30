package com.shelfradar.backend.controller;

import com.shelfradar.backend.dto.catalog.CatalogNameRequest;
import com.shelfradar.backend.dto.catalog.CategoryResponse;
import com.shelfradar.backend.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(
        "/api/admin/catalog/categories"
)
public class AdminCategoryController {

    private final CategoryService categoryService;

    public AdminCategoryController(
            CategoryService categoryService
    ) {
        this.categoryService =
                categoryService;
    }

    @GetMapping
    public List<CategoryResponse> getAll() {

        return categoryService.getAll();
    }

    @GetMapping("/{id}")
    public CategoryResponse getById(
            @PathVariable
            Long id
    ) {

        return categoryService.getById(
                id
        );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse create(
            @Valid
            @RequestBody
            CatalogNameRequest request
    ) {

        return categoryService.create(
                request
        );
    }

    @PutMapping("/{id}")
    public CategoryResponse update(
            @PathVariable
            Long id,

            @Valid
            @RequestBody
            CatalogNameRequest request
    ) {

        return categoryService.update(
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

        categoryService.delete(id);
    }
}