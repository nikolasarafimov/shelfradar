import {
    useQuery,
} from '@tanstack/react-query'

import {
    AlertTriangle,
    Boxes,
    LogOut,
    PackageX,
    Store,
    Warehouse,
} from 'lucide-react'

import {
    Link,
    useNavigate,
} from 'react-router-dom'

import {
    getOwnerDashboard,
} from '../api/storeApi'

import {
    useAuth,
} from '../features/auth/useAuth'


export default function StoreDashboardPage() {

    const navigate =
        useNavigate()

    const {
        user,
        logout,
    } = useAuth()


    const dashboardQuery =
        useQuery({
            queryKey: [
                'owner-dashboard',
            ],

            queryFn:
            getOwnerDashboard,
        })


    function handleLogout() {

        logout()

        navigate('/')
    }


    const dashboard =
        dashboardQuery.data


    return (
        <main className="min-h-screen bg-slate-950 text-white">

            <header className="border-b border-slate-800">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">

                    <Link
                        to="/store"
                        className="text-xl font-bold tracking-tight"
                    >
                        ShelfRadar
                    </Link>


                    <div className="flex items-center gap-4">

                        <div className="hidden text-right sm:block">

                            <p className="text-sm font-medium">
                                {
                                    user?.fullName ??
                                    'Store Owner'
                                }
                            </p>

                            <p className="text-xs text-slate-500">
                                Store Owner
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={
                                handleLogout
                            }
                            className="flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white"
                        >
                            <LogOut
                                size={16}
                            />

                            Logout
                        </button>

                    </div>

                </div>

            </header>


            <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">

                <div>

                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-400">
                        Store Operations
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                        Dashboard
                    </h1>

                    <p className="mt-3 text-slate-400">
                        Monitor inventory health and manage your ShelfRadar stores.
                    </p>

                </div>


                {
                    dashboardQuery.isLoading && (

                        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
                            Loading dashboard...
                        </div>
                    )
                }


                {
                    dashboardQuery.isError && (

                        <div className="mt-8 rounded-2xl border border-red-900/50 bg-red-950/30 p-6 text-red-300">
                            Unable to load your store dashboard.
                        </div>
                    )
                }


                {
                    dashboard && (

                        <>
                            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                                <KpiCard
                                    icon={
                                        <Store />
                                    }
                                    label="Stores"
                                    value={
                                        dashboard.totalStores
                                    }
                                />

                                <KpiCard
                                    icon={
                                        <Boxes />
                                    }
                                    label="Products"
                                    value={
                                        dashboard.totalProducts
                                    }
                                />

                                <KpiCard
                                    icon={
                                        <AlertTriangle />
                                    }
                                    label="Low stock"
                                    value={
                                        dashboard.lowStockProducts
                                    }
                                    attention={
                                        dashboard.lowStockProducts >
                                        0
                                    }
                                />

                                <KpiCard
                                    icon={
                                        <PackageX />
                                    }
                                    label="Out of stock"
                                    value={
                                        dashboard.outOfStockProducts
                                    }
                                    attention={
                                        dashboard.outOfStockProducts >
                                        0
                                    }
                                />

                            </section>


                            <section className="mt-4 grid gap-4 sm:grid-cols-3">

                                <SecondaryKpi
                                    label="Available products"
                                    value={
                                        formatNumber(
                                            dashboard.availableProducts,
                                        )
                                    }
                                />

                                <SecondaryKpi
                                    label="Total units"
                                    value={
                                        formatNumber(
                                            dashboard.totalUnits,
                                        )
                                    }
                                />

                                <SecondaryKpi
                                    label="Inventory value"
                                    value={
                                        `${formatPrice(
                                            dashboard.inventoryValue,
                                        )} MKD`
                                    }
                                />

                            </section>


                            <section className="mt-10">

                                <div className="flex items-end justify-between gap-4">

                                    <div>

                                        <h2 className="text-2xl font-bold">
                                            Your stores
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-400">
                                            Open a store to manage its inventory and profile.
                                        </p>

                                    </div>

                                </div>


                                {
                                    dashboard.stores.length ===
                                    0 ? (

                                        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
                                            No stores are assigned to your account.
                                        </div>

                                    ) : (

                                        <div className="mt-6 grid gap-5 lg:grid-cols-2">

                                            {
                                                dashboard.stores.map(
                                                    storeDashboard => (

                                                        <StoreCard
                                                            key={
                                                                storeDashboard
                                                                    .store
                                                                    .id
                                                            }
                                                            dashboard={
                                                                storeDashboard
                                                            }
                                                        />
                                                    ),
                                                )
                                            }

                                        </div>
                                    )
                                }

                            </section>
                        </>
                    )
                }

            </div>

        </main>
    )
}


