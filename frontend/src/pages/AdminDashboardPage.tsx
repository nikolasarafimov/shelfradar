import {
    useQuery,
} from '@tanstack/react-query'

import {
    AlertTriangle,
    ArrowRight,
    Boxes,
    Building2,
    Clock3,
    MapPin,
    PackageSearch,
    PackageX,
    Store,
    Users,
    WalletCards,
} from 'lucide-react'

import {
    Link,
} from 'react-router-dom'

import {
    getAdminDashboard,
} from '../api/adminApi'

import AdminLayout from '../components/admin/AdminLayout'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import LoadingState from '../components/ui/LoadingState'
import MetricCard from '../components/ui/MetricCard'
import PageHeader from '../components/ui/PageHeader'
import StatusBadge from '../components/ui/StatusBadge'

import {
    formatMkd,
    formatNumber,
} from '../lib/format'

export default function AdminDashboardPage() {
    const dashboardQuery =
        useQuery({
            queryKey: [
                'admin-dashboard',
            ],

            queryFn:
            getAdminDashboard,
        })

    const dashboard =
        dashboardQuery.data

    return (
        <AdminLayout>
            <div className="space-y-8">
                <PageHeader
                    eyebrow="Administration"
                    title="Platform dashboard"
                    description="Monitor stores, catalog activity and inventory health across ShelfRadar."
                    actions={
                        <Link
                            to="/admin/stores"
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/40 px-4 text-sm font-medium text-slate-300 transition duration-200 hover:border-sky-300/15 hover:bg-sky-300/[0.05] hover:text-sky-300"
                        >
                            Manage stores

                            <ArrowRight
                                className="size-3.5"
                                aria-hidden="true"
                            />
                        </Link>
                    }
                />

                {dashboardQuery.isLoading && (
                    <LoadingState
                        message="Loading admin dashboard..."
                    />
                )}

                {dashboardQuery.isError && (
                    <ErrorState
                        title="Dashboard unavailable"
                        message="ShelfRadar could not load the platform dashboard."
                        onRetry={
                            () => {
                                void dashboardQuery.refetch()
                            }
                        }
                    />
                )}

                {!dashboardQuery.isLoading &&
                    !dashboardQuery.isError &&
                    !dashboard && (
                        <EmptyState
                            title="No dashboard data"
                            message="Platform statistics are not available yet."
                        />
                    )}

                {dashboard &&
                    !dashboardQuery.isLoading &&
                    !dashboardQuery.isError && (
                        <>
                            <section
                                aria-label="Store statistics"
                                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                            >
                                <MetricCard
                                    icon={
                                        <Store
                                            className="size-5"
                                        />
                                    }
                                    label="All stores"
                                    value={
                                        formatNumber(
                                            dashboard.totalStores,
                                        )
                                    }
                                    hint={
                                        `${formatNumber(
                                            dashboard.inactiveStores,
                                        )} inactive`
                                    }
                                />

                                <MetricCard
                                    icon={
                                        <Building2
                                            className="size-5"
                                        />
                                    }
                                    label="Active stores"
                                    value={
                                        formatNumber(
                                            dashboard.activeStores,
                                        )
                                    }
                                    hint="Visible in public search"
                                />

                                <MetricCard
                                    icon={
                                        <Clock3
                                            className="size-5"
                                        />
                                    }
                                    label="Pending approval"
                                    value={
                                        formatNumber(
                                            dashboard.pendingStores,
                                        )
                                    }
                                    hint="Awaiting administrator review"
                                    attention={
                                        dashboard.pendingStores >
                                        0
                                    }
                                />

                                <MetricCard
                                    icon={
                                        <Users
                                            className="size-5"
                                        />
                                    }
                                    label="Store owners"
                                    value={
                                        formatNumber(
                                            dashboard.storeOwners,
                                        )
                                    }
                                    hint="Registered owner accounts"
                                />
                            </section>

                            <section
                                aria-label="Inventory statistics"
                                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                            >
                                <MetricCard
                                    icon={
                                        <PackageSearch
                                            className="size-5"
                                        />
                                    }
                                    label="Catalog products"
                                    value={
                                        formatNumber(
                                            dashboard.totalProducts,
                                        )
                                    }
                                />

                                <MetricCard
                                    icon={
                                        <Boxes
                                            className="size-5"
                                        />
                                    }
                                    label="Inventory items"
                                    value={
                                        formatNumber(
                                            dashboard.inventoryItems,
                                        )
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
                                            dashboard.lowStockItems,
                                        )
                                    }
                                    attention={
                                        dashboard.lowStockItems >
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
                                            dashboard.outOfStockItems,
                                        )
                                    }
                                    attention={
                                        dashboard.outOfStockItems >
                                        0
                                    }
                                />
                            </section>

                            <section
                                aria-label="Inventory totals"
                                className="grid gap-4 sm:grid-cols-2"
                            >
                                <MetricCard
                                    icon={
                                        <Boxes
                                            className="size-5"
                                        />
                                    }
                                    label="Total inventory units"
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
                                    hint="Current stock value, not revenue"
                                />
                            </section>

                            <section
                                aria-labelledby="pending-stores-heading"
                                className="space-y-5 pt-2"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <p className="eyebrow">
                                            Store onboarding
                                        </p>

                                        <h2
                                            id="pending-stores-heading"
                                            className="mt-1.5 text-xl font-semibold tracking-[-0.03em] text-slate-50 sm:text-2xl"
                                        >
                                            Pending store approvals
                                        </h2>

                                        <p className="mt-1.5 text-sm leading-6 text-slate-500">
                                            Review stores waiting to become publicly visible.
                                        </p>
                                    </div>

                                    {dashboard.pendingStorePreview.length >
                                        0 && (
                                            <Link
                                                to="/admin/stores?status=PENDING"
                                                className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-sky-300 transition duration-200 hover:text-sky-200"
                                            >
                                                View all pending stores

                                                <ArrowRight
                                                    className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                                                    aria-hidden="true"
                                                />
                                            </Link>
                                        )}
                                </div>

                                {dashboard.pendingStorePreview.length ===
                                0 ? (
                                    <EmptyState
                                        title="No stores awaiting approval"
                                        message="There are currently no pending store applications to review."
                                        action={
                                            <Link
                                                to="/admin/stores"
                                                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/50 px-4 text-sm font-medium text-slate-300 transition duration-200 hover:border-sky-300/15 hover:bg-sky-300/[0.05] hover:text-sky-300"
                                            >
                                                View all stores

                                                <ArrowRight
                                                    className="size-3.5"
                                                    aria-hidden="true"
                                                />
                                            </Link>
                                        }
                                    />
                                ) : (
                                    <div className="grid gap-4 lg:grid-cols-2">
                                        {dashboard.pendingStorePreview.map(
                                            store => (
                                                <Link
                                                    key={store.id}
                                                    to={
                                                        `/admin/stores/${store.id}`
                                                    }
                                                    className="premium-card group relative overflow-hidden rounded-2xl p-5 transition duration-200 hover:-translate-y-0.5 hover:border-sky-300/15 sm:p-6"
                                                >
                                                    <div
                                                        aria-hidden="true"
                                                        className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-sky-400/[0.045] blur-3xl transition duration-300 group-hover:bg-sky-400/[0.075]"
                                                    />

                                                    <div className="relative flex h-full flex-col justify-between gap-5">
                                                        <div>
                                                            <div className="flex flex-wrap items-center gap-2.5">
                                                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/10 bg-sky-300/[0.06] text-sky-300">
                                                                    <Store
                                                                        className="size-[18px]"
                                                                        strokeWidth={1.8}
                                                                        aria-hidden="true"
                                                                    />
                                                                </div>

                                                                <div className="min-w-0 flex-1">
                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                        <h3 className="truncate text-sm font-semibold text-slate-100 transition-colors duration-200 group-hover:text-sky-300">
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
                                                                </div>
                                                            </div>

                                                            <div className="mt-4 flex items-start gap-2 text-sm leading-6 text-slate-500">
                                                                <MapPin
                                                                    className="mt-1 size-3.5 shrink-0 text-slate-600"
                                                                    aria-hidden="true"
                                                                />

                                                                <span>
                                                                    {
                                                                        store.address
                                                                    }
                                                                    ,{' '}
                                                                    {
                                                                        store.city
                                                                    }
                                                                </span>
                                                            </div>

                                                            <div className="mt-4 border-t border-slate-800/70 pt-4">
                                                                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-600">
                                                                    Store owner
                                                                </p>

                                                                <p className="mt-1.5 truncate text-sm font-medium text-slate-300">
                                                                    {
                                                                        store.owner.fullName
                                                                    }
                                                                </p>

                                                                <p className="mt-0.5 truncate text-xs text-slate-500">
                                                                    {
                                                                        store.owner.email
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between border-t border-slate-800/70 pt-4">
                                                            <span className="text-xs text-slate-600">
                                                                Awaiting review
                                                            </span>

                                                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300">
                                                                Review store

                                                                <ArrowRight
                                                                    className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ),
                                        )}
                                    </div>
                                )}
                            </section>
                        </>
                    )}
            </div>
        </AdminLayout>
    )
}