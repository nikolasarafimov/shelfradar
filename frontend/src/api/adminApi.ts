import { apiClient } from './client'

import type {
    AdminDashboard,
    AdminOwner,
    AdminStoreDetail,
    AdminStoreFilters,
    AdminStorePage,
    AdminStoreSearchParams,
    AdminStoreUpdate,
} from '../types/admin'

import type {
    AdminAnalytics,
    AuditLogPage,
    AuditSearchParams,
} from '../types/audit'

import type {
    Brand,
    CatalogNameRequest,
    Category,
    PageResponse,
    Product,
    ProductRequest,
} from '../types/catalog'

import type {
    StoreStatus,
} from '../types/store'

type ProductQuery = {
    q?: string
    page?: number
    size?: number
    sort?: string
}

export async function getAdminDashboard():
    Promise<AdminDashboard> {
    const response =
        await apiClient.get<AdminDashboard>(
            '/admin/dashboard',
        )

    return response.data
}

export async function getAdminStores(
    params: AdminStoreSearchParams,
): Promise<AdminStorePage> {
    const normalizedQuery =
        params.q?.trim()

    const normalizedCity =
        params.city?.trim()

    const response =
        await apiClient.get<AdminStorePage>(
            '/admin/stores',
            {
                params: {
                    q:
                        normalizedQuery ||
                        undefined,

                    status:
                    params.status,

                    city:
                        normalizedCity ||
                        undefined,

                    page:
                        params.page ??
                        0,

                    size:
                        params.size ??
                        20,

                    sort:
                        params.sort ??
                        'newest',
                },
            },
        )

    return response.data
}

export async function getAdminStoreFilters():
    Promise<AdminStoreFilters> {
    const response =
        await apiClient.get<AdminStoreFilters>(
            '/admin/stores/filters',
        )

    return response.data
}

export async function getAdminStore(
    storeId: number,
): Promise<AdminStoreDetail> {
    const response =
        await apiClient.get<AdminStoreDetail>(
            `/admin/stores/${storeId}`,
        )

    return response.data
}

export async function updateAdminStoreStatus(
    storeId: number,
    status: StoreStatus,
): Promise<AdminStoreDetail> {
    const response =
        await apiClient.patch<AdminStoreDetail>(
            `/admin/stores/${storeId}/status`,
            {
                status,
            },
        )

    return response.data
}

export async function updateAdminStore(
    storeId: number,
    request: AdminStoreUpdate,
): Promise<AdminStoreDetail> {
    const response =
        await apiClient.put<AdminStoreDetail>(
            `/admin/stores/${storeId}`,
            request,
        )

    return response.data
}

export async function getAdminStoreOwners():
    Promise<AdminOwner[]> {
    const response =
        await apiClient.get<AdminOwner[]>(
            '/admin/store-owners',
        )

    return response.data
}

export async function getAdminAnalytics():
    Promise<AdminAnalytics> {
    const response =
        await apiClient.get<AdminAnalytics>(
            '/admin/analytics',
        )

    return response.data
}

export async function getAdminAudit(
    params: AuditSearchParams,
): Promise<AuditLogPage> {
    const normalizedQuery =
        params.q?.trim()

    const response =
        await apiClient.get<AuditLogPage>(
            '/admin/audit',
            {
                params: {
                    q:
                        normalizedQuery ||
                        undefined,

                    action:
                    params.action,

                    entityType:
                    params.entityType,

                    storeId:
                    params.storeId,

                    page:
                        params.page ??
                        0,

                    size:
                        params.size ??
                        20,
                },
            },
        )

    return response.data
}

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

export async function getProducts(
    query: ProductQuery = {},
): Promise<PageResponse<Product>> {
    const normalizedQuery =
        query.q?.trim()

    const response =
        await apiClient.get<
            PageResponse<Product>
        >(
            '/admin/catalog/products',
            {
                params: {
                    q:
                        normalizedQuery ||
                        undefined,

                    page:
                        query.page ??
                        0,

                    size:
                        query.size ??
                        20,

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