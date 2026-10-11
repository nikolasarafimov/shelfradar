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

import {
    motion,
} from 'motion/react'

import type {
    PublicSearchResult,
} from '../../types/public'

import {
    formatDistance,
    formatMkd,
} from '../../lib/format'

import StatusBadge from '../ui/StatusBadge'

interface SearchResultCardProps {
    result: PublicSearchResult
    index?: number
}

export default function SearchResultCard({
                                             result,
                                             index = 0,
                                         }: SearchResultCardProps) {
    const distance =
        formatDistance(
            result.distanceKm,
        )

    return (
        <motion.article
            initial={{
                opacity: 0,
                y: 16,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.45,
                delay:
                    Math.min(
                        index,
                        7,
                    ) * 0.055,
                ease: [
                    0.16,
                    1,
                    0.3,
                    1,
                ],
            }}
            whileHover={{
                y: -3,
            }}
            className="premium-card group flex min-h-[220px] flex-col rounded-2xl p-5"
        >
            <div className="relative flex min-w-0 items-start gap-4">
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
                            <p className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-sky-300/80">
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
                                className="mt-1.5 block truncate text-lg font-semibold tracking-[-0.025em] text-slate-50 transition-colors duration-200 hover:text-sky-300"
                            >
                                {
                                    result.product.name
                                }
                            </Link>
                        </div>

                        <StatusBadge
                            status={
                                result.status
                            }
                        />
                    </div>

                    <div className="mt-5 flex flex-wrap items-end gap-x-7 gap-y-4">
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-600">
                                Current price
                            </p>

                            <p className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-50 sm:text-2xl">
                                {
                                    formatMkd(
                                        result.price,
                                    )
                                }
                            </p>
                        </div>

                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-600">
                                Quantity
                            </p>

                            <div className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-300">
                                <Boxes
                                    className="size-3.5 text-slate-600"
                                    aria-hidden="true"
                                />

                                {
                                    result.quantity
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative my-4 h-px bg-gradient-to-r from-transparent via-slate-700/70 to-transparent" />

            <div className="relative mt-auto">
                <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-sky-300/10 bg-sky-300/[0.07] text-sky-300">
                        <Store
                            className="size-4"
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />
                    </div>

                    <div className="min-w-0">
                        <Link
                            to={
                                `/stores/${result.store.id}`
                            }
                            className="block truncate text-sm font-semibold text-slate-200 transition-colors duration-200 hover:text-sky-300"
                        >
                            {
                                result.store.name
                            }
                        </Link>

                        <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[11px] text-slate-500">
                            <MapPin
                                className="size-3 shrink-0"
                                aria-hidden="true"
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

                <div className="mt-4 flex items-center justify-between gap-4">
                    {distance ? (
                        <span className="inline-flex min-w-0 items-center gap-1.5 text-xs font-medium text-slate-400">
                            <Navigation
                                className="size-3.5 shrink-0 text-sky-300"
                                aria-hidden="true"
                            />

                            <span className="truncate">
                                {distance} away
                            </span>
                        </span>
                    ) : (
                        <span className="text-xs text-slate-600">
                            ShelfRadar store
                        </span>
                    )}

                    <Link
                        to={
                            `/products/${result.product.id}`
                        }
                        className="group/link inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-sky-300/10 bg-sky-300/[0.07] px-3 py-2 text-xs font-semibold text-sky-300 transition duration-200 hover:border-sky-300/20 hover:bg-sky-300/10"
                    >
                        View product

                        <ArrowUpRight
                            className="size-3.5 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                            aria-hidden="true"
                        />
                    </Link>
                </div>
            </div>
        </motion.article>
    )
}

interface ProductImageProps {
    name: string
    imageUrl: string | null
}

function ProductImage({
                          name,
                          imageUrl,
                      }: ProductImageProps) {
    if (imageUrl) {
        return (
            <img
                src={imageUrl}
                alt={name}
                loading="lazy"
                decoding="async"
                className="size-16 shrink-0 rounded-2xl border border-slate-700/60 bg-slate-950 object-cover shadow-lg shadow-black/20"
            />
        )
    }

    return (
        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-950/80 text-slate-600">
            <Package
                className="size-6"
                strokeWidth={1.6}
                aria-hidden="true"
            />
        </div>
    )
}