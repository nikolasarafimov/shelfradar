import {
    useState,
} from 'react'

import type {
    FormEvent,
    ReactNode,
} from 'react'

import {
    ArrowLeft,
    BadgeCheck,
    Eye,
    EyeOff,
    LoaderCircle,
    Lock,
    Mail,
    Settings2,
    ShieldCheck,
    Store,
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

import {
    useAuth,
} from '../features/auth/authContext'

interface InfoItem {
    icon: LucideIcon
    title: string
    text: string
}

const infoItems: InfoItem[] = [
    {
        icon: Store,
        title: 'Manage inventory',
        text: 'Update prices, quantities and availability.',
    },
    {
        icon: ShieldCheck,
        title: 'Secure role-based access',
        text: 'Store owners and administrators use protected workspaces.',
    },
    {
        icon: Settings2,
        title: 'Platform administration',
        text: 'Approve stores and manage ShelfRadar operations.',
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

export default function LoginPage() {
    const navigate =
        useNavigate()

    const {
        login,
    } = useAuth()

    const [
        email,
        setEmail,
    ] = useState('')

    const [
        password,
        setPassword,
    ] = useState('')

    const [
        showPassword,
        setShowPassword,
    ] = useState(false)

    const [
        error,
        setError,
    ] = useState<string | null>(
        null,
    )

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false)

    function clearError() {
        if (error) {
            setError(
                null,
            )
        }
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()

        const normalizedEmail =
            email.trim()

        if (
            !normalizedEmail ||
            password.length === 0
        ) {
            setError(
                'Please enter both email and password.',
            )

            return
        }

        try {
            setIsSubmitting(
                true,
            )

            setError(
                null,
            )

            const authenticatedUser =
                await login(
                    normalizedEmail,
                    password,
                )

            if (
                authenticatedUser.role ===
                'ADMIN'
            ) {
                navigate(
                    '/admin',
                    {
                        replace: true,
                    },
                )

                return
            }

            navigate(
                '/store',
                {
                    replace: true,
                },
            )
        } catch {
            setError(
                'Unable to sign in. Check your email and password and try again.',
            )
        } finally {
            setIsSubmitting(
                false,
            )
        }
    }

    return (
        <main className="relative min-h-dvh overflow-x-hidden bg-slate-950 text-white">
            <LoginBackground />

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
                            className="h-13 w-auto object-contain drop-shadow-[0_0_18px_rgba(56,189,248,0.08)] transition duration-300 group-hover:scale-[1.025]"
                        />
                    </Link>

                    <Link
                        to="/"
                        className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/60 px-4 text-sm font-medium text-slate-300 transition duration-200 hover:border-slate-600 hover:bg-slate-800/80 hover:text-white"
                    >
                        <ArrowLeft
                            className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                            aria-hidden="true"
                        />

                        <span className="hidden sm:inline">
                            Back to home
                        </span>

                        <span className="sm:hidden">
                            Home
                        </span>
                    </Link>
                </div>
            </header>

            <section className="relative z-10">
                <div className="mx-auto grid min-h-[calc(100dvh-80px)] max-w-7xl items-center gap-14 px-5 py-12 md:px-8 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16 lg:py-12">
                    <div className="max-w-2xl">
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
                                Secure staff access
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
                            className="mt-7 max-w-3xl text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.05em] text-slate-50 sm:text-5xl lg:text-[4rem]"
                        >
                            Manage your store.

                            <span className="text-gradient mt-1 block pb-1.5">
                                Keep ShelfRadar current.
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
                            Sign in to update inventory, manage store information and access ShelfRadar administration tools.
                        </motion.p>

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
                                delay: 0.26,
                            }}
                            className="mt-8 space-y-3"
                        >
                            {infoItems.map(
                                (
                                    item,
                                    index,
                                ) => (
                                    <InfoStrip
                                        key={item.title}
                                        item={item}
                                        index={index}
                                    />
                                ),
                            )}
                        </motion.div>

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
                                delay: 0.4,
                            }}
                            className="mt-6 inline-flex items-center gap-2 text-sm text-slate-400"
                        >
                            <BadgeCheck
                                className="size-4 text-emerald-400"
                                aria-hidden="true"
                            />

                            <span>
                                Public product search does not require an account.
                            </span>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 18,
                            scale: 0.985,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        transition={{
                            duration: 0.65,
                            delay: 0.2,
                            ease: [
                                0.16,
                                1,
                                0.3,
                                1,
                            ],
                        }}
                        className="relative"
                    >
                        <div
                            aria-hidden="true"
                            className="animate-glow-pulse absolute inset-6 rounded-[2rem] bg-sky-400/[0.08] blur-3xl motion-reduce:animate-none"
                        />

                        <div className="premium-card relative overflow-hidden rounded-[2rem] p-6 shadow-[0_35px_120px_-40px_rgba(14,165,233,0.3)] sm:p-8">
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -right-24 -top-24 size-52 rounded-full bg-sky-400/[0.055] blur-3xl"
                            />

                            <div className="relative">
                                <p className="eyebrow">
                                    ShelfRadar
                                </p>

                                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-slate-50">
                                    Staff login
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                    Enter your staff credentials to continue.
                                </p>

                                {error && (
                                    <div
                                        role="alert"
                                        className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-300/10 bg-rose-300/[0.05] px-4 py-3 text-sm leading-6 text-rose-200/80"
                                    >
                                        <ShieldCheck
                                            className="mt-1 size-4 shrink-0 text-rose-300"
                                            aria-hidden="true"
                                        />

                                        <span>
                                            {error}
                                        </span>
                                    </div>
                                )}

                                <form
                                    onSubmit={handleSubmit}
                                    className="mt-6 space-y-5"
                                >
                                    <Field
                                        label="Email"
                                        htmlFor="email"
                                    >
                                        <div className="relative">
                                            <Mail
                                                className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-slate-500"
                                                aria-hidden="true"
                                            />

                                            <input
                                                id="email"
                                                type="email"
                                                autoComplete="email"
                                                value={email}
                                                disabled={isSubmitting}
                                                onChange={
                                                    event => {
                                                        setEmail(
                                                            event.target.value,
                                                        )

                                                        clearError()
                                                    }
                                                }
                                                placeholder="you@example.com"
                                                className="field min-h-14 w-full pl-12 pr-4 text-sm disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                                            />
                                        </div>
                                    </Field>

                                    <Field
                                        label="Password"
                                        htmlFor="password"
                                    >
                                        <div className="relative">
                                            <Lock
                                                className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-slate-500"
                                                aria-hidden="true"
                                            />

                                            <input
                                                id="password"
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                autoComplete="current-password"
                                                value={password}
                                                disabled={isSubmitting}
                                                onChange={
                                                    event => {
                                                        setPassword(
                                                            event.target.value,
                                                        )

                                                        clearError()
                                                    }
                                                }
                                                placeholder="Enter your password"
                                                className="field min-h-14 w-full pl-12 pr-12 text-sm disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                                            />

                                            <button
                                                type="button"
                                                disabled={isSubmitting}
                                                onClick={
                                                    () =>
                                                        setShowPassword(
                                                            current =>
                                                                !current,
                                                        )
                                                }
                                                aria-label={
                                                    showPassword
                                                        ? 'Hide password'
                                                        : 'Show password'
                                                }
                                                aria-pressed={
                                                    showPassword
                                                }
                                                className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition duration-200 hover:bg-slate-800/70 hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {showPassword ? (
                                                    <EyeOff
                                                        className="size-[18px]"
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <Eye
                                                        className="size-[18px]"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                            </button>
                                        </div>
                                    </Field>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="shine-button inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-300 px-6 py-3 font-semibold text-slate-950 shadow-[0_14px_35px_-16px_rgba(56,189,248,0.48)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-65 motion-reduce:transform-none"
                                    >
                                        {isSubmitting && (
                                            <LoaderCircle
                                                className="size-4 animate-spin"
                                                aria-hidden="true"
                                            />
                                        )}

                                        {isSubmitting
                                            ? 'Signing in...'
                                            : 'Sign in'}
                                    </button>
                                </form>

                                <div className="mt-6 border-t border-slate-800/80 pt-5">
                                    <div className="flex items-start gap-3 text-sm leading-6 text-slate-400">
                                        <ShieldCheck
                                            className="mt-1 size-4 shrink-0 text-sky-300"
                                            aria-hidden="true"
                                        />

                                        <span>
                                            Staff access is restricted to registered Store Owner and Administrator accounts.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    )
}

