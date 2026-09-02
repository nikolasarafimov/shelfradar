import {
    apiClient,
} from './client'

import type {
    PublicSearchFilters,
    PublicSearchPage,
    PublicSearchParams,
} from '../types/publicSearch'

export async function searchPublicProducts(
    params: PublicSearchParams,
): Promise<PublicSearchPage> {

    const normalizedQuery =
        params.q?.trim()

    const normalizedCity =
        params.city?.trim()

    const response =
        await apiClient.get<
            PublicSearchPage
        >(
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
        await apiClient.get<
            PublicSearchFilters
        >(
            '/public/filters',
        )
    return response.data
}