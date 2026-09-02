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
    Clock3,
    MapPin,
    Package,
    Phone,
    ShoppingBag,
    Store,
} from 'lucide-react'

import {
    Link,
    useParams,
} from 'react-router-dom'

import {
    getPublicStore,
} from '../api/publicBrowseApi'

import StockBadge
    from '../components/public/StockBadge'

import StoreLocationMap
    from '../components/public/StoreLocationMap'

import {
    formatMkd,
    formatNumber,
} from '../lib/format'


export default function PublicStorePage() {

    const {
        storeId,
    } =
        useParams()


    const parsedStoreId =
        parsePositiveId(
            storeId,
        )


    const storeQuery =
        useQuery({
            queryKey: [
                'public-store',
                parsedStoreId,
            ],

            queryFn:
                () =>
                    getPublicStore(
                        parsedStoreId!,
                    ),

            enabled:
                parsedStoreId !==
                null,
        })


    if (
        parsedStoreId ===
        null
    ) {

        return (
            <NotFoundMessage />
        )
    }


    if (
        storeQuery.isLoading
    ) {

        return (
            <PageMessage
                message="Loading store..."
            />
        )
    }


    if (
        storeQuery.isError
    ) {

        return (
            <ErrorMessage
                onRetry={
                    () => {
                        void storeQuery.refetch()
                    }
                }
            />
        )
    }


    if (
        !storeQuery.data
    ) {

        return (
            <NotFoundMessage />
        )
    }


    const detail =
        storeQuery.data


    const store =
        detail.store


    return (
        <main className="relative min-h-dvh overflow-x-clip bg-[#020817] text-white">

            <Background />

            <PublicHeader />


            <div className="relative z-10 mx-auto max-w-7xl px-5 pb-14 pt-6 md:px-8">

                <div className="animate-fade-up">

                    <Link
                        to="/search"
                        className="group inline-flex items-center gap-2 py-2 text-sm font-semibold text-slate-500 transition hover:text-sky-300"
                    >

                        <ArrowLeft
                            size={15}
                            className="transition-transform duration-200 group-hover:-translate-x-1"
                        />

                        Back to search

                    </Link>

                </div>


                <section className="premium-card animate-fade-up animation-delay-100 mt-3 overflow-hidden rounded-[1.8rem] border border-slate-800/90 bg-slate-900/55 shadow-[0_30px_90px_-50px_rgba(14,165,233,0.28)] backdrop-blur-xl">

                    <div className="grid gap-7 p-6 md:p-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">

                        <div className="min-w-0">

                            <div className="inline-flex items-center gap-2 rounded-full border border-sky-900/60 bg-sky-950/35 px-3 py-1.5">

                                <Store
                                    size={12}
                                    className="text-sky-400"
                                />

                                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-300">
                                    ShelfRadar Store
                                </span>

                            </div>


                            <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-[2.7rem]">
                                {store.name}
                            </h1>


                            <div className="mt-6 flex flex-wrap gap-3">

                                <InfoChip
                                    icon={
                                        <MapPin
                                            size={15}
                                        />
                                    }
                                >
                                    {store.address}, {store.city}
                                </InfoChip>


                                {
                                    store.phone && (

                                        <a
                                            href={
                                                `tel:${store.phone}`
                                            }
                                            className="group inline-flex min-h-10 items-center gap-2.5 rounded-xl border border-slate-800 bg-[#020817]/55 px-3.5 text-sm text-slate-400 transition hover:border-sky-900 hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                                        >

                                            <Phone
                                                size={15}
                                                className="text-sky-400"
                                            />

                                            {store.phone}

                                        </a>
                                    )
                                }


                                {
                                    store.workingHours && (

                                        <InfoChip
                                            icon={
                                                <Clock3
                                                    size={15}
                                                />
                                            }
                                        >
                                            {store.workingHours}
                                        </InfoChip>
                                    )
                                }

                            </div>

                        </div>


                        <div className="grid grid-cols-2 gap-3">

                            <StoreMetric
                                icon={
                                    <ShoppingBag
                                        size={17}
                                    />
                                }
                                label="Products listed"
                                value={
                                    formatNumber(
                                        detail.totalProducts,
                                    )
                                }
                            />


                            <StoreMetric
                                icon={
                                    <BadgeCheck
                                        size={17}
                                    />
                                }
                                label="Available now"
                                value={
                                    formatNumber(
                                        detail.availableProducts,
                                    )
                                }
                                highlighted
                            />

                        </div>

                    </div>

                </section>


                <section className="animate-fade-up animation-delay-200 mt-8">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                        <div>

                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky-400">
                                Store inventory
                            </p>


                            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
                                Available products
                            </h2>


                            <p className="mt-1 text-sm text-slate-500">
                                Current price and availability reported by this store.
                            </p>

                        </div>


                        {
                            detail.inventory.length >
                            0 && (

                                <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/55 px-3 py-2 text-xs font-semibold text-slate-400">

                                    <Boxes
                                        size={13}
                                        className="text-sky-400"
                                    />

                                    {
                                        formatNumber(
                                            detail.inventory.length,
                                        )
                                    }{' '}

                                    {
                                        detail.inventory.length ===
                                        1
                                            ? 'product'
                                            : 'products'
                                    }

                                </div>
                            )
                        }

                    </div>


                    <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">

                        {
                            detail.inventory.length ===
                            0 ? (

                                <EmptyInventory />

                            ) : (

                                <div className="grid gap-4 sm:grid-cols-2">

                                    {
                                        detail.inventory.map(
                                            (
                                                item,
                                                index,
                                            ) => (

                                                <article
                                                    key={
                                                        item.inventoryId
                                                    }
                                                    className="premium-card animate-fade-up group flex min-h-[205px] flex-col rounded-3xl border border-slate-800/90 bg-slate-900/55 p-5 shadow-[0_22px_60px_-38px_rgba(0,0,0,0.9)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-sky-900/80 hover:bg-slate-900/80 hover:shadow-[0_28px_70px_-38px_rgba(14,165,233,0.22)] motion-reduce:transform-none"
                                                    style={{
                                                        animationDelay:
                                                            `${Math.min(
                                                                index,
                                                                7,
                                                            ) * 70 + 220}ms`,
                                                    }}
                                                >

                                                    <div className="flex min-w-0 items-start gap-4">

                                                        <ProductThumbnail
                                                            name={
                                                                item.product.name
                                                            }
                                                            imageUrl={
                                                                item.product.imageUrl
                                                            }
                                                        />


                                                        <div className="min-w-0 flex-1">

                                                            <p className="truncate text-[10px] font-bold uppercase tracking-[0.1em] text-sky-400">

                                                                {
                                                                    item.product.brand.name
                                                                }

                                                                <span className="mx-1.5 text-slate-700">
                                                                    ·
                                                                </span>

                                                                {
                                                                    item.product.category.name
                                                                }

                                                            </p>


                                                            <Link
                                                                to={
                                                                    `/products/${item.product.id}`
                                                                }
                                                                className="mt-1.5 block line-clamp-2 text-base font-bold leading-5 text-white transition hover:text-sky-300"
                                                            >
                                                                {
                                                                    item.product.name
                                                                }
                                                            </Link>


                                                            <div className="mt-4">

                                                                <StockBadge
                                                                    status={
                                                                        item.status
                                                                    }
                                                                />

                                                            </div>

                                                        </div>

                                                    </div>


                                                    <div className="my-4 border-t border-slate-800/80" />


                                                    <div className="mt-auto flex items-end justify-between gap-4">

                                                        <div>

                                                            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-600">
                                                                Current price
                                                            </p>


                                                            <p className="mt-1 whitespace-nowrap text-xl font-bold tracking-tight text-white">
                                                                {
                                                                    formatMkd(
                                                                        item.price,
                                                                    )
                                                                }
                                                            </p>

                                                        </div>


                                                        <div className="text-right">

                                                            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-600">
                                                                Quantity
                                                            </p>


                                                            <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-300">

                                                                <Boxes
                                                                    size={13}
                                                                    className="text-slate-600"
                                                                />

                                                                {
                                                                    formatNumber(
                                                                        item.quantity,
                                                                    )
                                                                }

                                                            </p>

                                                        </div>

                                                    </div>


                                                    <Link
                                                        to={
                                                            `/products/${item.product.id}`
                                                        }
                                                        className="group/link mt-4 inline-flex min-h-9 items-center justify-between rounded-xl border border-slate-800 bg-[#020817]/45 px-3 text-xs font-bold text-slate-400 transition hover:border-sky-900 hover:bg-sky-500/[0.06] hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                                                    >

                                                        View product

                                                        <ArrowUpRight
                                                            size={13}
                                                            className="transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                                                        />

                                                    </Link>

                                                </article>
                                            ),
                                        )
                                    }

                                </div>
                            )
                        }


                        <aside className="lg:sticky lg:top-28">

                            <div className="mb-3 flex items-center justify-between">

                                <div>

                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-400">
                                        Location
                                    </p>

                                    <h3 className="mt-1 text-lg font-bold text-white">
                                        Find this store
                                    </h3>

                                </div>


                                <MapPin
                                    size={18}
                                    className="text-sky-400"
                                />

                            </div>


                            <StoreLocationMap
                                store={
                                    store
                                }
                            />


                            <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">

                                <div className="flex items-start gap-3">

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">

                                        <MapPin
                                            size={15}
                                        />

                                    </div>


                                    <div className="min-w-0">

                                        <p className="text-sm font-semibold text-slate-200">
                                            {store.name}
                                        </p>


                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            {store.address}, {store.city}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </aside>

                    </div>

                </section>

            </div>

        </main>
    )
}


