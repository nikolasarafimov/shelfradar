import {
    useState,
} from 'react'

import type {
    FormEvent,
} from 'react'

import {
    Link,
    useNavigate,
} from 'react-router-dom'

import {
    MapPin,
    Search,
    ShoppingBasket,
    Store,
} from 'lucide-react'

export default function HomePage() {

    const [query, setQuery] =
        useState('')

    const navigate =
        useNavigate()

    function handleSubmit(
        event:
        FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault()

        const value =
            query.trim()

        if (value) {

            navigate(
                `/search?q=${encodeURIComponent(
                    value,
                )}`,
            )

        } else {

            navigate(
                '/search',
            )
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white">

            <header>

                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 md:px-8">

                    <Link
                        to="/"
                        className="text-xl font-bold tracking-tight"
                    >
                        ShelfRadar
                    </Link>

                    <Link
                        to="/login"
                        className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
                    >
                        Staff Login
                    </Link>

                </div>

            </header>

            <section className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-14 px-5 py-16 md:px-8 lg:grid-cols-2">

                <div>

                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">
                        Search. Compare. Find.
                    </p>

                    <h1 className="mt-5 max-w-3xl text-5xl font-bold tracking-tight md:text-6xl">
                        Find the product you need, where it's actually available.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                        Search local stores, compare prices and check product availability before you go.
                    </p>

                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="mt-9 flex max-w-2xl flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-3 sm:flex-row"
                    >

                        <div className="relative flex-1">

                            <Search
                                size={20}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                            />

                            <input
                                value={query}
                                onChange={
                                    event =>
                                        setQuery(
                                            event
                                                .target
                                                .value,
                                        )
                                }
                                placeholder="Search Coca-Cola, milk, chocolate..."
                                className="w-full rounded-xl bg-slate-950 py-4 pl-12 pr-4 outline-none ring-1 ring-slate-800 placeholder:text-slate-600 focus:ring-sky-500"
                            />

                        </div>

                        <button
                            type="submit"
                            className="rounded-xl bg-sky-500 px-7 py-4 font-semibold text-slate-950 transition hover:bg-sky-400"
                        >
                            Search
                        </button>

                    </form>

                    <Link
                        to="/search"
                        className="mt-4 inline-block text-sm text-slate-400 hover:text-white"
                    >
                        Browse all products →
                    </Link>

                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                    <FeatureCard
                        icon={
                            <ShoppingBasket />
                        }
                        title="Find Products"
                        text="Search the shared ShelfRadar product catalog."
                    />

                    <FeatureCard
                        icon={
                            <Store />
                        }
                        title="Compare Stores"
                        text="See which participating stores currently carry each product."
                    />

                    <FeatureCard
                        icon={
                            <Search />
                        }
                        title="Compare Prices"
                        text="Sort offers and quickly spot the lowest available price."
                    />

                    <FeatureCard
                        icon={
                            <MapPin />
                        }
                        title="Location Ready"
                        text="Store addresses and coordinates prepare search results for distance and maps."
                    />

                </div>

            </section>

        </main>
    )
}

function FeatureCard({
                         icon,
                         title,
                         text,
                     }: {
    icon: React.ReactNode
    title: string
    text: string
}) {

    return (
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-sky-400">
                {icon}
            </div>

            <h2 className="mt-5 text-lg font-semibold">
                {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
                {text}
            </p>

        </article>
    )
}