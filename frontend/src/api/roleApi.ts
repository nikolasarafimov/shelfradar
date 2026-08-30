import {
    apiClient,
} from './client'

interface AccessResponse {
    message: string
}

export async function getStoreAccess():
    Promise<AccessResponse> {

    const response =
        await apiClient.get<AccessResponse>(
            '/store/access',
        )

    return response.data
}

export async function getAdminAccess():
    Promise<AccessResponse> {

    const response =
        await apiClient.get<AccessResponse>(
            '/admin/access',
        )

    return response.data
}