function ProductThumbnail({
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
                className="h-16 w-16 shrink-0 rounded-2xl border border-slate-800 bg-[#020817] object-cover shadow-lg shadow-black/20"
            />
        )
    }


    return (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-800 bg-[#020817] text-slate-600">

            <Package
                size={24}
                strokeWidth={1.5}
            />

        </div>
    )
}


function InfoChip({
                      icon,
                      children,
                  }: {
    icon: ReactNode
    children: ReactNode
}) {

    return (
        <div className="inline-flex min-h-10 items-center gap-2.5 rounded-xl border border-slate-800 bg-[#020817]/55 px-3.5 text-sm text-slate-400">

            <span className="text-sky-400">
                {icon}
            </span>

            <span>
                {children}
            </span>

        </div>
    )
}


function StoreMetric({
                         icon,
                         label,
                         value,
                         highlighted = false,
                     }: {
    icon: ReactNode
    label: string
    value: string
    highlighted?: boolean
}) {

    return (
        <div
            className={
                highlighted
                    ? 'relative overflow-hidden rounded-2xl border border-sky-900/60 bg-sky-950/25 p-4'
                    : 'relative overflow-hidden rounded-2xl border border-slate-800 bg-[#020817]/45 p-4'
            }
        >

            {
                highlighted && (

                    <div
                        aria-hidden="true"
                        className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-sky-500/10 blur-2xl"
                    />
                )
            }


            <div className="relative">

                <div
                    className={
                        highlighted
                            ? 'flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400'
                            : 'flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-slate-500'
                    }
                >
                    {icon}
                </div>


                <p className="mt-4 text-2xl font-bold tracking-tight text-white">
                    {value}
                </p>


                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    {label}
                </p>

            </div>

        </div>
    )
}


