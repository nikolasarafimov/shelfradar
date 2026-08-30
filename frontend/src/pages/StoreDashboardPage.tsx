import {
    useQuery,
} from '@tanstack/react-query'

import {
    Link,
    useNavigate,
} from 'react-router-dom'

import {
    getMyStores,
} from '../api/storeApi'

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

    const storesQuery =
        useQuery({
            queryKey: [
                'my-stores',
            ],
            queryFn:
            getMyStores,
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
        <main className="min-h-screen bg-slate-950 px-5 py-8 text-white md:px-8">

            <div className="mx-auto max-w-7xl">

                <header className="flex flex-col gap-5 border-b border-slate-800 pb-8 md:flex-row md:items-center md:justify-between">

                    <div>

                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">
                            ShelfRadar
                        </p>

                        <h1 className="mt-2 text-4xl font-bold">
                            Store Dashboard
                        </h1>

                        <p className="mt-2 text-slate-400">
                            Welcome, {user?.fullName}
                        </p>

                    </div>

                    <button
                        onClick={
                            handleLogout
                        }
                        className="rounded-xl border border-slate-700 px-4 py-2"
                    >
                        Logout
                    </button>

                </header>

                <section className="mt-8">

                    <div>

                        <h2 className="text-2xl font-semibold">
                            My Stores
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Manage store information and inventory.
                        </p>

                    </div>

                    {
                        storesQuery.isLoading && (
                            <p className="mt-8 text-slate-400">
                                Loading stores...
                            </p>
                        )
                    }

                    {
                        storesQuery.isError && (
                            <p className="mt-8 text-red-400">
                                Unable to load stores.
                            </p>
                        )
                    }

                    <div className="mt-6 grid gap-5 lg:grid-cols-2">

                        {
                            storesQuery.data?.map(
                                store => (

                                    <article
                                        key={
                                            store.id
                                        }
                                        className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                                    >

                                        <div className="flex items-start justify-between gap-4">

                                            <div>

                                                <h3 className="text-xl font-semibold">
                                                    {
                                                        store.name
                                                    }
                                                </h3>

                                                <p className="mt-2 text-sm text-slate-400">
                                                    {
                                                        store.address
                                                    }
                                                    ,{' '}
                                                    {
                                                        store.city
                                                    }
                                                </p>

                                            </div>

                                            <StatusBadge
                                                status={
                                                    store.status
                                                }
                                            />

                                        </div>

                                        <Link
                                            to={
                                                `/store/stores/${store.id}`
                                            }
                                            className="mt-6 inline-flex rounded-xl bg-sky-500 px-4 py-2 font-semibold text-slate-950"
                                        >
                                            Manage Store
                                        </Link>

                                    </article>
                                ),
                            )
                        }

                    </div>

                </section>

            </div>

        </main>
    )
}

function StatusBadge({
                         status,
                     }: {
    status:
        | 'PENDING'
        | 'ACTIVE'
        | 'INACTIVE'
}) {

    return (
        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold">
            {
                status
                    .replaceAll(
                        '_',
                        ' ',
                    )
            }
        </span>
    )
}