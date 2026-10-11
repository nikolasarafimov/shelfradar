import type {
    ReactNode,
} from 'react'

import {
    useQuery,
} from '@tanstack/react-query'

import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    BadgeCheck,
    Boxes,
    LoaderCircle,
    MapPin,
    Package,
    ShoppingBag,
    Store,
    Tag,
} from 'lucide-react'

import {
    motion,
} from 'motion/react'

import {
    Link,
    useParams,
} from 'react-router-dom'

import {
    getPublicProduct,
} from '../api/publicApi'

import SearchResultsMap from '../components/public/SearchResultsMap'
import StatusBadge from '../components/ui/StatusBadge'

import {
    formatMkd,
    formatNumber,
} from '../lib/format'

export default function PublicProductPage() {
    const {
        productId,
    } = useParams()

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

    if (parsedProductId === null) {
        return (
            <PublicPageState
                type="not-found"
                title="Product not found"
                message="The requested product does not exist or the address is invalid."
            />
        )
    }

    if (productQuery.isLoading) {
        return (
            <PublicPageState
                type="loading"
                title="Loading product"
                message="Retrieving the latest ShelfRadar offers..."
            />
        )
    }

    if (productQuery.isError) {
        return (
            <PublicPageState
                type="error"
                title="Unable to load product"
                message="ShelfRadar could not retrieve this product right now."
                onRetry={
                    () => {
                        void productQuery.refetch()
                    }
                }
            />
        )
    }

    if (!productQuery.data) {
        return (
            <PublicPageState
                type="not-found"
                title="Product not found"
                message="The requested product could not be loaded."
            />
        )
    }

    const detail =
        productQuery.data

    const product =
        detail.product

    const bestOffer =
        detail.offers.reduce<
            (typeof detail.offers)[number] | null
        >(
            (
                currentBest,
                offer,
            ) => {
                if (
                    offer.status ===
                    'OUT_OF_STOCK'
                ) {
                    return currentBest
                }

                if (
                    !currentBest ||
                    offer.price <
                    currentBest.price
                ) {
                    return offer
                }

                return currentBest
            },
            null,
        )

    return (
        <PublicShell>
            <div className="relative z-10 mx-auto max-w-7xl px-5 pb-14 pt-6 md:px-8">
                <motion.div
                    initial={{
                        opacity: 0,
                        x: -8,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                    }}
                    transition={{
                        duration: 0.3,
                    }}
                >
                    <Link
                        to="/search"
                        className="group inline-flex items-center gap-2 rounded-xl py-2 text-sm font-medium text-slate-500 transition duration-200 hover:text-sky-300"
                    >
                        <ArrowLeft
                            className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                            aria-hidden="true"
                        />

                        Back to search
                    </Link>
                </motion.div>

                <motion.section
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
                        delay: 0.05,
                        ease: [
                            0.16,
                            1,
                            0.3,
                            1,
                        ],
                    }}
                    className="premium-card relative mt-3 overflow-hidden rounded-[1.8rem]"
                >
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-32 -top-36 size-72 rounded-full bg-sky-400/[0.045] blur-3xl"
                    />

                    <div className="relative grid gap-6 p-5 md:p-6 lg:grid-cols-[150px_minmax(0,1fr)_260px] lg:items-center lg:gap-7">
                        <ProductImage
                            name={product.name}
                            imageUrl={
                                product.imageUrl
                            }
                        />

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-300/[0.07] px-2.5 py-1 text-[10px] font-bold text-sky-300 ring-1 ring-inset ring-sky-300/15">
                                    <Tag
                                        className="size-3"
                                        aria-hidden="true"
                                    />

                                    {
                                        product.brand.name
                                    }
                                </span>

                                <span className="rounded-full bg-slate-400/[0.05] px-2.5 py-1 text-[10px] font-semibold text-slate-400 ring-1 ring-inset ring-slate-300/10">
                                    {
                                        product.category.name
                                    }
                                </span>
                            </div>

                            <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.045em] text-slate-50 sm:text-4xl lg:text-[2.7rem]">
                                {product.name}
                            </h1>

                            {product.description && (
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                                    {
                                        product.description
                                    }
                                </p>
                            )}

                            <div className="mt-5 flex flex-wrap gap-x-7 gap-y-4">
                                <CompactStat
                                    icon={
                                        <Store
                                            className="size-3.5"
                                            aria-hidden="true"
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
                                            className="size-3.5"
                                            aria-hidden="true"
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

                        <div className="relative overflow-hidden rounded-2xl border border-sky-300/15 bg-sky-300/[0.055] p-5">
                            <div
                                aria-hidden="true"
                                className="absolute -right-10 -top-10 size-28 rounded-full bg-sky-300/[0.09] blur-3xl"
                            />

                            <div className="relative">
                                <p className="eyebrow">
                                    Lowest available
                                </p>

                                {detail.lowestPrice !==
                                null ? (
                                    <>
                                        <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-50">
                                            {
                                                formatMkd(
                                                    detail.lowestPrice,
                                                )
                                            }
                                        </p>

                                        <p className="mt-2 text-xs leading-5 text-slate-500">
                                            Best current ShelfRadar offer
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="mt-2 text-xl font-semibold text-slate-300">
                                            Unavailable
                                        </p>

                                        <p className="mt-2 text-xs leading-5 text-slate-500">
                                            No currently available stock
                                        </p>
                                    </>
                                )}

                                {bestOffer && (
                                    <Link
                                        to={
                                            `/stores/${bestOffer.store.id}`
                                        }
                                        className="group mt-5 inline-flex items-center gap-2 text-xs font-semibold text-sky-300 transition duration-200 hover:text-sky-200"
                                    >
                                        View best offer

                                        <ArrowRight
                                            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                                            aria-hidden="true"
                                        />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.section>

                {detail.offers.length > 0 ? (
                    <motion.section
                        initial={{
                            opacity: 0,
                            y: 14,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.45,
                            delay: 0.14,
                        }}
                        className="mt-8"
                    >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="eyebrow">
                                    Store availability
                                </p>

                                <h2 className="mt-1.5 text-2xl font-semibold tracking-[-0.03em] text-slate-50">
                                    Where to buy
                                </h2>

                                <p className="mt-1.5 text-sm text-slate-500">
                                    Compare current offers from participating stores.
                                </p>
                            </div>

                            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-900/50 px-3 py-2 text-xs font-medium text-slate-400">
                                <ShoppingBag
                                    className="size-3.5 text-sky-300"
                                    aria-hidden="true"
                                />

                                {
                                    formatNumber(
                                        detail.offers.length,
                                    )
                                }{' '}
                                {
                                    detail.offers.length === 1
                                        ? 'offer'
                                        : 'offers'
                                }
                            </div>
                        </div>

                        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
                            <div className="space-y-3">
                                {detail.offers.map(
                                    (
                                        offer,
                                        index,
                                    ) => (
                                        <motion.article
                                            key={
                                                offer.inventoryId
                                            }
                                            initial={{
                                                opacity: 0,
                                                y: 8,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            transition={{
                                                duration: 0.3,
                                                delay:
                                                    Math.min(
                                                        index,
                                                        7,
                                                    ) * 0.035,
                                            }}
                                            className="premium-card group overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-0.5 hover:border-sky-300/15 motion-reduce:transform-none"
                                        >
                                            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/10 bg-sky-300/[0.06] text-sky-300">
                                                            <Store
                                                                className="size-4"
                                                                aria-hidden="true"
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
                                                                className="mt-0.5 block truncate text-base font-semibold text-slate-100 transition duration-200 hover:text-sky-300"
                                                            >
                                                                {
                                                                    offer.store.name
                                                                }
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 flex min-w-0 items-start gap-2 pl-1 text-xs leading-5 text-slate-500">
                                                        <MapPin
                                                            className="mt-0.5 size-3.5 shrink-0 text-slate-600"
                                                            aria-hidden="true"
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

                                                <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-5 border-t border-slate-800/80 pt-4 sm:min-w-[330px] sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                                                    <OfferMetric
                                                        label="Price"
                                                    >
                                                        <span className="whitespace-nowrap text-lg font-semibold text-slate-50">
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
                                                                className="size-3.5 text-slate-600"
                                                                aria-hidden="true"
                                                            />

                                                            {
                                                                formatNumber(
                                                                    offer.quantity,
                                                                )
                                                            }
                                                        </span>
                                                    </OfferMetric>

                                                    <StatusBadge
                                                        status={
                                                            offer.status
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between border-t border-slate-800/70 bg-slate-950/25 px-5 py-2.5">
                                                <span className="text-[10px] text-slate-600">
                                                    Current ShelfRadar offer
                                                </span>

                                                <Link
                                                    to={
                                                        `/stores/${offer.store.id}`
                                                    }
                                                    className="group/link inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-sky-300 transition duration-200 hover:bg-sky-300/[0.06]"
                                                >
                                                    View store

                                                    <ArrowUpRight
                                                        className="size-3 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                                                        aria-hidden="true"
                                                    />
                                                </Link>
                                            </div>
                                        </motion.article>
                                    ),
                                )}
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
                    </motion.section>
                ) : (
                    <motion.section
                        initial={{
                            opacity: 0,
                            y: 12,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.4,
                            delay: 0.14,
                        }}
                        className="mt-8"
                    >
                        <div className="premium-card flex min-h-[280px] items-center justify-center rounded-[1.8rem] border-dashed p-8 text-center">
                            <div className="max-w-sm">
                                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-950/40 text-slate-600">
                                    <Package
                                        className="size-6"
                                        strokeWidth={1.5}
                                        aria-hidden="true"
                                    />
                                </div>

                                <h2 className="mt-5 text-xl font-semibold text-slate-100">
                                    No active offers
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    This product is not currently listed by an active ShelfRadar store.
                                </p>

                                <Link
                                    to="/search?browse=all"
                                    className="group mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/40 px-4 text-sm font-medium text-slate-300 transition duration-200 hover:border-sky-300/15 hover:bg-sky-300/[0.05] hover:text-sky-300"
                                >
                                    Browse products

                                    <ArrowRight
                                        className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                                        aria-hidden="true"
                                    />
                                </Link>
                            </div>
                        </div>
                    </motion.section>
                )}
            </div>
        </PublicShell>
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
                decoding="async"
                className="aspect-square w-full max-w-[150px] shrink-0 rounded-2xl border border-slate-700/60 bg-slate-950 object-cover shadow-xl shadow-black/20"
            />
        )
    }

    return (
        <div className="flex aspect-square w-full max-w-[150px] shrink-0 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-950/70 text-slate-600">
            <Package
                className="size-10"
                strokeWidth={1.4}
                aria-hidden="true"
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
            <span className="flex size-8 items-center justify-center rounded-lg border border-slate-800/80 bg-slate-950/50 text-sky-300">
                {icon}
            </span>

            <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-slate-600">
                    {label}
                </p>

                <p className="mt-0.5 text-sm font-semibold text-slate-200">
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

function PublicShell({
                         children,
                     }: {
    children: ReactNode
}) {
    return (
        <main className="relative min-h-dvh overflow-x-clip bg-slate-950 text-white">
            <Background />

            <PublicHeader />

            {children}
        </main>
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

function Background() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 overflow-hidden"
        >
            <div className="animate-glow-drift absolute left-1/2 top-[-270px] h-[580px] w-[880px] -translate-x-1/2 rounded-full bg-sky-400/[0.065] blur-[150px] motion-reduce:animate-none" />

            <div className="animate-glow-drift absolute -left-56 top-[400px] size-[420px] rounded-full bg-cyan-400/[0.025] blur-[130px] [animation-delay:900ms] motion-reduce:animate-none" />

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

function PublicPageState({
                             type,
                             title,
                             message,
                             onRetry,
                         }: {
    type:
        | 'loading'
        | 'error'
        | 'not-found'
    title: string
    message: string
    onRetry?: () => void
}) {
    const loading =
        type ===
        'loading'

    const error =
        type ===
        'error'

    return (
        <PublicShell>
            <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-80px)] max-w-7xl items-center justify-center px-5 py-16 text-center md:px-8">
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
                        duration: 0.35,
                    }}
                    className="max-w-md"
                    role={
                        loading
                            ? 'status'
                            : undefined
                    }
                    aria-live={
                        loading
                            ? 'polite'
                            : undefined
                    }
                    aria-busy={
                        loading
                            ? true
                            : undefined
                    }
                >
                    <div
                        className={
                            error
                                ? 'mx-auto flex size-14 items-center justify-center rounded-2xl border border-rose-300/15 bg-rose-300/[0.06] text-rose-300'
                                : 'mx-auto flex size-14 items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-900/60 text-sky-300'
                        }
                    >
                        {loading ? (
                            <LoaderCircle
                                className="size-6 animate-spin"
                                aria-hidden="true"
                            />
                        ) : error ? (
                            <AlertCircle
                                className="size-6"
                                aria-hidden="true"
                            />
                        ) : (
                            <Package
                                className="size-6"
                                aria-hidden="true"
                            />
                        )}
                    </div>

                    <h1 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-slate-50">
                        {title}
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        {message}
                    </p>

                    {!loading && (
                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                            {error &&
                                onRetry && (
                                    <button
                                        type="button"
                                        onClick={onRetry}
                                        className="shine-button inline-flex min-h-10 items-center justify-center rounded-xl bg-gradient-to-r from-sky-400 to-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:brightness-110"
                                    >
                                        Try again
                                    </button>
                                )}

                            <Link
                                to="/search"
                                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/40 px-4 text-sm font-medium text-slate-300 transition duration-200 hover:border-slate-600 hover:bg-slate-800/70 hover:text-slate-100"
                            >
                                <ArrowLeft
                                    className="size-3.5"
                                    aria-hidden="true"
                                />

                                Return to search
                            </Link>
                        </div>
                    )}
                </motion.div>
            </div>
        </PublicShell>
    )
}

function parsePositiveId(
    value: string | undefined,
): number | null {
    if (!value) {
        return null
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
        : null
}