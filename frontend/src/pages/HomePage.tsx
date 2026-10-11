import {
    useState,
} from 'react'

import type {
    FormEvent,
} from 'react'

import {
    ArrowRight,
    BadgeCheck,
    CircleDollarSign,
    Navigation,
    Search,
    ShoppingBag,
} from 'lucide-react'

import type {
    LucideIcon,
} from 'lucide-react'

import {
    Link,
    useNavigate,
} from 'react-router-dom'

import {
    motion,
} from 'motion/react'

interface CapabilityItem {
    icon: LucideIcon
    title: string
    text: string
}

const capabilities: CapabilityItem[] = [
    {
        icon: ShoppingBag,
        title: 'Search products',
        text: 'Explore the catalog',
    },
    {
        icon: CircleDollarSign,
        title: 'Compare prices',
        text: 'Review store offers',
    },
    {
        icon: Navigation,
        title: 'Find nearby',
        text: 'Use your location',
    },
]

const entranceTransition = {
    duration: 0.55,
    ease: [
        0.16,
        1,
        0.3,
        1,
    ] as const,
}

export default function HomePage() {
    const [
        query,
        setQuery,
    ] = useState('')

    const navigate =
        useNavigate()

    function handleSubmit(
        event: FormEvent<HTMLFormElement>,
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
        <main className="relative min-h-dvh overflow-x-hidden bg-slate-950 text-white">
            <HomeBackground />

            <header className="relative z-40 border-b border-slate-800/60 bg-slate-950/72 backdrop-blur-2xl">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
                    <Link
                        to="/"
                        aria-label="ShelfRadar home"
                        className="group flex items-center"
                    >
                        <img
                            src="/shelfradar-logo.png"
                            alt="ShelfRadar"
                            className="h-13 w-auto object-contain drop-shadow-[0_0_18px_rgba(56,189,248,0.1)] transition duration-300 group-hover:scale-[1.025] group-hover:drop-shadow-[0_0_24px_rgba(56,189,248,0.16)]"
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
                            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900/60 px-4 text-sm font-semibold text-slate-200 transition duration-200 hover:border-slate-600 hover:bg-slate-800/80 hover:text-white"
                        >
                            Staff login
                        </Link>
                    </nav>
                </div>
            </header>

            <section className="relative z-10">
                <div className="mx-auto grid min-h-[calc(100dvh-80px)] max-w-7xl items-center gap-14 px-5 py-14 md:px-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(400px,0.92fr)] lg:gap-16 lg:py-12 xl:gap-20">
                    <div className="relative">
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 12,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                ...entranceTransition,
                                delay: 0.05,
                            }}
                            className="inline-flex items-center gap-2 rounded-full border border-sky-300/15 bg-sky-300/[0.07] px-3.5 py-2 shadow-[0_10px_35px_rgba(14,165,233,0.06)] backdrop-blur"
                        >
                            <span className="relative flex size-2">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky-300 opacity-45 motion-reduce:animate-none" />

                                <span className="relative inline-flex size-2 rounded-full bg-sky-300" />
                            </span>

                            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky-300 sm:text-[11px]">
                                Search. Compare. Find.
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{
                                opacity: 0,
                                y: 18,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                ...entranceTransition,
                                delay: 0.12,
                            }}
                            className="mt-7 max-w-3xl text-[2.75rem] font-semibold leading-[1.03] tracking-[-0.055em] text-slate-50 sm:text-5xl md:text-6xl lg:text-[4.1rem]"
                        >
                            Find the product.

                            <span className="text-gradient mt-1 block pb-1.5">
                                Find the right store.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{
                                opacity: 0,
                                y: 16,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                ...entranceTransition,
                                delay: 0.19,
                            }}
                            className="mt-6 max-w-xl text-base leading-8 text-slate-400 sm:text-lg"
                        >
                            Search nearby stores, compare current prices and check availability before you go.
                        </motion.p>

                        <motion.form
                            initial={{
                                opacity: 0,
                                y: 16,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                ...entranceTransition,
                                delay: 0.26,
                            }}
                            onSubmit={handleSubmit}
                            className="mt-9 max-w-2xl rounded-[1.35rem] border border-slate-700/60 bg-slate-900/65 p-2 shadow-[0_28px_90px_-40px_rgba(14,165,233,0.42)] backdrop-blur-xl sm:flex"
                        >
                            <div className="relative min-w-0 flex-1">
                                <Search
                                    className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500"
                                    aria-hidden="true"
                                />

                                <label
                                    htmlFor="home-search"
                                    className="sr-only"
                                >
                                    Search products
                                </label>

                                <input
                                    id="home-search"
                                    type="search"
                                    autoComplete="off"
                                    value={query}
                                    onChange={
                                        event =>
                                            setQuery(
                                                event.target.value,
                                            )
                                    }
                                    placeholder="What are you looking for?"
                                    className="min-h-14 w-full rounded-xl border-0 bg-slate-950/80 py-3 pl-12 pr-4 text-sm text-slate-50 outline-none ring-1 ring-inset ring-slate-700/70 transition duration-200 placeholder:text-slate-600 focus:ring-2 focus:ring-sky-400/80 sm:text-base"
                                />
                            </div>

                            <button
                                type="submit"
                                className="shine-button group mt-2 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-300 px-7 py-3 font-semibold text-slate-950 shadow-[0_14px_35px_-16px_rgba(56,189,248,0.5)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110 motion-reduce:transform-none sm:ml-2 sm:mt-0 sm:w-auto"
                            >
                                Search

                                <ArrowRight
                                    className="size-[18px] transition-transform duration-200 group-hover:translate-x-1"
                                    aria-hidden="true"
                                />
                            </button>
                        </motion.form>

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 12,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                ...entranceTransition,
                                delay: 0.33,
                            }}
                            className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3"
                        >
                            <Link
                                to="/search?browse=all"
                                className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition duration-200 hover:text-sky-300"
                            >
                                Browse all products

                                <ArrowRight
                                    className="size-3.5 transition-transform duration-200 group-hover:translate-x-1"
                                    aria-hidden="true"
                                />
                            </Link>

                            <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                                <BadgeCheck
                                    className="size-[17px] text-emerald-400"
                                    aria-hidden="true"
                                />

                                No account required
                            </span>
                        </motion.div>

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 16,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                ...entranceTransition,
                                delay: 0.4,
                            }}
                            className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3"
                        >
                            {capabilities.map(
                                item => (
                                    <Capability
                                        key={item.title}
                                        item={item}
                                    />
                                ),
                            )}
                        </motion.div>
                    </div>

                    <RadarVisual />
                </div>
            </section>
        </main>
    )
}

