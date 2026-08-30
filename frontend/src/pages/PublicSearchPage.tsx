import type {
    FormEvent,
    ReactNode,
} from 'react'

import {
    useQuery,
} from '@tanstack/react-query'

import {
    Link,
    useSearchParams,
} from 'react-router-dom'

import {
    Search,
    SlidersHorizontal,
} from 'lucide-react'

import {
    getPublicSearchFilters,
    searchPublicProducts,
} from '../api/publicSearchApi'

import SearchResultCard
    from '../components/public/SearchResultCard'

import type {
    PublicSearchSort,
} from '../types/publicSearch'

import type {
    StockStatus,
} from '../types/store'


export default function PublicSearchPage() {

    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams()


    const currentQuery =
        searchParams.get('q') ?? ''

    const currentBrandId =
        toNumberOrUndefined(
            searchParams.get('brandId'),
        )

    const currentCategoryId =
        toNumberOrUndefined(
            searchParams.get('categoryId'),
        )

    const currentStatus =
        toStockStatus(
            searchParams.get('status'),
        )

    const currentCity =
        searchParams.get('city') ?? ''

    const currentSort =
        toPublicSearchSort(
            searchParams.get('sort'),
        )

    const currentPage =
        toPageNumber(
            searchParams.get('page'),
        )


    const filtersQuery =
        useQuery({
            queryKey: [
                'public-search-filters',
            ],
            queryFn:
            getPublicSearchFilters,
        })


    const resultsQuery =
        useQuery({
            queryKey: [
                'public-search',
                currentQuery,
                currentBrandId,
                currentCategoryId,
                currentStatus,
                currentCity,
                currentPage,
                currentSort,
            ],

            queryFn:
                () =>
                    searchPublicProducts({
                        q:
                        currentQuery,

                        brandId:
                        currentBrandId,

                        categoryId:
                        currentCategoryId,

                        status:
                        currentStatus,

                        city:
                        currentCity,

                        page:
                        currentPage,

                        size:
                            12,

                        sort:
                        currentSort,
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

        const query =
            String(
                formData.get('q') ?? '',
            ).trim()

        const brandId =
            String(
                formData.get('brandId') ?? '',
            )

        const categoryId =
            String(
                formData.get('categoryId') ?? '',
            )

        const status =
            toStockStatus(
                String(
                    formData.get('status') ?? '',
                ),
            )

        const city =
            String(
                formData.get('city') ?? '',
            ).trim()

        const sort =
            toPublicSearchSort(
                String(
                    formData.get('sort') ?? '',
                ),
            )

        const next =
            new URLSearchParams()

        if (query) {
            next.set(
                'q',
                query,
            )
        }

        if (brandId) {
            next.set(
                'brandId',
                brandId,
            )
        }

        if (categoryId) {
            next.set(
                'categoryId',
                categoryId,
            )
        }

        if (status) {
            next.set(
                'status',
                status,
            )
        }

        if (city) {
            next.set(
                'city',
                city,
            )
        }

        next.set(
            'sort',
            sort,
        )

        next.set(
            'page',
            '0',
        )

        setSearchParams(
            next,
        )
    }


    function clearFilters() {

        setSearchParams({
            sort:
                'priceAsc',
            page:
                '0',
        })
    }


    function changePage(
        page: number,
    ) {

        const nextPage =
            Math.max(
                0,
                page,
            )

        const next =
            new URLSearchParams(
                searchParams,
            )

        next.set(
            'page',
            String(nextPage),
        )

        setSearchParams(
            next,
        )

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }


    const results =
        resultsQuery.data


    return (
        <main className="min-h-screen bg-slate-50 text-slate-950">

            <header className="border-b border-slate-200 bg-white">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">

                    <Link
                        to="/"
                        className="text-xl font-bold tracking-tight"
                    >
                        ShelfRadar
                    </Link>

                    <Link
                        to="/login"
                        className="text-sm font-medium text-slate-600 hover:text-slate-950"
                    >
                        Staff Login
                    </Link>

                </div>

            </header>


            <section className="border-b border-slate-200 bg-white">

                <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">

                    <div className="max-w-3xl">

                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">
                            Product Search
                        </p>

                        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                            Find products across nearby stores
                        </h1>

                        <p className="mt-3 text-slate-500">
                            Compare prices and availability across ShelfRadar stores.
                        </p>

                    </div>

                </div>

            </section>


            <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 md:px-8 lg:grid-cols-[280px_minmax(0,1fr)]">

                <aside>

                    <form
                        key={
                            searchParams.toString()
                        }
                        onSubmit={
                            handleSubmit
                        }
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >

                        <div className="flex items-center gap-2">

                            <SlidersHorizontal
                                size={18}
                            />

                            <h2 className="font-semibold">
                                Search & Filters
                            </h2>

                        </div>


                        <div className="mt-5 space-y-5">

                            <FieldLabel
                                label="Product"
                            >

                                <div className="relative">

                                    <Search
                                        size={17}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="search"
                                        name="q"
                                        defaultValue={
                                            currentQuery
                                        }
                                        placeholder="Coca-Cola..."
                                        className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 outline-none focus:border-sky-500"
                                    />

                                </div>

                            </FieldLabel>


                            <FieldLabel
                                label="Brand"
                            >

                                <select
                                    name="brandId"
                                    defaultValue={
                                        currentBrandId !== undefined
                                            ? String(currentBrandId)
                                            : ''
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5"
                                >

                                    <option value="">
                                        All brands
                                    </option>

                                    {
                                        filtersQuery
                                            .data
                                            ?.brands
                                            .map(
                                                brand => (

                                                    <option
                                                        key={
                                                            brand.id
                                                        }
                                                        value={
                                                            brand.id
                                                        }
                                                    >
                                                        {
                                                            brand.name
                                                        }
                                                    </option>
                                                ),
                                            )
                                    }

                                </select>

                            </FieldLabel>


                            <FieldLabel
                                label="Category"
                            >

                                <select
                                    name="categoryId"
                                    defaultValue={
                                        currentCategoryId !== undefined
                                            ? String(currentCategoryId)
                                            : ''
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5"
                                >

                                    <option value="">
                                        All categories
                                    </option>

                                    {
                                        filtersQuery
                                            .data
                                            ?.categories
                                            .map(
                                                category => (

                                                    <option
                                                        key={
                                                            category.id
                                                        }
                                                        value={
                                                            category.id
                                                        }
                                                    >
                                                        {
                                                            category.name
                                                        }
                                                    </option>
                                                ),
                                            )
                                    }

                                </select>

                            </FieldLabel>


                            <FieldLabel
                                label="City"
                            >

                                <select
                                    name="city"
                                    defaultValue={
                                        currentCity
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5"
                                >

                                    <option value="">
                                        All cities
                                    </option>

                                    {
                                        filtersQuery
                                            .data
                                            ?.cities
                                            .map(
                                                city => (

                                                    <option
                                                        key={
                                                            city
                                                        }
                                                        value={
                                                            city
                                                        }
                                                    >
                                                        {city}
                                                    </option>
                                                ),
                                            )
                                    }

                                </select>

                            </FieldLabel>


                            <FieldLabel
                                label="Availability"
                            >

                                <select
                                    name="status"
                                    defaultValue={
                                        currentStatus ?? ''
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5"
                                >

                                    <option value="">
                                        Any status
                                    </option>

                                    <option value="IN_STOCK">
                                        In stock
                                    </option>

                                    <option value="LOW_STOCK">
                                        Low stock
                                    </option>

                                    <option value="OUT_OF_STOCK">
                                        Out of stock
                                    </option>

                                </select>

                            </FieldLabel>


                            <FieldLabel
                                label="Sort by"
                            >

                                <select
                                    name="sort"
                                    defaultValue={
                                        currentSort
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5"
                                >

                                    <option value="priceAsc">
                                        Lowest price
                                    </option>

                                    <option value="priceDesc">
                                        Highest price
                                    </option>

                                    <option value="nameAsc">
                                        Product A-Z
                                    </option>

                                    <option value="nameDesc">
                                        Product Z-A
                                    </option>

                                    <option value="updatedDesc">
                                        Recently updated
                                    </option>

                                </select>

                            </FieldLabel>

                        </div>


                        <button
                            type="submit"
                            className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
                        >
                            Apply Search
                        </button>

                        <button
                            type="button"
                            onClick={
                                clearFilters
                            }
                            className="mt-2 w-full rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50"
                        >
                            Clear Filters
                        </button>

                    </form>

                </aside>


                <section>

                    <div className="flex items-end justify-between gap-4">

                        <div>

                            <h2 className="text-2xl font-bold">
                                Results
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {
                                    results
                                        ?.totalElements ??
                                    0
                                }{' '}
                                store offers found
                            </p>

                        </div>

                    </div>


                    {
                        resultsQuery.isLoading && (

                            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
                                Searching products...
                            </div>
                        )
                    }


                    {
                        resultsQuery.isError && (

                            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                                Unable to load search results.
                            </div>
                        )
                    }


                    {
                        results &&
                        results.content.length === 0 &&
                        !resultsQuery.isLoading &&
                        !resultsQuery.isError && (

                            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center">

                                <h3 className="font-semibold">
                                    No matching products
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Try changing the search text or filters.
                                </p>

                            </div>
                        )
                    }


                    {
                        results &&
                        results.content.length > 0 && (

                            <div className="mt-6 grid gap-5">

                                {
                                    results.content.map(
                                        result => (

                                            <SearchResultCard
                                                key={
                                                    result.inventoryId
                                                }
                                                result={
                                                    result
                                                }
                                            />
                                        ),
                                    )
                                }

                            </div>
                        )
                    }


                    {
                        results &&
                        results.totalPages > 1 && (

                            <div className="mt-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">

                                <button
                                    type="button"
                                    disabled={
                                        results.first
                                    }
                                    onClick={
                                        () =>
                                            changePage(
                                                results.page - 1,
                                            )
                                    }
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Previous
                                </button>

                                <span className="text-sm text-slate-500">
                                    Page{' '}
                                    {
                                        results.page + 1
                                    }{' '}
                                    of{' '}
                                    {
                                        results.totalPages
                                    }
                                </span>

                                <button
                                    type="button"
                                    disabled={
                                        results.last
                                    }
                                    onClick={
                                        () =>
                                            changePage(
                                                results.page + 1,
                                            )
                                    }
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                </button>

                            </div>
                        )
                    }

                </section>

            </div>

        </main>
    )
}


function FieldLabel({
                        label,
                        children,
                    }: {
    label: string
    children: ReactNode
}) {

    return (
        <label className="block">

            <span className="mb-2 block text-sm font-medium text-slate-700">
                {label}
            </span>

            {children}

        </label>
    )
}


function toNumberOrUndefined(
    value: string | null,
): number | undefined {

    if (!value) {
        return undefined
    }

    const parsed =
        Number(value)

    if (
        !Number.isFinite(parsed) ||
        parsed <= 0
    ) {
        return undefined
    }

    return parsed
}


function toPageNumber(
    value: string | null,
): number {

    if (!value) {
        return 0
    }

    const parsed =
        Number(value)

    if (
        !Number.isInteger(parsed) ||
        parsed < 0
    ) {
        return 0
    }

    return parsed
}


function toStockStatus(
    value: string | null,
): StockStatus | undefined {

    if (
        value === 'IN_STOCK' ||
        value === 'LOW_STOCK' ||
        value === 'OUT_OF_STOCK'
    ) {
        return value
    }

    return undefined
}


function toPublicSearchSort(
    value: string | null,
): PublicSearchSort {

    if (
        value === 'priceAsc' ||
        value === 'priceDesc' ||
        value === 'nameAsc' ||
        value === 'nameDesc' ||
        value === 'updatedDesc'
    ) {
        return value
    }

    return 'priceAsc'
}