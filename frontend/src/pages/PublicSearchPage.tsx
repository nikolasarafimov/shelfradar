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
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Filter,
    LoaderCircle,
    LocateFixed,
    MapPinned,
    Rows3,
    Search,
    SlidersHorizontal,
    Sparkles,
    X,
} from 'lucide-react'

import {
    motion,
} from 'motion/react'

import {
    Link,
    useSearchParams,
} from 'react-router-dom'

import {
    getPublicSearchFilters,
    searchPublicProducts,
} from '../api/publicApi'

import SearchResultCard from '../components/public/SearchResultCard'
import SearchResultsMap from '../components/public/SearchResultsMap'

import {
    formatNumber,
} from '../lib/format'

import type {
    PublicSearchSort,
} from '../types/public'

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

interface StockStatusOption {
    value: StockStatus
    label: string
}

interface SearchSortOption {
    value: PublicSearchSort
    label: string
}

const STOCK_STATUS_OPTIONS: StockStatusOption[] = [
    {
        value: 'IN_STOCK',
        label: 'In stock',
    },
    {
        value: 'LOW_STOCK',
        label: 'Low stock',
    },
    {
        value: 'OUT_OF_STOCK',
        label: 'Out of stock',
    },
]

const SEARCH_SORT_OPTIONS: SearchSortOption[] = [
    {
        value: 'priceAsc',
        label: 'Lowest price',
    },
    {
        value: 'priceDesc',
        label: 'Highest price',
    },
    {
        value: 'distanceAsc',
        label: 'Nearest first',
    },
    {
        value: 'nameAsc',
        label: 'Product A-Z',
    },
    {
        value: 'nameDesc',
        label: 'Product Z-A',
    },
    {
        value: 'updatedDesc',
        label: 'Recently updated',
    },
]

const RADIUS_OPTIONS = [
    {
        value: 1,
        label: 'Within 1 km',
    },
    {
        value: 3,
        label: 'Within 3 km',
    },
    {
        value: 5,
        label: 'Within 5 km',
    },
    {
        value: 10,
        label: 'Within 10 km',
    },
    {
        value: 25,
        label: 'Within 25 km',
    },
]

const selectClassName =
    'field min-h-11 w-full px-3 text-sm disabled:cursor-not-allowed disabled:opacity-40'

