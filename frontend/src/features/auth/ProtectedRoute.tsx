import type {
    ReactNode,
} from 'react'

import {
    Navigate,
} from 'react-router-dom'

import {
    LoaderCircle,
} from 'lucide-react'

import {
    useAuth,
} from './authContext'

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
            <main className="flex min-h-dvh items-center justify-center px-6">
                <div className="premium-card flex items-center gap-4 px-6 py-5">
                    <div className="flex size-10 items-center justify-center rounded-xl border border-sky-400/15 bg-sky-400/10 text-sky-300">
                        <LoaderCircle
                            className="size-5 animate-spin"
                            aria-hidden="true"
                        />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-100">
                            Loading ShelfRadar
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Restoring your session...
                        </p>
                    </div>
                </div>
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