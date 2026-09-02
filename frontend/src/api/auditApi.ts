import {
    apiClient,
} from './client'

import type {
    AdminAnalytics,
    AuditLogPage,
    AuditSearchParams,
} from '../types/audit'

export async function getAdminAnalytics():
    Promise<AdminAnalytics> {

    const response =
        await apiClient.get<
            AdminAnalytics
        >(
            '/admin/analytics',
        )
    return response.data
}

export async function getAdminAudit(
    params: AuditSearchParams,
): Promise<AuditLogPage> {

    const response =
        await apiClient.get<
            AuditLogPage
        >(
            '/admin/audit',
            {
                params: {
                    q:
                        params.q ||
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

export async function getStoreActivity(
    storeId: number,
    page = 0,
    size = 20,
): Promise<AuditLogPage> {

    const response =
        await apiClient.get<
            AuditLogPage
        >(
            `/store/stores/${storeId}/activity`,
            {
                params: {
                    page,
                    size,
                },
            },
        )
    return response.data
}