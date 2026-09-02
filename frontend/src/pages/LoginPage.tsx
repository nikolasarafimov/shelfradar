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
    Lock,
    Mail,
    Settings2,
    ShieldCheck,
    Store,
} from 'lucide-react'

import {
    Link,
    useNavigate,
} from 'react-router-dom'

import {
    useAuth,
} from '../features/auth/useAuth'

export default function LoginPage() {

    const navigate =
        useNavigate()

    const {
        login,
    } =
        useAuth()

    const [
        email,
        setEmail,
    ] =
        useState('')

    const [
        password,
        setPassword,
    ] =
        useState('')

    const [
        showPassword,
        setShowPassword,
    ] =
        useState(false)

    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null,
        )

    const [
        isSubmitting,
        setIsSubmitting,
    ] =
        useState(false)

    function clearError() {
        if (
            error
        ) {
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
            password.length ===
            0
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
                        replace:
                            true,
                    },
                )
                return
            }

            navigate(
                '/store',
                {
                    replace:
                        true,
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
        <main className="relative min-h-dvh overflow-x-hidden bg-slate-950 text-white lg:h-dvh lg:overflow-hidden">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-[-220px] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-sky-500/10 blur-[130px]" />
                <div className="absolute -left-40 top-[280px] h-[360px] w-[360px] rounded-full bg-cyan-500/5 blur-[120px]" />
                <div className="absolute right-[-120px] top-[180px] h-[420px] w-[420px] rounded-full bg-blue-500/5 blur-[140px]" />

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
                    <Link
                        to="/"
                        aria-label="ShelfRadar home"
                        className="group flex items-center"
                    >
                        <img
                            src="/shelfradar-logo.png"
                            alt="ShelfRadar"
                            className="h-14 w-auto object-contain transition duration-300 group-hover:scale-[1.025]"
                        />
                    </Link>

                    <Link
                        to="/"
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-200 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-500 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 motion-reduce:transform-none"
                    >
                        <ArrowLeft size={16}/>
                        Back to Home
                    </Link>
                </div>
            </header>

            <section className="relative z-10">
                <div className="mx-auto grid min-h-[calc(100dvh-80px)] max-w-7xl items-center gap-12 px-5 py-8 md:px-8 lg:h-[calc(100dvh-80px)] lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16 lg:py-8">
                    <div className="max-w-2xl">
                        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-sky-900/60 bg-sky-950/40 px-3.5 py-2 shadow-lg shadow-sky-950/10 backdrop-blur">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-50 motion-reduce:animate-none" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-400" />
                            </span>

                            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-sky-300 sm:text-xs">
                                Secure Staff Access
                            </span>
                        </div>

                        <h1 className="animate-fade-up animation-delay-100 mt-7 max-w-3xl text-[2.5rem] font-bold leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl lg:text-[4rem]">
                            Manage your store.
                            <span className="mt-1 block bg-gradient-to-r from-sky-300 via-cyan-300 to-sky-500 bg-clip-text pb-1.5 text-transparent">
                                Keep ShelfRadar current.
                            </span>
                        </h1>

                        <p className="animate-fade-up animation-delay-200 mt-6 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
                            Sign in to update inventory, manage store information
                            and access ShelfRadar administration tools.
                        </p>

                        <div className="mt-8 space-y-3">
                            <InfoStrip
                                className="animate-fade-up animation-delay-300"
                                icon={
                                    <Store
                                        size={18}
                                    />
                                }
                                title="Manage inventory"
                                text="Update prices, quantities and availability."
                            />

                            <InfoStrip
                                className="animate-fade-up animation-delay-400"
                                icon={
                                    <ShieldCheck
                                        size={18}
                                    />
                                }
                                title="Secure role-based access"
                                text="Store owners and administrators use protected workspaces."
                            />

                            <InfoStrip
                                className="animate-fade-up animation-delay-500"
                                icon={
                                    <Settings2
                                        size={18}
                                    />
                                }
                                title="Platform administration"
                                text="Approve stores and manage ShelfRadar operations."
                            />
                        </div>

                        <div className="animate-fade-up animation-delay-600 mt-6 inline-flex items-center gap-2 text-sm text-slate-400">
                            <BadgeCheck
                                size={16}
                                className="text-emerald-400"
                            />

                            <span>
                                Public product search does not require an account.
                            </span>
                        </div>
                    </div>

                    <div className="relative animate-fade-up animation-delay-300">
                        <div className="animate-glow-pulse absolute inset-6 rounded-[2rem] bg-sky-500/10 blur-3xl" />

                        <div className="relative rounded-[2rem] border border-slate-800/90 bg-slate-900/80 p-6 shadow-[0_35px_120px_-40px_rgba(14,165,233,0.35)] backdrop-blur-xl sm:p-8">
                            <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-400">
                                ShelfRadar
                            </p>

                            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
                                Staff Login
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                Enter your staff credentials to continue.
                            </p>
                            {
                                error && (
                                    <div
                                        role="alert"
                                        className="mt-5 rounded-2xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300"
                                    >
                                        {error}
                                    </div>
                                )
                            }

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                                className="mt-6 space-y-5"
                            >
                                <Field
                                    label="Email"
                                    htmlFor="email"
                                >
                                    <div className="relative">
                                        <Mail
                                            size={18}
                                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                        />

                                        <input
                                            id="email"
                                            type="email"
                                            autoComplete="email"
                                            value={
                                                email
                                            }
                                            disabled={
                                                isSubmitting
                                            }
                                            onChange={
                                                event => {

                                                    setEmail(
                                                        event.target.value,
                                                    )

                                                    clearError()
                                                }
                                            }
                                            placeholder="you@example.com"
                                            className="min-h-14 w-full rounded-xl border-0 bg-slate-950/90 py-3 pl-12 pr-4 text-sm text-white outline-none ring-1 ring-inset ring-slate-800 transition placeholder:text-slate-600 focus:ring-2 focus:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                                        />
                                    </div>
                                </Field>

                                <Field
                                    label="Password"
                                    htmlFor="password"
                                >
                                    <div className="relative">
                                        <Lock
                                            size={18}
                                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                        />

                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            autoComplete="current-password"
                                            value={
                                                password
                                            }
                                            disabled={
                                                isSubmitting
                                            }
                                            onChange={
                                                event => {

                                                    setPassword(
                                                        event.target.value,
                                                    )

                                                    clearError()
                                                }
                                            }
                                            placeholder="Enter your password"
                                            className="min-h-14 w-full rounded-xl border-0 bg-slate-950/90 py-3 pl-12 pr-12 text-sm text-white outline-none ring-1 ring-inset ring-slate-800 transition placeholder:text-slate-600 focus:ring-2 focus:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                                        />

                                        <button
                                            type="button"
                                            disabled={
                                                isSubmitting
                                            }
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
                                            className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-900 hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {
                                                showPassword
                                                    ? (
                                                        <EyeOff
                                                            size={18}
                                                        />
                                                    )
                                                    : (
                                                        <Eye
                                                            size={18}
                                                        />
                                                    )
                                            }
                                        </button>
                                    </div>
                                </Field>

                                <button
                                    type="submit"
                                    disabled={
                                        isSubmitting
                                    }
                                    className="inline-flex min-h-14 w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-sky-950/30 transition duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transform-none"
                                >
                                    {
                                        isSubmitting
                                            ? 'Signing in...'
                                            : 'Sign in'
                                    }
                                </button>
                            </form>

                            <div className="mt-6 border-t border-slate-800/90 pt-5">
                                <div className="inline-flex items-start gap-3 text-sm leading-6 text-slate-400">
                                    <ShieldCheck
                                        size={16}
                                        className="mt-1 shrink-0 text-sky-400"
                                    />

                                    <span>
                                        Staff access is restricted to registered
                                        Store Owner and Administrator accounts.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
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
            htmlFor={
                htmlFor
            }
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
    icon,
    title,
    text,
    className = '',
}: {
    icon: ReactNode
    title: string
    text: string
    className?: string
}) {
    return (
        <article
            className={`rounded-2xl border border-slate-800/80 bg-slate-900/35 px-4 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-sky-900/70 hover:bg-slate-900/60 motion-reduce:transform-none ${className}`}
        >
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                    {icon}
                </div>

                <div className="min-w-0">
                    <h3 className="text-base font-semibold text-white">
                        {title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                        {text}
                    </p>
                </div>
            </div>
        </article>
    )
}