export default function PublicSearchPage() {
    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams()

    const [
        filtersOpen,
        setFiltersOpen,
    ] = useState(false)

    const [
        viewMode,
        setViewMode,
    ] = useState<ViewMode>(
        'offers',
    )

    const [
        userLocation,
        setUserLocation,
    ] = useState<UserLocation | null>(
        null,
    )

    const [
        locationStatus,
        setLocationStatus,
    ] = useState<LocationStatus>(
        'idle',
    )

    const [
        locationError,
        setLocationError,
    ] = useState<string | null>(
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

    const currentSort: PublicSearchSort =
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
        ].filter(
            Boolean,
        ).length

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
                userLocation?.latitude,
                userLocation?.longitude,
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
                        userLocation?.latitude,

                        longitude:
                        userLocation?.longitude,

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
            'page',
        )

        if (query) {
            next.set(
                'q',
                query,
            )

            next.delete(
                'browse',
            )
        } else {
            next.delete(
                'q',
            )

            if (browseAll) {
                next.set(
                    'browse',
                    'all',
                )
            }
        }

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

        const sort: PublicSearchSort =
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

        if (currentQuery) {
            next.set(
                'q',
                currentQuery,
            )
        } else if (browseAll) {
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

        if (currentQuery) {
            next.set(
                'q',
                currentQuery,
            )
        } else if (browseAll) {
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

        const normalizedPage =
            Math.max(
                0,
                page,
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

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
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

                const next =
                    new URLSearchParams(
                        searchParams,
                    )

                next.delete(
                    'page',
                )

                setSearchParams(
                    next,
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

        next.delete(
            'page',
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

    const hasResults =
        Boolean(
            results &&
            results.content.length >
            0,
        )

    const filterOptionsUnavailable =
        filtersQuery.isLoading ||
        filtersQuery.isError

    const formKey =
        `${searchParams.toString()}-${userLocation ? 'located' : 'no-location'}`

    return (
        <main className="relative min-h-dvh overflow-x-clip bg-slate-950 text-white">
            <SearchBackground />

            <PublicHeader />

            <section className="relative z-10">
                <div className="mx-auto max-w-7xl px-5 pb-7 pt-9 md:px-8 lg:pb-8 lg:pt-10">
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 12,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.45,
                        }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/15 bg-sky-300/[0.07] px-3.5 py-2">
                            <Sparkles
                                className="size-3.5 text-sky-300"
                                aria-hidden="true"
                            />

                            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky-300 sm:text-[11px]">
                                ShelfRadar search
                            </span>
                        </div>

                        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.05em] text-slate-50 sm:text-5xl">
                            Find it.

                            <span className="text-gradient">
                                {' '}
                                Compare it.
                            </span>

                            <span className="block pb-1">
                                Know where to buy it.
                            </span>
                        </h1>

                        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                            Search products and compare current store offers, availability and location.
                        </p>
                    </motion.div>

                    <motion.form
                        initial={{
                            opacity: 0,
                            y: 12,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.45,
                            delay: 0.08,
                        }}
                        onSubmit={handleSearchSubmit}
                        className="mx-auto mt-7 max-w-3xl"
                    >
                        <div className="premium-card flex rounded-[1.45rem] p-2 shadow-[0_30px_90px_-38px_rgba(14,165,233,0.34)]">
                            <div className="relative min-w-0 flex-1">
                                <Search
                                    className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500"
                                    aria-hidden="true"
                                />

                                <label
                                    htmlFor="public-product-search"
                                    className="sr-only"
                                >
                                    Search products
                                </label>

                                <input
                                    key={currentQuery}
                                    id="public-product-search"
                                    type="search"
                                    name="q"
                                    defaultValue={
                                        currentQuery
                                    }
                                    autoComplete="off"
                                    placeholder="Search Coca-Cola, milk, chocolate..."
                                    className="field min-h-14 w-full pl-12 pr-4 text-sm sm:text-base"
                                />
                            </div>

                            <button
                                type="submit"
                                className="shine-button group ml-2 inline-flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-300 px-5 text-sm font-semibold text-slate-950 shadow-[0_14px_35px_-18px_rgba(56,189,248,0.5)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110 motion-reduce:transform-none sm:px-6"
                            >
                                <span className="hidden sm:inline">
                                    Search
                                </span>

                                <Search
                                    className="size-4 sm:hidden"
                                    aria-hidden="true"
                                />

                                <ArrowRight
                                    className="hidden size-4 transition-transform duration-200 group-hover:translate-x-0.5 sm:block"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    </motion.form>
                </div>
            </section>

            <section className="relative z-10 border-y border-slate-800/60 bg-slate-950/25">
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
                        className="flex min-h-12 w-full items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/50 px-4 lg:hidden"
                    >
                        <span className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                            <SlidersHorizontal
                                className="size-4 text-sky-300"
                                aria-hidden="true"
                            />

                            Refine results
                        </span>

                        <span className="flex items-center gap-2">
                            {activeFilterCount >
                                0 && (
                                    <span className="rounded-full bg-sky-300 px-2.5 py-1 text-[10px] font-bold text-slate-950">
                                        {
                                            activeFilterCount
                                        }
                                    </span>
                                )}

                            <span
                                className={
                                    filtersOpen
                                        ? 'rotate-45 text-sky-300 transition-transform'
                                        : 'text-slate-500 transition-transform'
                                }
                            >
                                <SlidersHorizontal
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            </span>
                        </span>
                    </button>

                    <form
                        id="public-search-filters"
                        key={formKey}
                        onSubmit={
                            handleFiltersSubmit
                        }
                        className={
                            filtersOpen
                                ? 'mt-3 block'
                                : 'hidden lg:block'
                        }
                    >
                        <div className="premium-card rounded-2xl p-3">
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
                                        className={
                                            selectClassName
                                        }
                                    >
                                        <option value="">
                                            {filtersQuery.isLoading
                                                ? 'Loading brands...'
                                                : filtersQuery.isError
                                                    ? 'Brands unavailable'
                                                    : 'All brands'}
                                        </option>

                                        {filtersQuery.data?.brands.map(
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
                                        )}
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
                                        className={
                                            selectClassName
                                        }
                                    >
                                        <option value="">
                                            {filtersQuery.isLoading
                                                ? 'Loading categories...'
                                                : filtersQuery.isError
                                                    ? 'Categories unavailable'
                                                    : 'All categories'}
                                        </option>

                                        {filtersQuery.data?.categories.map(
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
                                        )}
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
                                        className={
                                            selectClassName
                                        }
                                    >
                                        <option value="">
                                            {filtersQuery.isLoading
                                                ? 'Loading cities...'
                                                : filtersQuery.isError
                                                    ? 'Cities unavailable'
                                                    : 'All cities'}
                                        </option>

                                        {filtersQuery.data?.cities.map(
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
                                        )}
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
                                        className={
                                            selectClassName
                                        }
                                    >
                                        <option value="">
                                            Any status
                                        </option>

                                        {STOCK_STATUS_OPTIONS.map(
                                            option => (
                                                <option
                                                    key={
                                                        option.value
                                                    }
                                                    value={
                                                        option.value
                                                    }
                                                >
                                                    {
                                                        option.label
                                                    }
                                                </option>
                                            ),
                                        )}
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
                                        className={
                                            selectClassName
                                        }
                                    >
                                        {SEARCH_SORT_OPTIONS.map(
                                            option => (
                                                <option
                                                    key={
                                                        option.value
                                                    }
                                                    value={
                                                        option.value
                                                    }
                                                    disabled={
                                                        option.value ===
                                                        'distanceAsc' &&
                                                        !userLocation
                                                    }
                                                >
                                                    {
                                                        option.label
                                                    }
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </FilterField>
                            </div>

                            <div className="mt-3 flex flex-col gap-3 border-t border-slate-800/70 pt-3 lg:flex-row lg:items-end lg:justify-between">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                    <div>
                                        <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
                                            Location
                                        </p>

                                        {userLocation ? (
                                            <div className="flex min-h-11 min-w-[180px] items-center justify-between rounded-xl border border-emerald-300/15 bg-emerald-300/[0.055] px-3">
                                                <span className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                                                    <LocateFixed
                                                        className="size-3.5"
                                                        aria-hidden="true"
                                                    />

                                                    Location enabled
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        clearLocation
                                                    }
                                                    aria-label="Remove location"
                                                    className="flex size-7 items-center justify-center rounded-lg text-emerald-400 transition hover:bg-emerald-300/10 hover:text-emerald-200"
                                                >
                                                    <X
                                                        className="size-3.5"
                                                        aria-hidden="true"
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
                                                className="flex min-h-11 min-w-[180px] items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-950/50 px-4 text-xs font-semibold text-slate-300 transition duration-200 hover:border-sky-300/15 hover:bg-sky-300/[0.05] hover:text-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {locationStatus ===
                                                'loading' ? (
                                                    <LoaderCircle
                                                        className="size-3.5 animate-spin text-sky-300"
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <LocateFixed
                                                        className="size-3.5 text-sky-300"
                                                        aria-hidden="true"
                                                    />
                                                )}

                                                {locationStatus ===
                                                'loading'
                                                    ? 'Locating...'
                                                    : 'Use my location'}
                                            </button>
                                        )}
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
                                            className="field min-h-11 min-w-[160px] px-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <option value="">
                                                Any distance
                                            </option>

                                            {RADIUS_OPTIONS.map(
                                                option => (
                                                    <option
                                                        key={
                                                            option.value
                                                        }
                                                        value={
                                                            option.value
                                                        }
                                                    >
                                                        {
                                                            option.label
                                                        }
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </FilterField>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={
                                            clearFilters
                                        }
                                        className="min-h-11 rounded-xl px-4 text-xs font-semibold text-slate-500 transition duration-200 hover:bg-slate-800/70 hover:text-slate-200"
                                    >
                                        Reset
                                    </button>

                                    <button
                                        type="submit"
                                        className="shine-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-300 px-5 text-xs font-semibold text-slate-950 transition hover:brightness-110"
                                    >
                                        <Filter
                                            className="size-3.5"
                                            aria-hidden="true"
                                        />

                                        Apply filters
                                    </button>
                                </div>
                            </div>

                            {locationError && (
                                <p
                                    role="alert"
                                    className="mt-3 text-xs leading-5 text-rose-300"
                                >
                                    {
                                        locationError
                                    }
                                </p>
                            )}

                            {filtersQuery.isError && (
                                <p className="mt-3 text-xs leading-5 text-amber-300/80">
                                    Brand, category and city filters are temporarily unavailable.
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </section>

            <section className="relative z-10 mx-auto max-w-7xl px-5 py-7 md:px-8 lg:py-8">
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 10,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.4,
                        delay: 0.12,
                    }}
                >
                    <ResultsHeader
                        browseAll={
                            browseAll
                        }
                        currentQuery={
                            currentQuery
                        }
                        shouldSearch={
                            shouldSearch
                        }
                        resultsCount={
                            results
                                ?.totalElements
                        }
                        loading={
                            resultsQuery.isLoading
                        }
                        updating={
                            resultsQuery.isFetching &&
                            !resultsQuery.isLoading
                        }
                        hasResults={
                            hasResults
                        }
                        viewMode={
                            viewMode
                        }
                        onViewModeChange={
                            setViewMode
                        }
                    />

                    {!shouldSearch && (
                        <ReadyState />
                    )}

                    {shouldSearch &&
                        resultsQuery.isLoading && (
                            <SearchSkeleton />
                        )}

                    {shouldSearch &&
                        resultsQuery.isError && (
                            <SearchError
                                onRetry={
                                    () => {
                                        void resultsQuery.refetch()
                                    }
                                }
                            />
                        )}

                    {shouldSearch &&
                        results &&
                        results.content.length ===
                        0 &&
                        !resultsQuery.isLoading &&
                        !resultsQuery.isError && (
                            <NoResults
                                hasFilters={
                                    activeFilterCount >
                                    0
                                }
                                onReset={
                                    clearFilters
                                }
                            />
                        )}

                    {hasResults &&
                        viewMode ===
                        'offers' &&
                        results && (
                            <div className="mt-6 grid gap-4 lg:grid-cols-2">
                                {results.content.map(
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
                                )}
                            </div>
                        )}

                    {hasResults &&
                        viewMode ===
                        'map' &&
                        results && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 6,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    duration: 0.25,
                                }}
                                className="mt-6"
                            >
                                <SearchResultsMap
                                    results={
                                        results.content
                                    }
                                    userLocation={
                                        userLocation
                                    }
                                    variant="large"
                                />
                            </motion.div>
                        )}

                    {hasResults &&
                        results &&
                        results.totalPages >
                        1 && (
                            <Pagination
                                page={
                                    results.page
                                }
                                totalPages={
                                    results.totalPages
                                }
                                first={
                                    results.first
                                }
                                last={
                                    results.last
                                }
                                disabled={
                                    resultsQuery.isFetching
                                }
                                onChange={
                                    changePage
                                }
                            />
                        )}
                </motion.div>
            </section>
        </main>
    )
}

function ResultsHeader({
                           browseAll,
                           currentQuery,
                           shouldSearch,
                           resultsCount,
                           loading,
                           updating,
                           hasResults,
                           viewMode,
                           onViewModeChange,
                       }: {
    browseAll: boolean
    currentQuery: string
    shouldSearch: boolean
    resultsCount: number | undefined
    loading: boolean
    updating: boolean
    hasResults: boolean
    viewMode: ViewMode
    onViewModeChange: (
        mode: ViewMode,
    ) => void
}) {
    const title =
        browseAll
            ? 'Browse store offers'
            : currentQuery
                ? `Results for “${currentQuery}”`
                : shouldSearch
                    ? 'Matching offers'
                    : 'Ready when you are'

    let description =
        'Search for a product or explore all current offers.'

    if (shouldSearch) {
        if (
            resultsCount !==
            undefined
        ) {
            description =
                `${formatNumber(
                    resultsCount,
                )} ${
                    resultsCount ===
                    1
                        ? 'offer'
                        : 'offers'
                } found`
        } else if (loading) {
            description =
                'Searching current offers...'
        } else {
            description =
                'Offers will appear here.'
        }
    }

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p className="eyebrow">
                    Product discovery
                </p>

                <h2 className="mt-1.5 text-2xl font-semibold tracking-[-0.03em] text-slate-50">
                    {title}
                </h2>

                <div className="mt-1.5 flex flex-wrap items-center gap-3">
                    <p className="text-sm text-slate-500">
                        {description}
                    </p>

                    {updating && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/10 bg-sky-300/[0.05] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                            <LoaderCircle
                                className="size-3 animate-spin text-sky-300"
                                aria-hidden="true"
                            />

                            Updating
                        </span>
                    )}
                </div>
            </div>

            {hasResults && (
                <div
                    role="group"
                    aria-label="Search result view"
                    className="inline-flex w-fit rounded-xl border border-slate-800/80 bg-slate-900/60 p-1"
                >
                    <ViewButton
                        active={
                            viewMode ===
                            'offers'
                        }
                        onClick={
                            () =>
                                onViewModeChange(
                                    'offers',
                                )
                        }
                        icon={
                            <Rows3
                                className="size-3.5"
                                aria-hidden="true"
                            />
                        }
                    >
                        Offers
                    </ViewButton>

                    <ViewButton
                        active={
                            viewMode ===
                            'map'
                        }
                        onClick={
                            () =>
                                onViewModeChange(
                                    'map',
                                )
                        }
                        icon={
                            <MapPinned
                                className="size-3.5"
                                aria-hidden="true"
                            />
                        }
                    >
                        Map
                    </ViewButton>
                </div>
            )}
        </div>
    )
}

function ViewButton({
                        active,
                        onClick,
                        icon,
                        children,
                    }: {
    active: boolean
    onClick: () => void
    icon: ReactNode
    children: string
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={
                active
                    ? 'inline-flex min-h-9 items-center gap-2 rounded-lg bg-sky-300/[0.09] px-3 text-xs font-semibold text-sky-300'
                    : 'inline-flex min-h-9 items-center gap-2 rounded-lg px-3 text-xs font-medium text-slate-500 transition duration-200 hover:bg-white/[0.025] hover:text-slate-300'
            }
        >
            {icon}

            {children}
        </button>
    )
}

function ReadyState() {
    return (
        <div className="premium-card mt-6 overflow-hidden rounded-[1.8rem]">
            <div className="relative flex min-h-[330px] items-center justify-center p-8 text-center">
                <div
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 size-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300/[0.045] blur-[70px]"
                />

                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.97,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    transition={{
                        duration: 0.35,
                    }}
                    className="relative max-w-md"
                >
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-sky-300/15 bg-sky-300/[0.06] text-sky-300 shadow-[0_0_40px_rgba(14,165,233,0.07)]">
                        <Search
                            className="size-6"
                            aria-hidden="true"
                        />
                    </div>

                    <h3 className="mt-5 text-xl font-semibold text-slate-50">
                        Search ShelfRadar
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Find a product by name or browse current offers from participating stores.
                    </p>

                    <Link
                        to="/search?browse=all"
                        className="group mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/40 px-4 text-sm font-medium text-slate-300 transition duration-200 hover:border-sky-300/15 hover:bg-sky-300/[0.05] hover:text-sky-300"
                    >
                        Browse all offers

                        <ArrowRight
                            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                            aria-hidden="true"
                        />
                    </Link>
                </motion.div>
            </div>
        </div>
    )
}

function SearchSkeleton() {
    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className="mt-6 grid gap-4 lg:grid-cols-2"
        >
            <span className="sr-only">
                Loading search results...
            </span>

            {[
                1,
                2,
                3,
                4,
            ].map(
                item => (
                    <div
                        key={item}
                        aria-hidden="true"
                        className="premium-card h-[220px] rounded-2xl p-5"
                    >
                        <div className="flex gap-4">
                            <div className="skeleton size-16 shrink-0 rounded-2xl" />

                            <div className="flex-1">
                                <div className="skeleton h-3 w-24 rounded-full" />

                                <div className="skeleton mt-4 h-5 w-2/3 rounded-full" />

                                <div className="skeleton mt-3 h-3 w-1/2 rounded-full" />
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-3 gap-3">
                            <div className="skeleton h-10 rounded-xl" />
                            <div className="skeleton h-10 rounded-xl" />
                            <div className="skeleton h-10 rounded-xl" />
                        </div>
                    </div>
                ),
            )}
        </div>
    )
}

