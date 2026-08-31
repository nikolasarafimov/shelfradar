import {
    useQuery,
} from '@tanstack/react-query'

import {
    Boxes,
    Building2,
    Clock3,
    PackageSearch,
    Store,
    Users,
} from 'lucide-react'

import {
    Link,
} from 'react-router-dom'

import {
    getAdminDashboard,
} from '../api/adminStoreApi'

import AdminLayout
    from '../components/admin/AdminLayout'

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


    if (
        dashboardQuery.isLoading
    ) {

        return (
            <AdminLayout>

                <PageHeader
                    eyebrow="Administration"
                    title="Platform Dashboard"
                    description="Monitor stores, catalog activity and inventory health across ShelfRadar."
                />


                <div className="mt-8">

                    <LoadingState
                        message="Loading admin dashboard..."
                    />

                </div>

            </AdminLayout>
        )
    }


    if (
        dashboardQuery.isError
    ) {

        return (
            <AdminLayout>

                <PageHeader
                    eyebrow="Administration"
                    title="Platform Dashboard"
                    description="Monitor stores, catalog activity and inventory health across ShelfRadar."
                />


                <div className="mt-8">

                    <ErrorState
                        title="Dashboard unavailable"
                        message="ShelfRadar could not load the platform dashboard."
                        onRetry={
                            () => {
                                void dashboardQuery
                                    .refetch()
                            }
                        }
                    />

                </div>

            </AdminLayout>
        )
    }


    const dashboard =
        dashboardQuery.data


    if (!dashboard) {

        return (
            <AdminLayout>

                <PageHeader
                    eyebrow="Administration"
                    title="Platform Dashboard"
                    description="Monitor stores, catalog activity and inventory health across ShelfRadar."
                />


                <div className="mt-8">

                    <EmptyState
                        title="No dashboard data"
                        message="Platform statistics are not available yet."
                    />

                </div>

            </AdminLayout>
        )
    }


    return (
        <AdminLayout>

            <PageHeader
                eyebrow="Administration"
                title="Platform Dashboard"
                description="Monitor stores, catalog activity and inventory health across ShelfRadar."
                actions={
                    <Link
                        to="/admin/stores"
                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                    >
                        Manage stores
                    </Link>
                }
            />


            <section
                aria-label="Store statistics"
                className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >

                <MetricCard
                    icon={
                        <Store
                            size={20}
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
                            size={20}
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
                            size={20}
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
                            size={20}
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
                className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >

                <MetricCard
                    icon={
                        <PackageSearch
                            size={20}
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
                            size={20}
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
                        <Boxes
                            size={20}
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
                        <Boxes
                            size={20}
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
                className="mt-4 grid gap-4 sm:grid-cols-2"
            >

                <MetricCard
                    icon={
                        <Boxes
                            size={20}
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
                        <PackageSearch
                            size={20}
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
                className="mt-10"
            >

                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                    <div>

                        <h2
                            id="pending-stores-heading"
                            className="text-xl font-bold tracking-tight text-white sm:text-2xl"
                        >
                            Pending store approvals
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-slate-400">
                            Review stores waiting to become publicly visible.
                        </p>

                    </div>


                    {
                        dashboard.pendingStorePreview.length >
                        0 && (

                            <Link
                                to="/admin/stores?status=PENDING"
                                className="inline-flex w-fit items-center text-sm font-semibold text-sky-400 transition hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                            >
                                View all pending stores
                            </Link>
                        )
                    }

                </div>


                {
                    dashboard.pendingStorePreview.length ===
                    0 ? (

                        <div className="mt-6">

                            <EmptyState
                                title="No stores awaiting approval"
                                message="There are currently no pending store applications to review."
                                action={
                                    <Link
                                        to="/admin/stores"
                                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                                    >
                                        View all stores
                                    </Link>
                                }
                            />

                        </div>

                    ) : (

                        <div className="mt-6 grid gap-4">

                            {
                                dashboard
                                    .pendingStorePreview
                                    .map(
                                        store => (

                                            <Link
                                                key={
                                                    store.id
                                                }
                                                to={
                                                    `/admin/stores/${store.id}`
                                                }
                                                className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-600 hover:bg-slate-900/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                                            >

                                                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                                                    <div className="min-w-0">

                                                        <div className="flex flex-wrap items-center gap-3">

                                                            <h3 className="truncate font-semibold text-white group-hover:text-sky-300">
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


                                                        <div className="mt-3">

                                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                                Store owner
                                                            </p>

                                                            <p className="mt-1 text-sm text-slate-300">
                                                                {
                                                                    store.owner.fullName
                                                                }
                                                            </p>

                                                            <p className="mt-0.5 break-all text-xs text-slate-500">
                                                                {
                                                                    store.owner.email
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>


                                                    <span className="shrink-0 text-sm font-semibold text-sky-400">
                                                        Review store
                                                    </span>

                                                </div>

                                            </Link>
                                        ),
                                    )
                            }

                        </div>
                    )
                }

            </section>

        </AdminLayout>
    )
}