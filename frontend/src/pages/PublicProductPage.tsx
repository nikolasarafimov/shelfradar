import type {
    ReactNode,
} from 'react'

import {
    useQuery,
} from '@tanstack/react-query'

import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    BadgeCheck,
    Boxes,
    MapPin,
    Package,
    ShoppingBag,
    Store,
    Tag,
} from 'lucide-react'

import {
    Link,
    useParams,
} from 'react-router-dom'

import {
    getPublicProduct,
} from '../api/publicBrowseApi'

import SearchResultsMap
    from '../components/public/SearchResultsMap'

import StockBadge
    from '../components/public/StockBadge'

import {
    formatMkd,
    formatNumber,
} from '../lib/format'


export default function PublicProductPage() {

    const {
        productId,
    } =
        useParams()


    const parsedProductId =
        parsePositiveId(
            productId,
        )


    const productQuery =
        useQuery({
            queryKey: [
                'public-product',
                parsedProductId,
            ],

            queryFn:
                () =>
                    getPublicProduct(
                        parsedProductId!,
                    ),

            enabled:
                parsedProductId !==
                null,
        })


    if (
        parsedProductId ===
        null
    ) {

        return (
            <NotFoundMessage
                message="Product not found."
            />
        )
    }


    if (
        productQuery.isLoading
    ) {

        return (
            <PageMessage
                message="Loading product..."
            />
        )
    }


    if (
        productQuery.isError
    ) {

        return (
            <ErrorMessage
                onRetry={
                    () => {
                        void productQuery.refetch()
                    }
                }
            />
        )
    }


    if (
        !productQuery.data
    ) {

        return (
            <NotFoundMessage
                message="Product not found."
            />
        )
    }


    const detail =
        productQuery.data


    const product =
        detail.product


    const bestOffer =
        detail.offers.find(
            offer =>
                offer.status !==
                'OUT_OF_STOCK',
        ) ??
        null


    return (
        <main className="relative min-h-dvh overflow-x-clip bg-[#020817] text-white">

            <Background />

            <PublicHeader />


            <div className="relative z-10 mx-auto max-w-7xl px-5 pb-12 pt-6 md:px-8">

                <div className="animate-fade-up">

                    <Link
                        to="/search"
                        className="group inline-flex items-center gap-2 rounded-xl py-2 text-sm font-semibold text-slate-500 transition hover:text-sky-300"
                    >

                        <ArrowLeft
                            size={15}
                            className="transition-transform group-hover:-translate-x-1"
                        />

                        Back to search

                    </Link>

                </div>


                <section className="premium-card animate-fade-up animation-delay-100 mt-3 overflow-hidden rounded-[1.8rem] border border-slate-800/90 bg-slate-900/55 shadow-[0_30px_90px_-50px_rgba(14,165,233,0.3)] backdrop-blur-xl">

                    <div className="grid gap-6 p-5 md:p-6 lg:grid-cols-[150px_minmax(0,1fr)_260px] lg:items-center lg:gap-7">

                        <ProductImage
                            name={
                                product.name
                            }
                            imageUrl={
                                product.imageUrl
                            }
                        />


                        <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                                <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-900/60 bg-sky-950/35 px-2.5 py-1 text-[10px] font-bold text-sky-300">

                                    <Tag
                                        size={11}
                                    />

                                    {
                                        product.brand.name
                                    }

                                </span>


                                <span className="rounded-full border border-slate-800 bg-slate-950/50 px-2.5 py-1 text-[10px] font-semibold text-slate-400">
                                    {
                                        product.category.name
                                    }
                                </span>

                            </div>


                            <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-[2.7rem]">
                                {
                                    product.name
                                }
                            </h1>


                            {
                                product.description && (

                                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                                        {
                                            product.description
                                        }
                                    </p>
                                )
                            }


                            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">

                                <CompactStat
                                    icon={
                                        <Store
                                            size={14}
                                        />
                                    }
                                    label="Store offers"
                                    value={
                                        formatNumber(
                                            detail.totalStores,
                                        )
                                    }
                                />


                                <CompactStat
                                    icon={
                                        <BadgeCheck
                                            size={14}
                                        />
                                    }
                                    label="Available now"
                                    value={
                                        formatNumber(
                                            detail.availableStores,
                                        )
                                    }
                                />

                            </div>

                        </div>


                        <div className="relative overflow-hidden rounded-2xl border border-sky-900/50 bg-sky-950/20 p-5">

                            <div
                                aria-hidden="true"
                                className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-sky-500/10 blur-3xl"
                            />


                            <div className="relative">

                                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-sky-400">
                                    Lowest available
                                </p>


                                {
                                    detail.lowestPrice !==
                                    null ? (

                                        <>
                                            <p className="mt-2 text-3xl font-bold tracking-tight text-white">
                                                {
                                                    formatMkd(
                                                        detail.lowestPrice,
                                                    )
                                                }
                                            </p>


                                            <p className="mt-2 text-xs text-slate-500">
                                                Best current ShelfRadar offer
                                            </p>

                                        </>

                                    ) : (

                                        <>
                                            <p className="mt-2 text-xl font-bold text-slate-300">
                                                Unavailable
                                            </p>


                                            <p className="mt-2 text-xs text-slate-500">
                                                No currently available stock
                                            </p>
                                        </>
                                    )
                                }


                                {
                                    bestOffer && (

                                        <Link
                                            to={
                                                `/stores/${bestOffer.store.id}`
                                            }
                                            className="group mt-5 inline-flex items-center gap-2 text-xs font-bold text-sky-300 transition hover:text-sky-200"
                                        >

                                            View best offer

                                            <ArrowRight
                                                size={13}
                                                className="transition-transform group-hover:translate-x-1"
                                            />

                                        </Link>
                                    )
                                }

                            </div>

                        </div>

                    </div>

                </section>


                {
                    detail.offers.length >
                    0 && (

                        <section className="animate-fade-up animation-delay-200 mt-8">

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                                <div>

                                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky-400">
                                        Store availability
                                    </p>


                                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
                                        Where to buy
                                    </h2>


                                    <p className="mt-1 text-sm text-slate-500">
                                        Compare current offers from participating stores.
                                    </p>

                                </div>


                                <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs font-semibold text-slate-400">

                                    <ShoppingBag
                                        size={13}
                                        className="text-sky-400"
                                    />

                                    {
                                        formatNumber(
                                            detail.offers.length,
                                        )
                                    }{' '}

                                    {
                                        detail.offers.length ===
                                        1
                                            ? 'offer'
                                            : 'offers'
                                    }

                                </div>

                            </div>


                            <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">

                                <div className="space-y-3">

                                    {
                                        detail.offers.map(
                                            (
                                                offer,
                                                index,
                                            ) => (

                                                <article
                                                    key={
                                                        offer.inventoryId
                                                    }
                                                    className="premium-card animate-fade-up group overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/55 transition duration-300 hover:-translate-y-0.5 hover:border-sky-900/80 hover:bg-slate-900/75 hover:shadow-[0_24px_60px_-35px_rgba(14,165,233,0.22)] motion-reduce:transform-none"
                                                    style={{
                                                        animationDelay:
                                                            `${Math.min(
                                                                index,
                                                                6,
                                                            ) * 70 + 220}ms`,
                                                    }}
                                                >

                                                    <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">

                                                        <div className="min-w-0 flex-1">

                                                            <div className="flex items-center gap-3">

                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">

                                                                    <Store
                                                                        size={16}
                                                                    />

                                                                </div>


                                                                <div className="min-w-0">

                                                                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
                                                                        Store
                                                                    </p>


                                                                    <Link
                                                                        to={
                                                                            `/stores/${offer.store.id}`
                                                                        }
                                                                        className="mt-0.5 block truncate text-base font-bold text-slate-100 transition hover:text-sky-300"
                                                                    >
                                                                        {
                                                                            offer.store.name
                                                                        }
                                                                    </Link>

                                                                </div>

                                                            </div>


                                                            <div className="mt-3 flex min-w-0 items-center gap-2 pl-1 text-xs text-slate-500">

                                                                <MapPin
                                                                    size={13}
                                                                    className="shrink-0"
                                                                />

                                                                <span className="truncate">
                                                                    {
                                                                        offer.store.address
                                                                    }
                                                                    ,{' '}
                                                                    {
                                                                        offer.store.city
                                                                    }
                                                                </span>

                                                            </div>

                                                        </div>


                                                        <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-5 border-t border-slate-800 pt-4 sm:min-w-[330px] sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">

                                                            <OfferMetric
                                                                label="Price"
                                                            >
                                                                <span className="whitespace-nowrap text-lg font-bold text-white">
                                                                    {
                                                                        formatMkd(
                                                                            offer.price,
                                                                        )
                                                                    }
                                                                </span>
                                                            </OfferMetric>


                                                            <OfferMetric
                                                                label="Quantity"
                                                            >

                                                                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-300">

                                                                    <Boxes
                                                                        size={13}
                                                                        className="text-slate-600"
                                                                    />

                                                                    {
                                                                        formatNumber(
                                                                            offer.quantity,
                                                                        )
                                                                    }

                                                                </span>

                                                            </OfferMetric>


                                                            <StockBadge
                                                                status={
                                                                    offer.status
                                                                }
                                                            />

                                                        </div>

                                                    </div>


                                                    <div className="flex items-center justify-between border-t border-slate-800/80 bg-[#020817]/35 px-5 py-2.5">

                                                        <span className="text-[10px] text-slate-600">
                                                            Current ShelfRadar offer
                                                        </span>


                                                        <Link
                                                            to={
                                                                `/stores/${offer.store.id}`
                                                            }
                                                            className="group/link inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-sky-300 transition hover:bg-sky-500/10"
                                                        >

                                                            View store

                                                            <ArrowUpRight
                                                                size={12}
                                                                className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                                                            />

                                                        </Link>

                                                    </div>

                                                </article>
                                            ),
                                        )
                                    }

                                </div>


                                <div className="lg:sticky lg:top-28">

                                    <SearchResultsMap
                                        results={
                                            detail.offers
                                        }
                                        userLocation={
                                            null
                                        }
                                    />

                                </div>

                            </div>

                        </section>
                    )
                }


                {
                    detail.offers.length ===
                    0 && (

                        <section className="animate-fade-up animation-delay-200 mt-8">

                            <div className="premium-card flex min-h-[280px] items-center justify-center rounded-[1.8rem] border border-dashed border-slate-800 bg-slate-900/25 p-8 text-center">

                                <div className="max-w-sm">

                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-500">

                                        <Package
                                            size={23}
                                        />

                                    </div>


                                    <h2 className="mt-5 text-xl font-bold">
                                        No active offers
                                    </h2>


                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        This product is not currently listed by an active
                                        ShelfRadar store.
                                    </p>


                                    <Link
                                        to="/search?browse=all"
                                        className="group mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-sky-800 hover:bg-slate-900 hover:text-white"
                                    >

                                        Browse products

                                        <ArrowRight
                                            size={14}
                                            className="transition-transform group-hover:translate-x-1"
                                        />

                                    </Link>

                                </div>

                            </div>

                        </section>
                    )
                }

            </div>

        </main>
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
                decoding="async"
                className="aspect-square w-full max-w-[150px] shrink-0 rounded-2xl border border-slate-800 bg-[#020817] object-cover shadow-xl shadow-black/20"
            />
        )
    }


    return (
        <div className="flex aspect-square w-full max-w-[150px] shrink-0 items-center justify-center rounded-2xl border border-slate-800 bg-[#020817] text-slate-600">

            <Package
                size={42}
                strokeWidth={1.45}
            />

        </div>
    )
}


