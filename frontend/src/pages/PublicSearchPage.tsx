import {
    useState,
} from 'react'

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
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    LocateFixed,
    MapPinned,
    Rows3,
    Search,
    SlidersHorizontal,
    Sparkles,
    X,
} from 'lucide-react'

import {
    getPublicSearchFilters,
    searchPublicProducts,
} from '../api/publicSearchApi'

import SearchResultCard
    from '../components/public/SearchResultCard'

import SearchResultsMap
    from '../components/public/SearchResultsMap'

import type {
    PublicSearchSort,
} from '../types/publicSearch'

import type {
    StockStatus,
} from '../types/store'

interface UserLocation {
    latitude: number
    longitude: number
}

type LocationStatus =
    | 'idle'
    | 'loading'
    | 'ready'
    | 'error'

type ViewMode =
    | 'offers'
    | 'map'

export default function PublicSearchPage() {

    const [
        searchParams,
        setSearchParams,
    ] =
        useSearchParams()


    const [
        filtersOpen,
        setFiltersOpen,
    ] =
        useState(false)


    const [
        viewMode,
        setViewMode,
    ] =
        useState<ViewMode>(
            'offers',
        )


    const [
        userLocation,
        setUserLocation,
    ] =
        useState<UserLocation | null>(
            null,
        )


    const [
        locationStatus,
        setLocationStatus,
    ] =
        useState<LocationStatus>(
            'idle',
        )


    const [
        locationError,
        setLocationError,
    ] =
        useState<string | null>(
            null,
        )


    const currentQuery =
        (
            searchParams.get(
                'q',
            ) ??
            ''
        ).trim()


    const currentBrandId =
        toNumberOrUndefined(
            searchParams.get(
                'brandId',
            ),
        )


    const currentCategoryId =
        toNumberOrUndefined(
            searchParams.get(
                'categoryId',
            ),
        )


    const currentStatus =
        toStockStatus(
            searchParams.get(
                'status',
            ),
        )


    const currentCity =
        (
            searchParams.get(
                'city',
            ) ??
            ''
        ).trim()


    const requestedSort =
        toPublicSearchSort(
            searchParams.get(
                'sort',
            ),
        )


    const currentSort:
        PublicSearchSort =
        requestedSort ===
        'distanceAsc' &&
        !userLocation
            ? 'priceAsc'
            : requestedSort


    const currentPage =
        toPageNumber(
            searchParams.get(
                'page',
            ),
        )


    const currentRadiusKm =
        toRadiusKm(
            searchParams.get(
                'radiusKm',
            ),
        )


    const browseAll =
        searchParams.get(
            'browse',
        ) ===
        'all'


    const hasSearchCriteria =
        Boolean(
            currentQuery,
        ) ||
        currentBrandId !==
        undefined ||
        currentCategoryId !==
        undefined ||
        currentStatus !==
        undefined ||
        Boolean(
            currentCity,
        ) ||
        userLocation !==
        null


    const shouldSearch =
        browseAll ||
        hasSearchCriteria


    const activeFilterCount =
        [
            currentBrandId !==
            undefined,

            currentCategoryId !==
            undefined,

            currentStatus !==
            undefined,

            Boolean(
                currentCity,
            ),

            userLocation !==
            null,

            userLocation !==
            null &&
            currentRadiusKm !==
            undefined,
        ]
            .filter(
                Boolean,
            )
            .length


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
                userLocation
                    ?.latitude,
                userLocation
                    ?.longitude,
                userLocation
                    ? currentRadiusKm
                    : undefined,
                browseAll,
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

                        latitude:
                        userLocation
                            ?.latitude,

                        longitude:
                        userLocation
                            ?.longitude,

                        radiusKm:
                            userLocation
                                ? currentRadiusKm
                                : undefined,
                    }),

            enabled:
            shouldSearch,
        })


    function handleSearchSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault()


        const formData =
            new FormData(
                event.currentTarget,
            )


        const query =
            String(
                formData.get(
                    'q',
                ) ??
                '',
            ).trim()


        const next =
            new URLSearchParams(
                searchParams,
            )


        next.delete(
            'browse',
        )


        if (
            query
        ) {

            next.set(
                'q',
                query,
            )

        } else {

            next.delete(
                'q',
            )
        }


        next.set(
            'page',
            '0',
        )


        setSearchParams(
            next,
        )


        setViewMode(
            'offers',
        )
    }


    function handleFiltersSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault()


        const formData =
            new FormData(
                event.currentTarget,
            )


        const brandId =
            toNumberOrUndefined(
                String(
                    formData.get(
                        'brandId',
                    ) ??
                    '',
                ),
            )


        const categoryId =
            toNumberOrUndefined(
                String(
                    formData.get(
                        'categoryId',
                    ) ??
                    '',
                ),
            )


        const status =
            toStockStatus(
                String(
                    formData.get(
                        'status',
                    ) ??
                    '',
                ),
            )


        const city =
            String(
                formData.get(
                    'city',
                ) ??
                '',
            ).trim()


        const requestedFormSort =
            toPublicSearchSort(
                String(
                    formData.get(
                        'sort',
                    ) ??
                    '',
                ),
            )


        const sort:
            PublicSearchSort =
            requestedFormSort ===
            'distanceAsc' &&
            !userLocation
                ? 'priceAsc'
                : requestedFormSort


        const radiusKm =
            userLocation
                ? toRadiusKm(
                    String(
                        formData.get(
                            'radiusKm',
                        ) ??
                        '',
                    ),
                )
                : undefined


        const next =
            new URLSearchParams()


        if (
            currentQuery
        ) {

            next.set(
                'q',
                currentQuery,
            )
        }


        if (
            !currentQuery &&
            browseAll
        ) {

            next.set(
                'browse',
                'all',
            )
        }


        if (
            brandId !==
            undefined
        ) {

            next.set(
                'brandId',
                String(
                    brandId,
                ),
            )
        }


        if (
            categoryId !==
            undefined
        ) {

            next.set(
                'categoryId',
                String(
                    categoryId,
                ),
            )
        }


        if (
            status
        ) {

            next.set(
                'status',
                status,
            )
        }


        if (
            city
        ) {

            next.set(
                'city',
                city,
            )
        }


        if (
            userLocation &&
            radiusKm !==
            undefined
        ) {

            next.set(
                'radiusKm',
                String(
                    radiusKm,
                ),
            )
        }


        if (
            sort !==
            'priceAsc'
        ) {

            next.set(
                'sort',
                sort,
            )
        }


        next.set(
            'page',
            '0',
        )


        setSearchParams(
            next,
        )


        setFiltersOpen(
            false,
        )
    }


    function clearFilters() {

        setUserLocation(
            null,
        )


        setLocationStatus(
            'idle',
        )


        setLocationError(
            null,
        )


        const next =
            new URLSearchParams()


        if (
            currentQuery
        ) {

            next.set(
                'q',
                currentQuery,
            )

        } else if (
            browseAll
        ) {

            next.set(
                'browse',
                'all',
            )
        }


        setSearchParams(
            next,
        )


        setFiltersOpen(
            false,
        )


        setViewMode(
            'offers',
        )
    }


    function changePage(
        page: number,
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
                    page,
                ),
            ),
        )


        setSearchParams(
            next,
        )


        window.scrollTo({
            top:
                0,

            behavior:
                'smooth',
        })
    }


    function requestLocation() {

        setLocationError(
            null,
        )


        if (
            !navigator.geolocation
        ) {

            setLocationStatus(
                'error',
            )


            setLocationError(
                'Geolocation is not supported by this browser.',
            )

            return
        }


        setLocationStatus(
            'loading',
        )


        navigator.geolocation.getCurrentPosition(
            position => {

                setUserLocation({
                    latitude:
                        Number(
                            position.coords.latitude.toFixed(
                                6,
                            ),
                        ),

                    longitude:
                        Number(
                            position.coords.longitude.toFixed(
                                6,
                            ),
                        ),
                })


                setLocationStatus(
                    'ready',
                )


                setLocationError(
                    null,
                )
            },

            error => {

                setUserLocation(
                    null,
                )


                setLocationStatus(
                    'error',
                )


                setLocationError(
                    getLocationErrorMessage(
                        error.code,
                    ),
                )
            },

            {
                enableHighAccuracy:
                    true,

                timeout:
                    10000,

                maximumAge:
                    300000,
            },
        )
    }


    function clearLocation() {

        setUserLocation(
            null,
        )


        setLocationStatus(
            'idle',
        )


        setLocationError(
            null,
        )


        const next =
            new URLSearchParams(
                searchParams,
            )


        next.delete(
            'radiusKm',
        )


        if (
            next.get(
                'sort',
            ) ===
            'distanceAsc'
        ) {

            next.delete(
                'sort',
            )
        }


        setSearchParams(
            next,
        )
    }


    const results =
        resultsQuery.data


    const formKey =
        `${searchParams.toString()}-${userLocation ? 'located' : 'no-location'}`


    const hasResults =
        Boolean(
            results &&
            results.content.length >
            0,
        )


    const filterOptionsUnavailable =
        filtersQuery.isLoading ||
        filtersQuery.isError


    return (
        <main className="relative min-h-dvh overflow-x-clip bg-[#020817] text-white">

            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 overflow-hidden"
            >

                <div className="animate-glow-drift absolute left-1/2 top-[-260px] h-[560px] w-[850px] -translate-x-1/2 rounded-full bg-sky-500/[0.075] blur-[150px]" />

                <div className="animate-glow-drift absolute -left-56 top-[430px] h-[440px] w-[440px] rounded-full bg-cyan-500/[0.03] blur-[135px] [animation-delay:900ms]" />

                <div className="animate-glow-drift absolute -right-56 top-[260px] h-[500px] w-[500px] rounded-full bg-blue-500/[0.035] blur-[145px] [animation-delay:1500ms]" />


                <div
                    className="absolute inset-0 opacity-[0.026]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(148,163,184,0.30) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.30) 1px, transparent 1px)',

                        backgroundSize:
                            '46px 46px',
                    }}
                />

            </div>


            <header className="sticky top-0 z-50 border-b border-slate-900/90 bg-[#020817]/90 backdrop-blur-xl">

                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">

                    <Link
                        to="/"
                        aria-label="ShelfRadar home"
                        className="group flex items-center"
                    >

                        <img
                            src="/shelfradar-logo.png"
                            alt="ShelfRadar"
                            className="h-14 w-auto object-contain drop-shadow-[0_0_18px_rgba(56,189,248,0.10)] transition duration-300 group-hover:scale-[1.025]"
                        />

                    </Link>


                    <nav
                        aria-label="Public navigation"
                        className="flex items-center gap-2 sm:gap-3"
                    >

                        <Link
                            to="/search?browse=all"
                            className="hidden rounded-xl bg-slate-900/70 px-4 py-2.5 text-sm font-semibold text-slate-300 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:text-white motion-reduce:transform-none sm:inline-flex"
                        >
                            Browse products
                        </Link>


                        <Link
                            to="/login"
                            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900/50 px-4 py-2 text-sm font-semibold text-slate-200 transition duration-200 hover:-translate-y-0.5 hover:border-slate-500 hover:bg-slate-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 motion-reduce:transform-none"
                        >
                            Staff Login
                        </Link>

                    </nav>

                </div>

            </header>


            <section className="relative z-10">

                <div className="mx-auto max-w-7xl px-5 pb-7 pt-9 md:px-8 lg:pb-8 lg:pt-10">

                    <div className="animate-fade-up text-center">

                        <div className="inline-flex items-center gap-2 rounded-full border border-sky-900/60 bg-sky-950/35 px-3.5 py-2">

                            <Sparkles
                                size={14}
                                className="text-sky-400"
                            />


                            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky-300 sm:text-[11px]">
                                ShelfRadar Search
                            </span>

                        </div>


                        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl">

                            Find it.

                            <span className="bg-gradient-to-r from-sky-300 via-cyan-300 to-sky-500 bg-clip-text text-transparent">
                                {' '}
                                Compare it.
                            </span>

                            <span className="block pb-1">
                                Know where to buy it.
                            </span>

                        </h1>


                        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                            Search products and compare current store offers,
                            availability and location.
                        </p>

                    </div>


                    <form
                        onSubmit={
                            handleSearchSubmit
                        }
                        className="animate-fade-up animation-delay-100 mx-auto mt-7 max-w-3xl"
                    >

                        <div className="premium-card flex rounded-[1.45rem] border border-slate-800/90 bg-slate-900/75 p-2 shadow-[0_30px_90px_-38px_rgba(14,165,233,0.42)] backdrop-blur-xl">

                            <div className="relative min-w-0 flex-1">

                                <Search
                                    size={20}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                />


                                <label
                                    htmlFor="public-product-search"
                                    className="sr-only"
                                >
                                    Search products
                                </label>


                                <input
                                    key={
                                        currentQuery
                                    }
                                    id="public-product-search"
                                    type="search"
                                    name="q"
                                    defaultValue={
                                        currentQuery
                                    }
                                    autoComplete="off"
                                    placeholder="Search Coca-Cola, milk, chocolate..."
                                    className="min-h-14 w-full rounded-xl border border-slate-800 bg-[#020817]/95 py-3 pl-12 pr-4 text-sm text-white outline-none transition duration-300 placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 focus:shadow-[0_0_0_5px_rgba(14,165,233,0.06)] sm:text-base"
                                />

                            </div>


                            <button
                                type="submit"
                                className="shine-button group ml-2 inline-flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-6 text-sm font-bold text-slate-950 transition duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 motion-reduce:transform-none"
                            >

                                Search

                                <ArrowRight
                                    size={16}
                                    className="transition-transform duration-200 group-hover:translate-x-1"
                                />

                            </button>

                        </div>

                    </form>

                </div>

            </section>


            <section className="relative z-10 border-y border-slate-900/80 bg-slate-950/25">

                <div className="mx-auto max-w-7xl px-5 py-4 md:px-8">

                    <button
                        type="button"
                        onClick={
                            () =>
                                setFiltersOpen(
                                    current =>
                                        !current,
                                )
                        }
                        aria-expanded={
                            filtersOpen
                        }
                        aria-controls="public-search-filters"
                        className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 lg:hidden"
                    >

                        <span className="flex items-center gap-2 text-sm font-semibold">

                            <SlidersHorizontal
                                size={16}
                                className="text-sky-400"
                            />

                            Refine results

                        </span>


                        {
                            activeFilterCount >
                            0 && (

                                <span className="rounded-full bg-sky-500 px-2.5 py-1 text-[10px] font-bold text-slate-950">
                                    {activeFilterCount}
                                </span>
                            )
                        }

                    </button>


                    <form
                        id="public-search-filters"
                        key={
                            formKey
                        }
                        onSubmit={
                            handleFiltersSubmit
                        }
                        className={
                            filtersOpen
                                ? 'mt-3 block'
                                : 'hidden lg:block'
                        }
                    >

                        <div className="premium-card rounded-2xl border border-slate-800/80 bg-slate-900/55 p-3 backdrop-blur-xl">

                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">

                                <FilterField
                                    label="Brand"
                                >

                                    <select
                                        name="brandId"
                                        defaultValue={
                                            currentBrandId !==
                                            undefined
                                                ? String(
                                                    currentBrandId,
                                                )
                                                : ''
                                        }
                                        disabled={
                                            filterOptionsUnavailable
                                        }
                                        className={selectClassName}
                                    >

                                        <option value="">
                                            {
                                                filtersQuery.isLoading
                                                    ? 'Loading brands...'
                                                    : filtersQuery.isError
                                                        ? 'Brands unavailable'
                                                        : 'All brands'
                                            }
                                        </option>


                                        {
                                            filtersQuery.data?.brands.map(
                                                brand => (

                                                    <option
                                                        key={
                                                            brand.id
                                                        }
                                                        value={
                                                            brand.id
                                                        }
                                                    >
                                                        {brand.name}
                                                    </option>
                                                ),
                                            )
                                        }

                                    </select>

                                </FilterField>


                                <FilterField
                                    label="Category"
                                >

                                    <select
                                        name="categoryId"
                                        defaultValue={
                                            currentCategoryId !==
                                            undefined
                                                ? String(
                                                    currentCategoryId,
                                                )
                                                : ''
                                        }
                                        disabled={
                                            filterOptionsUnavailable
                                        }
                                        className={selectClassName}
                                    >

                                        <option value="">
                                            {
                                                filtersQuery.isLoading
                                                    ? 'Loading categories...'
                                                    : filtersQuery.isError
                                                        ? 'Categories unavailable'
                                                        : 'All categories'
                                            }
                                        </option>


                                        {
                                            filtersQuery.data?.categories.map(
                                                category => (

                                                    <option
                                                        key={
                                                            category.id
                                                        }
                                                        value={
                                                            category.id
                                                        }
                                                    >
                                                        {category.name}
                                                    </option>
                                                ),
                                            )
                                        }

                                    </select>

                                </FilterField>


                                <FilterField
                                    label="City"
                                >

                                    <select
                                        name="city"
                                        defaultValue={
                                            currentCity
                                        }
                                        disabled={
                                            filterOptionsUnavailable
                                        }
                                        className={selectClassName}
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

                                </FilterField>


                                <FilterField
                                    label="Availability"
                                >

                                    <select
                                        name="status"
                                        defaultValue={
                                            currentStatus ??
                                            ''
                                        }
                                        className={selectClassName}
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

                                </FilterField>


                                <FilterField
                                    label="Sort"
                                >

                                    <select
                                        name="sort"
                                        defaultValue={
                                            currentSort
                                        }
                                        className={selectClassName}
                                    >

                                        <option value="priceAsc">
                                            Lowest price
                                        </option>

                                        <option value="priceDesc">
                                            Highest price
                                        </option>

                                        <option
                                            value="distanceAsc"
                                            disabled={
                                                !userLocation
                                            }
                                        >
                                            Nearest first
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

                                </FilterField>

                            </div>


                            <div className="mt-3 flex flex-col gap-3 border-t border-slate-800/70 pt-3 lg:flex-row lg:items-end lg:justify-between">

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">

                                    <div>

                                        <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
                                            Location
                                        </p>


                                        {
                                            userLocation ? (

                                                <div className="flex min-h-11 min-w-[170px] items-center justify-between rounded-xl border border-emerald-900/60 bg-emerald-950/20 px-3">

                                                    <span className="flex items-center gap-2 text-xs font-semibold text-emerald-300">

                                                        <LocateFixed
                                                            size={14}
                                                        />

                                                        Location enabled

                                                    </span>


                                                    <button
                                                        type="button"
                                                        onClick={
                                                            clearLocation
                                                        }
                                                        aria-label="Remove location"
                                                        className="rounded-lg p-1 text-emerald-400 transition hover:bg-emerald-900/40"
                                                    >

                                                        <X
                                                            size={14}
                                                        />

                                                    </button>

                                                </div>

                                            ) : (

                                                <button
                                                    type="button"
                                                    onClick={
                                                        requestLocation
                                                    }
                                                    disabled={
                                                        locationStatus ===
                                                        'loading'
                                                    }
                                                    className="flex min-h-11 min-w-[170px] items-center justify-center gap-2 rounded-xl border border-slate-700 bg-[#020817]/80 px-4 text-xs font-semibold text-slate-300 transition hover:border-sky-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                                                >

                                                    <LocateFixed
                                                        size={14}
                                                        className="text-sky-400"
                                                    />

                                                    {
                                                        locationStatus ===
                                                        'loading'
                                                            ? 'Locating...'
                                                            : 'Use my location'
                                                    }

                                                </button>
                                            )
                                        }

                                    </div>


                                    <FilterField
                                        label="Radius"
                                    >

                                        <select
                                            name="radiusKm"
                                            defaultValue={
                                                currentRadiusKm !==
                                                undefined
                                                    ? String(
                                                        currentRadiusKm,
                                                    )
                                                    : ''
                                            }
                                            disabled={
                                                !userLocation
                                            }
                                            className="min-h-11 min-w-[160px] rounded-xl border border-slate-700 bg-[#020817]/85 px-3 text-sm text-slate-300 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                                        >

                                            <option value="">
                                                Any distance
                                            </option>

                                            <option value="1">
                                                Within 1 km
                                            </option>

                                            <option value="3">
                                                Within 3 km
                                            </option>

                                            <option value="5">
                                                Within 5 km
                                            </option>

                                            <option value="10">
                                                Within 10 km
                                            </option>

                                            <option value="25">
                                                Within 25 km
                                            </option>

                                        </select>

                                    </FilterField>

                                </div>


                                <div className="flex gap-2">

                                    <button
                                        type="button"
                                        onClick={
                                            clearFilters
                                        }
                                        className="min-h-11 rounded-xl px-4 text-xs font-semibold text-slate-500 transition hover:bg-slate-800 hover:text-slate-200"
                                    >
                                        Reset
                                    </button>


                                    <button
                                        type="submit"
                                        className="shine-button min-h-11 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 text-xs font-bold text-slate-950 transition hover:brightness-110"
                                    >
                                        Apply filters
                                    </button>

                                </div>

                            </div>


                            {
                                locationError && (

                                    <p
                                        role="alert"
                                        className="mt-3 text-xs text-red-400"
                                    >
                                        {locationError}
                                    </p>
                                )
                            }


                            {
                                filtersQuery.isError && (

                                    <p className="mt-3 text-xs text-amber-400">
                                        Brand, category and city filters are temporarily unavailable.
                                    </p>
                                )
                            }

                        </div>

                    </form>

                </div>

            </section>


            <section className="relative z-10 mx-auto max-w-7xl px-5 py-7 md:px-8 lg:py-8">

                <div className="animate-fade-up animation-delay-200">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                        <div>

                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky-400">
                                Product discovery
                            </p>


                            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">

                                {
                                    browseAll
                                        ? 'Browse store offers'
                                        : currentQuery
                                            ? `Results for “${currentQuery}”`
                                            : shouldSearch
                                                ? 'Matching offers'
                                                : 'Ready when you are'
                                }

                            </h2>


                            <p className="mt-1 text-sm text-slate-500">

                                {
                                    shouldSearch
                                        ? results
                                            ? `${results.totalElements} offers found`
                                            : resultsQuery.isLoading
                                                ? 'Searching current offers...'
                                                : 'Offers will appear here.'
                                        : 'Search for a product or explore all current offers.'
                                }

                            </p>

                        </div>


                        {
                            hasResults && (

                                <div
                                    role="group"
                                    aria-label="Search result view"
                                    className="inline-flex w-fit rounded-xl border border-slate-800 bg-slate-900/70 p-1"
                                >

                                    <button
                                        type="button"
                                        onClick={
                                            () =>
                                                setViewMode(
                                                    'offers',
                                                )
                                        }
                                        aria-pressed={
                                            viewMode ===
                                            'offers'
                                        }
                                        className={
                                            viewMode ===
                                            'offers'
                                                ? 'inline-flex min-h-9 items-center gap-2 rounded-lg bg-sky-500/15 px-3 text-xs font-bold text-sky-300'
                                                : 'inline-flex min-h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold text-slate-500 transition hover:text-slate-300'
                                        }
                                    >

                                        <Rows3
                                            size={14}
                                        />

                                        Offers

                                    </button>


                                    <button
                                        type="button"
                                        onClick={
                                            () =>
                                                setViewMode(
                                                    'map',
                                                )
                                        }
                                        aria-pressed={
                                            viewMode ===
                                            'map'
                                        }
                                        className={
                                            viewMode ===
                                            'map'
                                                ? 'inline-flex min-h-9 items-center gap-2 rounded-lg bg-sky-500/15 px-3 text-xs font-bold text-sky-300'
                                                : 'inline-flex min-h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold text-slate-500 transition hover:text-slate-300'
                                        }
                                    >

                                        <MapPinned
                                            size={14}
                                        />

                                        Map

                                    </button>

                                </div>
                            )
                        }

                    </div>


                    {
                        !shouldSearch && (

                            <div className="premium-card mt-6 overflow-hidden rounded-[1.8rem] border border-slate-800/80 bg-slate-900/[0.26]">

                                <div className="relative flex min-h-[330px] items-center justify-center p-8 text-center">

                                    <div
                                        aria-hidden="true"
                                        className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/[0.05] blur-[70px]"
                                    />


                                    <div className="animate-scale-in relative max-w-md">

                                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-900/50 bg-sky-950/30 text-sky-400 shadow-[0_0_40px_rgba(14,165,233,0.08)]">

                                            <Search
                                                size={23}
                                            />

                                        </div>


                                        <h3 className="mt-5 text-xl font-bold text-white">
                                            Search ShelfRadar
                                        </h3>


                                        <p className="mt-2 text-sm leading-6 text-slate-500">
                                            Find a product by name or browse current
                                            offers from participating stores.
                                        </p>


                                        <Link
                                            to="/search?browse=all"
                                            className="group mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:-translate-y-0.5 hover:border-sky-800 hover:text-white motion-reduce:transform-none"
                                        >

                                            Browse all offers

                                            <ArrowRight
                                                size={14}
                                                className="transition-transform group-hover:translate-x-1"
                                            />

                                        </Link>

                                    </div>

                                </div>

                            </div>
                        )
                    }


                    {
                        shouldSearch &&
                        resultsQuery.isLoading && (

                            <div
                                role="status"
                                aria-live="polite"
                                aria-busy="true"
                                className="mt-6 grid gap-4 lg:grid-cols-2"
                            >

                                <span className="sr-only">
                                    Loading search results...
                                </span>


                                {
                                    [
                                        1,
                                        2,
                                        3,
                                        4,
                                    ].map(
                                        item => (

                                            <div
                                                key={
                                                    item
                                                }
                                                aria-hidden="true"
                                                className="h-[220px] animate-pulse rounded-3xl border border-slate-800 bg-slate-900/45"
                                            />
                                        ),
                                    )
                                }

                            </div>
                        )
                    }


                    {
                        shouldSearch &&
                        resultsQuery.isError && (

                            <div
                                role="alert"
                                className="mt-6 rounded-2xl border border-red-900/50 bg-red-950/20 p-7 text-center"
                            >

                                <h3 className="font-semibold text-red-300">
                                    Unable to load offers
                                </h3>


                                <p className="mt-2 text-sm text-red-400/80">
                                    ShelfRadar could not retrieve the current offers.
                                </p>


                                <button
                                    type="button"
                                    onClick={
                                        () => {
                                            void resultsQuery.refetch()
                                        }
                                    }
                                    className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl border border-red-900/70 px-4 text-sm font-semibold text-red-300 transition hover:bg-red-950/40"
                                >
                                    Try again
                                </button>

                            </div>
                        )
                    }


                    {
                        shouldSearch &&
                        results &&
                        results.content.length ===
                        0 &&
                        !resultsQuery.isLoading &&
                        !resultsQuery.isError && (

                            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/35 p-10 text-center">

                                <Search
                                    size={22}
                                    className="mx-auto text-slate-600"
                                />


                                <h3 className="mt-4 font-semibold text-white">
                                    No matching offers
                                </h3>


                                <p className="mt-2 text-sm text-slate-500">
                                    Try changing your search or filters.
                                </p>


                                {
                                    activeFilterCount >
                                    0 && (

                                        <button
                                            type="button"
                                            onClick={
                                                clearFilters
                                            }
                                            className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-700 px-4 text-sm font-semibold text-slate-300 transition hover:border-sky-800 hover:bg-slate-800"
                                        >
                                            Reset filters
                                        </button>
                                    )
                                }

                            </div>
                        )
                    }


                    {
                        hasResults &&
                        viewMode ===
                        'offers' &&
                        results && (

                            <div className="mt-6 grid gap-4 lg:grid-cols-2">

                                {
                                    results.content.map(
                                        (
                                            result,
                                            index,
                                        ) => (

                                            <SearchResultCard
                                                key={
                                                    result.inventoryId
                                                }
                                                result={
                                                    result
                                                }
                                                index={
                                                    index
                                                }
                                            />
                                        ),
                                    )
                                }

                            </div>
                        )
                    }


                    {
                        hasResults &&
                        viewMode ===
                        'map' &&
                        results && (

                            <div className="animate-fade-in mt-6">

                                <SearchResultsMap
                                    results={
                                        results.content
                                    }
                                    userLocation={
                                        userLocation
                                    }
                                    variant="large"
                                />

                            </div>
                        )
                    }


                    {
                        hasResults &&
                        results &&
                        results.totalPages >
                        1 && (

                            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">

                                <button
                                    type="button"
                                    disabled={
                                        results.first ||
                                        resultsQuery.isFetching
                                    }
                                    onClick={
                                        () =>
                                            changePage(
                                                results.page -
                                                1,
                                            )
                                    }
                                    className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/50 px-4 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-30 sm:w-auto"
                                >

                                    <ChevronLeft
                                        size={15}
                                    />

                                    Previous

                                </button>


                                <span className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2.5 text-xs text-slate-500">

                                    Page{' '}

                                    <strong className="text-slate-200">
                                        {
                                            results.page +
                                            1
                                        }
                                    </strong>

                                    {' '}of{' '}

                                    <strong className="text-slate-200">
                                        {
                                            results.totalPages
                                        }
                                    </strong>

                                </span>


                                <button
                                    type="button"
                                    disabled={
                                        results.last ||
                                        resultsQuery.isFetching
                                    }
                                    onClick={
                                        () =>
                                            changePage(
                                                results.page +
                                                1,
                                            )
                                    }
                                    className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/50 px-4 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-30 sm:w-auto"
                                >

                                    Next

                                    <ChevronRight
                                        size={15}
                                    />

                                </button>

                            </div>
                        )
                    }

                </div>

            </section>

        </main>
    )
}


