import {
    Clock3,
    MapPin,
    Navigation,
    Package,
    Store,
} from 'lucide-react'

import type {
    PublicSearchResult,
} from '../../types/publicSearch'

import type {
    StockStatus,
} from '../../types/store'


export default function SearchResultCard({
                                             result,
                                         }: {
    result: PublicSearchResult
}) {

    return (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex h-full flex-col p-6">

                <div className="flex gap-5">

                    <ProductImage
                        name={
                            result.product.name
                        }
                        imageUrl={
                            result.product.imageUrl
                        }
                    />

                    <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-start justify-between gap-3">

                            <div>

                                <p className="text-sm font-medium text-slate-500">
                                    {
                                        result.product.brand.name
                                    }
                                    {' · '}
                                    {
                                        result.product.category.name
                                    }
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-slate-950">
                                    {
                                        result.product.name
                                    }
                                </h2>

                            </div>

                            <StockBadge
                                status={
                                    result.status
                                }
                            />

                        </div>


                        <div className="mt-5 flex items-end justify-between gap-4">

                            <div>

                                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                    Price
                                </p>

                                <p className="mt-1 text-2xl font-bold text-slate-950">
                                    {
                                        formatPrice(
                                            result.price,
                                        )
                                    }
                                    {' '}
                                    <span className="text-base font-semibold text-slate-500">
                                        MKD
                                    </span>
                                </p>

                            </div>


                            <div className="text-right">

                                <p className="text-xs text-slate-400">
                                    Quantity
                                </p>

                                <p className="font-semibold text-slate-700">
                                    {
                                        result.quantity
                                    }
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                <div className="my-5 border-t border-slate-100" />


                <div className="space-y-3 text-sm text-slate-600">

                    <div className="flex items-center gap-3">

                        <Store
                            size={17}
                            className="shrink-0 text-slate-400"
                        />

                        <span className="font-medium text-slate-800">
                            {
                                result.store.name
                            }
                        </span>

                    </div>


                    <div className="flex items-start gap-3">

                        <MapPin
                            size={17}
                            className="mt-0.5 shrink-0 text-slate-400"
                        />

                        <span>
                            {
                                result.store.address
                            }
                            ,{' '}
                            {
                                result.store.city
                            }
                        </span>

                    </div>


                    {
                        result.distanceKm !== null && (

                            <div className="flex items-center gap-3">

                                <Navigation
                                    size={17}
                                    className="shrink-0 text-slate-400"
                                />

                                <span className="font-medium text-slate-700">
                                    {
                                        formatDistance(
                                            result.distanceKm,
                                        )
                                    }{' '}
                                    away
                                </span>

                            </div>
                        )
                    }


                    {
                        result.store.workingHours && (

                            <div className="flex items-center gap-3">

                                <Clock3
                                    size={17}
                                    className="shrink-0 text-slate-400"
                                />

                                <span>
                                    {
                                        result.store.workingHours
                                    }
                                </span>

                            </div>
                        )
                    }

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

    if (imageUrl) {

        return (
            <img
                src={imageUrl}
                alt={name}
                className="h-24 w-24 shrink-0 rounded-xl border border-slate-100 object-cover"
            />
        )
    }

    return (
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">

            <Package
                size={34}
            />

        </div>
    )
}


function StockBadge({
                        status,
                    }: {
    status: StockStatus
}) {

    const styles =
        status === 'IN_STOCK'
            ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
            : status === 'LOW_STOCK'
                ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
                : 'bg-red-50 text-red-700 ring-red-600/20'


    const label =
        status === 'IN_STOCK'
            ? 'In stock'
            : status === 'LOW_STOCK'
                ? 'Low stock'
                : 'Out of stock'


    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${styles}`}
        >
            {label}
        </span>
    )
}


function formatPrice(
    value: number,
): string {

    return new Intl.NumberFormat(
        'en-US',
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        },
    ).format(value)
}


function formatDistance(
    distanceKm: number,
): string {

    if (distanceKm < 1) {

        return `${Math.round(
            distanceKm * 1000,
        )} m`
    }

    return `${distanceKm.toFixed(1)} km`
}