import {
    useQuery,
} from '@tanstack/react-query'

import {
    Link,
    useNavigate,
} from 'react-router-dom'

import {
    getAdminAccess,
} from '../api/roleApi'

import {
    useAuth,
} from '../features/auth/useAuth'



export default function AdminDashboardPage() {

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
        queryKey: ['admin-access'],
        queryFn: getAdminAccess,
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
                            Admin Dashboard
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
                            Unable to access Admin API.
                        </p>
                    )}

                    {data && (
                        <p className="mt-3 text-emerald-400">
                            {data.message}
                        </p>
                    )}

                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">

                    <Link
                        to="/admin/catalog"
                        className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700"
                    >

                        <p className="text-sm font-semibold text-sky-400">
                            Catalog
                        </p>

                        <h2 className="mt-2 text-xl font-semibold">
                            Manage Catalog
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                            Create and manage products, brands and categories.
                        </p>

                    </Link>

                </div>

            </div>

        </main>
    )
}