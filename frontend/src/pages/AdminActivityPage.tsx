import type {
    FormEvent,
    ReactNode,
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
} from '../api/adminApi'

import AdminLayout from '../components/admin/AdminLayout'
import AuditRow from '../components/audit/AuditRow'
import ErrorState from '../components/ui/ErrorState'
import LoadingState from '../components/ui/LoadingState'
import MetricCard from '../components/ui/MetricCard'
import PageHeader from '../components/ui/PageHeader'

import {
    formatNumber,
} from '../lib/format'

import type {
    AuditAction,
    AuditEntityType,
} from '../types/audit'

interface AuditActionOption {
    value: AuditAction
    label: string
}

interface EntityTypeOption {
    value: AuditEntityType
    label: string
}

const AUDIT_ACTION_OPTIONS: AuditActionOption[] = [
    {
        value: 'INVENTORY_CREATED',
        label: 'Inventory created',
    },
    {
        value: 'INVENTORY_UPDATED',
        label: 'Inventory updated',
    },
    {
        value: 'INVENTORY_DELETED',
        label: 'Inventory deleted',
    },
    {
        value: 'STORE_PROFILE_UPDATED',
        label: 'Store profile updated',
    },
    {
        value: 'STORE_STATUS_CHANGED',
        label: 'Store status changed',
    },
    {
        value: 'STORE_OWNER_CHANGED',
        label: 'Store owner changed',
    },
    {
        value: 'PRODUCT_CREATED',
        label: 'Product created',
    },
    {
        value: 'PRODUCT_UPDATED',
        label: 'Product updated',
    },
    {
        value: 'PRODUCT_DELETED',
        label: 'Product deleted',
    },
    {
        value: 'BRAND_CREATED',
        label: 'Brand created',
    },
    {
        value: 'BRAND_UPDATED',
        label: 'Brand updated',
    },
    {
        value: 'BRAND_DELETED',
        label: 'Brand deleted',
    },
    {
        value: 'CATEGORY_CREATED',
        label: 'Category created',
    },
    {
        value: 'CATEGORY_UPDATED',
        label: 'Category updated',
    },
    {
        value: 'CATEGORY_DELETED',
        label: 'Category deleted',
    },
]

const ENTITY_TYPE_OPTIONS: EntityTypeOption[] = [
    {
        value: 'INVENTORY',
        label: 'Inventory',
    },
    {
        value: 'STORE',
        label: 'Store',
    },
    {
        value: 'PRODUCT',
        label: 'Product',
    },
    {
        value: 'BRAND',
        label: 'Brand',
    },
    {
        value: 'CATEGORY',
        label: 'Category',
    },
]

const inputClassName =
    'field min-h-11 w-full px-4 text-sm disabled:cursor-not-allowed disabled:opacity-50'

