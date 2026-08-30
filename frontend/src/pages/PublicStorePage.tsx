import {
    useQuery,
} from '@tanstack/react-query'

import {
    ArrowLeft,
    Clock3,
    MapPin,
    Package,
    Phone,
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


export default function PublicStorePage() {

    const {
        storeId,
    } = useParams()


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
                parsedStoreId !== null,
        })


    if (
        parsedStoreId === null
    ) {

        return (
            <NotFoundMessage />
        )
    }


    if (storeQuery.isLoading) {

        return (
            <PageMessage
                message="Loading store..."
            />
        )
    }


    if (
        storeQuery.isError ||
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
        <main className="min-h-screen bg-slate-50 text-slate-950">

            <PublicHeader />


            <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">

                <Link
                    to="/search"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-950"
                >
                    <ArrowLeft
                        size={17}
                    />

                    Back to search
                </Link>


                <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

                    <div className="flex flex-col justify-between gap-8 lg:flex-row">

                        <div>

                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">
                                Store
                            </p>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                                {
                                    store.name
                                }
                            </h1>


                            <div className="mt-6 space-y-3 text-sm text-slate-600">

                                <div className="flex items-start gap-3">

                                    <MapPin
                                        size={18}
                                        className="mt-0.5 shrink-0 text-slate-400"
                                    />

                                    <span>
                                        {
                                            store.address
                                        }
                                        ,{' '}
                                        {
                                            store.city
                                        }
                                    </span>

                                </div>


                                {
                                    store.phone && (

                                        <div className="flex items-center gap-3">

                                            <Phone
                                                size={18}
                                                className="shrink-0 text-slate-400"
                                            />

                                            <a
                                                href={
                                                    `tel:${store.phone}`
                                                }
                                                className="hover:text-sky-600"
                                            >
                                                {
                                                    store.phone
                                                }
                                            </a>

                                        </div>
                                    )
                                }


                                {
                                    store.workingHours && (

                                        <div className="flex items-center gap-3">

                                            <Clock3
                                                size={18}
                                                className="shrink-0 text-slate-400"
                                            />

                                            <span>
                                                {
                                                    store.workingHours
                                                }
                                            </span>

                                        </div>
                                    )
                                }

                            </div>

                        </div>


                        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">

                            <SummaryCard
                                label="Products listed"
                                value={
                                    String(
                                        detail.totalProducts,
                                    )
                                }
                            />

                            <SummaryCard
                                label="Available now"
                                value={
                                    String(
                                        detail.availableProducts,
                                    )
                                }
                            />

                        </div>

                    </div>

                </section>


                <section className="mt-8">

                    <h2 className="text-2xl font-bold">
                        Location
                    </h2>

                    <div className="mt-4">

                        <StoreLocationMap
                            store={
                                store
                            }
                        />

                    </div>

                </section>


                <section className="mt-8 pb-12">

                    <h2 className="text-2xl font-bold">
                        Products
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Current inventory information reported by this store.
                    </p>


                    {
                        detail.inventory.length ===
                        0 ? (

                            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
                                No products are currently listed.
                            </div>

                        ) : (

                            <div className="mt-6 grid gap-4">

                                {
                                    detail.inventory.map(
                                        item => (

                                            <article
                                                key={
                                                    item.inventoryId
                                                }
                                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                            >

                                                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                                                    <div className="flex min-w-0 gap-4">

                                                        <ProductThumbnail
                                                            name={
                                                                item.product.name
                                                            }
                                                            imageUrl={
                                                                item.product.imageUrl
                                                            }
                                                        />


                                                        <div className="min-w-0">

                                                            <p className="text-xs font-medium text-slate-400">
                                                                {
                                                                    item.product.brand.name
                                                                }
                                                                {' · '}
                                                                {
                                                                    item.product.category.name
                                                                }
                                                            </p>

                                                            <Link
                                                                to={
                                                                    `/products/${item.product.id}`
                                                                }
                                                                className="mt-1 block font-semibold text-slate-950 hover:text-sky-600"
                                                            >
                                                                {
                                                                    item.product.name
                                                                }
                                                            </Link>

                                                            <div className="mt-3">

                                                                <StockBadge
                                                                    status={
                                                                        item.status
                                                                    }
                                                                />

                                                            </div>

                                                        </div>

                                                    </div>


                                                    <div className="sm:text-right">

                                                        <p className="text-2xl font-bold">
                                                            {
                                                                formatPrice(
                                                                    item.price,
                                                                )
                                                            }
                                                        </p>

                                                        <p className="text-xs font-medium text-slate-400">
                                                            MKD
                                                        </p>

                                                        <p className="mt-2 text-xs text-slate-500">
                                                            Quantity:{' '}
                                                            {
                                                                item.quantity
                                                            }
                                                        </p>

                                                    </div>

                                                </div>

                                            </article>
                                        ),
                                    )
                                }

                            </div>
                        )
                    }

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

    if (imageUrl) {

        return (
            <img
                src={imageUrl}
                alt={name}
                className="h-20 w-20 shrink-0 rounded-xl border border-slate-100 object-cover"
            />
        )
    }


    return (
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">

            <Package
                size={28}
            />

        </div>
    )
}


function SummaryCard({
                         label,
                         value,
                     }: {
    label: string
    value: string
}) {

    return (
        <div className="rounded-xl bg-slate-50 p-4">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-2 text-xl font-bold">
                {value}
            </p>

        </div>
    )
}


function PublicHeader() {

    return (
        <header className="border-b border-slate-200 bg-white">

            <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">

                <Link
                    to="/"
                    className="text-xl font-bold tracking-tight"
                >
                    ShelfRadar
                </Link>

                <Link
                    to="/login"
                    className="text-sm font-medium text-slate-600 hover:text-slate-950"
                >
                    Staff Login
                </Link>

            </div>

        </header>
    )
}


function PageMessage({
                         message,
                     }: {
    message: string
}) {

    return (
        <main className="min-h-screen bg-slate-50">

            <PublicHeader />

            <div className="mx-auto max-w-7xl px-5 py-16 text-center text-slate-500">
                {message}
            </div>

        </main>
    )
}


function NotFoundMessage() {

    return (
        <main className="min-h-screen bg-slate-50">

            <PublicHeader />

            <div className="mx-auto max-w-7xl px-5 py-16 text-center">

                <h1 className="text-2xl font-bold">
                    Store not found.
                </h1>

                <Link
                    to="/search"
                    className="mt-4 inline-block text-sm font-medium text-sky-600 hover:text-sky-700"
                >
                    Return to search
                </Link>

            </div>

        </main>
    )
}


function parsePositiveId(
    value: string | undefined,
): number | null {

    if (!value) {
        return null
    }

    const parsed =
        Number(value)

    if (
        !Number.isInteger(parsed) ||
        parsed <= 0
    ) {
        return null
    }

    return parsed
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