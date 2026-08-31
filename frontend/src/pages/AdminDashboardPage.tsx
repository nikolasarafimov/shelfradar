import {
    useQuery,
} from '@tanstack/react-query'

import {
    Building2,
    Clock3,
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

            <div>

                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-400">
                    Administration
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                    Platform Dashboard
                </h1>

                <p className="mt-3 text-slate-400">
                    Monitor stores, inventory health and platform operations.
                </p>

            </div>


            {
                dashboardQuery.isLoading && (

                    <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
                        Loading admin dashboard...
                    </div>
                )
            }


            {
                dashboardQuery.isError && (

                    <div className="mt-8 rounded-2xl border border-red-900/50 bg-red-950/30 p-6 text-red-300">
                        Unable to load admin dashboard.
                    </div>
                )
            }


            {
                dashboard && (

                    <>
                        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                            <MetricCard
                                icon={
                                    <Store />
                                }
                                label="All stores"
                                value={
                                    dashboard.totalStores
                                }
                            />

                            <MetricCard
                                icon={
                                    <Building2 />
                                }
                                label="Active stores"
                                value={
                                    dashboard.activeStores
                                }
                            />

                            <MetricCard
                                icon={
                                    <Clock3 />
                                }
                                label="Pending approval"
                                value={
                                    dashboard.pendingStores
                                }
                                attention={
                                    dashboard.pendingStores >
                                    0
                                }
                            />

                            <MetricCard
                                icon={
                                    <Users />
                                }
                                label="Store owners"
                                value={
                                    dashboard.storeOwners
                                }
                            />

                        </section>


                        <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                            <SecondaryCard
                                label="Catalog products"
                                value={
                                    formatNumber(
                                        dashboard.totalProducts,
                                    )
                                }
                            />

                            <SecondaryCard
                                label="Inventory items"
                                value={
                                    formatNumber(
                                        dashboard.inventoryItems,
                                    )
                                }
                            />

                            <SecondaryCard
                                label="Low stock"
                                value={
                                    formatNumber(
                                        dashboard.lowStockItems,
                                    )
                                }
                            />

                            <SecondaryCard
                                label="Out of stock"
                                value={
                                    formatNumber(
                                        dashboard.outOfStockItems,
                                    )
                                }
                            />

                        </section>


                        <section className="mt-4 grid gap-4 sm:grid-cols-2">

                            <SecondaryCard
                                label="Total inventory units"
                                value={
                                    formatNumber(
                                        dashboard.totalUnits,
                                    )
                                }
                            />

                            <SecondaryCard
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
                                        Pending store approvals
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-400">
                                        Review stores waiting to become publicly visible.
                                    </p>

                                </div>


                                <Link
                                    to="/admin/stores?status=PENDING"
                                    className="text-sm font-semibold text-sky-400 hover:text-sky-300"
                                >
                                    View all stores
                                </Link>

                            </div>


                            {
                                dashboard.pendingStorePreview.length ===
                                0 ? (

                                    <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
                                        No stores are currently awaiting approval.
                                    </div>

                                ) : (

                                    <div className="mt-6 grid gap-4">

                                        {
                                            dashboard.pendingStorePreview.map(
                                                store => (

                                                    <Link
                                                        key={
                                                            store.id
                                                        }
                                                        to={
                                                            `/admin/stores/${store.id}`
                                                        }
                                                        className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-600"
                                                    >

                                                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                                                            <div>

                                                                <h3 className="font-semibold">
                                                                    {
                                                                        store.name
                                                                    }
                                                                </h3>

                                                                <p className="mt-1 text-sm text-slate-400">
                                                                    {
                                                                        store.address
                                                                    }
                                                                    ,{' '}
                                                                    {
                                                                        store.city
                                                                    }
                                                                </p>

                                                                <p className="mt-2 text-xs text-slate-500">
                                                                    Owner:{' '}
                                                                    {
                                                                        store.owner.fullName
                                                                    }
                                                                    {' · '}
                                                                    {
                                                                        store.owner.email
                                                                    }
                                                                </p>

                                                            </div>


                                                            <span className="w-fit rounded-full bg-amber-950 px-3 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-800">
                                                                PENDING
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
                    </>
                )
            }

        </AdminLayout>
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


function SecondaryCard({
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

            <p className="mt-2 text-xl font-bold">
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
            maximumFractionDigits: 2,
        },
    ).format(value)
}