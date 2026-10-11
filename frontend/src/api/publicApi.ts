import {
    apiClient,
} from './client'

import type {
    HealthResponse,
    PublicProductDetail,
    PublicSearchFilters,
    PublicSearchPage,
    PublicSearchParams,
    PublicStoreDetail,
} from '../types/public'

export async function getHealth(): Promise<HealthResponse> {
    const response =
        await apiClient.get<HealthResponse>(
            '/health',
        )

    return response.data
}

export async function searchPublicProducts(
    params: PublicSearchParams,
): Promise<PublicSearchPage> {
    const normalizedQuery =
        params.q?.trim()

    const normalizedCity =
        params.city?.trim()

    const response =
        await apiClient.get<PublicSearchPage>(
            '/public/search',
            {
                params: {
                    q:
                        normalizedQuery ||
                        undefined,

                    brandId:
                    params.brandId,

                    categoryId:
                    params.categoryId,

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
                        12,

                    sort:
                        params.sort ??
                        'priceAsc',

                    latitude:
                    params.latitude,

                    longitude:
                    params.longitude,

                    radiusKm:
                    params.radiusKm,
                },
            },
        )

    return response.data
}

export async function getPublicSearchFilters():
    Promise<PublicSearchFilters> {
    const response =
        await apiClient.get<PublicSearchFilters>(
            '/public/filters',
        )

    return response.data
}

export async function getPublicProduct(
    productId: number,
): Promise<PublicProductDetail> {
    const response =
        await apiClient.get<PublicProductDetail>(
            `/public/products/${productId}`,
        )

    return response.data
}

export async function getPublicStore(
    storeId: number,
): Promise<PublicStoreDetail> {
    const response =
        await apiClient.get<PublicStoreDetail>(
            `/public/stores/${storeId}`,
        )

    return response.data
}