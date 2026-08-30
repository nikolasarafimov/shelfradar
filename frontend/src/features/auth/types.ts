export type UserRole =
    | 'ADMIN'
    | 'STORE_OWNER'

export interface AuthUser {
    id: number
    fullName: string
    email: string
    role: UserRole
}

export interface LoginRequest {
    email: string
    password: string
}

export interface AuthResponse {
    accessToken: string
    tokenType: string
    expiresInSeconds: number
    user: AuthUser
}