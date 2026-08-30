import { useQuery } from '@tanstack/react-query'
import { getHealth } from '../api/healthApi'

export default function HomePage() {

    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['health'],
        queryFn: getHealth,
    })

    return (
        <main className="min-h-screen bg-slate-950 text-white">

            <section className="mx-auto flex min-h-screen max-w-6xl items-center px-6">

                <div className="w-full">

                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-sky-400">
                        Product Finder
                    </p>

                    <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
                        ShelfRadar
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                        Find products in nearby stores, compare prices and
                        check availability.
                    </p>

                    <a
                        href="/login"
                        className="mt-8 inline-flex rounded-xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-400"
                    >
                        Staff Login
                    </a>

                    <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                        <h2 className="text-lg font-semibold">
                            System status
                        </h2>

                        {isLoading && (
                            <p className="mt-3 text-slate-400">
                                Connecting to ShelfRadar API...
                            </p>
                        )}

                        {isError && (
                            <p className="mt-3 text-red-400">
                                API connection failed.
                            </p>
                        )}

                        {data && (
                            <div className="mt-4 space-y-2">

                                <p>
                                    API:
                                    <span className="ml-2 text-emerald-400">
                                        {data.status}
                                    </span>
                                </p>

                                <p>
                                    Database:
                                    <span className="ml-2 text-emerald-400">
                                        {data.database}
                                    </span>
                                </p>

                                <p className="text-sm text-slate-400">
                                    PostGIS: {data.postgis}
                                </p>

                            </div>
                        )}

                    </div>

                </div>

            </section>

        </main>
    )
}