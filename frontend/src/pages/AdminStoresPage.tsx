import type {
    FormEvent,
} from 'react'

import {
    useQuery,
} from '@tanstack/react-query'

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
} from '../api/adminStoreApi'

import AdminLayout
    from '../components/admin/AdminLayout'

import EmptyState
    from '../components/ui/EmptyState'

import ErrorState
    from '../components/ui/ErrorState'

import LoadingState
    from '../components/ui/LoadingState'

import PageHeader
    from '../components/ui/PageHeader'

import StatusBadge
    from '../components/ui/StatusBadge'

import {
    formatNumber,
} from '../lib/format'

import type {
    AdminStoreSort,
} from '../types/admin'

import type {
    StoreStatus,
} from '../types/store'


export default function AdminStoresPage() {

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
                        q:
                        query,

                        status,

                        city,

                        page,

                        size:
                            20,

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


        if (
            nextQuery
        ) {

            next.set(
                'q',
                nextQuery,
            )
        }


        if (
            nextStatus
        ) {

            next.set(
                'status',
                nextStatus,
            )
        }


        if (
            nextCity
        ) {

            next.set(
                'city',
                nextCity,
            )
        }


        if (
            nextSort !==
            'newest'
        ) {

            next.set(
                'sort',
                nextSort,
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


    const data =
        storesQuery.data


    const hasFilters =
        Boolean(
            query ||
            status ||
            city ||
            sort !==
            'newest',
        )


    return (
        <AdminLayout>

            <div className="space-y-8">

                <PageHeader
                    eyebrow="Administration"
                    title="Store Management"
                    description="Review, approve and manage every store registered on ShelfRadar."
                />


                <form
                    key={
                        searchParams.toString()
                    }
                    onSubmit={
                        handleSubmit
                    }
                    className="premium-card grid gap-3 rounded-3xl border border-slate-800/90 bg-slate-900/55 p-5 backdrop-blur-xl xl:grid-cols-[minmax(240px,1fr)_170px_180px_170px_auto]"
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
                                size={15}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                            />


                            <input
                                id="admin-store-search"
                                name="q"
                                type="search"
                                defaultValue={
                                    query
                                }
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

                            <option value="PENDING">
                                Pending
                            </option>

                            <option value="ACTIVE">
                                Active
                            </option>

                            <option value="INACTIVE">
                                Inactive
                            </option>

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
                            defaultValue={
                                city
                            }
                            disabled={
                                filtersQuery.isLoading ||
                                filtersQuery.isError
                            }
                            className={inputClassName}
                        >

                            <option value="">
                                {
                                    filtersQuery.isLoading
                                        ? 'Loading cities...'
                                        : filtersQuery.isError
                                            ? 'Cities unavailable'
                                            : 'All cities'
                                }
                            </option>


                            {
                                filtersQuery.data?.cities.map(
                                    item => (

                                        <option
                                            key={
                                                item
                                            }
                                            value={
                                                item
                                            }
                                        >
                                            {item}
                                        </option>
                                    ),
                                )
                            }

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
                            defaultValue={
                                sort
                            }
                            className={inputClassName}
                        >

                            <option value="newest">
                                Newest
                            </option>

                            <option value="oldest">
                                Oldest
                            </option>

                            <option value="nameAsc">
                                Name A-Z
                            </option>

                            <option value="nameDesc">
                                Name Z-A
                            </option>

                            <option value="statusAsc">
                                Status
                            </option>

                        </select>

                    </div>


                    <div className="flex gap-2">

                        <button
                            type="submit"
                            className="shine-button inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 text-sm font-bold text-slate-950 transition hover:brightness-110 xl:flex-none"
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
                                    aria-label="Clear store filters"
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/50 px-3.5 text-sm font-semibold text-slate-400 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
                                >

                                    <RotateCcw
                                        size={14}
                                    />

                                    <span className="hidden 2xl:inline">
                                        Clear
                                    </span>

                                </button>
                            )
                        }

                    </div>

                </form>


                {
                    storesQuery.isFetching &&
                    !storesQuery.isLoading && (

                        <div className="flex justify-end">

                            <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-[10px] font-semibold text-slate-500">

                                <LoaderCircle
                                    size={12}
                                    className="animate-spin text-sky-400"
                                />

                                Updating stores

                            </span>

                        </div>
                    )
                }


                {
                    storesQuery.isLoading && (

                        <LoadingState
                            message="Loading stores..."
                        />
                    )
                }


                {
                    storesQuery.isError && (

                        <ErrorState
                            title="Stores unavailable"
                            message="ShelfRadar could not load the store directory."
                            onRetry={
                                () => {
                                    void storesQuery.refetch()
                                }
                            }
                        />
                    )
                }


                {
                    data &&
                    !storesQuery.isLoading &&
                    !storesQuery.isError && (

                        <section
                            aria-labelledby="admin-stores-results"
                            className="space-y-4"
                        >

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                                <div>

                                    <h2
                                        id="admin-stores-results"
                                        className="text-lg font-bold text-white"
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
                                            data.totalElements ===
                                            1
                                                ? 'store found'
                                                : 'stores found'
                                        }

                                    </p>

                                </div>


                                {
                                    hasFilters && (

                                        <button
                                            type="button"
                                            onClick={
                                                clearFilters
                                            }
                                            className="inline-flex w-fit items-center gap-2 text-xs font-semibold text-sky-400 transition hover:text-sky-300"
                                        >

                                            <RotateCcw
                                                size={13}
                                            />

                                            Clear filters

                                        </button>
                                    )
                                }

                            </div>


                            {
                                data.content.length ===
                                0 ? (

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

                                ) : (

                                    <div className="space-y-3">

                                        {
                                            data.content.map(
                                                store => (

                                                    <Link
                                                        key={
                                                            store.id
                                                        }
                                                        to={
                                                            `/admin/stores/${store.id}`
                                                        }
                                                        className="premium-card group block rounded-3xl border border-slate-800/90 bg-slate-900/55 px-5 py-4 shadow-[0_20px_60px_-45px_rgba(0,0,0,0.85)] backdrop-blur-xl transition duration-200 hover:border-sky-900/70 hover:bg-slate-900/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 sm:px-6"
                                                    >

                                                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                                                            <div className="flex min-w-0 items-start gap-4">

                                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-900/50 bg-sky-950/25 text-sky-400">

                                                                    <Store
                                                                        size={18}
                                                                    />

                                                                </div>


                                                                <div className="min-w-0">

                                                                    <div className="flex flex-wrap items-center gap-2.5">

                                                                        <h3 className="truncate text-sm font-bold text-slate-100 transition group-hover:text-sky-300">
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


                                                                    <div className="mt-2 flex min-w-0 items-start gap-1.5 text-xs text-slate-500">

                                                                        <MapPin
                                                                            size={12}
                                                                            className="mt-0.5 shrink-0"
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

                                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-[#020817]/60 text-slate-600">

                                                                        <UserRound
                                                                            size={15}
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


                                                                <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-sky-400">

                                                                    Review

                                                                    <ArrowUpRight
                                                                        size={13}
                                                                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                                                    />

                                                                </span>

                                                            </div>

                                                        </div>

                                                    </Link>
                                                ),
                                            )
                                        }

                                    </div>
                                )
                            }


                            {
                                data.totalPages >
                                1 && (

                                    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">

                                        <button
                                            type="button"
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
                                                    data.page +
                                                    1
                                                }
                                            </strong>

                                            {' '}of{' '}

                                            <strong className="font-semibold text-slate-300">
                                                {
                                                    data.totalPages
                                                }
                                            </strong>

                                        </span>


                                        <button
                                            type="button"
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
                        </section>
                    )
                }
            </div>

        </AdminLayout>
    )
}

function toStoreStatus(
    value: string | null,
): StoreStatus | undefined {

    if (
        value ===
        'ACTIVE' ||
        value ===
        'PENDING' ||
        value ===
        'INACTIVE'
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

function toSort(
    value: string | null,
): AdminStoreSort {

    if (
        value ===
        'newest' ||
        value ===
        'oldest' ||
        value ===
        'nameAsc' ||
        value ===
        'nameDesc' ||
        value ===
        'statusAsc'
    ) {
        return value
    }
    return 'newest'
}

const inputClassName =
    'min-h-11 w-full rounded-xl border border-slate-700 bg-[#020817]/85 px-4 text-sm text-white outline-none transition duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:opacity-50'