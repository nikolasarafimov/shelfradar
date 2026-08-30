import {
    apiClient,
} from './client'

import type {
    Brand,
    CatalogNameRequest,
    Category,
    PageResponse,
    Product,
    ProductRequest,
} from '../types/catalog'


// ========================================================
// BRANDS
// ========================================================

export async function getBrands():
    Promise<Brand[]> {

    const response =
        await apiClient.get<Brand[]>(
            '/admin/catalog/brands',
        )

    return response.data
}

export async function createBrand(
    request: CatalogNameRequest,
): Promise<Brand> {

    const response =
        await apiClient.post<Brand>(
            '/admin/catalog/brands',
            request,
        )

    return response.data
}

export async function updateBrand(
    id: number,
    request: CatalogNameRequest,
): Promise<Brand> {

    const response =
        await apiClient.put<Brand>(
            `/admin/catalog/brands/${id}`,
            request,
        )

    return response.data
}

export async function deleteBrand(
    id: number,
): Promise<void> {

    await apiClient.delete(
        `/admin/catalog/brands/${id}`,
    )
}


// ========================================================
// CATEGORIES
// ========================================================

export async function getCategories():
    Promise<Category[]> {

    const response =
        await apiClient.get<Category[]>(
            '/admin/catalog/categories',
        )

    return response.data
}

export async function createCategory(
    request: CatalogNameRequest,
): Promise<Category> {

    const response =
        await apiClient.post<Category>(
            '/admin/catalog/categories',
            request,
        )

    return response.data
}

export async function updateCategory(
    id: number,
    request: CatalogNameRequest,
): Promise<Category> {

    const response =
        await apiClient.put<Category>(
            `/admin/catalog/categories/${id}`,
            request,
        )

    return response.data
}

export async function deleteCategory(
    id: number,
): Promise<void> {

    await apiClient.delete(
        `/admin/catalog/categories/${id}`,
    )
}


// ========================================================
// PRODUCTS
// ========================================================

interface ProductQuery {
    q?: string
    page?: number
    size?: number
    sort?: string
}

export async function getProducts(
    query: ProductQuery = {},
): Promise<PageResponse<Product>> {

    const response =
        await apiClient.get<
            PageResponse<Product>
        >(
            '/admin/catalog/products',
            {
                params: {
                    q: query.q || undefined,
                    page: query.page ?? 0,
                    size: query.size ?? 20,
                    sort:
                        query.sort ??
                        'nameAsc',
                },
            },
        )

    return response.data
}

export async function createProduct(
    request: ProductRequest,
): Promise<Product> {

    const response =
        await apiClient.post<Product>(
            '/admin/catalog/products',
            request,
        )

    return response.data
}

export async function updateProduct(
    id: number,
    request: ProductRequest,
): Promise<Product> {

    const response =
        await apiClient.put<Product>(
            `/admin/catalog/products/${id}`,
            request,
        )

    return response.data
}

export async function deleteProduct(
    id: number,
): Promise<void> {

    await apiClient.delete(
        `/admin/catalog/products/${id}`,
    )
}