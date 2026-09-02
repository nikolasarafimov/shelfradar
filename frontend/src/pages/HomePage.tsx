import {
    useState,
} from 'react'

import type {
    FormEvent,
    ReactNode,
} from 'react'

import {
    ArrowRight,
    BadgeCheck,
    CircleDollarSign,
    Navigation,
    Search,
    ShoppingBag,
} from 'lucide-react'

import {
    Link,
    useNavigate,
} from 'react-router-dom'


export default function HomePage() {
    const [
        query,
        setQuery,
    ] =
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
            return
        }

        navigate(
            '/search',
        )
    }

    return (
        <main className="relative min-h-dvh overflow-x-hidden bg-slate-950 text-white lg:h-dvh lg:overflow-hidden">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="animate-glow-drift absolute left-1/2 top-[-220px] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-sky-500/10 blur-[130px]" />
                <div className="animate-glow-drift absolute -left-48 top-[360px] h-[420px] w-[420px] rounded-full bg-cyan-500/5 blur-[120px] [animation-delay:700ms]" />
                <div className="animate-glow-drift absolute -right-52 top-[180px] h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[140px] [animation-delay:1200ms]" />
                <div className="absolute left-1/2 top-[20%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-400/[0.04] blur-[120px]" />

                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.35) 1px, transparent 1px)',

                        backgroundSize:
                            '42px 42px',
                    }}
                />
            </div>

            <header className="relative z-40 border-b border-slate-900/80 bg-slate-950/70 backdrop-blur-xl">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
                    <Link to="/" aria-label="ShelfRadar home" className="group flex items-center">
                        <img src="/shelfradar-logo.png" alt="ShelfRadar" className="h-14 w-auto object-contain drop-shadow-[0_0_18px_rgba(56,189,248,0.12)] transition duration-300 group-hover:scale-[1.03] group-hover:drop-shadow-[0_0_26px_rgba(56,189,248,0.18)]"/>
                    </Link>

                    <nav className="flex items-center gap-2 sm:gap-3">
                        <Link to="/search?browse=all" className="hidden rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 transition duration-200 hover:bg-slate-900 hover:text-white sm:inline-flex">
                            Browse products
                        </Link>

                        <Link to="/login" className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-200 shadow-sm transition duration-200 hover:border-slate-500 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
                            Staff Login
                        </Link>
                    </nav>
                </div>
            </header>

            <section className="relative z-10">
                <div className="mx-auto grid min-h-[calc(100dvh-80px)] max-w-7xl items-center gap-12 px-5 py-10 md:px-8 lg:h-[calc(100dvh-80px)] lg:min-h-0 lg:grid-cols-[minmax(0,1.08fr)_minmax(430px,0.92fr)] lg:gap-20 lg:py-8">
                    <div className="relative">
                        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-sky-900/60 bg-sky-950/40 px-3.5 py-2 shadow-lg shadow-sky-950/10 backdrop-blur">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-50" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-400" />
                            </span>

                            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-sky-300 sm:text-xs">
                                Search. Compare. Find.
                            </span>
                        </div>

                        <h1 className="animate-fade-up animation-delay-100 mt-7 max-w-3xl text-[2.75rem] font-bold leading-[1.04] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl lg:text-[4.15rem]">
                            Find the product.

                            <span className="mt-1 block pb-1.5 bg-gradient-to-r from-sky-300 via-cyan-300 to-sky-500 bg-clip-text text-transparent">
                                Find the right store.
                            </span>
                        </h1>

                        <p className="animate-fade-up animation-delay-200 mt-6 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
                            Search nearby stores, compare current prices and check
                            availability before you go.
                        </p>

                        <form onSubmit={handleSubmit} className="animate-fade-up animation-delay-300 mt-9 max-w-2xl rounded-[1.35rem] border border-slate-800/90 bg-slate-900/80 p-2 shadow-[0_25px_80px_-35px_rgba(14,165,233,0.35)] backdrop-blur-xl sm:flex">
                            <div className="relative min-w-0 flex-1">
                                <Search size={20} aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"/>

                                <label htmlFor="home-search" className="sr-only">
                                    Search products
                                </label>

                                <input
                                    id="home-search"
                                    type="search"
                                    autoComplete="off"
                                    value={
                                        query
                                    }
                                    onChange={
                                        event =>
                                            setQuery(
                                                event.target.value,
                                            )
                                    }
                                    placeholder="What are you looking for?"
                                    className="min-h-14 w-full rounded-xl border-0 bg-slate-950/90 py-3 pl-12 pr-4 text-sm text-white outline-none ring-1 ring-inset ring-slate-800 transition duration-300 placeholder:text-slate-600 focus:ring-2 focus:ring-sky-500 focus:shadow-[0_0_0_5px_rgba(14,165,233,0.08)] sm:text-base"
                                />
                            </div>

                            <button type="submit" className="shine-button group mt-2 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-7 py-3 font-bold text-slate-950 shadow-lg shadow-sky-950/30 transition duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_16px_35px_-14px_rgba(56,189,248,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 motion-reduce:transform-none sm:ml-2 sm:mt-0 sm:w-auto">
                                Search

                                <ArrowRight
                                    size={18}
                                    className="transition-transform duration-200 group-hover:translate-x-1"
                                />
                            </button>
                        </form>

                        <div className="animate-fade-up animation-delay-400 mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                            <Link to="/search?browse=all" className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-sky-300">
                                Browse all products

                                <ArrowRight
                                    size={15}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Link>

                            <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                                <BadgeCheck size={17} className="text-emerald-400"/>
                                No account required
                            </span>
                        </div>

                        <div className="animate-fade-up animation-delay-500 mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
                            <Capability
                                icon={
                                    <ShoppingBag size={18} />
                                }
                                title="Search products"
                                text="Explore the catalog"
                            />

                            <Capability
                                icon={
                                    <CircleDollarSign size={18} />
                                }
                                title="Compare prices"
                                text="Review store offers"
                            />

                            <Capability
                                icon={
                                    <Navigation size={18} />
                                }
                                title="Find nearby"
                                text="Use your location"
                            />
                        </div>
                    </div>

                    <div className="relative mx-auto flex w-full max-w-[580px] items-center justify-center lg:mx-0 lg:ml-auto">
                        <div aria-hidden="true" className="animate-pulse-soft absolute h-[390px] w-[390px] rounded-full bg-sky-500/10 blur-[90px]"/>

                        <div className="animate-scale-in relative aspect-square w-full max-w-[500px]">
                            <div className="absolute inset-[2%] rounded-full bg-sky-500/[0.025] blur-2xl" />

                            <div className="absolute inset-[5%] rounded-full border border-sky-500/[0.12]" />

                            <div className="absolute inset-[15%] rounded-full border border-sky-400/[0.11]" />

                            <div className="absolute inset-[25%] rounded-full border border-sky-300/[0.12]" />

                            <div className="absolute inset-[35%] rounded-full border border-sky-300/[0.18]" />

                            <div className="absolute left-1/2 top-[5%] h-[90%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-sky-500/[0.08] to-transparent" />

                            <div className="absolute left-[5%] top-1/2 h-px w-[90%] -translate-y-1/2 bg-gradient-to-r from-transparent via-sky-500/[0.08] to-transparent" />

                            <div
                                aria-hidden="true"
                                className="absolute inset-[5%] animate-spin rounded-full motion-reduce:animate-none"
                                style={{
                                    animationDuration:
                                        '18s',
                                }}
                            >
                                <div className="absolute left-1/2 top-1/2 h-px w-[48%] origin-left bg-gradient-to-r from-cyan-400/65 to-transparent" />
                                <div className="absolute left-1/2 top-1/2 h-[48%] w-[48%] origin-top-left bg-gradient-to-br from-sky-400/[0.09] to-transparent" />
                            </div>

                            <div className="animate-float-soft absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-sky-500/25 bg-slate-900/95 shadow-[0_0_90px_rgba(14,165,233,0.18)] backdrop-blur-xl">

                                <div className="absolute inset-3 rounded-full border border-sky-400/[0.10]" />

                                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 via-sky-500 to-cyan-400 text-slate-950 shadow-[0_0_40px_rgba(56,189,248,0.28)]">
                                    <Search size={34} strokeWidth={2.2}/>
                                </div>
                            </div>


                            <RadarDot
                                className="left-[19%] top-[31%]"
                                delay="0ms"
                            />

                            <RadarDot
                                className="right-[16%] top-[23%]"
                                delay="700ms"
                            />

                            <RadarDot
                                className="bottom-[18%] left-[28%]"
                                delay="1300ms"
                            />

                            <RadarDot
                                className="bottom-[31%] right-[20%]"
                                delay="1900ms"
                            />

                        </div>

                    </div>
                </div>
            </section>
        </main>
    )
}

function Capability({
                        icon,
                        title,
                        text,
                    }: {
    icon: ReactNode
    title: string
    text: string
}) {
    return (
        <article className="premium-card group flex items-center gap-3 rounded-2xl border border-slate-800/70 bg-slate-900/40 px-4 py-3.5 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.8)] transition duration-300 hover:-translate-y-1 hover:border-sky-800/80 hover:bg-slate-900/75 hover:shadow-[0_18px_40px_-18px_rgba(14,165,233,0.18)] motion-reduce:transform-none">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 transition duration-300 group-hover:scale-105 group-hover:bg-sky-500/15">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-100">
                    {title}
                </p>

                <p className="mt-0.5 truncate text-xs text-slate-500">
                    {text}
                </p>
            </div>
        </article>
    )
}

function RadarDot({
                      className,
                      delay = '0ms',
                  }: {
    className: string
    delay?: string
}) {

    return (
        <div className={`absolute z-10 ${className}`}>

            <span className="relative flex h-3 w-3">

                <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-40 motion-reduce:animate-none"
                    style={{
                        animationDelay:
                        delay,
                    }}
                />

                <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-slate-950 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />

            </span>

        </div>
    )
}