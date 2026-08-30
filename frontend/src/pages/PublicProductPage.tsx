import {
    useQuery,
} from '@tanstack/react-query'

import {
    ArrowLeft,
    MapPin,
    Package,
    Store,
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
                parsedProductId !== null,
        })


    if (
        parsedProductId === null
    ) {

        return (
            <NotFoundMessage
                message="Product not found."
            />
        )
    }


    if (productQuery.isLoading) {

        return (
            <PageMessage
                message="Loading product..."
            />
        )
    }


    if (
        productQuery.isError ||
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

                    <div className="flex flex-col gap-7 md:flex-row">

                        <ProductImage
                            name={
                                product.name
                            }
                            imageUrl={
                                product.imageUrl
                            }
                        />


                        <div className="min-w-0 flex-1">

                            <p className="text-sm font-semibold text-sky-600">
                                {
                                    product.brand.name
                                }
                                {' · '}
                                {
                                    product.category.name
                                }
                            </p>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                                {
                                    product.name
                                }
                            </h1>


                            {
                                product.description && (

                                    <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                                        {
                                            product.description
                                        }
                                    </p>
                                )
                            }


                            <div className="mt-7 grid gap-3 sm:grid-cols-3">

                                <SummaryCard
                                    label="Store offers"
                                    value={
                                        String(
                                            detail.totalStores,
                                        )
                                    }
                                />

                                <SummaryCard
                                    label="Available now"
                                    value={
                                        String(
                                            detail.availableStores,
                                        )
                                    }
                                />

                                <SummaryCard
                                    label="Lowest available"
                                    value={
                                        detail.lowestPrice !== null
                                            ? `${formatPrice(detail.lowestPrice)} MKD`
                                            : 'Unavailable'
                                    }
                                />

                            </div>

                        </div>

                    </div>

                </section>


                {
                    detail.offers.length > 0 && (

                        <section className="mt-8">

                            <div>

                                <h2 className="text-2xl font-bold">
                                    Where to buy
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Compare current ShelfRadar store offers.
                                </p>

                            </div>


                            <SearchResultsMap
                                results={
                                    detail.offers
                                }
                                userLocation={
                                    null
                                }
                            />


                            <div className="mt-6 grid gap-4">

                                {
                                    detail.offers.map(
                                        offer => (

                                            <article
                                                key={
                                                    offer.inventoryId
                                                }
                                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                            >

                                                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                                                    <div>

                                                        <div className="flex items-center gap-2">

                                                            <Store
                                                                size={18}
                                                                className="text-slate-400"
                                                            />

                                                            <Link
                                                                to={
                                                                    `/stores/${offer.store.id}`
                                                                }
                                                                className="font-semibold text-slate-950 hover:text-sky-600"
                                                            >
                                                                {
                                                                    offer.store.name
                                                                }
                                                            </Link>

                                                        </div>


                                                        <div className="mt-2 flex items-start gap-2 text-sm text-slate-500">

                                                            <MapPin
                                                                size={16}
                                                                className="mt-0.5 shrink-0"
                                                            />

                                                            <span>
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


                                                    <div className="flex items-center gap-5 sm:text-right">

                                                        <StockBadge
                                                            status={
                                                                offer.status
                                                            }
                                                        />


                                                        <div>

                                                            <p className="text-2xl font-bold">
                                                                {
                                                                    formatPrice(
                                                                        offer.price,
                                                                    )
                                                                }
                                                            </p>

                                                            <p className="text-xs font-medium text-slate-400">
                                                                MKD
                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>

                                            </article>
                                        ),
                                    )
                                }

                            </div>

                        </section>
                    )
                }


                {
                    detail.offers.length === 0 && (

                        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center">

                            <h2 className="font-semibold">
                                No active store offers
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                This product is currently not listed by an active ShelfRadar store.
                            </p>

                        </div>
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

    if (imageUrl) {

        return (
            <img
                src={imageUrl}
                alt={name}
                className="h-44 w-44 shrink-0 rounded-2xl border border-slate-100 object-cover"
            />
        )
    }


    return (
        <div className="flex h-44 w-44 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

            <Package
                size={52}
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

            <p className="mt-2 text-lg font-bold">
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


function NotFoundMessage({
                             message,
                         }: {
    message: string
}) {

    return (
        <main className="min-h-screen bg-slate-50">

            <PublicHeader />

            <div className="mx-auto max-w-7xl px-5 py-16 text-center">

                <h1 className="text-2xl font-bold">
                    {message}
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