export default function AdminActivityPage() {
    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams()

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
                        q: query,
                        action,
                        entityType,
                        page,
                        size: 20,
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
            toAuditAction(
                String(
                    formData.get(
                        'action',
                    ) ??
                    '',
                ),
            )

        const nextEntityType =
            toEntityType(
                String(
                    formData.get(
                        'entityType',
                    ) ??
                    '',
                ),
            )

        const next =
            new URLSearchParams()

        if (nextQuery) {
            next.set(
                'q',
                nextQuery,
            )
        }

        if (nextAction) {
            next.set(
                'action',
                nextAction,
            )
        }

        if (nextEntityType) {
            next.set(
                'entityType',
                nextEntityType,
            )
        }

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

        const normalizedPage =
            Math.max(
                0,
                nextPage,
            )

        if (normalizedPage === 0) {
            next.delete(
                'page',
            )
        } else {
            next.set(
                'page',
                String(
                    normalizedPage,
                ),
            )
        }

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
                    title="Platform activity"
                    description="Review operational activity and historical changes across ShelfRadar."
                />

                <section
                    aria-label="Platform activity metrics"
                >
                    {analyticsQuery.isLoading && (
                        <LoadingState
                            message="Loading platform analytics..."
                        />
                    )}

                    {analyticsQuery.isError && (
                        <ErrorState
                            title="Analytics unavailable"
                            message="ShelfRadar could not load the platform activity metrics."
                            onRetry={
                                () => {
                                    void analyticsQuery.refetch()
                                }
                            }
                        />
                    )}

                    {analytics &&
                        !analyticsQuery.isLoading &&
                        !analyticsQuery.isError && (
                            <div className="space-y-5">
                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                    <MetricCard
                                        icon={
                                            <Clock3
                                                className="size-5"
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
                                                className="size-5"
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
                                                className="size-5"
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
                                                className="size-5"
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
                                    <AnalyticsPanel
                                        icon={
                                            <Activity
                                                className="size-[18px]"
                                                aria-hidden="true"
                                            />
                                        }
                                        title="Daily activity"
                                        description="Recorded actions over recent days."
                                    >
                                        {analytics.dailyActivity.length === 0 ? (
                                            <InlineEmptyState
                                                title="No daily activity"
                                                message="Platform activity will appear here once actions are recorded."
                                            />
                                        ) : (
                                            <div className="divide-y divide-slate-800/70">
                                                {analytics.dailyActivity.map(
                                                    item => (
                                                        <div
                                                            key={item.date}
                                                            className="flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-200 hover:bg-white/[0.018] sm:px-6"
                                                        >
                                                            <span className="text-sm text-slate-500">
                                                                {
                                                                    formatCalendarDate(
                                                                        item.date,
                                                                    )
                                                                }
                                                            </span>

                                                            <span className="rounded-lg bg-slate-400/[0.05] px-3 py-1.5 text-sm font-semibold text-slate-200 ring-1 ring-inset ring-slate-300/10">
                                                                {
                                                                    formatNumber(
                                                                        item.actions,
                                                                    )
                                                                }
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </AnalyticsPanel>

                                    <AnalyticsPanel
                                        icon={
                                            <Store
                                                className="size-[18px]"
                                                aria-hidden="true"
                                            />
                                        }
                                        title="Most active stores"
                                        description="Stores with the highest recorded activity."
                                    >
                                        {analytics.mostActiveStores.length === 0 ? (
                                            <InlineEmptyState
                                                title="No store activity"
                                                message="Store activity will appear here after store-related actions are recorded."
                                            />
                                        ) : (
                                            <div className="divide-y divide-slate-800/70">
                                                {analytics.mostActiveStores.map(
                                                    item => (
                                                        <div
                                                            key={item.storeId}
                                                            className="flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-200 hover:bg-white/[0.018] sm:px-6"
                                                        >
                                                            <div className="min-w-0">
                                                                <p className="truncate text-sm font-semibold text-slate-200">
                                                                    {
                                                                        item.storeName ??
                                                                        `Store ${item.storeId}`
                                                                    }
                                                                </p>

                                                                <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-600">
                                                                    Store activity
                                                                </p>
                                                            </div>

                                                            <span className="shrink-0 rounded-lg bg-slate-400/[0.05] px-3 py-1.5 text-xs font-semibold text-slate-300 ring-1 ring-inset ring-slate-300/10">
                                                                {
                                                                    formatNumber(
                                                                        item.actions,
                                                                    )
                                                                }{' '}
                                                                {
                                                                    item.actions === 1
                                                                        ? 'action'
                                                                        : 'actions'
                                                                }
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </AnalyticsPanel>
                                </div>
                            </div>
                        )}
                </section>

                <section
                    aria-labelledby="admin-audit-heading"
                    className="space-y-5"
                >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="eyebrow">
                                Audit trail
                            </p>

                            <h2
                                id="admin-audit-heading"
                                className="mt-1.5 text-2xl font-semibold tracking-[-0.03em] text-slate-50"
                            >
                                Audit log
                            </h2>

                            <p className="mt-1.5 text-sm leading-6 text-slate-500">
                                Search and filter recorded administrative and store-owner actions.
                            </p>
                        </div>

                        {auditQuery.isFetching &&
                            !auditQuery.isLoading && (
                                <span className="inline-flex items-center gap-2 self-start rounded-full border border-sky-300/10 bg-sky-300/[0.05] px-3 py-1.5 text-[10px] font-semibold text-slate-400 sm:self-auto">
                                    <LoaderCircle
                                        className="size-3 animate-spin text-sky-300"
                                        aria-hidden="true"
                                    />

                                    Updating
                                </span>
                            )}
                    </div>

                    <form
                        key={
                            searchParams.toString()
                        }
                        onSubmit={handleSubmit}
                        className="premium-card grid gap-3 rounded-2xl p-5 lg:grid-cols-[minmax(0,1fr)_220px_190px_auto]"
                    >
                        <label
                            htmlFor="audit-search"
                            className="sr-only"
                        >
                            Search audit log
                        </label>

                        <div className="relative">
                            <Search
                                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-600"
                                aria-hidden="true"
                            />

                            <input
                                id="audit-search"
                                name="q"
                                type="search"
                                defaultValue={query}
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

                            {AUDIT_ACTION_OPTIONS.map(
                                option => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ),
                            )}
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

                            {ENTITY_TYPE_OPTIONS.map(
                                option => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ),
                            )}
                        </select>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="shine-button inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-300 px-4 text-sm font-semibold text-slate-950 shadow-[0_12px_30px_rgba(14,165,233,0.15)] transition duration-200 hover:brightness-110 lg:flex-none"
                            >
                                <Filter
                                    className="size-3.5"
                                    aria-hidden="true"
                                />

                                Apply
                            </button>

                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    aria-label="Clear audit filters"
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/50 px-3.5 text-sm font-medium text-slate-400 transition duration-200 hover:border-slate-600 hover:bg-slate-800/70 hover:text-slate-100"
                                >
                                    <RotateCcw
                                        className="size-3.5"
                                        aria-hidden="true"
                                    />

                                    <span className="hidden xl:inline">
                                        Clear
                                    </span>
                                </button>
                            )}
                        </div>
                    </form>

                    {auditQuery.isLoading && (
                        <LoadingState
                            message="Loading audit log..."
                        />
                    )}

                    {auditQuery.isError && (
                        <ErrorState
                            title="Audit log unavailable"
                            message="ShelfRadar could not load the platform audit history."
                            onRetry={
                                () => {
                                    void auditQuery.refetch()
                                }
                            }
                        />
                    )}

                    {audit &&
                        !auditQuery.isLoading &&
                        !auditQuery.isError &&
                        audit.content.length === 0 && (
                            <div>
                                <InlineEmptyState
                                    title="No audit entries found"
                                    message={
                                        hasFilters
                                            ? 'No recorded activity matches the current filters.'
                                            : 'Recorded platform activity will appear here.'
                                    }
                                    action={
                                        hasFilters ? (
                                            <button
                                                type="button"
                                                onClick={clearFilters}
                                                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/50 px-4 text-sm font-medium text-slate-300 transition duration-200 hover:border-sky-300/15 hover:bg-sky-300/[0.05] hover:text-sky-300"
                                            >
                                                <RotateCcw
                                                    className="size-3.5"
                                                    aria-hidden="true"
                                                />

                                                Clear filters
                                            </button>
                                        ) : undefined
                                    }
                                />
                            </div>
                        )}

                    {audit &&
                        !auditQuery.isLoading &&
                        !auditQuery.isError &&
                        audit.content.length > 0 && (
                            <div className="premium-card overflow-hidden rounded-2xl">
                                <div className="divide-y divide-slate-800/70">
                                    {audit.content.map(
                                        entry => (
                                            <AuditRow
                                                key={entry.id}
                                                entry={entry}
                                            />
                                        ),
                                    )}
                                </div>

                                {audit.totalPages > 1 && (
                                    <div className="flex flex-col gap-3 border-t border-slate-800/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                        <PaginationButton
                                            direction="previous"
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
                                        />

                                        <span className="text-center text-xs text-slate-500">
                                            Page{' '}
                                            <strong className="font-semibold text-slate-300">
                                                {audit.page + 1}
                                            </strong>
                                            {' '}of{' '}
                                            <strong className="font-semibold text-slate-300">
                                                {audit.totalPages}
                                            </strong>
                                        </span>

                                        <PaginationButton
                                            direction="next"
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
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                </section>
            </div>
        </AdminLayout>
    )
}

function AnalyticsPanel({
                            icon,
                            title,
                            description,
                            children,
                        }: {
    icon: ReactNode
    title: string
    description: string
    children: ReactNode
}) {
    return (
        <section className="premium-card overflow-hidden rounded-2xl">
            <div className="flex items-center gap-3 border-b border-slate-800/80 px-5 py-4 sm:px-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-300/[0.07] text-sky-300">
                    {icon}
                </div>

                <div>
                    <h2 className="text-sm font-semibold text-slate-50">
                        {title}
                    </h2>

                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                        {description}
                    </p>
                </div>
            </div>

            {children}
        </section>
    )
}

function InlineEmptyState({
                              title,
                              message,
                              action,
                          }: {
    title: string
    message: string
    action?: ReactNode
}) {
    return (
        <div className="premium-card flex min-h-48 items-center justify-center rounded-2xl px-5 py-8 text-center sm:px-6">
            <div>
                <div className="mx-auto flex size-11 items-center justify-center rounded-xl border border-slate-800/80 bg-slate-950/40 text-slate-600">
                    <Activity
                        className="size-[18px]"
                        aria-hidden="true"
                    />
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-300">
                    {title}
                </p>

                <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-slate-500">
                    {message}
                </p>

                {action && (
                    <div className="mt-4">
                        {action}
                    </div>
                )}
            </div>
        </div>
    )
}

function PaginationButton({
                              direction,
                              disabled,
                              onClick,
                          }: {
    direction: 'previous' | 'next'
    disabled: boolean
    onClick: () => void
}) {
    const previous =
        direction ===
        'previous'

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/40 px-4 text-xs font-medium text-slate-400 transition duration-200 hover:border-slate-600 hover:bg-slate-800/70 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-35"
        >
            {previous && (
                <ChevronLeft
                    className="size-3.5"
                    aria-hidden="true"
                />
            )}

            {previous
                ? 'Previous'
                : 'Next'}

            {!previous && (
                <ChevronRight
                    className="size-3.5"
                    aria-hidden="true"
                />
            )}
        </button>
    )
}

function toAuditAction(
    value: string | null,
): AuditAction | undefined {
    return AUDIT_ACTION_OPTIONS.some(
        option =>
            option.value ===
            value,
    )
        ? value as AuditAction
        : undefined
}

function toEntityType(
    value: string | null,
): AuditEntityType | undefined {
    return ENTITY_TYPE_OPTIONS.some(
        option =>
            option.value ===
            value,
    )
        ? value as AuditEntityType
        : undefined
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
    parsed >= 0
        ? parsed
        : 0
}

function formatCalendarDate(
    value: string,
): string {
    const [
        year,
        month,
        day,
    ] =
        value
            .split('-')
            .map(Number)

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