function HomeBackground() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
        >
            <div className="animate-glow-drift absolute left-1/2 top-[-240px] h-[560px] w-[860px] -translate-x-1/2 rounded-full bg-sky-400/[0.09] blur-[140px] motion-reduce:animate-none" />

            <div className="animate-glow-drift absolute -left-52 top-[360px] size-[440px] rounded-full bg-cyan-400/[0.04] blur-[130px] [animation-delay:700ms] motion-reduce:animate-none" />

            <div className="animate-glow-drift absolute -right-56 top-[170px] size-[520px] rounded-full bg-blue-500/[0.04] blur-[150px] [animation-delay:1200ms] motion-reduce:animate-none" />

            <div
                className="absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px)',

                    backgroundSize:
                        '44px 44px',
                }}
            />

            <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-sky-400/[0.02] to-transparent" />
        </div>
    )
}

function RadarVisual() {
    return (
        <motion.div
            initial={{
                opacity: 0,
                scale: 0.96,
                x: 12,
            }}
            animate={{
                opacity: 1,
                scale: 1,
                x: 0,
            }}
            transition={{
                duration: 0.75,
                delay: 0.22,
                ease: [
                    0.16,
                    1,
                    0.3,
                    1,
                ],
            }}
            className="relative mx-auto flex w-full max-w-[560px] items-center justify-center lg:mx-0 lg:ml-auto"
        >
            <div
                aria-hidden="true"
                className="animate-pulse-soft absolute size-[390px] rounded-full bg-sky-400/[0.08] blur-[95px] motion-reduce:animate-none"
            />

            <div className="relative aspect-square w-full max-w-[500px]">
                <div className="absolute inset-[2%] rounded-full bg-sky-400/[0.02] blur-2xl" />

                <div className="absolute inset-[5%] rounded-full border border-sky-300/[0.11]" />

                <div className="absolute inset-[15%] rounded-full border border-sky-300/[0.1]" />

                <div className="absolute inset-[25%] rounded-full border border-sky-300/[0.11]" />

                <div className="absolute inset-[35%] rounded-full border border-sky-300/[0.16]" />

                <div className="absolute left-1/2 top-[5%] h-[90%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-sky-300/[0.07] to-transparent" />

                <div className="absolute left-[5%] top-1/2 h-px w-[90%] -translate-y-1/2 bg-gradient-to-r from-transparent via-sky-300/[0.07] to-transparent" />

                <div
                    aria-hidden="true"
                    className="absolute inset-[5%] animate-spin rounded-full motion-reduce:animate-none"
                    style={{
                        animationDuration:
                            '18s',
                    }}
                >
                    <div className="absolute left-1/2 top-1/2 h-px w-[48%] origin-left bg-gradient-to-r from-cyan-300/65 to-transparent" />

                    <div className="absolute left-1/2 top-1/2 h-[48%] w-[48%] origin-top-left bg-gradient-to-br from-sky-300/[0.075] to-transparent" />
                </div>

                <div className="animate-float-soft absolute left-1/2 top-1/2 flex size-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-sky-300/20 bg-slate-900/90 shadow-[0_0_90px_rgba(14,165,233,0.16)] backdrop-blur-xl motion-reduce:animate-none">
                    <div className="absolute inset-3 rounded-full border border-sky-300/[0.09]" />

                    <div className="relative flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-300 via-sky-400 to-cyan-300 text-slate-950 shadow-[0_0_42px_rgba(56,189,248,0.26)]">
                        <Search
                            className="size-8"
                            strokeWidth={2.2}
                            aria-hidden="true"
                        />
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
        </motion.div>
    )
}

function Capability({
                        item,
                    }: {
    item: CapabilityItem
}) {
    const Icon =
        item.icon

    return (
        <article className="premium-card group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition duration-300 hover:-translate-y-1 hover:border-sky-300/15 motion-reduce:transform-none">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/10 bg-sky-300/[0.06] text-sky-300 transition duration-300 group-hover:scale-105 group-hover:bg-sky-300/[0.1]">
                <Icon
                    className="size-[18px]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                />
            </div>

            <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-100">
                    {item.title}
                </p>

                <p className="mt-0.5 truncate text-xs text-slate-500">
                    {item.text}
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
        <div
            className={`absolute z-10 ${className}`}
        >
            <span className="relative flex size-3">
                <span
                    className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-300 opacity-40 motion-reduce:animate-none"
                    style={{
                        animationDelay:
                        delay,
                    }}
                />

                <span className="relative inline-flex size-3 rounded-full border-2 border-slate-950 bg-cyan-300 shadow-[0_0_15px_rgba(103,232,249,0.75)]" />
            </span>
        </div>
    )
}