function CompactStat({
                         icon,
                         label,
                         value,
                     }: {
    icon: ReactNode
    label: string
    value: string
}) {

    return (
        <div className="flex items-center gap-2.5">

            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950/70 text-sky-400">
                {icon}
            </span>


            <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-slate-600">
                    {label}
                </p>


                <p className="mt-0.5 text-sm font-bold text-slate-200">
                    {value}
                </p>

            </div>

        </div>
    )
}


function OfferMetric({
                         label,
                         children,
                     }: {
    label: string
    children: ReactNode
}) {

    return (
        <div>

            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-slate-600">
                {label}
            </p>


            <div className="mt-1">
                {children}
            </div>

        </div>
    )
}


function PublicHeader() {

    return (
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
                        className="h-14 w-auto object-contain drop-shadow-[0_0_18px_rgba(56,189,248,0.1)] transition duration-300 group-hover:scale-[1.025]"
                    />

                </Link>


                <nav
                    aria-label="Public navigation"
                    className="flex items-center gap-2 sm:gap-3"
                >

                    <Link
                        to="/search?browse=all"
                        className="hidden rounded-xl bg-slate-900/60 px-4 py-2.5 text-sm font-semibold text-slate-400 transition hover:-translate-y-0.5 hover:bg-slate-800 hover:text-white motion-reduce:transform-none sm:inline-flex"
                    >
                        Browse products
                    </Link>


                    <Link
                        to="/login"
                        className="rounded-xl border border-slate-700 bg-slate-900/40 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:border-slate-500 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 motion-reduce:transform-none"
                    >
                        Staff Login
                    </Link>

                </nav>

            </div>

        </header>
    )
}


