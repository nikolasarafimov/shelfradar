import {
    apiClient,
} from './client'

import type {
    PublicProductDetail,
    PublicStoreDetail,
} from '../types/publicSearch'


export async function getPublicProduct(
    productId: number,
): Promise<PublicProductDetail> {

    const response =
        await apiClient.get<
            PublicProductDetail
        >(
            `/public/products/${productId}`,
        )

    return response.data
}


export async function getPublicStore(
    storeId: number,
): Promise<PublicStoreDetail> {

    const response =
        await apiClient.get<
            PublicStoreDetail
        >(
            `/public/stores/${storeId}`,
        )

    return response.data
}