function EmptyInventory() {

    return (
        <div className="premium-card flex min-h-[330px] items-center justify-center rounded-[1.8rem] border border-dashed border-slate-800 bg-slate-900/25 p-8 text-center">

            <div className="max-w-sm">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-500">

                    <Package
                        size={23}
                    />

                </div>


                <h3 className="mt-5 text-xl font-bold text-white">
                    No products listed
                </h3>


                <p className="mt-2 text-sm leading-6 text-slate-500">
                    This store currently has no public inventory offers.
                </p>


                <Link
                    to="/search?browse=all"
                    className="group mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-sky-800 hover:bg-slate-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >

                    Browse other products

                    <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                    />

                </Link>

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
                        className="h-14 w-auto object-contain drop-shadow-[0_0_18px_rgba(56,189,248,0.10)] transition duration-300 group-hover:scale-[1.025]"
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

            <div className="animate-glow-drift absolute left-1/2 top-[-270px] h-[580px] w-[880px] -translate-x-1/2 rounded-full bg-sky-500/[0.07] blur-[150px]" />

            <div className="animate-glow-drift absolute -left-56 top-[420px] h-[440px] w-[440px] rounded-full bg-cyan-500/[0.025] blur-[135px] [animation-delay:900ms]" />

            <div className="animate-glow-drift absolute -right-56 top-[300px] h-[460px] w-[460px] rounded-full bg-blue-500/[0.025] blur-[140px] [animation-delay:1500ms]" />


            <div
                className="absolute inset-0 opacity-[0.024]"
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

                    <Store
                        size={22}
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

                    <Store
                        size={22}
                    />

                </div>


                <h1 className="mt-5 text-2xl font-bold">
                    Unable to load store
                </h1>


                <p className="mt-2 text-sm text-slate-500">
                    ShelfRadar could not retrieve this store right now.
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


function NotFoundMessage() {

    return (
        <main className="relative min-h-dvh overflow-x-clip bg-[#020817] text-white">

            <Background />

            <PublicHeader />


            <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 text-center md:px-8">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-500">

                    <Store
                        size={22}
                    />

                </div>


                <h1 className="mt-5 text-2xl font-bold">
                    Store not found.
                </h1>


                <p className="mt-2 text-sm text-slate-500">
                    The requested store is unavailable or no longer public.
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