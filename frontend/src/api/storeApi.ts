import {
    apiClient,
} from './client'

import type {
    PageResponse,
    Product,
} from '../types/catalog'

import type {
    InventoryCreateRequest,
    InventoryItem,
    InventoryUpdateRequest,
    OwnerDashboard,
    Store,
    StoreDashboard,
    StoreUpdateRequest,
} from '../types/store'


type InventoryQuery = {
    q?: string
    page?: number
    size?: number
    sort?: string
}

export async function getMyStores():
    Promise<Store[]> {

    const response =
        await apiClient.get<
            Store[]
        >(
            '/store/stores',
        )
    return response.data
}

export async function getStore(
    storeId: number,
): Promise<Store> {

    const response =
        await apiClient.get<
            Store
        >(
            `/store/stores/${storeId}`,
        )
    return response.data
}

export async function updateStore(
    storeId: number,
    request: StoreUpdateRequest,
): Promise<Store> {

    const response =
        await apiClient.put<
            Store
        >(
            `/store/stores/${storeId}`,
            request,
        )
    return response.data
}

export async function getInventory(
    storeId: number,
    query: InventoryQuery = {},
): Promise<PageResponse<InventoryItem>> {

    const normalizedQuery =
        query.q?.trim()

    const response =
        await apiClient.get<
            PageResponse<InventoryItem>
        >(
            `/store/stores/${storeId}/inventory`,
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

export async function createInventoryItem(
    storeId: number,
    request: InventoryCreateRequest,
): Promise<InventoryItem> {

    const response =
        await apiClient.post<
            InventoryItem
        >(
            `/store/stores/${storeId}/inventory`,
            request,
        )
    return response.data
}

export async function updateInventoryItem(
    storeId: number,
    inventoryId: number,
    request: InventoryUpdateRequest,
): Promise<InventoryItem> {

    const response =
        await apiClient.put<
            InventoryItem
        >(
            `/store/stores/${storeId}/inventory/${inventoryId}`,
            request,
        )
    return response.data
}

export async function deleteInventoryItem(
    storeId: number,
    inventoryId: number,
): Promise<void> {

    await apiClient.delete(
        `/store/stores/${storeId}/inventory/${inventoryId}`,
    )
}

export async function getStoreCatalogProducts(
    q = '',
): Promise<PageResponse<Product>> {

    const normalizedQuery =
        q.trim()

    const response =
        await apiClient.get<
            PageResponse<Product>
        >(
            '/store/catalog/products',
            {
                params: {
                    q:
                        normalizedQuery ||
                        undefined,

                    page:
                        0,

                    size:
                        100,
                },
            },
        )
    return response.data
}

export async function getOwnerDashboard():
    Promise<OwnerDashboard> {

    const response =
        await apiClient.get<
            OwnerDashboard
        >(
            '/store/dashboard',
        )
    return response.data
}

export async function getStoreDashboard(
    storeId: number,
): Promise<StoreDashboard> {

    const response =
        await apiClient.get<
            StoreDashboard
        >(
            `/store/stores/${storeId}/dashboard`,
        )
    return response.data
}