function SearchError({
                         onRetry,
                     }: {
    onRetry: () => void
}) {
    return (
        <div
            role="alert"
            className="premium-card mt-6 rounded-2xl p-8 text-center"
        >
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-rose-300/15 bg-rose-300/[0.06] text-rose-300">
                <Search
                    className="size-5"
                    aria-hidden="true"
                />
            </div>

            <h3 className="mt-4 font-semibold text-rose-200">
                Unable to load offers
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
                ShelfRadar could not retrieve the current offers.
            </p>

            <button
                type="button"
                onClick={onRetry}
                className="mt-5 inline-flex min-h-10 items-center justify-center rounded-xl border border-rose-300/15 bg-rose-300/[0.05] px-4 text-sm font-medium text-rose-200 transition hover:bg-rose-300/[0.09]"
            >
                Try again
            </button>
        </div>
    )
}

function NoResults({
                       hasFilters,
                       onReset,
                   }: {
    hasFilters: boolean
    onReset: () => void
}) {
    return (
        <div className="premium-card mt-6 rounded-[1.8rem] p-10 text-center">
            <Search
                className="mx-auto size-6 text-slate-600"
                aria-hidden="true"
            />

            <h3 className="mt-4 font-semibold text-slate-100">
                No matching offers
            </h3>

            <p className="mt-2 text-sm text-slate-500">
                Try changing your search or filters.
            </p>

            {hasFilters && (
                <button
                    type="button"
                    onClick={onReset}
                    className="mt-5 inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900/40 px-4 text-sm font-medium text-slate-300 transition duration-200 hover:border-sky-300/15 hover:bg-sky-300/[0.05] hover:text-sky-300"
                >
                    Reset filters
                </button>
            )}
        </div>
    )
}

