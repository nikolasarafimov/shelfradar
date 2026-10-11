import type {
    FormEvent,
} from 'react'

import {
    useQuery,
} from '@tanstack/react-query'

import {
    motion,
} from 'motion/react'

import {
    ArrowUpRight,
    ChevronLeft,
    ChevronRight,
    Filter,
    LoaderCircle,
    MapPin,
    RotateCcw,
    Search,
    Store,
    UserRound,
} from 'lucide-react'

import {
    Link,
    useSearchParams,
} from 'react-router-dom'

import {
    getAdminStoreFilters,
    getAdminStores,
} from '../api/adminApi'

import AdminLayout from '../components/admin/AdminLayout'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import LoadingState from '../components/ui/LoadingState'
import PageHeader from '../components/ui/PageHeader'
import StatusBadge from '../components/ui/StatusBadge'

import {
    formatNumber,
} from '../lib/format'

import type {
    AdminStoreSort,
} from '../types/admin'

import type {
    StoreStatus,
} from '../types/store'

interface StoreStatusOption {
    value: StoreStatus
    label: string
}

interface StoreSortOption {
    value: AdminStoreSort
    label: string
}

const STORE_STATUS_OPTIONS: StoreStatusOption[] = [
    {
        value: 'PENDING',
        label: 'Pending',
    },
    {
        value: 'ACTIVE',
        label: 'Active',
    },
    {
        value: 'INACTIVE',
        label: 'Inactive',
    },
]

const STORE_SORT_OPTIONS: StoreSortOption[] = [
    {
        value: 'newest',
        label: 'Newest',
    },
    {
        value: 'oldest',
        label: 'Oldest',
    },
    {
        value: 'nameAsc',
        label: 'Name A-Z',
    },
    {
        value: 'nameDesc',
        label: 'Name Z-A',
    },
    {
        value: 'statusAsc',
        label: 'Status',
    },
]

const inputClassName =
    'field min-h-11 w-full px-4 text-sm disabled:cursor-not-allowed disabled:opacity-50'

