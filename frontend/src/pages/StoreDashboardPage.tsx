import {
    useQuery,
} from '@tanstack/react-query'

import {
    useNavigate,
} from 'react-router-dom'

import {
    getStoreAccess,
} from '../api/roleApi'

import {
    useAuth,
} from '../features/auth/useAuth'

export default function StoreDashboardPage() {

    const {
        user,
        logout,
    } = useAuth()

    const navigate =
        useNavigate()

    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['store-access'],
        queryFn: getStoreAccess,
    })

    function handleLogout() {

        logout()

        navigate(
            '/',
            {
                replace: true,
            },
        )
    }

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">

            <div className="mx-auto max-w-6xl">

                <div className="flex items-center justify-between">

                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">
                            ShelfRadar
                        </p>

                        <h1 className="mt-2 text-4xl font-bold">
                            Store Dashboard
                        </h1>

                        <p className="mt-2 text-slate-400">
                            Signed in as {user?.fullName}
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="rounded-xl border border-slate-700 px-4 py-2 hover:bg-slate-900"
                    >
                        Logout
                    </button>

                </div>

                <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <h2 className="font-semibold">
                        Authorization status
                    </h2>

                    {isLoading && (
                        <p className="mt-3 text-slate-400">
                            Verifying access...
                        </p>
                    )}

                    {isError && (
                        <p className="mt-3 text-red-400">
                            Unable to access Store Owner API.
                        </p>
                    )}

                    {data && (
                        <p className="mt-3 text-emerald-400">
                            {data.message}
                        </p>
                    )}

                </div>

            </div>

        </main>
    )
}