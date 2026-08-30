import type {
    ReactNode,
} from 'react'

import {
    Navigate,
} from 'react-router-dom'

import {
    useAuth,
} from './useAuth'

import type {
    UserRole,
} from './types'

interface ProtectedRouteProps {
    allowedRole: UserRole
    children: ReactNode
}

export default function ProtectedRoute({
                                           allowedRole,
                                           children,
                                       }: ProtectedRouteProps) {

    const {
        user,
        initializing,
    } = useAuth()

    if (initializing) {

        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
                <p className="text-slate-400">
                    Loading ShelfRadar...
                </p>
            </main>
        )
    }

    if (!user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        )
    }

    if (user.role !== allowedRole) {

        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        )
    }

    return children
}