import {
    apiClient,
} from './client'

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
    StoreStatus,
} from '../types/store'


export async function getAdminDashboard():
    Promise<AdminDashboard> {

    const response =
        await apiClient.get<
            AdminDashboard
        >(
            '/admin/dashboard',
        )

    return response.data
}


export async function getAdminStores(
    params: AdminStoreSearchParams,
): Promise<AdminStorePage> {

    const response =
        await apiClient.get<
            AdminStorePage
        >(
            '/admin/stores',
            {
                params: {
                    q:
                        params.q ||
                        undefined,

                    status:
                    params.status,

                    city:
                        params.city ||
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
        await apiClient.get<
            AdminStoreFilters
        >(
            '/admin/stores/filters',
        )

    return response.data
}


export async function getAdminStore(
    storeId: number,
): Promise<AdminStoreDetail> {

    const response =
        await apiClient.get<
            AdminStoreDetail
        >(
            `/admin/stores/${storeId}`,
        )

    return response.data
}


export async function updateAdminStoreStatus(
    storeId: number,
    status: StoreStatus,
): Promise<AdminStoreDetail> {

    const response =
        await apiClient.patch<
            AdminStoreDetail
        >(
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
        await apiClient.put<
            AdminStoreDetail
        >(
            `/admin/stores/${storeId}`,
            request,
        )

    return response.data
}


export async function getAdminStoreOwners():
    Promise<AdminOwner[]> {

    const response =
        await apiClient.get<
            AdminOwner[]
        >(
            '/admin/store-owners',
        )

    return response.data
}