function KpiCard({
                     icon,
                     label,
                     value,
                     attention = false,
                 }: {
    icon: React.ReactNode
    label: string
    value: number
    attention?: boolean
}) {

    return (
        <article
            className={
                attention
                    ? 'rounded-2xl border border-amber-800/60 bg-amber-950/20 p-5'
                    : 'rounded-2xl border border-slate-800 bg-slate-900 p-5'
            }
        >

            <div className="flex items-center justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-sky-400">
                    {icon}
                </div>

                {
                    attention && (

                        <span className="rounded-full bg-amber-900/40 px-2.5 py-1 text-xs font-semibold text-amber-300">
                            Attention
                        </span>
                    )
                }

            </div>

            <p className="mt-5 text-3xl font-bold">
                {
                    formatNumber(
                        value,
                    )
                }
            </p>

            <p className="mt-1 text-sm text-slate-400">
                {label}
            </p>

        </article>
    )
}


function SecondaryKpi({
                          label,
                          value,
                      }: {
    label: string
    value: string
}) {

    return (
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

            <p className="text-sm text-slate-400">
                {label}
            </p>

            <p className="mt-2 text-xl font-bold">
                {value}
            </p>

        </article>
    )
}


function StoreCard({
                       dashboard,
                   }: {
    dashboard:
        import('../types/store')
            .StoreDashboardSummary
}) {

    const needsAttention =
        dashboard.lowStockProducts +
        dashboard.outOfStockProducts


    return (
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700">

            <div className="flex items-start justify-between gap-5">

                <div>

                    <div className="flex items-center gap-3">

                        <Warehouse
                            size={20}
                            className="text-sky-400"
                        />

                        <h3 className="text-lg font-semibold">
                            {
                                dashboard.store.name
                            }
                        </h3>

                    </div>

                    <p className="mt-2 text-sm text-slate-400">
                        {
                            dashboard.store.address
                        }
                        ,{' '}
                        {
                            dashboard.store.city
                        }
                    </p>

                </div>

                <StoreStatusBadge
                    status={
                        dashboard.store.status
                    }
                />

            </div>


            <div className="mt-6 grid grid-cols-3 gap-3">

                <MiniMetric
                    label="Products"
                    value={
                        dashboard.totalProducts
                    }
                />

                <MiniMetric
                    label="Units"
                    value={
                        dashboard.totalUnits
                    }
                />

                <MiniMetric
                    label="Alerts"
                    value={
                        needsAttention
                    }
                />

            </div>


            <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-5">

                <div className="text-sm">

                    <span className="text-slate-500">
                        Value:{' '}
                    </span>

                    <span className="font-semibold text-slate-200">
                        {
                            formatPrice(
                                dashboard.inventoryValue,
                            )
                        }{' '}
                        MKD
                    </span>

                </div>


                <Link
                    to={
                        `/store/stores/${dashboard.store.id}`
                    }
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                    Manage store
                </Link>

            </div>

        </article>
    )
}


function MiniMetric({
                        label,
                        value,
                    }: {
    label: string
    value: number
}) {

    return (
        <div className="rounded-xl bg-slate-950 p-3">

            <p className="text-lg font-bold">
                {
                    formatNumber(
                        value,
                    )
                }
            </p>

            <p className="mt-1 text-xs text-slate-500">
                {label}
            </p>

        </div>
    )
}


function StoreStatusBadge({
                              status,
                          }: {
    status:
        | 'PENDING'
        | 'ACTIVE'
        | 'INACTIVE'
}) {

    const styles =
        status === 'ACTIVE'
            ? 'bg-emerald-950 text-emerald-300 ring-emerald-700'
            : status === 'PENDING'
                ? 'bg-amber-950 text-amber-300 ring-amber-700'
                : 'bg-slate-800 text-slate-400 ring-slate-700'


    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles}`}
        >
            {status}
        </span>
    )
}


function formatPrice(
    value: number,
): string {

    return new Intl.NumberFormat(
        'en-US',
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        },
    ).format(value)
}


function formatNumber(
    value: number,
): string {

    return new Intl.NumberFormat(
        'en-US',
    ).format(value)
}