import type {
    ReactNode,
} from 'react'

import {
    useQuery,
} from '@tanstack/react-query'

import {
    AlertTriangle,
    ArrowUpRight,
    Boxes,
    LogOut,
    MapPin,
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


        navigate(
            '/',
            {
                replace:
                    true,
            },
        )
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
                                void dashboardQuery.refetch()
                            }
                        }
                    />

                </div>

            </StoreOwnerShell>
        )
    }


    const dashboard =
        dashboardQuery.data


    if (
        !dashboard
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

                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

                    <div>

                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400">
                            Store workspaces
                        </p>


                        <h2
                            id="stores-heading"
                            className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl"
                        >
                            Your stores
                        </h2>


                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Open a store workspace to manage inventory, activity and profile information.
                        </p>

                    </div>


                    {
                        dashboard.stores.length >
                        0 && (

                            <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2 text-xs font-semibold text-slate-400">

                                <Warehouse
                                    size={13}
                                    className="text-sky-400"
                                />

                                {
                                    formatNumber(
                                        dashboard.stores.length,
                                    )
                                }{' '}

                                {
                                    dashboard.stores.length ===
                                    1
                                        ? 'store'
                                        : 'stores'
                                }

                            </span>
                        )
                    }

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
        <article className="premium-card group overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/55 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.85)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-sky-900/70 hover:bg-slate-900/75 hover:shadow-[0_28px_80px_-45px_rgba(14,165,233,0.22)] motion-reduce:transform-none">

            <div className="p-5 sm:p-6">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                    <div className="flex min-w-0 items-start gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-900/50 bg-sky-950/25 text-sky-400">

                            <Warehouse
                                size={18}
                            />

                        </div>


                        <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2.5">

                                <h3 className="truncate text-lg font-bold text-white">
                                    {store.name}
                                </h3>


                                <StatusBadge
                                    status={
                                        store.status
                                    }
                                />

                            </div>


                            <div className="mt-2 flex min-w-0 items-start gap-2 text-sm text-slate-500">

                                <MapPin
                                    size={14}
                                    className="mt-0.5 shrink-0 text-slate-600"
                                />

                                <span>
                                    {store.address}, {store.city}
                                </span>

                            </div>

                        </div>

                    </div>


                    <Link
                        to={
                            `/store/stores/${store.id}`
                        }
                        className="group/link inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-sky-900/60 bg-sky-950/20 px-4 text-sm font-semibold text-sky-300 transition hover:border-sky-700 hover:bg-sky-950/40 hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                    >

                        Manage store

                        <ArrowUpRight
                            size={14}
                            className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                        />

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
                        attention={
                            dashboard.lowStockProducts >
                            0
                        }
                    />


                    <StoreMetric
                        label="Out"
                        value={
                            dashboard.outOfStockProducts
                        }
                        attention={
                            dashboard.outOfStockProducts >
                            0
                        }
                    />

                </div>


                <div className="mt-5 grid gap-4 border-t border-slate-800/80 pt-5 sm:grid-cols-3">

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

            </div>

        </article>
    )
}


function StoreMetric({
                         label,
                         value,
                         attention = false,
                     }: {
    label: string
    value: number
    attention?: boolean
}) {

    return (
        <div
            className={
                attention
                    ? 'rounded-xl border border-amber-900/40 bg-amber-950/15 p-3'
                    : 'rounded-xl border border-slate-800/80 bg-[#020817]/55 p-3'
            }
        >

            <p
                className={
                    attention
                        ? 'text-xl font-bold text-amber-300'
                        : 'text-xl font-bold text-slate-100'
                }
            >
                {
                    formatNumber(
                        value,
                    )
                }
            </p>


            <p
                className={
                    attention
                        ? 'mt-1 text-xs font-medium text-amber-500/80'
                        : 'mt-1 text-xs text-slate-600'
                }
            >
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
        <div className="min-w-0">

            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-600">
                {label}
            </p>


            <p className="mt-1.5 break-words text-sm font-medium text-slate-300">
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
    children: ReactNode
}) {

    return (
        <main className="relative min-h-dvh overflow-x-clip bg-[#020817] text-white">

            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 overflow-hidden"
            >

                <div className="animate-glow-drift absolute left-1/2 top-[-280px] h-[580px] w-[880px] -translate-x-1/2 rounded-full bg-sky-500/[0.065] blur-[150px]" />

                <div className="animate-glow-drift absolute -left-56 top-[430px] h-[430px] w-[430px] rounded-full bg-cyan-500/[0.025] blur-[135px] [animation-delay:900ms]" />


                <div
                    className="absolute inset-0 opacity-[0.022]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(148,163,184,0.28) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.28) 1px, transparent 1px)',

                        backgroundSize:
                            '46px 46px',
                    }}
                />

            </div>


            <header className="sticky top-0 z-50 border-b border-slate-900/90 bg-[#020817]/90 backdrop-blur-xl">

                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">

                    <Link
                        to="/store"
                        aria-label="ShelfRadar Store Owner dashboard"
                        className="group flex min-w-0 items-center gap-3"
                    >

                        <img
                            src="/shelfradar-logo.png"
                            alt="ShelfRadar"
                            className="h-14 w-auto object-contain drop-shadow-[0_0_18px_rgba(56,189,248,0.1)] transition duration-300 group-hover:scale-[1.025]"
                        />


                        <span className="hidden rounded-full border border-sky-900/50 bg-sky-950/25 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-sky-400 md:inline-flex">
                            Store Owner
                        </span>

                    </Link>


                    <div className="flex items-center gap-3">

                        <div className="hidden max-w-52 text-right sm:block">

                            <p className="truncate text-sm font-semibold text-slate-200">
                                {
                                    ownerName ??
                                    'Store Owner'
                                }
                            </p>


                            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-600">
                                Store Owner
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={
                                onLogout
                            }
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/50 px-3.5 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                        >

                            <LogOut size={15}/>

                            <span className="hidden sm:inline">
                                Logout
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="relative z-10 mx-auto max-w-7xl px-5 py-7 md:px-8 md:py-8">
                {children}
            </div>
        </main>
    )
}