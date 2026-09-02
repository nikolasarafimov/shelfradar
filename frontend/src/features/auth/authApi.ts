import { apiClient } from '../../api/client'

import type {
    AuthResponse,
    AuthUser,
    LoginRequest,
} from './types'

export async function login(
    request: LoginRequest,
): Promise<AuthResponse> {

    const response =
        await apiClient.post<AuthResponse>(
            '/auth/login',
            request,
        )
    return response.data
}

export async function getCurrentUser():
    Promise<AuthUser> {

    const response =
        await apiClient.get<AuthUser>(
            '/auth/me',
        )
    return response.data
}