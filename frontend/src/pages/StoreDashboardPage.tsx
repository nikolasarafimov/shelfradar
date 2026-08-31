import {
    useQuery,
} from '@tanstack/react-query'

import {
    AlertTriangle,
    Boxes,
    LogOut,
    PackageCheck,
    PackageX,
    Warehouse,
} from 'lucide-react'

import {
    Link,
    useNavigate,
} from 'react-router-dom'

import {
    getOwnerDashboard,
} from '../api/storeApi'

import EmptyState
    from '../components/ui/EmptyState'

import ErrorState
    from '../components/ui/ErrorState'

import LoadingState
    from '../components/ui/LoadingState'

import MetricCard
    from '../components/ui/MetricCard'

import PageHeader
    from '../components/ui/PageHeader'

import StatusBadge
    from '../components/ui/StatusBadge'

import {
    useAuth,
} from '../features/auth/useAuth'

import {
    formatDateTime,
    formatMkd,
    formatNumber,
} from '../lib/format'

import type {
    StoreDashboardSummary,
} from '../types/store'


export default function StoreDashboardPage() {

    const navigate =
        useNavigate()


    const {
        user,
        logout,
    } =
        useAuth()


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


    if (
        dashboardQuery.isLoading
    ) {

        return (
            <StoreOwnerShell
                ownerName={
                    user?.fullName
                }
                onLogout={
                    handleLogout
                }
            >

                <PageHeader
                    eyebrow="Store Owner"
                    title="Operations Dashboard"
                    description="Monitor your stores, inventory availability and stock health."
                />


                <div className="mt-8">

                    <LoadingState
                        message="Loading store owner dashboard..."
                    />

                </div>

            </StoreOwnerShell>
        )
    }


    if (
        dashboardQuery.isError
    ) {

        return (
            <StoreOwnerShell
                ownerName={
                    user?.fullName
                }
                onLogout={
                    handleLogout
                }
            >

                <PageHeader
                    eyebrow="Store Owner"
                    title="Operations Dashboard"
                    description="Monitor your stores, inventory availability and stock health."
                />


                <div className="mt-8">

                    <ErrorState
                        title="Dashboard unavailable"
                        message="ShelfRadar could not load your store dashboard."
                        onRetry={
                            () => {
                                void dashboardQuery
                                    .refetch()
                            }
                        }
                    />

                </div>

            </StoreOwnerShell>
        )
    }


    const dashboard =
        dashboardQuery.data


    if (!dashboard) {

        return (
            <StoreOwnerShell
                ownerName={
                    user?.fullName
                }
                onLogout={
                    handleLogout
                }
            >

                <PageHeader
                    eyebrow="Store Owner"
                    title="Operations Dashboard"
                    description="Monitor your stores, inventory availability and stock health."
                />


                <div className="mt-8">

                    <EmptyState
                        title="No dashboard data"
                        message="Store dashboard information is not available yet."
                    />

                </div>

            </StoreOwnerShell>
        )
    }


    return (
        <StoreOwnerShell
            ownerName={
                user?.fullName
            }
            onLogout={
                handleLogout
            }
        >

            <PageHeader
                eyebrow="Store Owner"
                title="Operations Dashboard"
                description="Monitor your stores, inventory availability and stock health."
            />


            <section
                aria-label="Store owner metrics"
                className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >

                <MetricCard
                    icon={
                        <Warehouse
                            size={20}
                        />
                    }
                    label="Stores"
                    value={
                        formatNumber(
                            dashboard.totalStores,
                        )
                    }
                />


                <MetricCard
                    icon={
                        <Boxes
                            size={20}
                        />
                    }
                    label="Products"
                    value={
                        formatNumber(
                            dashboard.totalProducts,
                        )
                    }
                />


                <MetricCard
                    icon={
                        <PackageCheck
                            size={20}
                        />
                    }
                    label="Available"
                    value={
                        formatNumber(
                            dashboard.availableProducts,
                        )
                    }
                />


                <MetricCard
                    icon={
                        <AlertTriangle
                            size={20}
                        />
                    }
                    label="Low stock"
                    value={
                        formatNumber(
                            dashboard.lowStockProducts,
                        )
                    }
                    attention={
                        dashboard.lowStockProducts >
                        0
                    }
                />

            </section>


            <section
                aria-label="Inventory totals"
                className="mt-4 grid gap-4 sm:grid-cols-3"
            >

                <MetricCard
                    icon={
                        <PackageX
                            size={20}
                        />
                    }
                    label="Out of stock"
                    value={
                        formatNumber(
                            dashboard.outOfStockProducts,
                        )
                    }
                    attention={
                        dashboard.outOfStockProducts >
                        0
                    }
                />


                <MetricCard
                    icon={
                        <Boxes
                            size={20}
                        />
                    }
                    label="Total units"
                    value={
                        formatNumber(
                            dashboard.totalUnits,
                        )
                    }
                />


                <MetricCard
                    icon={
                        <PackageCheck
                            size={20}
                        />
                    }
                    label="Inventory value"
                    value={
                        formatMkd(
                            dashboard.inventoryValue,
                        )
                    }
                    hint="Current stock value"
                />

            </section>


            <section
                aria-labelledby="stores-heading"
                className="mt-10"
            >

                <div>

                    <h2
                        id="stores-heading"
                        className="text-xl font-bold tracking-tight sm:text-2xl"
                    >
                        Your stores
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                        Open a store workspace to manage inventory, activity and profile information.
                    </p>

                </div>


                {
                    dashboard.stores.length ===
                    0 ? (

                        <div className="mt-6">

                            <EmptyState
                                title="No stores assigned"
                                message="There are currently no stores assigned to this Store Owner account."
                            />

                        </div>

                    ) : (

                        <div className="mt-6 grid gap-4 lg:grid-cols-2">

                            {
                                dashboard.stores.map(
                                    storeDashboard => (

                                        <StoreCard
                                            key={
                                                storeDashboard.store.id
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

        </StoreOwnerShell>
    )
}


function StoreCard({
                       dashboard,
                   }: {
    dashboard: StoreDashboardSummary
}) {

    const store =
        dashboard.store


    return (
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-3">

                        <h3 className="truncate text-lg font-semibold">
                            {
                                store.name
                            }
                        </h3>


                        <StatusBadge
                            status={
                                store.status
                            }
                        />

                    </div>


                    <p className="mt-2 text-sm leading-6 text-slate-400">
                        {
                            store.address
                        }
                        ,{' '}
                        {
                            store.city
                        }
                    </p>

                </div>


                <Link
                    to={
                        `/store/stores/${store.id}`
                    }
                    className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                    Manage store
                </Link>

            </div>


            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

                <StoreMetric
                    label="Products"
                    value={
                        dashboard.totalProducts
                    }
                />

                <StoreMetric
                    label="Available"
                    value={
                        dashboard.availableProducts
                    }
                />

                <StoreMetric
                    label="Low"
                    value={
                        dashboard.lowStockProducts
                    }
                />

                <StoreMetric
                    label="Out"
                    value={
                        dashboard.outOfStockProducts
                    }
                />

            </div>


            <div className="mt-5 grid gap-3 border-t border-slate-800 pt-5 sm:grid-cols-3">

                <StoreInfo
                    label="Units"
                    value={
                        formatNumber(
                            dashboard.totalUnits,
                        )
                    }
                />

                <StoreInfo
                    label="Inventory value"
                    value={
                        formatMkd(
                            dashboard.inventoryValue,
                        )
                    }
                />

                <StoreInfo
                    label="Last inventory update"
                    value={
                        formatDateTime(
                            dashboard.lastUpdatedAt,
                        )
                    }
                />

            </div>

        </article>
    )
}


function StoreMetric({
                         label,
                         value,
                     }: {
    label: string
    value: number
}) {

    return (
        <div className="rounded-xl bg-slate-950 p-3">

            <p className="text-xl font-bold">
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


function StoreInfo({
                       label,
                       value,
                   }: {
    label: string
    value: string
}) {

    return (
        <div>

            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {label}
            </p>

            <p className="mt-1 text-sm text-slate-300">
                {value}
            </p>

        </div>
    )
}


function StoreOwnerShell({
                             ownerName,
                             onLogout,
                             children,
                         }: {
    ownerName?: string
    onLogout: () => void
    children: React.ReactNode
}) {

    return (
        <main className="min-h-screen bg-slate-950 text-white">

            <header className="border-b border-slate-800 bg-slate-950">

                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

                    <Link
                        to="/store"
                        className="flex items-center gap-2 font-bold"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-slate-950">
                            S
                        </span>

                        ShelfRadar
                    </Link>


                    <div className="flex items-center gap-3">

                        <div className="hidden text-right sm:block">

                            <p className="max-w-48 truncate text-sm font-medium">
                                {
                                    ownerName ??
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
                                onLogout
                            }
                            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                        >
                            <LogOut
                                size={16}
                            />

                            <span className="hidden sm:inline">
                                Logout
                            </span>

                        </button>

                    </div>

                </div>

            </header>


            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                {children}
            </div>

        </main>
    )
}