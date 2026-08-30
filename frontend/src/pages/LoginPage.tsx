import axios from 'axios'

import {
    useEffect,
    useState,
} from 'react'

import type {
    FormEvent,
} from 'react'

import {
    useNavigate,
} from 'react-router-dom'

import {
    useAuth,
} from '../features/auth/useAuth'

export default function LoginPage() {

    const {
        login,
        user,
    } = useAuth()

    const navigate =
        useNavigate()

    const [email, setEmail] =
        useState('')

    const [password, setPassword] =
        useState('')

    const [error, setError] =
        useState<string | null>(null)

    const [
        submitting,
        setSubmitting,
    ] = useState(false)

    useEffect(() => {

        if (!user) {
            return
        }

        navigate(
            user.role === 'ADMIN'
                ? '/admin'
                : '/store',
            {
                replace: true,
            },
        )

    }, [
        user,
        navigate,
    ])

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault()

        setError(null)
        setSubmitting(true)

        try {

            const authenticatedUser =
                await login(
                    email,
                    password,
                )

            navigate(
                authenticatedUser.role === 'ADMIN'
                    ? '/admin'
                    : '/store',
                {
                    replace: true,
                },
            )

        } catch (requestError) {

            if (
                axios.isAxiosError(
                    requestError,
                ) &&
                requestError.response?.status === 401
            ) {

                setError(
                    'Invalid email or password.',
                )

            } else {

                setError(
                    'Unable to sign in. Please try again.',
                )
            }

        } finally {

            setSubmitting(false)
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">

            <div className="w-full max-w-md">

                <a
                    href="/"
                    className="text-sm text-slate-400 hover:text-white"
                >
                    ← Back to ShelfRadar
                </a>

                <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">
                        ShelfRadar
                    </p>

                    <h1 className="mt-3 text-3xl font-bold">
                        Staff Login
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                        Sign in to manage your store or access administration.
                    </p>

                    <form
                        className="mt-8 space-y-5"
                        onSubmit={handleSubmit}
                    >

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={
                                    (event) =>
                                        setEmail(
                                            event.target.value,
                                        )
                                }
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={
                                    (event) =>
                                        setPassword(
                                            event.target.value,
                                        )
                                }
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-sky-500"
                            />
                        </div>

                        {error && (
                            <div
                                role="alert"
                                className="rounded-xl border border-red-900/50 bg-red-950/50 px-4 py-3 text-sm text-red-300"
                            >
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full rounded-xl bg-sky-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {
                                submitting
                                    ? 'Signing in...'
                                    : 'Sign in'
                            }
                        </button>

                    </form>

                </div>

            </div>

        </main>
    )
}