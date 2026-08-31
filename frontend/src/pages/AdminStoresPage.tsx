import type {
    FormEvent,
} from 'react'

import {
    useQuery,
} from '@tanstack/react-query'

import {
    Search,
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
        searchParams.get('q') ??
        ''

    const status =
        toStoreStatus(
            searchParams.get(
                'status',
            ),
        )

    const city =
        searchParams.get('city') ??
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
        event:
        FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault()

        const data =
            new FormData(
                event.currentTarget,
            )


        const next =
            new URLSearchParams()


        const nextQuery =
            String(
                data.get('q') ??
                '',
            ).trim()

        const nextStatus =
            String(
                data.get('status') ??
                '',
            )

        const nextCity =
            String(
                data.get('city') ??
                '',
            )

        const nextSort =
            toSort(
                String(
                    data.get('sort') ??
                    '',
                ),
            )


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

        next.set(
            'sort',
            nextSort,
        )

        next.set(
            'page',
            '0',
        )

        setSearchParams(
            next,
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


    return (
        <AdminLayout>

            <div>

                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-400">
                    Administration
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Store Management
                </h1>

                <p className="mt-2 text-slate-400">
                    Review, approve and manage all stores on ShelfRadar.
                </p>

            </div>


            <form
                key={
                    searchParams.toString()
                }
                onSubmit={
                    handleSubmit
                }
                className="mt-8 grid gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:grid-cols-[minmax(0,1fr)_180px_180px_180px_auto]"
            >

                <div className="relative">

                    <Search
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                        name="q"
                        type="search"
                        defaultValue={
                            query
                        }
                        placeholder="Store, owner, email..."
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3"
                    />

                </div>


                <select
                    name="status"
                    defaultValue={
                        status ?? ''
                    }
                    className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5"
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


                <select
                    name="city"
                    defaultValue={
                        city
                    }
                    className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5"
                >
                    <option value="">
                        All cities
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


                <select
                    name="sort"
                    defaultValue={
                        sort
                    }
                    className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5"
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


                <button
                    type="submit"
                    className="rounded-xl bg-white px-5 py-2.5 font-semibold text-slate-950"
                >
                    Apply
                </button>

            </form>


            {
                storesQuery.isLoading && (

                    <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
                        Loading stores...
                    </div>
                )
            }


            {
                storesQuery.isError && (

                    <div className="mt-6 rounded-2xl border border-red-900/50 bg-red-950/30 p-6 text-red-300">
                        Unable to load stores.
                    </div>
                )
            }


            {
                data && (

                    <section className="mt-6">

                        <p className="mb-4 text-sm text-slate-400">
                            {
                                data.totalElements
                            } stores found
                        </p>


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
                                            className="block rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-600"
                                        >

                                            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

                                                <div>

                                                    <div className="flex flex-wrap items-center gap-3">

                                                        <h2 className="font-semibold">
                                                            {
                                                                store.name
                                                            }
                                                        </h2>

                                                        <StatusBadge
                                                            status={
                                                                store.status
                                                            }
                                                        />

                                                    </div>

                                                    <p className="mt-2 text-sm text-slate-400">
                                                        {
                                                            store.address
                                                        }
                                                        ,{' '}
                                                        {
                                                            store.city
                                                        }
                                                    </p>

                                                </div>


                                                <div className="text-sm lg:text-right">

                                                    <p className="font-medium text-slate-200">
                                                        {
                                                            store.owner.fullName
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-slate-500">
                                                        {
                                                            store.owner.email
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        </Link>
                                    ),
                                )
                            }

                        </div>


                        {
                            data.totalPages >
                            1 && (

                                <div className="mt-6 flex items-center justify-between">

                                    <button
                                        type="button"
                                        disabled={
                                            data.first
                                        }
                                        onClick={
                                            () =>
                                                changePage(
                                                    data.page -
                                                    1,
                                                )
                                        }
                                        className="rounded-xl border border-slate-700 px-4 py-2 disabled:opacity-40"
                                    >
                                        Previous
                                    </button>


                                    <span className="text-sm text-slate-400">
                                        Page{' '}
                                        {
                                            data.page +
                                            1
                                        }{' '}
                                        of{' '}
                                        {
                                            data.totalPages
                                        }
                                    </span>


                                    <button
                                        type="button"
                                        disabled={
                                            data.last
                                        }
                                        onClick={
                                            () =>
                                                changePage(
                                                    data.page +
                                                    1,
                                                )
                                        }
                                        className="rounded-xl border border-slate-700 px-4 py-2 disabled:opacity-40"
                                    >
                                        Next
                                    </button>

                                </div>
                            )
                        }

                    </section>
                )
            }

        </AdminLayout>
    )
}


function StatusBadge({
                         status,
                     }: {
    status: StoreStatus
}) {

    const styles =
        status === 'ACTIVE'
            ? 'bg-emerald-950 text-emerald-300 ring-emerald-800'
            : status === 'PENDING'
                ? 'bg-amber-950 text-amber-300 ring-amber-800'
                : 'bg-slate-800 text-slate-400 ring-slate-700'


    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles}`}
        >
            {status}
        </span>
    )
}


function toStoreStatus(
    value: string | null,
): StoreStatus | undefined {

    if (
        value === 'ACTIVE' ||
        value === 'PENDING' ||
        value === 'INACTIVE'
    ) {
        return value
    }

    return undefined
}


function toPage(
    value: string | null,
): number {

    const parsed =
        Number(value)

    return Number.isInteger(parsed) &&
    parsed >= 0
        ? parsed
        : 0
}


function toSort(
    value: string | null,
): AdminStoreSort {

    if (
        value === 'newest' ||
        value === 'oldest' ||
        value === 'nameAsc' ||
        value === 'nameDesc' ||
        value === 'statusAsc'
    ) {
        return value
    }

    return 'newest'
}