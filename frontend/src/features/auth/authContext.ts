import {
    createContext,
    useContext,
} from 'react'

import type {
    AuthUser,
} from './types'

export interface AuthContextValue {
    user: AuthUser | null

    initializing: boolean

    login: (
        email: string,
        password: string,
    ) => Promise<AuthUser>

    logout: () => void
}

export const AuthContext =
    createContext<
        AuthContextValue | undefined
    >(undefined)

export function useAuth(): AuthContextValue {
    const context =
        useContext(AuthContext)

    if (!context) {
        throw new Error(
            'useAuth must be used inside AuthProvider.',
        )
    }

    return context
}