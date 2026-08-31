import {
    useQuery,
} from '@tanstack/react-query'

import {
    AlertTriangle,
    Boxes,
    Clock3,
    PackageCheck,
    PackageX,
    Pencil,
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
            <LoadingState
                message="Loading store overview..."
            />
        )
    }


    if (
        dashboardQuery.isError
    ) {

        return (
            <ErrorState
                title="Store overview unavailable"
                message="ShelfRadar could not load the operational dashboard for this store."
                onRetry={
                    () => {
                        void dashboardQuery
                            .refetch()
                    }
                }
            />
        )
    }


    const dashboard =
        dashboardQuery.data


    if (!dashboard) {

        return (
            <EmptyState
                title="No overview data"
                message="Operational statistics are not available for this store yet."
            />
        )
    }


    return (
        <div className="space-y-8">

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                    <div>

                        <div className="flex flex-wrap items-center gap-3">

                            <h2 className="text-xl font-bold">
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


                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            {
                                dashboard.store.address
                            }
                            ,{' '}
                            {
                                dashboard.store.city
                            }
                        </p>

                    </div>


                    <div className="flex flex-wrap gap-2">

                        <button
                            type="button"
                            onClick={
                                onManageInventory
                            }
                            className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                        >
                            <Boxes
                                size={16}
                            />

                            Manage inventory
                        </button>


                        <button
                            type="button"
                            onClick={
                                onEditProfile
                            }
                            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                        >
                            <Pencil
                                size={16}
                            />

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


            <div className="grid gap-6 xl:grid-cols-2">

                <section
                    aria-labelledby="inventory-alerts-heading"
                    className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
                >

                    <div className="border-b border-slate-800 p-5">

                        <h2
                            id="inventory-alerts-heading"
                            className="font-semibold"
                        >
                            Inventory alerts
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Products requiring inventory attention.
                        </p>

                    </div>


                    {
                        dashboard.alerts.length ===
                        0 ? (

                            <div className="p-5">

                                <EmptyState
                                    title="No stock alerts"
                                    message="All inventory items currently have healthy stock levels."
                                />

                            </div>

                        ) : (

                            <div className="divide-y divide-slate-800">

                                {
                                    dashboard.alerts.map(
                                        item => (

                                            <div
                                                key={
                                                    item.id
                                                }
                                                className="p-5"
                                            >

                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                                                    <div className="min-w-0">

                                                        <p className="font-medium">
                                                            {
                                                                item.product.name
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-sm text-slate-500">
                                                            {
                                                                item.product.brand.name
                                                            }
                                                            {' · '}
                                                            Qty:{' '}
                                                            {
                                                                item.quantity
                                                            }
                                                        </p>

                                                    </div>


                                                    <StatusBadge
                                                        status={
                                                            item.status
                                                        }
                                                    />

                                                </div>

                                            </div>
                                        ),
                                    )
                                }

                            </div>
                        )
                    }

                </section>


                <section
                    aria-labelledby="recent-updates-heading"
                    className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
                >

                    <div className="border-b border-slate-800 p-5">

                        <h2
                            id="recent-updates-heading"
                            className="font-semibold"
                        >
                            Recent inventory updates
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            The latest inventory records changed for this store.
                        </p>

                    </div>


                    {
                        dashboard.recentUpdates.length ===
                        0 ? (

                            <div className="p-5">

                                <EmptyState
                                    title="No recent updates"
                                    message="Inventory updates will appear here after products are changed."
                                />

                            </div>

                        ) : (

                            <div className="divide-y divide-slate-800">

                                {
                                    dashboard.recentUpdates.map(
                                        item => (

                                            <div
                                                key={
                                                    item.id
                                                }
                                                className="p-5"
                                            >

                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                                                    <div className="min-w-0">

                                                        <p className="font-medium">
                                                            {
                                                                item.product.name
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-sm text-slate-500">
                                                            {
                                                                formatMkd(
                                                                    item.price,
                                                                )
                                                            }
                                                            {' · '}
                                                            Qty:{' '}
                                                            {
                                                                item.quantity
                                                            }
                                                        </p>

                                                        <p className="mt-2 text-xs text-slate-600">
                                                            {
                                                                formatDateTime(
                                                                    item.updatedAt,
                                                                )
                                                            }
                                                        </p>

                                                    </div>


                                                    <StatusBadge
                                                        status={
                                                            item.status
                                                        }
                                                    />

                                                </div>

                                            </div>
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