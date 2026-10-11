import {
    useEffect,
    useMemo,
} from 'react'

import {
    CircleMarker,
    MapContainer,
    Popup,
    TileLayer,
    useMap,
} from 'react-leaflet'

import {
    ArrowUpRight,
    LocateFixed,
    MapPin,
    Navigation,
    Package,
    Store,
} from 'lucide-react'

import {
    Link,
} from 'react-router-dom'

import type {
    PublicSearchResult,
} from '../../types/public'

import type {
    StockStatus,
} from '../../types/store'

import {
    formatDistance,
    formatMkd,
} from '../../lib/format'

interface UserLocation {
    latitude: number
    longitude: number
}

interface SearchResultsMapProps {
    results: PublicSearchResult[]
    userLocation: UserLocation | null
    variant?: 'default' | 'large'
}

interface StoreMapEntry {
    storeId: number
    storeName: string
    address: string
    city: string
    latitude: number
    longitude: number
    status: StockStatus
    lowestPrice: number
    offerCount: number
    distanceKm: number | null
}

interface MarkerStyle {
    border: string
    fill: string
}

type MapPoint = [
    number,
    number,
]

const MARKER_STYLES:
    Record<StockStatus, MarkerStyle> = {
    IN_STOCK: {
        border: '#059669',
        fill: '#34d399',
    },

    LOW_STOCK: {
        border: '#d97706',
        fill: '#fbbf24',
    },

    OUT_OF_STOCK: {
        border: '#e11d48',
        fill: '#fb7185',
    },
}

const STATUS_LABELS:
    Record<StockStatus, string> = {
    IN_STOCK: 'In stock',
    LOW_STOCK: 'Low stock',
    OUT_OF_STOCK: 'Out of stock',
}

export default function SearchResultsMap({
                                             results,
                                             userLocation,
                                             variant = 'default',
                                         }: SearchResultsMapProps) {
    const stores =
        useMemo(
            () =>
                buildStoreEntries(
                    results,
                ),
            [results],
        )

    const mapPoints =
        useMemo<MapPoint[]>(
            () => [
                ...stores.map(
                    store => [
                        store.latitude,
                        store.longitude,
                    ] as MapPoint,
                ),

                ...(
                    userLocation
                        ? [[
                            userLocation.latitude,
                            userLocation.longitude,
                        ] as MapPoint]
                        : []
                ),
            ],
            [
                stores,
                userLocation,
            ],
        )

    if (
        stores.length === 0 &&
        !userLocation
    ) {
        return null
    }

    const center: MapPoint =
        userLocation
            ? [
                userLocation.latitude,
                userLocation.longitude,
            ]
            : [
                stores[0].latitude,
                stores[0].longitude,
            ]

    const mapHeight =
        variant === 'large'
            ? 'h-[480px] md:h-[560px] lg:h-[610px]'
            : 'h-[330px] sm:h-[360px]'

    return (
        <section className="premium-card overflow-hidden rounded-2xl">
            <div className="relative flex flex-col gap-4 border-b border-slate-800/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-300/[0.08] text-sky-300">
                        <MapPin
                            className="size-4"
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />
                    </div>

                    <div className="min-w-0">
                        <h3 className="text-sm font-semibold tracking-tight text-slate-50">
                            Store locations
                        </h3>

                        <p className="mt-0.5 text-[11px] text-slate-500">
                            {stores.length}{' '}
                            {
                                stores.length === 1
                                    ? 'store on this page'
                                    : 'stores on this page'
                            }
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] font-medium text-slate-500">
                    <LegendItem
                        colorClass="bg-emerald-400 shadow-[0_0_9px_rgba(52,211,153,0.6)]"
                        label="In stock"
                    />

                    <LegendItem
                        colorClass="bg-amber-400 shadow-[0_0_9px_rgba(251,191,36,0.5)]"
                        label="Low stock"
                    />

                    <LegendItem
                        colorClass="bg-rose-400 shadow-[0_0_9px_rgba(251,113,133,0.5)]"
                        label="Out of stock"
                    />

                    {userLocation && (
                        <span className="inline-flex items-center gap-1.5">
                            <LocateFixed
                                className="size-3 text-sky-300"
                                aria-hidden="true"
                            />

                            You
                        </span>
                    )}
                </div>
            </div>

            <div className="shelfradar-map rounded-none border-0 shadow-none">
                <MapContainer
                    center={center}
                    zoom={12}
                    scrollWheelZoom={false}
                    className={`${mapHeight} w-full`}
                >
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <FitMapToPoints
                        points={mapPoints}
                    />

                    {userLocation && (
                        <CircleMarker
                            center={[
                                userLocation.latitude,
                                userLocation.longitude,
                            ]}
                            radius={9}
                            pathOptions={{
                                color: '#e0f2fe',
                                fillColor: '#38bdf8',
                                fillOpacity: 1,
                                weight: 3,
                            }}
                        >
                            <Popup>
                                <div className="min-w-[150px]">
                                    <div className="flex items-center gap-2">
                                        <LocateFixed
                                            className="size-3.5"
                                            aria-hidden="true"
                                        />

                                        <strong>
                                            Your location
                                        </strong>
                                    </div>
                                </div>
                            </Popup>
                        </CircleMarker>
                    )}

                    {stores.map(
                        store => {
                            const markerStyle =
                                MARKER_STYLES[
                                    store.status
                                    ]

                            const distance =
                                formatDistance(
                                    store.distanceKm,
                                )

                            return (
                                <CircleMarker
                                    key={store.storeId}
                                    center={[
                                        store.latitude,
                                        store.longitude,
                                    ]}
                                    radius={8}
                                    pathOptions={{
                                        color:
                                        markerStyle.border,

                                        fillColor:
                                        markerStyle.fill,

                                        fillOpacity:
                                            0.95,

                                        weight:
                                            3,
                                    }}
                                >
                                    <Popup>
                                        <div className="min-w-[215px]">
                                            <div className="flex items-start gap-2.5">
                                                <Store
                                                    className="mt-0.5 size-3.5 shrink-0"
                                                    aria-hidden="true"
                                                />

                                                <div className="min-w-0">
                                                    <strong>
                                                        {
                                                            store.storeName
                                                        }
                                                    </strong>

                                                    <div className="mt-1 text-xs">
                                                        {
                                                            store.address
                                                        }
                                                        ,{' '}
                                                        {
                                                            store.city
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-3 space-y-1.5 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <Package
                                                        className="size-3"
                                                        aria-hidden="true"
                                                    />

                                                    <span>
                                                        {
                                                            store.offerCount
                                                        }{' '}
                                                        {
                                                            store.offerCount === 1
                                                                ? 'offer'
                                                                : 'offers'
                                                        }
                                                    </span>
                                                </div>

                                                <div>
                                                    From{' '}
                                                    <strong>
                                                        {
                                                            formatMkd(
                                                                store.lowestPrice,
                                                            )
                                                        }
                                                    </strong>
                                                </div>

                                                <div>
                                                    {
                                                        STATUS_LABELS[
                                                            store.status
                                                            ]
                                                    }
                                                </div>

                                                {distance && (
                                                    <div className="flex items-center gap-2">
                                                        <Navigation
                                                            className="size-3"
                                                            aria-hidden="true"
                                                        />

                                                        {distance} away
                                                    </div>
                                                )}
                                            </div>

                                            <Link
                                                to={
                                                    `/stores/${store.storeId}`
                                                }
                                                className="group/link mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 transition-colors hover:text-sky-200"
                                            >
                                                View store

                                                <ArrowUpRight
                                                    className="size-3 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                                                    aria-hidden="true"
                                                />
                                            </Link>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            )
                        },
                    )}
                </MapContainer>
            </div>

            <div className="relative flex items-center justify-between gap-4 border-t border-slate-800/80 bg-slate-950/25 px-5 py-3">
                <p className="text-[10px] leading-4 text-slate-600">
                    Marker color reflects the best availability reported by each store.
                </p>

                <span className="hidden shrink-0 items-center gap-1.5 text-[10px] text-slate-600 sm:inline-flex">
                    <MapPin
                        className="size-3"
                        aria-hidden="true"
                    />

                    ShelfRadar map
                </span>
            </div>
        </section>
    )
}

