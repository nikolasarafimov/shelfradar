import type {
    ReactNode,
} from 'react'

import {
    useQuery,
} from '@tanstack/react-query'

import {
    motion,
} from 'motion/react'

import {
    AlertTriangle,
    ArrowUpRight,
    Boxes,
    LogOut,
    MapPin,
    PackageCheck,
    PackageX,
    Warehouse,
    WalletCards,
} from 'lucide-react'

import {
    Link,
    useNavigate,
} from 'react-router-dom'

import {
    getOwnerDashboard,
} from '../api/storeApi'

import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import LoadingState from '../components/ui/LoadingState'
import MetricCard from '../components/ui/MetricCard'
import PageHeader from '../components/ui/PageHeader'
import StatusBadge from '../components/ui/StatusBadge'

import {
    useAuth,
} from '../features/auth/authContext'

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

        navigate(
            '/',
            {
                replace: true,
            },
        )
    }

    const dashboard =
        dashboardQuery.data

    return (
        <StoreOwnerShell
            ownerName={
                user?.fullName
            }
            onLogout={
                handleLogout
            }
        >
            <div className="space-y-8">
                <PageHeader
                    eyebrow="Store Owner"
                    title="Operations dashboard"
                    description="Monitor your stores, inventory availability and stock health."
                />

                {dashboardQuery.isLoading && (
                    <LoadingState
                        message="Loading store owner dashboard..."
                    />
                )}

                {dashboardQuery.isError && (
                    <ErrorState
                        title="Dashboard unavailable"
                        message="ShelfRadar could not load your store dashboard."
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
                            message="Store dashboard information is not available yet."
                        />
                    )}

                {dashboard &&
                    !dashboardQuery.isLoading &&
                    !dashboardQuery.isError && (
                        <>
                            <section
                                aria-label="Store owner metrics"
                                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                            >
                                <MetricCard
                                    icon={
                                        <Warehouse
                                            className="size-5"
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
                            </section>

                            <section
                                aria-label="Inventory totals"
                                className="grid gap-4 sm:grid-cols-3"
                            >
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
                                    hint="Current stock value"
                                />
                            </section>

                            <section
                                aria-labelledby="stores-heading"
                                className="space-y-5 pt-2"
                            >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <p className="eyebrow">
                                            Store workspaces
                                        </p>

                                        <h2
                                            id="stores-heading"
                                            className="mt-1.5 text-xl font-semibold tracking-[-0.03em] text-slate-50 sm:text-2xl"
                                        >
                                            Your stores
                                        </h2>

                                        <p className="mt-1.5 text-sm leading-6 text-slate-500">
                                            Open a store workspace to manage inventory, activity and profile information.
                                        </p>
                                    </div>

                                    {dashboard.stores.length >
                                        0 && (
                                            <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-900/50 px-3 py-2 text-xs font-medium text-slate-400">
                                                <Warehouse
                                                    className="size-3.5 text-sky-300"
                                                    aria-hidden="true"
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
                                        )}
                                </div>

                                {dashboard.stores.length ===
                                0 ? (
                                    <EmptyState
                                        title="No stores assigned"
                                        message="There are currently no stores assigned to this Store Owner account."
                                    />
                                ) : (
                                    <div className="grid gap-4 lg:grid-cols-2">
                                        {dashboard.stores.map(
                                            (
                                                storeDashboard,
                                                index,
                                            ) => (
                                                <StoreCard
                                                    key={
                                                        storeDashboard.store.id
                                                    }
                                                    dashboard={
                                                        storeDashboard
                                                    }
                                                    index={
                                                        index
                                                    }
                                                />
                                            ),
                                        )}
                                    </div>
                                )}
                            </section>
                        </>
                    )}
            </div>
        </StoreOwnerShell>
    )
}

function StoreCard({
                       dashboard,
                       index,
                   }: {
    dashboard: StoreDashboardSummary
    index: number
}) {
    const store =
        dashboard.store

    return (
        <motion.article
            initial={{
                opacity: 0,
                y: 8,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.3,
                delay:
                    Math.min(
                        index,
                        7,
                    ) * 0.035,
            }}
            className="premium-card group relative overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-0.5 hover:border-sky-300/15 motion-reduce:transform-none"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 size-44 rounded-full bg-sky-400/[0.035] blur-3xl transition duration-300 group-hover:bg-sky-400/[0.06]"
            />

            <div className="relative p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-sky-300/10 bg-sky-300/[0.06] text-sky-300">
                            <Warehouse
                                className="size-[18px]"
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h3 className="truncate text-lg font-semibold tracking-[-0.02em] text-slate-50">
                                    {store.name}
                                </h3>

                                <StatusBadge
                                    status={
                                        store.status
                                    }
                                />
                            </div>

                            <div className="mt-2 flex min-w-0 items-start gap-2 text-sm leading-6 text-slate-500">
                                <MapPin
                                    className="mt-1 size-3.5 shrink-0 text-slate-600"
                                    aria-hidden="true"
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
                        className="group/link inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-sky-300/15 bg-sky-300/[0.055] px-4 text-sm font-medium text-sky-300 transition duration-200 hover:border-sky-300/25 hover:bg-sky-300/[0.09] hover:text-sky-200"
                    >
                        Manage store

                        <ArrowUpRight
                            className="size-3.5 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                            aria-hidden="true"
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

                <div className="mt-5 grid gap-4 border-t border-slate-800/70 pt-5 sm:grid-cols-3">
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
        </motion.article>
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
                    ? 'rounded-xl border border-amber-300/10 bg-amber-300/[0.045] p-3'
                    : 'rounded-xl border border-slate-800/80 bg-slate-950/35 p-3'
            }
        >
            <p
                className={
                    attention
                        ? 'text-xl font-semibold text-amber-300'
                        : 'text-xl font-semibold text-slate-100'
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
                        ? 'mt-1 text-xs font-medium text-amber-400/75'
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
        <main className="relative min-h-dvh overflow-x-clip bg-slate-950 text-white">
            <StoreOwnerBackground />

            <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/85 backdrop-blur-2xl">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
                    <Link
                        to="/store"
                        aria-label="ShelfRadar Store Owner dashboard"
                        className="group flex min-w-0 items-center gap-3"
                    >
                        <img
                            src="/shelfradar-logo.png"
                            alt="ShelfRadar"
                            className="h-13 w-auto object-contain drop-shadow-[0_0_18px_rgba(56,189,248,0.08)] transition duration-300 group-hover:scale-[1.025]"
                        />

                        <span className="hidden rounded-full border border-sky-300/10 bg-sky-300/[0.055] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-sky-300 md:inline-flex">
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

                            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-600">
                                Store Owner
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onLogout}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/50 px-3.5 text-sm font-medium text-slate-300 transition duration-200 hover:border-slate-600 hover:bg-slate-800/70 hover:text-white"
                        >
                            <LogOut
                                className="size-4"
                                aria-hidden="true"
                            />

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

function StoreOwnerBackground() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 overflow-hidden"
        >
            <div className="animate-glow-drift absolute left-1/2 top-[-280px] h-[580px] w-[880px] -translate-x-1/2 rounded-full bg-sky-400/[0.06] blur-[150px] motion-reduce:animate-none" />

            <div className="animate-glow-drift absolute -left-56 top-[430px] size-[430px] rounded-full bg-cyan-400/[0.025] blur-[135px] [animation-delay:900ms] motion-reduce:animate-none" />

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
    )
}