function Background() {

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 overflow-hidden"
        >

            <div className="animate-glow-drift absolute left-1/2 top-[-270px] h-[580px] w-[880px] -translate-x-1/2 rounded-full bg-sky-500/[0.075] blur-[150px]" />


            <div className="animate-glow-drift absolute -left-56 top-[400px] h-[420px] w-[420px] rounded-full bg-cyan-500/[0.025] blur-[130px] [animation-delay:900ms]" />


            <div
                className="absolute inset-0 opacity-[0.025]"
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


function PageMessage({
                         message,
                     }: {
    message: string
}) {

    return (
        <main className="relative min-h-dvh overflow-x-clip bg-[#020817] text-white">

            <Background />

            <PublicHeader />


            <div
                role="status"
                aria-live="polite"
                aria-busy="true"
                className="relative z-10 mx-auto max-w-7xl px-5 py-20 text-center md:px-8"
            >

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-sky-400">

                    <Package
                        size={23}
                    />

                </div>


                <p className="mt-5 text-sm font-medium text-slate-400">
                    {message}
                </p>

            </div>

        </main>
    )
}


function ErrorMessage({
                          onRetry,
                      }: {
    onRetry: () => void
}) {

    return (
        <main className="relative min-h-dvh overflow-x-clip bg-[#020817] text-white">

            <Background />

            <PublicHeader />


            <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 text-center md:px-8">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-900/50 bg-red-950/20 text-red-400">

                    <Package
                        size={23}
                    />

                </div>


                <h1 className="mt-5 text-2xl font-bold">
                    Unable to load product
                </h1>


                <p className="mt-2 text-sm text-slate-500">
                    ShelfRadar could not retrieve this product right now.
                </p>


                <div className="mt-5 flex flex-wrap justify-center gap-3">

                    <button
                        type="button"
                        onClick={
                            onRetry
                        }
                        className="inline-flex min-h-10 items-center justify-center rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                    >
                        Try again
                    </button>


                    <Link
                        to="/search"
                        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                    >

                        <ArrowLeft
                            size={14}
                        />

                        Return to search

                    </Link>

                </div>

            </div>

        </main>
    )
}


function NotFoundMessage({
                             message,
                         }: {
    message: string
}) {

    return (
        <main className="relative min-h-dvh overflow-x-clip bg-[#020817] text-white">

            <Background />

            <PublicHeader />


            <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 text-center md:px-8">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-500">

                    <Package
                        size={23}
                    />

                </div>


                <h1 className="mt-5 text-2xl font-bold">
                    {message}
                </h1>


                <p className="mt-2 text-sm text-slate-500">
                    The requested product could not be loaded.
                </p>


                <Link
                    to="/search"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >

                    <ArrowLeft
                        size={14}
                    />

                    Return to search

                </Link>

            </div>

        </main>
    )
}

function parsePositiveId(
    value: string | undefined,
): number | null {

    if (
        !value
    ) {
        return null
    }


    const parsed =
        Number(
            value,
        )


    if (
        !Number.isInteger(
            parsed,
        ) ||
        parsed <=
        0
    ) {
        return null
    }

    return parsed
}