function Pagination({
                        page,
                        totalPages,
                        first,
                        last,
                        disabled,
                        onChange,
                    }: {
    page: number
    totalPages: number
    first: boolean
    last: boolean
    disabled: boolean
    onChange: (page: number) => void
}) {
    return (
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PaginationButton
                direction="previous"
                disabled={
                    first ||
                    disabled
                }
                onClick={
                    () =>
                        onChange(
                            page - 1,
                        )
                }
            />

            <span className="rounded-xl border border-slate-800/80 bg-slate-900/40 px-4 py-2.5 text-xs text-slate-500">
                Page{' '}

                <strong className="font-semibold text-slate-200">
                    {page + 1}
                </strong>

                {' '}of{' '}

                <strong className="font-semibold text-slate-200">
                    {totalPages}
                </strong>
            </span>

            <PaginationButton
                direction="next"
                disabled={
                    last ||
                    disabled
                }
                onClick={
                    () =>
                        onChange(
                            page + 1,
                        )
                }
            />
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
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/40 px-4 text-sm font-medium text-slate-400 transition duration-200 hover:border-slate-600 hover:bg-slate-800/70 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-30 sm:w-auto"
        >
            {previous && (
                <ChevronLeft
                    className="size-4"
                    aria-hidden="true"
                />
            )}

            {previous
                ? 'Previous'
                : 'Next'}

            {!previous && (
                <ChevronRight
                    className="size-4"
                    aria-hidden="true"
                />
            )}
        </button>
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

function PublicHeader() {
    return (
        <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/85 backdrop-blur-2xl">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
                <Link
                    to="/"
                    aria-label="ShelfRadar home"
                    className="group flex items-center"
                >
                    <img
                        src="/shelfradar-logo.png"
                        alt="ShelfRadar"
                        className="h-13 w-auto object-contain drop-shadow-[0_0_18px_rgba(56,189,248,0.08)] transition duration-300 group-hover:scale-[1.025]"
                    />
                </Link>

                <nav
                    aria-label="Public navigation"
                    className="flex items-center gap-2 sm:gap-3"
                >
                    <Link
                        to="/search?browse=all"
                        className="hidden min-h-10 items-center rounded-xl border border-transparent px-4 text-sm font-medium text-slate-400 transition duration-200 hover:border-slate-800 hover:bg-slate-900/60 hover:text-slate-100 sm:inline-flex"
                    >
                        Browse products
                    </Link>

                    <Link
                        to="/login"
                        className="inline-flex min-h-10 items-center rounded-xl border border-slate-700/80 bg-slate-900/60 px-4 text-sm font-semibold text-slate-200 transition duration-200 hover:border-slate-600 hover:bg-slate-800/80 hover:text-white"
                    >
                        Staff login
                    </Link>
                </nav>
            </div>
        </header>
    )
}

function SearchBackground() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 overflow-hidden"
        >
            <div className="animate-glow-drift absolute left-1/2 top-[-260px] h-[560px] w-[850px] -translate-x-1/2 rounded-full bg-sky-400/[0.065] blur-[150px] motion-reduce:animate-none" />

            <div className="animate-glow-drift absolute -left-56 top-[430px] size-[440px] rounded-full bg-cyan-400/[0.025] blur-[135px] [animation-delay:900ms] motion-reduce:animate-none" />

            <div className="animate-glow-drift absolute -right-56 top-[260px] size-[500px] rounded-full bg-blue-500/[0.03] blur-[145px] [animation-delay:1500ms] motion-reduce:animate-none" />

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

function toNumberOrUndefined(
    value: string | null,
): number | undefined {
    if (!value) {
        return undefined
    }

    const parsed =
        Number(
            value,
        )

    return Number.isInteger(
        parsed,
    ) &&
    parsed > 0
        ? parsed
        : undefined
}

function toPageNumber(
    value: string | null,
): number {
    if (!value) {
        return 0
    }

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

function toRadiusKm(
    value: string | null,
): number | undefined {
    if (!value) {
        return undefined
    }

    const parsed =
        Number(
            value,
        )

    return Number.isFinite(
        parsed,
    ) &&
    parsed > 0 &&
    parsed <= 100
        ? parsed
        : undefined
}

function toStockStatus(
    value: string | null,
): StockStatus | undefined {
    return STOCK_STATUS_OPTIONS.some(
        option =>
            option.value ===
            value,
    )
        ? value as StockStatus
        : undefined
}

function toPublicSearchSort(
    value: string | null,
): PublicSearchSort {
    return SEARCH_SORT_OPTIONS.some(
        option =>
            option.value ===
            value,
    )
        ? value as PublicSearchSort
        : 'priceAsc'
}

function getLocationErrorMessage(
    code: number,
): string {
    if (code === 1) {
        return 'Location permission was denied.'
    }

    if (code === 2) {
        return 'Your location is currently unavailable.'
    }

    if (code === 3) {
        return 'Location request timed out.'
    }

    return 'Unable to determine your location.'
}