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
} from 'lucide-react'

import {
    getStoreDashboard,
} from '../../api/storeApi'

import type {
    InventoryItem,
    StockStatus,
} from '../../types/store'


interface StoreOverviewProps {
    storeId: number
    onManageInventory: () => void
    onEditProfile: () => void
}


export default function StoreOverview({
                                          storeId,
                                          onManageInventory,
                                          onEditProfile,
                                      }: StoreOverviewProps) {

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


    if (dashboardQuery.isLoading) {

        return (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
                Loading store overview...
            </div>
        )
    }


    if (
        dashboardQuery.isError ||
        !dashboardQuery.data
    ) {

        return (
            <div className="rounded-2xl border border-red-900/50 bg-red-950/30 p-6 text-red-300">
                Unable to load store overview.
            </div>
        )
    }


    const dashboard =
        dashboardQuery.data


    return (
        <div className="space-y-8">

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <MetricCard
                    icon={
                        <Boxes />
                    }
                    label="Products"
                    value={
                        dashboard.totalProducts
                    }
                />

                <MetricCard
                    icon={
                        <PackageCheck />
                    }
                    label="Available"
                    value={
                        dashboard.availableProducts
                    }
                />

                <MetricCard
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

                <MetricCard
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


            <section className="grid gap-4 md:grid-cols-3">

                <InfoCard
                    label="Total units"
                    value={
                        formatNumber(
                            dashboard.totalUnits,
                        )
                    }
                />

                <InfoCard
                    label="Inventory value"
                    value={
                        `${formatPrice(
                            dashboard.inventoryValue,
                        )} MKD`
                    }
                />

                <InfoCard
                    label="Last inventory update"
                    value={
                        dashboard.lastUpdatedAt
                            ? formatDateTime(
                                dashboard.lastUpdatedAt,
                            )
                            : 'No updates'
                    }
                />

            </section>


            <section>

                <div className="flex flex-wrap items-center justify-between gap-4">

                    <div>

                        <h2 className="text-xl font-bold">
                            Inventory alerts
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Products that require attention.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={
                            onManageInventory
                        }
                        className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500"
                    >
                        Manage inventory
                    </button>

                </div>


                {
                    dashboard.alerts.length ===
                    0 ? (

                        <div className="mt-4 rounded-2xl border border-emerald-900/50 bg-emerald-950/20 p-6">

                            <div className="flex items-center gap-3 text-emerald-300">

                                <PackageCheck
                                    size={20}
                                />

                                <span className="font-medium">
                                    No inventory alerts
                                </span>

                            </div>

                            <p className="mt-2 text-sm text-slate-400">
                                No products are currently marked low stock or out of stock.
                            </p>

                        </div>

                    ) : (

                        <div className="mt-4 space-y-3">

                            {
                                dashboard.alerts.map(
                                    item => (

                                        <AlertRow
                                            key={
                                                item.id
                                            }
                                            item={
                                                item
                                            }
                                        />
                                    ),
                                )
                            }

                        </div>
                    )
                }

            </section>


            <section>

                <div className="flex flex-wrap items-center justify-between gap-4">

                    <div>

                        <h2 className="text-xl font-bold">
                            Recent updates
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Latest inventory changes for this store.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={
                            onEditProfile
                        }
                        className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500"
                    >
                        <Pencil
                            size={15}
                        />

                        Store profile
                    </button>

                </div>


                {
                    dashboard.recentUpdates.length ===
                    0 ? (

                        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-400">
                            No inventory activity yet.
                        </div>

                    ) : (

                        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800">

                            {
                                dashboard.recentUpdates.map(
                                    item => (

                                        <RecentUpdateRow
                                            key={
                                                item.id
                                            }
                                            item={
                                                item
                                            }
                                        />
                                    ),
                                )
                            }

                        </div>
                    )
                }

            </section>

        </div>
    )
}


function AlertRow({
                      item,
                  }: {
    item: InventoryItem
}) {

    return (
        <article className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:flex-row sm:items-center">

            <div>

                <p className="font-semibold">
                    {
                        item.product.name
                    }
                </p>

                <p className="mt-1 text-sm text-slate-500">
                    {
                        item.product.brand.name
                    }
                    {' · '}
                    Quantity:{' '}
                    {
                        item.quantity
                    }
                </p>

            </div>


            <div className="flex items-center gap-4">

                <InventoryStatusBadge
                    status={
                        item.status
                    }
                />

                <span className="font-semibold">
                    {
                        formatPrice(
                            item.price,
                        )
                    }{' '}
                    MKD
                </span>

            </div>

        </article>
    )
}


function RecentUpdateRow({
                             item,
                         }: {
    item: InventoryItem
}) {

    return (
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 bg-slate-900 p-4 last:border-b-0 sm:flex-row sm:items-center">

            <div>

                <p className="font-medium">
                    {
                        item.product.name
                    }
                </p>

                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">

                    <Clock3
                        size={13}
                    />

                    {
                        formatDateTime(
                            item.updatedAt,
                        )
                    }

                </div>

            </div>


            <div className="flex items-center gap-4">

                <InventoryStatusBadge
                    status={
                        item.status
                    }
                />

                <span className="text-sm text-slate-400">
                    Qty{' '}
                    {
                        item.quantity
                    }
                </span>

            </div>

        </div>
    )
}


function InventoryStatusBadge({
                                  status,
                              }: {
    status: StockStatus
}) {

    const styles =
        status === 'IN_STOCK'
            ? 'bg-emerald-950 text-emerald-300 ring-emerald-800'
            : status === 'LOW_STOCK'
                ? 'bg-amber-950 text-amber-300 ring-amber-800'
                : 'bg-red-950 text-red-300 ring-red-800'


    const text =
        status === 'IN_STOCK'
            ? 'In stock'
            : status === 'LOW_STOCK'
                ? 'Low stock'
                : 'Out of stock'


    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles}`}
        >
            {text}
        </span>
    )
}


function MetricCard({
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

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-sky-400">
                {icon}
            </div>

            <p className="mt-4 text-3xl font-bold">
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


function InfoCard({
                      label,
                      value,
                  }: {
    label: string
    value: string
}) {

    return (
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

            <p className="text-sm text-slate-500">
                {label}
            </p>

            <p className="mt-2 text-lg font-semibold">
                {value}
            </p>

        </article>
    )
}


function formatNumber(
    value: number,
): string {

    return new Intl.NumberFormat(
        'en-US',
    ).format(value)
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


function formatDateTime(
    value: string,
): string {

    return new Intl.DateTimeFormat(
        'en-GB',
        {
            dateStyle: 'medium',
            timeStyle: 'short',
        },
    ).format(
        new Date(value),
    )
}