import {
    ArrowUpRight,
    Boxes,
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

import StockBadge
    from './StockBadge'

export default function SearchResultCard({
    result,
    index = 0,
}: {
    result: PublicSearchResult
    index?: number
}) {

    const animationDelay =
        `${Math.min(
            index,
            7,
        ) * 70}ms`

    return (
        <article
            className="animate-fade-up premium-card group flex min-h-[215px] flex-col rounded-3xl border border-slate-800/90 bg-slate-900/55 p-5 shadow-[0_22px_60px_-35px_rgba(0,0,0,0.9)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-sky-900/80 hover:bg-slate-900/80 hover:shadow-[0_28px_70px_-35px_rgba(14,165,233,0.24)] motion-reduce:transform-none"
            style={{
                animationDelay,
            }}
        >
            <div className="flex min-w-0 items-start gap-4">
                <ProductImage
                    name={
                        result.product.name
                    }
                    imageUrl={
                        result.product.imageUrl
                    }
                />

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="truncate text-[10px] font-bold uppercase tracking-[0.12em] text-sky-400">
                                {
                                    result.product.brand.name
                                }

                                <span className="mx-1.5 text-slate-700">
                                    ·
                                </span>

                                {
                                    result.product.category.name
                                }
                            </p>

                            <Link
                                to={
                                    `/products/${result.product.id}`
                                }
                                className="mt-1.5 block truncate text-lg font-bold tracking-tight text-white transition hover:text-sky-300"
                            >
                                {
                                    result.product.name
                                }
                            </Link>
                        </div>

                        <StockBadge
                            status={
                                result.status
                            }
                        />
                    </div>

                    <div className="mt-5 flex items-end gap-7">
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-600">
                                Current price
                            </p>

                            <p className="mt-1 whitespace-nowrap text-2xl font-bold tracking-tight text-white">
                                {
                                    formatPrice(
                                        result.price,
                                    )
                                }

                                <span className="ml-1.5 text-xs font-semibold text-slate-500">
                                    MKD
                                </span>
                            </p>
                        </div>

                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-600">
                                Quantity
                            </p>

                            <div className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-300">
                                <Boxes
                                    size={14}
                                    className="text-slate-600"
                                />

                                {
                                    result.quantity
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="my-4 border-t border-slate-800/80" />

            <div className="mt-auto">
                <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                        <Store size={14}/>
                    </div>

                    <div className="min-w-0">
                        <Link
                            to={
                                `/stores/${result.store.id}`
                            }
                            className="block truncate text-sm font-semibold text-slate-200 transition hover:text-sky-300"
                        >
                            {
                                result.store.name
                            }
                        </Link>

                        <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[11px] text-slate-500">
                            <MapPin
                                size={11}
                                className="shrink-0"
                            />

                            <span className="truncate">
                                {
                                    result.store.address
                                }
                                ,{' '}
                                {
                                    result.store.city
                                }
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    {
                        result.distanceKm !==
                        null ? (

                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                                <Navigation
                                    size={13}
                                    className="text-sky-400"
                                />

                                {
                                    formatDistance(
                                        result.distanceKm,
                                    )
                                } away
                            </span>
                        ) : (
                            <span className="text-xs text-slate-600">
                                ShelfRadar store
                            </span>
                        )
                    }

                    <Link
                        to={
                            `/products/${result.product.id}`
                        }
                        className="group/link inline-flex items-center gap-1.5 rounded-xl bg-sky-500/10 px-3 py-2 text-xs font-bold text-sky-300 transition hover:bg-sky-500/15"
                    >
                        View product

                        <ArrowUpRight
                            size={12}
                            className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                        />
                    </Link>
                </div>
            </div>
        </article>
    )
}

function ProductImage({
    name,
    imageUrl,
}: {
    name: string
    imageUrl: string | null
}) {

    if (
        imageUrl
    ) {

        return (
            <img
                src={
                    imageUrl
                }
                alt={
                    name
                }
                className="h-16 w-16 shrink-0 rounded-2xl border border-slate-800 bg-[#020817] object-cover shadow-lg shadow-black/20"
            />
        )
    }

    return (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-800 bg-[#020817] text-slate-600">
            <Package
                size={24}
                strokeWidth={1.6}
            />
        </div>
    )
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