export default function AdminStoresPage() {
    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams()

    const query =
        searchParams.get(
            'q',
        ) ??
        ''

    const status =
        toStoreStatus(
            searchParams.get(
                'status',
            ),
        )

    const city =
        searchParams.get(
            'city',
        ) ??
        ''

    const page =
        toPage(
            searchParams.get(
                'page',
            ),
        )

    const sort =
        toSort(
            searchParams.get(
                'sort',
            ),
        )

    const filtersQuery =
        useQuery({
            queryKey: [
                'admin-store-filters',
            ],

            queryFn:
            getAdminStoreFilters,
        })

    const storesQuery =
        useQuery({
            queryKey: [
                'admin-stores',
                query,
                status,
                city,
                page,
                sort,
            ],

            queryFn:
                () =>
                    getAdminStores({
                        q: query,
                        status,
                        city,
                        page,
                        size: 20,
                        sort,
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

        const nextStatus =
            toStoreStatus(
                String(
                    formData.get(
                        'status',
                    ) ??
                    '',
                ),
            )

        const nextCity =
            String(
                formData.get(
                    'city',
                ) ??
                '',
            ).trim()

        const nextSort =
            toSort(
                String(
                    formData.get(
                        'sort',
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

        if (nextStatus) {
            next.set(
                'status',
                nextStatus,
            )
        }

        if (nextCity) {
            next.set(
                'city',
                nextCity,
            )
        }

        if (nextSort !== 'newest') {
            next.set(
                'sort',
                nextSort,
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

    const data =
        storesQuery.data

    const hasFilters =
        Boolean(
            query ||
            status ||
            city ||
            sort !== 'newest',
        )

    return (
        <AdminLayout>
            <div className="space-y-8">
                <PageHeader
                    eyebrow="Administration"
                    title="Store management"
                    description="Review, approve and manage every store registered on ShelfRadar."
                />

                <form
                    key={
                        searchParams.toString()
                    }
                    onSubmit={handleSubmit}
                    className="premium-card grid gap-3 rounded-2xl p-5 xl:grid-cols-[minmax(240px,1fr)_170px_180px_170px_auto]"
                >
                    <div>
                        <label
                            htmlFor="admin-store-search"
                            className="sr-only"
                        >
                            Search stores
                        </label>

                        <div className="relative">
                            <Search
                                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-600"
                                aria-hidden="true"
                            />

                            <input
                                id="admin-store-search"
                                name="q"
                                type="search"
                                defaultValue={query}
                                autoComplete="off"
                                placeholder="Store, owner, email..."
                                className={`${inputClassName} pl-11`}
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="admin-store-status"
                            className="sr-only"
                        >
                            Filter by status
                        </label>

                        <select
                            id="admin-store-status"
                            name="status"
                            defaultValue={
                                status ??
                                ''
                            }
                            className={inputClassName}
                        >
                            <option value="">
                                All statuses
                            </option>

                            {STORE_STATUS_OPTIONS.map(
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
                    </div>

                    <div>
                        <label
                            htmlFor="admin-store-city"
                            className="sr-only"
                        >
                            Filter by city
                        </label>

                        <select
                            id="admin-store-city"
                            name="city"
                            defaultValue={city}
                            disabled={
                                filtersQuery.isLoading ||
                                filtersQuery.isError
                            }
                            className={inputClassName}
                        >
                            <option value="">
                                {filtersQuery.isLoading
                                    ? 'Loading cities...'
                                    : filtersQuery.isError
                                        ? 'Cities unavailable'
                                        : 'All cities'}
                            </option>

                            {filtersQuery.data?.cities.map(
                                item => (
                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>
                                ),
                            )}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="admin-store-sort"
                            className="sr-only"
                        >
                            Sort stores
                        </label>

                        <select
                            id="admin-store-sort"
                            name="sort"
                            defaultValue={sort}
                            className={inputClassName}
                        >
                            {STORE_SORT_OPTIONS.map(
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
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="shine-button inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-300 px-4 text-sm font-semibold text-slate-950 shadow-[0_12px_30px_rgba(14,165,233,0.15)] transition duration-200 hover:brightness-110 xl:flex-none"
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
                                aria-label="Clear store filters"
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/50 px-3.5 text-sm font-medium text-slate-400 transition duration-200 hover:border-slate-600 hover:bg-slate-800/70 hover:text-slate-100"
                            >
                                <RotateCcw
                                    className="size-3.5"
                                    aria-hidden="true"
                                />

                                <span className="hidden 2xl:inline">
                                    Clear
                                </span>
                            </button>
                        )}
                    </div>
                </form>

                {storesQuery.isLoading && (
                    <LoadingState
                        message="Loading stores..."
                    />
                )}

                {storesQuery.isError && (
                    <ErrorState
                        title="Stores unavailable"
                        message="ShelfRadar could not load the store directory."
                        onRetry={
                            () => {
                                void storesQuery.refetch()
                            }
                        }
                    />
                )}

                {data &&
                    !storesQuery.isLoading &&
                    !storesQuery.isError && (
                        <section
                            aria-labelledby="admin-stores-results"
                            className="space-y-4"
                        >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="eyebrow">
                                        Directory
                                    </p>

                                    <h2
                                        id="admin-stores-results"
                                        className="mt-1.5 text-xl font-semibold tracking-[-0.03em] text-slate-50"
                                    >
                                        Stores
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {
                                            formatNumber(
                                                data.totalElements,
                                            )
                                        }{' '}
                                        {
                                            data.totalElements === 1
                                                ? 'store found'
                                                : 'stores found'
                                        }
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    {storesQuery.isFetching &&
                                        !storesQuery.isLoading && (
                                            <span className="inline-flex items-center gap-2 rounded-full border border-sky-300/10 bg-sky-300/[0.05] px-3 py-1.5 text-[10px] font-semibold text-slate-400">
                                                <LoaderCircle
                                                    className="size-3 animate-spin text-sky-300"
                                                    aria-hidden="true"
                                                />

                                                Updating
                                            </span>
                                        )}

                                    {hasFilters && (
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="inline-flex w-fit items-center gap-2 text-xs font-semibold text-sky-300 transition duration-200 hover:text-sky-200"
                                        >
                                            <RotateCcw
                                                className="size-3.5"
                                                aria-hidden="true"
                                            />

                                            Clear filters
                                        </button>
                                    )}
                                </div>
                            </div>

                            {data.content.length === 0 ? (
                                <EmptyState
                                    title={
                                        hasFilters
                                            ? 'No matching stores'
                                            : 'No stores found'
                                    }
                                    message={
                                        hasFilters
                                            ? 'No stores match the current search and filter criteria.'
                                            : 'Registered stores will appear here when they become available.'
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
                            ) : (
                                <div className="space-y-3">
                                    {data.content.map(
                                        (
                                            store,
                                            index,
                                        ) => (
                                            <motion.div
                                                key={store.id}
                                                initial={{
                                                    opacity: 0,
                                                    y: 7,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                transition={{
                                                    duration: 0.28,
                                                    delay:
                                                        Math.min(
                                                            index,
                                                            8,
                                                        ) * 0.025,
                                                }}
                                            >
                                                <Link
                                                    to={
                                                        `/admin/stores/${store.id}`
                                                    }
                                                    className="premium-card group relative block overflow-hidden rounded-2xl px-5 py-4 transition duration-200 hover:-translate-y-0.5 hover:border-sky-300/15 sm:px-6"
                                                >
                                                    <div
                                                        aria-hidden="true"
                                                        className="pointer-events-none absolute -left-20 -top-20 size-40 rounded-full bg-sky-400/[0.025] blur-3xl transition duration-300 group-hover:bg-sky-400/[0.05]"
                                                    />

                                                    <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                                        <div className="flex min-w-0 items-start gap-4">
                                                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-sky-300/10 bg-sky-300/[0.06] text-sky-300">
                                                                <Store
                                                                    className="size-[18px]"
                                                                    strokeWidth={1.8}
                                                                    aria-hidden="true"
                                                                />
                                                            </div>

                                                            <div className="min-w-0">
                                                                <div className="flex flex-wrap items-center gap-2.5">
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

                                                                <div className="mt-2 flex min-w-0 items-start gap-1.5 text-xs leading-5 text-slate-500">
                                                                    <MapPin
                                                                        className="mt-0.5 size-3 shrink-0 text-slate-600"
                                                                        aria-hidden="true"
                                                                    />

                                                                    <span className="truncate">
                                                                        {
                                                                            store.address
                                                                        }
                                                                        ,{' '}
                                                                        {
                                                                            store.city
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col gap-4 border-t border-slate-800/70 pt-4 sm:flex-row sm:items-center sm:justify-between lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                                                            <div className="flex min-w-0 items-center gap-3">
                                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-800/80 bg-slate-950/40 text-slate-600">
                                                                    <UserRound
                                                                        className="size-4"
                                                                        aria-hidden="true"
                                                                    />
                                                                </div>

                                                                <div className="min-w-0 lg:w-52">
                                                                    <p className="truncate text-xs font-semibold text-slate-300">
                                                                        {
                                                                            store.owner.fullName
                                                                        }
                                                                    </p>

                                                                    <p className="mt-0.5 truncate text-[11px] text-slate-600">
                                                                        {
                                                                            store.owner.email
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-sky-300">
                                                                Review

                                                                <ArrowUpRight
                                                                    className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ),
                                    )}
                                </div>
                            )}

                            {data.totalPages > 1 && (
                                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                                    <PaginationButton
                                        direction="previous"
                                        disabled={
                                            data.first ||
                                            storesQuery.isFetching
                                        }
                                        onClick={
                                            () =>
                                                changePage(
                                                    data.page - 1,
                                                )
                                        }
                                    />

                                    <span className="text-center text-xs text-slate-500">
                                        Page{' '}
                                        <strong className="font-semibold text-slate-300">
                                            {data.page + 1}
                                        </strong>
                                        {' '}of{' '}
                                        <strong className="font-semibold text-slate-300">
                                            {data.totalPages}
                                        </strong>
                                    </span>

                                    <PaginationButton
                                        direction="next"
                                        disabled={
                                            data.last ||
                                            storesQuery.isFetching
                                        }
                                        onClick={
                                            () =>
                                                changePage(
                                                    data.page + 1,
                                                )
                                        }
                                    />
                                </div>
                            )}
                        </section>
                    )}
            </div>
        </AdminLayout>
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

function toStoreStatus(
    value: string | null,
): StoreStatus | undefined {
    return STORE_STATUS_OPTIONS.some(
        option =>
            option.value ===
            value,
    )
        ? value as StoreStatus
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

function toSort(
    value: string | null,
): AdminStoreSort {
    return STORE_SORT_OPTIONS.some(
        option =>
            option.value ===
            value,
    )
        ? value as AdminStoreSort
        : 'newest'
}