function FitMapToPoints({
                            points,
                        }: {
    points: MapPoint[]
}) {
    const map =
        useMap()

    useEffect(
        () => {
            if (points.length === 0) {
                return
            }

            if (points.length === 1) {
                map.setView(
                    points[0],
                    14,
                )

                return
            }

            map.fitBounds(
                points,
                {
                    padding: [
                        40,
                        40,
                    ],
                    maxZoom: 14,
                },
            )
        },
        [
            map,
            points,
        ],
    )

    return null
}

function LegendItem({
                        colorClass,
                        label,
                    }: {
    colorClass: string
    label: string
}) {
    return (
        <span className="inline-flex items-center gap-1.5">
            <span
                aria-hidden="true"
                className={`size-2 rounded-full ${colorClass}`}
            />

            {label}
        </span>
    )
}

function buildStoreEntries(
    results: PublicSearchResult[],
): StoreMapEntry[] {
    const groupedResults =
        new Map<
            number,
            PublicSearchResult[]
        >()

    results.forEach(
        result => {
            const existing =
                groupedResults.get(
                    result.store.id,
                )

            if (existing) {
                existing.push(
                    result,
                )

                return
            }

            groupedResults.set(
                result.store.id,
                [
                    result,
                ],
            )
        },
    )

    return Array.from(
        groupedResults.values(),
    ).map(
        offers => {
            const firstOffer =
                offers[0]

            const availableOffers =
                offers.filter(
                    offer =>
                        offer.status !==
                        'OUT_OF_STOCK',
                )

            const pricedOffers =
                availableOffers.length > 0
                    ? availableOffers
                    : offers

            const availableDistances =
                offers
                    .map(
                        offer =>
                            offer.distanceKm,
                    )
                    .filter(
                        (
                            distance,
                        ): distance is number =>
                            distance !== null,
                    )

            return {
                storeId:
                firstOffer.store.id,

                storeName:
                firstOffer.store.name,

                address:
                firstOffer.store.address,

                city:
                firstOffer.store.city,

                latitude:
                firstOffer.store.latitude,

                longitude:
                firstOffer.store.longitude,

                status:
                    getBestStatus(
                        offers,
                    ),

                lowestPrice:
                    Math.min(
                        ...pricedOffers.map(
                            offer =>
                                offer.price,
                        ),
                    ),

                offerCount:
                offers.length,

                distanceKm:
                    availableDistances.length > 0
                        ? Math.min(
                            ...availableDistances,
                        )
                        : null,
            }
        },
    )
}

function getBestStatus(
    offers: PublicSearchResult[],
): StockStatus {
    if (
        offers.some(
            offer =>
                offer.status ===
                'IN_STOCK',
        )
    ) {
        return 'IN_STOCK'
    }

    if (
        offers.some(
            offer =>
                offer.status ===
                'LOW_STOCK',
        )
    ) {
        return 'LOW_STOCK'
    }

    return 'OUT_OF_STOCK'
}