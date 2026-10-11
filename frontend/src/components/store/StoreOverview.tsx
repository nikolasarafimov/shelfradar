import {
    useQuery,
} from '@tanstack/react-query'

import {
    motion,
} from 'motion/react'

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

import type {
    InventoryItem,
} from '../../types/store'

import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import LoadingState from '../ui/LoadingState'
import MetricCard from '../ui/MetricCard'
import StatusBadge from '../ui/StatusBadge'

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
            <LoadingState
                message="Loading store overview..."
            />
        )
    }

    if (dashboardQuery.isError) {
        return (
            <ErrorState
                title="Store overview unavailable"
                message="ShelfRadar could not load the operational dashboard for this store."
                onRetry={
                    () => {
                        void dashboardQuery.refetch()
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
        <div className="space-y-6">
            <motion.section
                initial={{
                    opacity: 0,
                    y: 12,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.45,
                    ease: [
                        0.16,
                        1,
                        0.3,
                        1,
                    ],
                }}
                className="premium-card relative overflow-hidden rounded-2xl p-5 sm:p-6"
            >
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-24 -top-24 size-56 rounded-full bg-sky-400/[0.07] blur-3xl"
                />

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-28 left-1/3 size-56 rounded-full bg-emerald-400/[0.035] blur-3xl"
                />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                        <div className="flex items-start gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-sky-300/15 bg-sky-300/[0.08] text-sky-300 shadow-[0_12px_35px_rgba(14,165,233,0.1)]">
                                <Store
                                    className="size-5"
                                    strokeWidth={1.8}
                                    aria-hidden="true"
                                />
                            </div>

                            <div className="min-w-0">
                                <p className="eyebrow">
                                    Store overview
                                </p>

                                <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
                                    <h2 className="truncate text-xl font-semibold tracking-[-0.035em] text-slate-50 sm:text-2xl">
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

                                <div className="mt-2.5 flex items-start gap-1.5 text-sm leading-6 text-slate-500">
                                    <MapPin
                                        className="mt-1 size-3.5 shrink-0 text-slate-600"
                                        aria-hidden="true"
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

                    <div className="flex shrink-0 flex-wrap gap-2.5">
                        <button
                            type="button"
                            onClick={onManageInventory}
                            className="shine-button inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-300 px-4 text-sm font-semibold text-slate-950 shadow-[0_12px_32px_rgba(14,165,233,0.18)] transition duration-200 hover:brightness-110"
                        >
                            <Boxes
                                className="size-4"
                                aria-hidden="true"
                            />

                            Manage inventory

                            <ArrowRight
                                className="size-3.5"
                                aria-hidden="true"
                            />
                        </button>

                        <button
                            type="button"
                            onClick={onEditProfile}
                            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/50 px-4 text-sm font-medium text-slate-300 transition duration-200 hover:border-slate-600 hover:bg-slate-800/70 hover:text-slate-50"
                        >
                            <Pencil
                                className="size-3.5"
                                aria-hidden="true"
                            />

                            Edit profile
                        </button>
                    </div>
                </div>
            </motion.section>

            <section
                aria-label="Store inventory metrics"
                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
                <MetricCard
                    icon={
                        <Boxes
                            className="size-5"
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
                            className="size-5"
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
                            className="size-5"
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
                            className="size-5"
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

            <section
                aria-label="Store operational metrics"
                className="grid gap-4 sm:grid-cols-3"
            >
                <MetricCard
                    icon={
                        <Boxes
                            className="size-5"
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
                            className="size-5"
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
                            className="size-5"
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
                <InventoryAlertsPanel
                    items={
                        dashboard.alerts
                    }
                />

                <RecentUpdatesPanel
                    items={
                        dashboard.recentUpdates
                    }
                />
            </div>
        </div>
    )
}

function InventoryAlertsPanel({
                                  items,
                              }: {
    items: InventoryItem[]
}) {
    return (
        <section
            aria-labelledby="inventory-alerts-heading"
            className="premium-card overflow-hidden rounded-2xl"
        >
            <PanelHeader
                id="inventory-alerts-heading"
                icon={
                    <AlertTriangle
                        className="size-[18px]"
                        aria-hidden="true"
                    />
                }
                tone="warning"
                title="Inventory alerts"
                description="Products requiring inventory attention."
            />

            {items.length === 0 ? (
                <InlineEmptyState
                    title="No stock alerts"
                    message="All inventory items currently have healthy stock levels."
                />
            ) : (
                <div className="divide-y divide-slate-800/70">
                    {items.map(
                        item => (
                            <InventoryRow
                                key={item.id}
                                item={item}
                                variant="alert"
                            />
                        ),
                    )}
                </div>
            )}
        </section>
    )
}

function RecentUpdatesPanel({
                                items,
                            }: {
    items: InventoryItem[]
}) {
    return (
        <section
            aria-labelledby="recent-updates-heading"
            className="premium-card overflow-hidden rounded-2xl"
        >
            <PanelHeader
                id="recent-updates-heading"
                icon={
                    <Clock3
                        className="size-[18px]"
                        aria-hidden="true"
                    />
                }
                tone="primary"
                title="Recent inventory updates"
                description="The latest inventory records changed for this store."
            />

            {items.length === 0 ? (
                <InlineEmptyState
                    title="No recent updates"
                    message="Inventory updates will appear here after products are changed."
                />
            ) : (
                <div className="divide-y divide-slate-800/70">
                    {items.map(
                        item => (
                            <InventoryRow
                                key={item.id}
                                item={item}
                                variant="recent"
                            />
                        ),
                    )}
                </div>
            )}
        </section>
    )
}

function PanelHeader({
                         id,
                         icon,
                         tone,
                         title,
                         description,
                     }: {
    id: string
    icon: React.ReactNode
    tone: 'primary' | 'warning'
    title: string
    description: string
}) {
    const iconClassName =
        tone === 'warning'
            ? 'border-amber-300/15 bg-amber-300/[0.08] text-amber-300'
            : 'border-sky-300/15 bg-sky-300/[0.08] text-sky-300'

    return (
        <div className="relative flex items-center gap-3 border-b border-slate-800/80 px-5 py-4 sm:px-6">
            <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${iconClassName}`}
            >
                {icon}
            </div>

            <div>
                <h2
                    id={id}
                    className="text-sm font-semibold tracking-tight text-slate-50"
                >
                    {title}
                </h2>

                <p className="mt-0.5 text-xs leading-5 text-slate-500">
                    {description}
                </p>
            </div>
        </div>
    )
}

function InventoryRow({
                          item,
                          variant,
                      }: {
    item: InventoryItem
    variant: 'alert' | 'recent'
}) {
    const recent =
        variant ===
        'recent'

    return (
        <article className="flex flex-col gap-3 px-5 py-4 transition-colors duration-200 hover:bg-white/[0.018] sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
                <div
                    className={
                        recent
                            ? 'flex size-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/10 bg-sky-300/[0.05] text-sky-300/70'
                            : 'flex size-10 shrink-0 items-center justify-center rounded-xl border border-amber-300/10 bg-amber-300/[0.05] text-amber-300/70'
                    }
                >
                    {recent ? (
                        <WalletCards
                            className="size-4"
                            aria-hidden="true"
                        />
                    ) : (
                        <Boxes
                            className="size-4"
                            aria-hidden="true"
                        />
                    )}
                </div>

                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-200">
                        {
                            item.product.name
                        }
                    </p>

                    {recent ? (
                        <>
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
                        </>
                    ) : (
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
                    )}
                </div>
            </div>

            <StatusBadge
                status={
                    item.status
                }
            />
        </article>
    )
}

function InlineEmptyState({
                              title,
                              message,
                          }: {
    title: string
    message: string
}) {
    return (
        <div className="px-5 py-10 text-center sm:px-6">
            <div className="mx-auto flex size-10 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-900/60 text-slate-600">
                <PackageCheck
                    className="size-4"
                    aria-hidden="true"
                />
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-300">
                {title}
            </p>

            <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-slate-500">
                {message}
            </p>
        </div>
    )
}