import {
    useEffect,
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
} from '../../types/publicSearch'

import type {
    StockStatus,
} from '../../types/store'

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

type MapPoint = [
    number,
    number,
]

export default function SearchResultsMap({
    results,
    userLocation,
    variant = 'default',
}: SearchResultsMapProps) {
    const stores =
        buildStoreEntries(
            results,
        )

    if (
        stores.length ===
        0 &&
        !userLocation
    ) {
        return null
    }

    const center:
        MapPoint =
        userLocation
            ? [
                userLocation.latitude,
                userLocation.longitude,
            ]
            : [
                stores[0].latitude,
                stores[0].longitude,
            ]

    const mapPoints:
        MapPoint[] = [
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
    ]

    const mapHeight =
        variant ===
        'large'
            ? 'h-[480px] md:h-[560px] lg:h-[610px]'
            : 'h-[330px] sm:h-[360px]'

    return (
        <section className="premium-card overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-900/60 shadow-[0_28px_90px_-45px_rgba(14,165,233,0.18)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 border-b border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-900/50 bg-sky-950/30 text-sky-400">
                        <MapPin size={17}/>
                    </div>

                    <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-white">
                            Store locations
                        </h3>

                        <p className="mt-0.5 text-[11px] text-slate-500">
                            {
                                stores.length
                            }{' '}

                            {
                                stores.length ===
                                1
                                    ? 'store on this page'
                                    : 'stores on this page'
                            }
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] text-slate-500">
                    <LegendItem
                        colorClass="bg-emerald-400 shadow-[0_0_9px_rgba(52,211,153,0.65)]"
                        label="In stock"
                    />

                    <LegendItem
                        colorClass="bg-amber-400 shadow-[0_0_9px_rgba(251,191,36,0.55)]"
                        label="Low stock"
                    />

                    <LegendItem
                        colorClass="bg-red-400 shadow-[0_0_9px_rgba(248,113,113,0.55)]"
                        label="Out of stock"
                    />
                    {
                        userLocation && (
                            <span className="inline-flex items-center gap-1.5">
                                <LocateFixed
                                    size={11}
                                    className="text-sky-400"
                                />
                                You
                            </span>
                        )
                    }
                </div>
            </div>

            <div className="shelfradar-map">
                <MapContainer
                    center={
                        center
                    }
                    zoom={
                        12
                    }
                    scrollWheelZoom={
                        false
                    }
                    className={`${mapHeight} w-full`}
                >

                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <FitMapToPoints
                        points={
                            mapPoints
                        }
                    />
                    {
                        userLocation && (
                            <CircleMarker
                                center={[
                                    userLocation.latitude,
                                    userLocation.longitude,
                                ]}
                                radius={
                                    9
                                }
                                pathOptions={{
                                    color:
                                        '#e0f2fe',

                                    fillColor:
                                        '#38bdf8',

                                    fillOpacity:
                                        1,

                                    weight:
                                        3,
                                }}
                            >
                                <Popup>
                                    <div className="min-w-[150px]">
                                        <div className="flex items-center gap-2">
                                            <LocateFixed
                                                size={13}
                                            />

                                            <strong>
                                                Your location
                                            </strong>
                                        </div>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        )
                    }

                    {
                        stores.map(
                            store => {

                                const markerStyle =
                                    getMarkerStyle(
                                        store.status,
                                    )

                                return (
                                    <CircleMarker
                                        key={
                                            store.storeId
                                        }
                                        center={[
                                            store.latitude,
                                            store.longitude,
                                        ]}
                                        radius={
                                            8
                                        }
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
                                            <div className="min-w-[210px]">
                                                <div className="flex items-start gap-2">
                                                    <Store
                                                        size={14}
                                                        className="mt-0.5 shrink-0"
                                                    />

                                                    <div>
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
                                                        <Package size={12}/>

                                                        <span>
                                                            {
                                                                store.offerCount
                                                            }{' '}

                                                            {
                                                                store.offerCount ===
                                                                1
                                                                    ? 'offer'
                                                                    : 'offers'
                                                            }
                                                        </span>
                                                    </div>

                                                    <div>
                                                        From{' '}
                                                        <strong>
                                                            {
                                                                formatPrice(
                                                                    store.lowestPrice,
                                                                )
                                                            } MKD
                                                        </strong>
                                                    </div>

                                                    <div>
                                                        {
                                                            formatStatus(
                                                                store.status,
                                                            )
                                                        }
                                                    </div>
                                                    {
                                                        store.distanceKm !==
                                                        null && (

                                                            <div className="flex items-center gap-2">
                                                                <Navigation size={12}/>
                                                                {
                                                                    formatDistance(
                                                                        store.distanceKm,
                                                                    )
                                                                } away
                                                            </div>
                                                        )
                                                    }
                                                </div>

                                                <Link
                                                    to={
                                                        `/stores/${store.storeId}`
                                                    }
                                                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300"
                                                >
                                                    View store
                                                    <ArrowUpRight size={11}/>
                                                </Link>
                                            </div>
                                        </Popup>
                                    </CircleMarker>
                                )
                            },
                        )
                    }
                </MapContainer>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-slate-800 bg-[#020817]/35 px-5 py-3">
                <p className="text-[10px] leading-4 text-slate-600">
                    Marker color reflects the best availability reported by each store.
                </p>

                <span className="hidden shrink-0 items-center gap-1.5 text-[10px] text-slate-600 sm:inline-flex">
                    <MapPin size={11}/>
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
            if (
                points.length ===
                0
            ) {
                return
            }

            if (
                points.length ===
                1
            ) {

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

                    maxZoom:
                        14,
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
                className={`h-2 w-2 rounded-full ${colorClass}`}
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

            if (
                existing
            ) {
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
                            distance !==
                            null,
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
                        ...offers.map(
                            offer =>
                                offer.price,
                        ),
                    ),

                offerCount:
                offers.length,

                distanceKm:
                    availableDistances.length >
                    0
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

function getMarkerStyle(
    status: StockStatus,
): {
    border: string
    fill: string
} {
    if (
        status ===
        'IN_STOCK'
    ) {
        return {
            border:
                '#059669',

            fill:
                '#34d399',
        }
    }

    if (
        status ===
        'LOW_STOCK'
    ) {
        return {
            border:
                '#d97706',

            fill:
                '#fbbf24',
        }
    }

    return {
        border:
            '#dc2626',

        fill:
            '#f87171',
    }
}

function formatStatus(
    status: StockStatus,
): string {
    if (
        status ===
        'IN_STOCK'
    ) {
        return 'In stock'
    }

    if (
        status ===
        'LOW_STOCK'
    ) {
        return 'Low stock'
    }
    return 'Out of stock'
}

function formatPrice(
    value: number,
): string {
    return new Intl.NumberFormat(
        'en-US',
        {
            minimumFractionDigits:
                0,

            maximumFractionDigits:
                2,
        },
    ).format(
        value,
    )
}

function formatDistance(
    distanceKm: number,
): string {
    if (
        distanceKm <
        1
    ) {
        return `${Math.round(
            distanceKm *
            1000,
        )} m`
    }

    return `${distanceKm.toFixed(
        1,
    )} km`
}