function LoginBackground() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
        >
            <div className="animate-glow-drift absolute left-1/2 top-[-240px] h-[560px] w-[860px] -translate-x-1/2 rounded-full bg-sky-400/[0.09] blur-[140px] motion-reduce:animate-none" />

            <div className="animate-glow-drift absolute -left-48 top-[300px] size-[400px] rounded-full bg-cyan-400/[0.04] blur-[130px] [animation-delay:700ms] motion-reduce:animate-none" />

            <div className="animate-glow-drift absolute -right-48 top-[180px] size-[460px] rounded-full bg-blue-500/[0.04] blur-[145px] [animation-delay:1200ms] motion-reduce:animate-none" />

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

function Field({
                   label,
                   htmlFor,
                   children,
               }: {
    label: string
    htmlFor: string
    children: ReactNode
}) {
    return (
        <label
            htmlFor={htmlFor}
            className="block"
        >
            <span className="mb-2 block text-sm font-semibold text-slate-200">
                {label}
            </span>

            {children}
        </label>
    )
}

function InfoStrip({
                       item,
                       index,
                   }: {
    item: InfoItem
    index: number
}) {
    const Icon =
        item.icon

    return (
        <motion.article
            initial={{
                opacity: 0,
                x: -8,
            }}
            animate={{
                opacity: 1,
                x: 0,
            }}
            transition={{
                duration: 0.4,
                delay:
                    0.3 +
                    index * 0.06,
            }}
            className="premium-card group rounded-2xl px-4 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-sky-300/15 motion-reduce:transform-none"
        >
            <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-sky-300/10 bg-sky-300/[0.06] text-sky-300 transition duration-300 group-hover:bg-sky-300/[0.1]">
                    <Icon
                        className="size-[18px]"
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />
                </div>

                <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-100">
                        {item.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                        {item.text}
                    </p>
                </div>
            </div>
        </motion.article>
    )
}