function FilterField({
                         label,
                         children,
                     }: {
    label: string
    children: ReactNode
}) {

    return (
        <label className="block">

            <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
                {label}
            </span>

            {children}

        </label>
    )
}


function toNumberOrUndefined(
    value: string | null,
): number | undefined {

    if (
        !value
    ) {
        return undefined
    }


    const parsed =
        Number(
            value,
        )


    return Number.isInteger(
        parsed,
    ) &&
    parsed >
    0
        ? parsed
        : undefined
}


function toPageNumber(
    value: string | null,
): number {

    if (
        !value
    ) {
        return 0
    }


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


function toRadiusKm(
    value: string | null,
): number | undefined {

    if (
        !value
    ) {
        return undefined
    }


    const parsed =
        Number(
            value,
        )


    return Number.isFinite(
        parsed,
    ) &&
    parsed >
    0 &&
    parsed <=
    100
        ? parsed
        : undefined
}


function toStockStatus(
    value: string | null,
): StockStatus | undefined {

    if (
        value ===
        'IN_STOCK' ||
        value ===
        'LOW_STOCK' ||
        value ===
        'OUT_OF_STOCK'
    ) {

        return value
    }


    return undefined
}


function toPublicSearchSort(
    value: string | null,
): PublicSearchSort {

    if (
        value ===
        'priceAsc' ||
        value ===
        'priceDesc' ||
        value ===
        'nameAsc' ||
        value ===
        'nameDesc' ||
        value ===
        'updatedDesc' ||
        value ===
        'distanceAsc'
    ) {

        return value
    }


    return 'priceAsc'
}


function getLocationErrorMessage(
    code: number,
): string {

    if (
        code ===
        1
    ) {
        return 'Location permission was denied.'
    }


    if (
        code ===
        2
    ) {
        return 'Your location is currently unavailable.'
    }


    if (
        code ===
        3
    ) {
        return 'Location request timed out.'
    }


    return 'Unable to determine your location.'
}


const selectClassName =
    'min-h-11 w-full rounded-xl border border-slate-700 bg-[#020817]/85 px-3 text-sm text-slate-300 outline-none transition duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:opacity-40'