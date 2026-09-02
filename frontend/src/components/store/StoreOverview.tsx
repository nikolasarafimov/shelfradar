import {
    useQuery,
} from '@tanstack/react-query'

import {
    AlertTriangle,
    ArrowRight,
    Boxes,
    Clock3,
    MapPin,
    PackageCheck,
    PackageX,
    Pencil,
    Store,
    WalletCards,
} from 'lucide-react'

import {
    getStoreDashboard,
} from '../../api/storeApi'

import {
    formatDateTime,
    formatMkd,
    formatNumber,
} from '../../lib/format'

import EmptyState
    from '../ui/EmptyState'

import ErrorState
    from '../ui/ErrorState'

import LoadingState
    from '../ui/LoadingState'

import MetricCard
    from '../ui/MetricCard'

import StatusBadge
    from '../ui/StatusBadge'

export default function StoreOverview({
    storeId,
    onManageInventory,
    onEditProfile,
}: {
    storeId: number
    onManageInventory: () => void
    onEditProfile: () => void
}) {

    const dashboardQuery =
        useQuery({
            queryKey: [
                'store-dashboard',
                storeId,
            ],

            queryFn:
                () =>
                    getStoreDashboard(
                        storeId,
                    ),
        })

    if (
        dashboardQuery.isLoading
    ) {
        return (
            <div className="premium-card rounded-3xl border border-slate-800/90 bg-slate-900/55 p-5 backdrop-blur-xl sm:p-6">
                <LoadingState
                    message="Loading store overview..."
                />
            </div>
        )
    }

    if (
        dashboardQuery.isError
    ) {
        return (
            <div className="premium-card rounded-3xl border border-slate-800/90 bg-slate-900/55 p-5 backdrop-blur-xl sm:p-6">
                <ErrorState
                    title="Store overview unavailable"
                    message="ShelfRadar could not load the operational dashboard for this store."
                    onRetry={
                        () => {
                            void dashboardQuery.refetch()
                        }
                    }
                />
            </div>
        )
    }

    const dashboard =
        dashboardQuery.data

    if (
        !dashboard
    ) {
        return (
            <div className="premium-card rounded-3xl border border-slate-800/90 bg-slate-900/55 p-5 backdrop-blur-xl sm:p-6">
                <EmptyState
                    title="No overview data"
                    message="Operational statistics are not available for this store yet."
                />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <section className="premium-card relative overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/55 p-5 shadow-[0_24px_70px_-45px_rgba(14,165,233,0.22)] backdrop-blur-xl sm:p-6">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-sky-500/[0.07] blur-3xl"
                />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-sky-900/50 bg-sky-950/30 text-sky-400">
                                <Store size={20}/>
                            </div>

                            <div className="min-w-0">
                                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-sky-400">
                                    Store overview
                                </p>

                                <div className="mt-1 flex flex-wrap items-center gap-2.5">
                                    <h2 className="truncate text-xl font-bold tracking-tight text-white sm:text-2xl">
                                        {
                                            dashboard.store.name
                                        }
                                    </h2>

                                    <StatusBadge
                                        status={
                                            dashboard.store.status
                                        }
                                    />
                                </div>

                                <div className="mt-2 flex items-start gap-1.5 text-sm leading-6 text-slate-500">
                                    <MapPin
                                        size={14}
                                        className="mt-1 shrink-0 text-slate-600"
                                    />

                                    <span>
                                        {
                                            dashboard.store.address
                                        }
                                        ,{' '}
                                        {
                                            dashboard.store.city
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={
                                onManageInventory
                            }
                            className="shine-button inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 text-sm font-bold text-slate-950 transition duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                        >
                            <Boxes size={15}/>
                            Manage inventory

                            <ArrowRight size={14}/>
                        </button>

                        <button
                            type="button"
                            onClick={
                                onEditProfile
                            }
                            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/50 px-4 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                        >
                            <Pencil size={14}/>
                            Edit profile
                        </button>
                    </div>
                </div>
            </section>

            <section
                aria-label="Store inventory metrics"
                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
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
                    hint={
                        `${formatNumber(
                            dashboard.inStockProducts,
                        )} fully in stock`
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
            </section>

            <section className="grid gap-4 sm:grid-cols-3">
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
                        <WalletCards
                            size={20}
                        />
                    }
                    label="Inventory value"
                    value={
                        formatMkd(
                            dashboard.inventoryValue,
                        )
                    }
                />

                <MetricCard
                    icon={
                        <Clock3
                            size={20}
                        />
                    }
                    label="Last update"
                    value={
                        formatDateTime(
                            dashboard.lastUpdatedAt,
                        )
                    }
                />
            </section>

            <div className="grid items-start gap-5 xl:grid-cols-2">
                <section
                    aria-labelledby="inventory-alerts-heading"
                    className="premium-card overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/55 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.8)] backdrop-blur-xl"
                >
                    <div className="flex items-center gap-3 border-b border-slate-800/80 px-5 py-4 sm:px-6">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-900/40 bg-amber-950/20 text-amber-400">
                            <AlertTriangle size={17}/>
                        </div>

                        <div>
                            <h2
                                id="inventory-alerts-heading"
                                className="text-sm font-bold text-white"
                            >
                                Inventory alerts
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Products requiring inventory attention.
                            </p>
                        </div>
                    </div>
                    {
                        dashboard.alerts.length ===
                        0 ? (
                            <div className="p-5 sm:p-6">

                                <EmptyState
                                    title="No stock alerts"
                                    message="All inventory items currently have healthy stock levels."
                                />
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-800/70">
                                {
                                    dashboard.alerts.map(
                                        item => (

                                            <article
                                                key={
                                                    item.id
                                                }
                                                className="flex flex-col gap-3 px-5 py-4 transition duration-200 hover:bg-slate-800/25 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-[#020817]/60 text-slate-600">
                                                        <Boxes size={16}/>
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold text-slate-200">
                                                            {
                                                                item.product.name
                                                            }
                                                        </p>

                                                        <p className="mt-1 truncate text-xs text-slate-500">
                                                            {
                                                                item.product.brand.name
                                                            }

                                                            <span className="mx-1.5 text-slate-700">
                                                                ·
                                                            </span>

                                                            Qty:{' '}

                                                            <strong className="font-semibold text-slate-300">
                                                                {
                                                                    item.quantity
                                                                }
                                                            </strong>
                                                        </p>
                                                    </div>
                                                </div>

                                                <StatusBadge
                                                    status={
                                                        item.status
                                                    }
                                                />
                                            </article>
                                        ),
                                    )
                                }
                            </div>
                        )
                    }
                </section>

                <section
                    aria-labelledby="recent-updates-heading"
                    className="premium-card overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/55 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.8)] backdrop-blur-xl"
                >
                    <div className="flex items-center gap-3 border-b border-slate-800/80 px-5 py-4 sm:px-6">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-900/50 bg-sky-950/25 text-sky-400">
                            <Clock3 size={17}/>
                        </div>

                        <div>
                            <h2
                                id="recent-updates-heading"
                                className="text-sm font-bold text-white"
                            >
                                Recent inventory updates
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">
                                The latest inventory records changed for this store.
                            </p>
                        </div>
                    </div>
                    {
                        dashboard.recentUpdates.length ===
                        0 ? (
                            <div className="p-5 sm:p-6">
                                <EmptyState
                                    title="No recent updates"
                                    message="Inventory updates will appear here after products are changed."
                                />
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-800/70">
                                {
                                    dashboard.recentUpdates.map(
                                        item => (

                                            <article
                                                key={
                                                    item.id
                                                }
                                                className="flex flex-col gap-3 px-5 py-4 transition duration-200 hover:bg-slate-800/25 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-[#020817]/60 text-slate-600">
                                                        <WalletCards size={16}/>
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold text-slate-200">
                                                            {
                                                                item.product.name
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-500">
                                                            <span className="font-semibold text-slate-300">
                                                                {
                                                                    formatMkd(
                                                                        item.price,
                                                                    )
                                                                }
                                                            </span>

                                                            <span className="mx-1.5 text-slate-700">
                                                                ·
                                                            </span>

                                                            Qty:{' '}

                                                            <strong className="font-semibold text-slate-300">
                                                                {
                                                                    item.quantity
                                                                }
                                                            </strong>
                                                        </p>

                                                        <p className="mt-1 text-[10px] text-slate-600">
                                                            {
                                                                formatDateTime(
                                                                    item.updatedAt,
                                                                )
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <StatusBadge
                                                    status={
                                                        item.status
                                                    }
                                                />
                                            </article>
                                        ),
                                    )
                                }
                            </div>
                        )
                    }
                </section>
            </div>
        </div>
    )
}