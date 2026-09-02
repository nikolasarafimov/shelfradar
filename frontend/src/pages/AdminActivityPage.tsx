import type {
    FormEvent,
} from 'react'

import {
    useQuery,
} from '@tanstack/react-query'

import {
    Activity,
    Boxes,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Filter,
    LoaderCircle,
    RotateCcw,
    Search,
    Store,
} from 'lucide-react'

import {
    useSearchParams,
} from 'react-router-dom'

import {
    getAdminAnalytics,
    getAdminAudit,
} from '../api/auditApi'

import AdminLayout
    from '../components/admin/AdminLayout'

import AuditRow
    from '../components/audit/AuditRow'

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

import {
    formatNumber,
} from '../lib/format'

import type {
    AuditAction,
    AuditEntityType,
} from '../types/audit'


export default function AdminActivityPage() {

    const [
        searchParams,
        setSearchParams,
    ] =
        useSearchParams()


    const query =
        searchParams.get(
            'q',
        ) ??
        ''


    const action =
        toAuditAction(
            searchParams.get(
                'action',
            ),
        )


    const entityType =
        toEntityType(
            searchParams.get(
                'entityType',
            ),
        )


    const page =
        toPage(
            searchParams.get(
                'page',
            ),
        )


    const analyticsQuery =
        useQuery({
            queryKey: [
                'admin-analytics',
            ],

            queryFn:
            getAdminAnalytics,
        })


    const auditQuery =
        useQuery({
            queryKey: [
                'admin-audit',
                query,
                action,
                entityType,
                page,
            ],

            queryFn:
                () =>
                    getAdminAudit({
                        q:
                        query,

                        action,

                        entityType,

                        page,

                        size:
                            20,
                    }),
        })


    function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault()


        const formData =
            new FormData(
                event.currentTarget,
            )


        const nextQuery =
            String(
                formData.get(
                    'q',
                ) ??
                '',
            ).trim()


        const nextAction =
            String(
                formData.get(
                    'action',
                ) ??
                '',
            )


        const nextEntityType =
            String(
                formData.get(
                    'entityType',
                ) ??
                '',
            )


        const next =
            new URLSearchParams()


        if (
            nextQuery
        ) {

            next.set(
                'q',
                nextQuery,
            )
        }


        if (
            nextAction
        ) {

            next.set(
                'action',
                nextAction,
            )
        }


        if (
            nextEntityType
        ) {

            next.set(
                'entityType',
                nextEntityType,
            )
        }


        next.set(
            'page',
            '0',
        )


        setSearchParams(
            next,
        )
    }


    function clearFilters() {

        setSearchParams(
            new URLSearchParams(),
        )
    }


    function changePage(
        nextPage: number,
    ) {

        const next =
            new URLSearchParams(
                searchParams,
            )


        next.set(
            'page',
            String(
                Math.max(
                    0,
                    nextPage,
                ),
            ),
        )


        setSearchParams(
            next,
        )
    }


    const analytics =
        analyticsQuery.data


    const audit =
        auditQuery.data


    const hasFilters =
        Boolean(
            query ||
            action ||
            entityType,
        )


    return (
        <AdminLayout>

            <div className="space-y-8">

                <PageHeader
                    eyebrow="Analytics & Audit"
                    title="Platform Activity"
                    description="Review operational activity and historical changes across ShelfRadar."
                />


                <section
                    aria-label="Platform activity metrics"
                >

                    {
                        analyticsQuery.isLoading && (

                            <LoadingState
                                message="Loading platform analytics..."
                            />
                        )
                    }


                    {
                        analyticsQuery.isError && (

                            <ErrorState
                                title="Analytics unavailable"
                                message="ShelfRadar could not load the platform activity metrics."
                                onRetry={
                                    () => {
                                        void analyticsQuery.refetch()
                                    }
                                }
                            />
                        )
                    }


                    {
                        analytics &&
                        !analyticsQuery.isLoading &&
                        !analyticsQuery.isError && (

                            <div className="space-y-5">

                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                                    <MetricCard
                                        icon={
                                            <Clock3
                                                size={20}
                                            />
                                        }
                                        label="Last 24 hours"
                                        value={
                                            formatNumber(
                                                analytics.activityLast24Hours,
                                            )
                                        }
                                    />


                                    <MetricCard
                                        icon={
                                            <Activity
                                                size={20}
                                            />
                                        }
                                        label="Last 7 days"
                                        value={
                                            formatNumber(
                                                analytics.activityLast7Days,
                                            )
                                        }
                                    />


                                    <MetricCard
                                        icon={
                                            <Boxes
                                                size={20}
                                            />
                                        }
                                        label="Inventory changes"
                                        value={
                                            formatNumber(
                                                analytics.inventoryChangesLast7Days,
                                            )
                                        }
                                    />


                                    <MetricCard
                                        icon={
                                            <Store
                                                size={20}
                                            />
                                        }
                                        label="Store changes"
                                        value={
                                            formatNumber(
                                                analytics.storeChangesLast7Days,
                                            )
                                        }
                                    />

                                </div>


                                <div className="grid items-start gap-5 lg:grid-cols-2">

                                    <section className="premium-card overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/55 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.8)] backdrop-blur-xl">

                                        <div className="flex items-center gap-3 border-b border-slate-800/80 px-5 py-4 sm:px-6">

                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-900/50 bg-sky-950/30 text-sky-400">

                                                <Activity
                                                    size={17}
                                                />

                                            </div>


                                            <div>

                                                <h2 className="text-sm font-bold text-white">
                                                    Daily activity
                                                </h2>


                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    Recorded actions over recent days.
                                                </p>

                                            </div>

                                        </div>


                                        {
                                            analytics.dailyActivity.length ===
                                            0 ? (

                                                <div className="p-5 sm:p-6">

                                                    <EmptyState
                                                        title="No daily activity"
                                                        message="Platform activity will appear here once actions are recorded."
                                                    />

                                                </div>

                                            ) : (

                                                <div className="divide-y divide-slate-800/70">

                                                    {
                                                        analytics.dailyActivity.map(
                                                            item => (

                                                                <div
                                                                    key={
                                                                        item.date
                                                                    }
                                                                    className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-800/25 sm:px-6"
                                                                >

                                                                    <span className="text-sm text-slate-500">
                                                                        {
                                                                            formatDate(
                                                                                item.date,
                                                                            )
                                                                        }
                                                                    </span>


                                                                    <span className="rounded-lg border border-slate-800 bg-[#020817]/55 px-3 py-1.5 text-sm font-bold text-slate-200">
                                                                        {
                                                                            formatNumber(
                                                                                item.actions,
                                                                            )
                                                                        }
                                                                    </span>

                                                                </div>
                                                            ),
                                                        )
                                                    }

                                                </div>
                                            )
                                        }

                                    </section>


                                    <section className="premium-card overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/55 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.8)] backdrop-blur-xl">

                                        <div className="flex items-center gap-3 border-b border-slate-800/80 px-5 py-4 sm:px-6">

                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-900/50 bg-sky-950/30 text-sky-400">

                                                <Store
                                                    size={17}
                                                />

                                            </div>


                                            <div>

                                                <h2 className="text-sm font-bold text-white">
                                                    Most active stores
                                                </h2>


                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    Stores with the highest recorded activity.
                                                </p>

                                            </div>

                                        </div>


                                        {
                                            analytics.mostActiveStores.length ===
                                            0 ? (

                                                <div className="p-5 sm:p-6">

                                                    <EmptyState
                                                        title="No store activity"
                                                        message="Store activity will appear here after store-related actions are recorded."
                                                    />

                                                </div>

                                            ) : (

                                                <div className="divide-y divide-slate-800/70">

                                                    {
                                                        analytics.mostActiveStores.map(
                                                            item => (

                                                                <div
                                                                    key={
                                                                        item.storeId
                                                                    }
                                                                    className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-800/25 sm:px-6"
                                                                >

                                                                    <div className="min-w-0">

                                                                        <p className="truncate text-sm font-semibold text-slate-200">
                                                                            {
                                                                                item.storeName ??
                                                                                `Store ${item.storeId}`
                                                                            }
                                                                        </p>

                                                                        <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">
                                                                            Store activity
                                                                        </p>

                                                                    </div>


                                                                    <span className="shrink-0 rounded-lg border border-slate-800 bg-[#020817]/55 px-3 py-1.5 text-xs font-semibold text-slate-300">

                                                                        {
                                                                            formatNumber(
                                                                                item.actions,
                                                                            )
                                                                        }{' '}

                                                                        {
                                                                            item.actions ===
                                                                            1
                                                                                ? 'action'
                                                                                : 'actions'
                                                                        }

                                                                    </span>

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

                </section>


                <section
                    aria-labelledby="admin-audit-heading"
                    className="space-y-5"
                >

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                        <div>

                            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-sky-400">
                                Audit trail
                            </p>


                            <h2
                                id="admin-audit-heading"
                                className="mt-1 text-2xl font-bold tracking-tight text-white"
                            >
                                Audit Log
                            </h2>


                            <p className="mt-1 text-sm text-slate-500">
                                Search and filter recorded administrative and store-owner actions.
                            </p>

                        </div>


                        {
                            auditQuery.isFetching &&
                            !auditQuery.isLoading && (

                                <span className="inline-flex items-center gap-2 self-start rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-[10px] font-semibold text-slate-500 sm:self-auto">

                                    <LoaderCircle
                                        size={12}
                                        className="animate-spin text-sky-400"
                                    />

                                    Updating

                                </span>
                            )
                        }

                    </div>


                    <form
                        key={
                            searchParams.toString()
                        }
                        onSubmit={
                            handleSubmit
                        }
                        className="premium-card grid gap-3 rounded-3xl border border-slate-800/90 bg-slate-900/55 p-5 backdrop-blur-xl lg:grid-cols-[minmax(0,1fr)_220px_190px_auto]"
                    >

                        <label
                            htmlFor="audit-search"
                            className="sr-only"
                        >
                            Search audit log
                        </label>


                        <div className="relative">

                            <Search
                                size={15}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                            />


                            <input
                                id="audit-search"
                                name="q"
                                type="search"
                                defaultValue={
                                    query
                                }
                                placeholder="Actor, store, product..."
                                className={`${inputClassName} pl-11`}
                            />

                        </div>


                        <label
                            htmlFor="audit-action"
                            className="sr-only"
                        >
                            Filter by action
                        </label>


                        <select
                            id="audit-action"
                            name="action"
                            defaultValue={
                                action ??
                                ''
                            }
                            className={inputClassName}
                        >

                            <option value="">
                                All actions
                            </option>

                            <option value="INVENTORY_CREATED">
                                Inventory created
                            </option>

                            <option value="INVENTORY_UPDATED">
                                Inventory updated
                            </option>

                            <option value="INVENTORY_DELETED">
                                Inventory deleted
                            </option>

                            <option value="STORE_PROFILE_UPDATED">
                                Store updated
                            </option>

                            <option value="STORE_STATUS_CHANGED">
                                Store status changed
                            </option>

                            <option value="STORE_OWNER_CHANGED">
                                Store owner changed
                            </option>

                        </select>


                        <label
                            htmlFor="audit-entity"
                            className="sr-only"
                        >
                            Filter by entity type
                        </label>


                        <select
                            id="audit-entity"
                            name="entityType"
                            defaultValue={
                                entityType ??
                                ''
                            }
                            className={inputClassName}
                        >

                            <option value="">
                                All entities
                            </option>

                            <option value="INVENTORY">
                                Inventory
                            </option>

                            <option value="STORE">
                                Store
                            </option>

                            <option value="PRODUCT">
                                Product
                            </option>

                            <option value="BRAND">
                                Brand
                            </option>

                            <option value="CATEGORY">
                                Category
                            </option>

                        </select>


                        <div className="flex gap-2">

                            <button
                                type="submit"
                                className="shine-button inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 text-sm font-bold text-slate-950 transition hover:brightness-110 lg:flex-none"
                            >

                                <Filter
                                    size={14}
                                />

                                Apply

                            </button>


                            {
                                hasFilters && (

                                    <button
                                        type="button"
                                        onClick={
                                            clearFilters
                                        }
                                        aria-label="Clear audit filters"
                                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/50 px-3.5 text-sm font-semibold text-slate-400 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
                                    >

                                        <RotateCcw
                                            size={14}
                                        />

                                        <span className="hidden xl:inline">
                                            Clear
                                        </span>

                                    </button>
                                )
                            }

                        </div>

                    </form>


                    {
                        auditQuery.isLoading && (

                            <LoadingState
                                message="Loading audit log..."
                            />
                        )
                    }


                    {
                        auditQuery.isError && (

                            <ErrorState
                                title="Audit log unavailable"
                                message="ShelfRadar could not load the platform audit history."
                                onRetry={
                                    () => {
                                        void auditQuery.refetch()
                                    }
                                }
                            />
                        )
                    }


                    {
                        audit &&
                        !auditQuery.isLoading &&
                        !auditQuery.isError && (

                            <div className="premium-card overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/55 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.8)] backdrop-blur-xl">

                                {
                                    audit.content.length ===
                                    0 ? (

                                        <div className="p-5 sm:p-6">

                                            <EmptyState
                                                title="No audit entries found"
                                                message={
                                                    hasFilters
                                                        ? 'No recorded activity matches the current filters.'
                                                        : 'Recorded platform activity will appear here.'
                                                }
                                                action={
                                                    hasFilters
                                                        ? (
                                                            <button
                                                                type="button"
                                                                onClick={
                                                                    clearFilters
                                                                }
                                                                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-4 text-sm font-semibold text-slate-300 transition hover:border-sky-900 hover:bg-sky-950/20 hover:text-sky-300"
                                                            >
                                                                <RotateCcw
                                                                    size={14}
                                                                />

                                                                Clear filters
                                                            </button>
                                                        )
                                                        : undefined
                                                }
                                            />

                                        </div>

                                    ) : (

                                        <div>
                                            {
                                                audit.content.map(
                                                    entry => (

                                                        <AuditRow
                                                            key={
                                                                entry.id
                                                            }
                                                            entry={
                                                                entry
                                                            }
                                                        />
                                                    ),
                                                )
                                            }
                                        </div>
                                    )
                                }


                                {
                                    audit.totalPages >
                                    1 && (

                                        <div className="flex flex-col gap-3 border-t border-slate-800/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                                            <button
                                                type="button"
                                                disabled={
                                                    audit.first ||
                                                    auditQuery.isFetching
                                                }
                                                onClick={
                                                    () =>
                                                        changePage(
                                                            audit.page - 1,
                                                        )
                                                }
                                                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/40 px-4 text-xs font-semibold text-slate-400 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                                            >

                                                <ChevronLeft
                                                    size={14}
                                                />

                                                Previous

                                            </button>


                                            <span className="text-center text-xs text-slate-500">

                                                Page{' '}

                                                <strong className="font-semibold text-slate-300">
                                                    {
                                                        audit.page +
                                                        1
                                                    }
                                                </strong>

                                                {' '}of{' '}

                                                <strong className="font-semibold text-slate-300">
                                                    {
                                                        audit.totalPages
                                                    }
                                                </strong>

                                            </span>


                                            <button
                                                type="button"
                                                disabled={
                                                    audit.last ||
                                                    auditQuery.isFetching
                                                }
                                                onClick={
                                                    () =>
                                                        changePage(
                                                            audit.page + 1,
                                                        )
                                                }
                                                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/40 px-4 text-xs font-semibold text-slate-400 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                                            >

                                                Next

                                                <ChevronRight
                                                    size={14}
                                                />

                                            </button>

                                        </div>
                                    )
                                }

                            </div>
                        )
                    }

                </section>

            </div>

        </AdminLayout>
    )
}


function toAuditAction(
    value: string | null,
): AuditAction | undefined {

    const actions:
        AuditAction[] = [
        'INVENTORY_CREATED',
        'INVENTORY_UPDATED',
        'INVENTORY_DELETED',
        'STORE_PROFILE_UPDATED',
        'STORE_STATUS_CHANGED',
        'STORE_OWNER_CHANGED',
        'PRODUCT_CREATED',
        'PRODUCT_UPDATED',
        'PRODUCT_DELETED',
        'BRAND_CREATED',
        'BRAND_UPDATED',
        'BRAND_DELETED',
        'CATEGORY_CREATED',
        'CATEGORY_UPDATED',
        'CATEGORY_DELETED',
    ]


    return actions.includes(
        value as AuditAction,
    )
        ? value as AuditAction
        : undefined
}


function toEntityType(
    value: string | null,
): AuditEntityType | undefined {

    if (
        value ===
        'INVENTORY' ||
        value ===
        'STORE' ||
        value ===
        'PRODUCT' ||
        value ===
        'BRAND' ||
        value ===
        'CATEGORY'
    ) {
        return value
    }


    return undefined
}


function toPage(
    value: string | null,
): number {

    const parsed =
        Number(
            value,
        )


    return Number.isInteger(
        parsed,
    ) &&
    parsed >=
    0
        ? parsed
        : 0
}


function formatDate(
    value: string,
): string {

    const [
        year,
        month,
        day,
    ] =
        value
            .split(
                '-',
            )
            .map(
                Number,
            )


    if (
        !year ||
        !month ||
        !day
    ) {
        return value
    }


    return new Intl.DateTimeFormat(
        'en-GB',
        {
            dateStyle:
                'medium',
        },
    ).format(
        new Date(
            year,
            month - 1,
            day,
        ),
    )
}

const inputClassName =
    'min-h-11 w-full rounded-xl border border-slate-700 bg-[#020817]/85 px-4 text-sm text-white outline-none transition duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:opacity-50'