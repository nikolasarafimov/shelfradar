import {
    useState,
} from 'react'

import type {
    ReactNode,
} from 'react'

import {
    Activity,
    LayoutDashboard,
    LogOut,
    Menu,
    PackageSearch,
    ShieldCheck,
    Store,
    X,
} from 'lucide-react'

import {
    Link,
    NavLink,
    useNavigate,
} from 'react-router-dom'

import {
    useAuth,
} from '../../features/auth/useAuth'

export default function AdminLayout({
    children,
}: {
    children: ReactNode
}) {

    const navigate =
        useNavigate()

    const [
        mobileMenuOpen,
        setMobileMenuOpen,
    ] =
        useState(false)

    const {
        user,
        logout,
    } =
        useAuth()

    function handleLogout() {

        setMobileMenuOpen(
            false,
        )

        logout()

        navigate(
            '/',
        )
    }

    return (
        <main className="relative min-h-dvh overflow-x-clip bg-[#020817] text-white">
            <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-[-320px] h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-sky-500/[0.055] blur-[160px]" />
                <div
                    className="absolute inset-0 opacity-[0.018]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(148,163,184,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.25) 1px, transparent 1px)',

                        backgroundSize:
                            '48px 48px',
                    }}
                />
            </div>

            <header className="sticky top-0 z-50 border-b border-slate-900/90 bg-[#020817]/90 backdrop-blur-xl">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
                    <div className="flex min-w-0 items-center gap-7">
                        <Link
                            to="/admin"
                            aria-label="ShelfRadar admin dashboard"
                            className="group flex shrink-0 items-center gap-3"
                        >

                            <img
                                src="/shelfradar-logo.png"
                                alt="ShelfRadar"
                                className="h-12 w-auto object-contain drop-shadow-[0_0_18px_rgba(56,189,248,0.08)] transition duration-300 group-hover:scale-[1.02]"
                            />


                            <span className="hidden items-center gap-1.5 rounded-full border border-sky-900/60 bg-sky-950/35 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-sky-300 xl:inline-flex">
                                <ShieldCheck size={11}/>
                                Admin
                            </span>
                        </Link>

                        <nav className="hidden items-center gap-1 lg:flex">
                            <AdminNavLink
                                to="/admin"
                                end
                                icon={
                                    <LayoutDashboard
                                        size={16}
                                    />
                                }
                            >
                                Dashboard
                            </AdminNavLink>

                            <AdminNavLink
                                to="/admin/stores"
                                icon={
                                    <Store
                                        size={16}
                                    />
                                }
                            >
                                Stores
                            </AdminNavLink>

                            <AdminNavLink
                                to="/admin/catalog"
                                icon={
                                    <PackageSearch
                                        size={16}
                                    />
                                }
                            >
                                Catalog
                            </AdminNavLink>

                            <AdminNavLink
                                to="/admin/activity"
                                icon={
                                    <Activity
                                        size={16}
                                    />
                                }
                            >
                                Activity
                            </AdminNavLink>
                        </nav>
                    </div>

                    <div className="hidden items-center gap-3 lg:flex">
                        <div className="border-r border-slate-800 pr-4 text-right">
                            <p className="max-w-44 truncate text-sm font-semibold text-slate-200">
                                {
                                    user?.fullName ??
                                    'Administrator'
                                }
                            </p>
                            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-600">
                                Administrator
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={
                                handleLogout
                            }
                            className="group inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-3.5 text-sm font-semibold text-slate-400 transition duration-200 hover:border-red-900/60 hover:bg-red-950/20 hover:text-red-300"
                        >
                            <LogOut
                                size={15}
                                className="transition-transform duration-200 group-hover:translate-x-0.5"
                            />
                            Logout
                        </button>
                    </div>

                    <button
                        type="button"
                        aria-label={
                            mobileMenuOpen
                                ? 'Close navigation'
                                : 'Open navigation'
                        }
                        aria-expanded={
                            mobileMenuOpen
                        }
                        onClick={
                            () =>
                                setMobileMenuOpen(
                                    current =>
                                        !current,
                                )
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50 text-slate-300 transition hover:border-slate-700 hover:bg-slate-900 hover:text-white lg:hidden"
                    >
                        {
                            mobileMenuOpen
                                ? (
                                    <X
                                        size={19}
                                    />
                                )
                                : (
                                    <Menu
                                        size={19}
                                    />
                                )
                        }
                    </button>
                </div>
                {
                    mobileMenuOpen && (
                        <div className="border-t border-slate-900 bg-[#020817]/98 px-5 py-4 backdrop-blur-xl lg:hidden">
                            <div className="mx-auto max-w-7xl">
                                <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/45 p-4">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-200">
                                            {
                                                user?.fullName ??
                                                'Administrator'
                                            }
                                        </p>
                                        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-sky-400">
                                            Administrator
                                        </p>
                                    </div>

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-900/50 bg-sky-950/30 text-sky-400">
                                        <ShieldCheck
                                            size={17}
                                        />
                                    </div>
                                </div>

                                <nav className="grid gap-1 sm:grid-cols-2">
                                    <MobileAdminLink
                                        to="/admin"
                                        end
                                        icon={
                                            <LayoutDashboard
                                                size={17}
                                            />
                                        }
                                        onNavigate={
                                            () =>
                                                setMobileMenuOpen(
                                                    false,
                                                )
                                        }
                                    >
                                        Dashboard
                                    </MobileAdminLink>

                                    <MobileAdminLink
                                        to="/admin/stores"
                                        icon={
                                            <Store
                                                size={17}
                                            />
                                        }
                                        onNavigate={
                                            () =>
                                                setMobileMenuOpen(
                                                    false,
                                                )
                                        }
                                    >
                                        Stores
                                    </MobileAdminLink>

                                    <MobileAdminLink
                                        to="/admin/catalog"
                                        icon={
                                            <PackageSearch
                                                size={17}
                                            />
                                        }
                                        onNavigate={
                                            () =>
                                                setMobileMenuOpen(
                                                    false,
                                                )
                                        }
                                    >
                                        Catalog
                                    </MobileAdminLink>

                                    <MobileAdminLink
                                        to="/admin/activity"
                                        icon={
                                            <Activity
                                                size={17}
                                            />
                                        }
                                        onNavigate={
                                            () =>
                                                setMobileMenuOpen(
                                                    false,
                                                )
                                        }
                                    >
                                        Activity
                                    </MobileAdminLink>
                                </nav>

                                <button
                                    type="button"
                                    onClick={
                                        handleLogout
                                    }
                                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-900/40 bg-red-950/15 px-4 text-sm font-semibold text-red-300 transition hover:border-red-800/60 hover:bg-red-950/30"
                                >
                                    <LogOut
                                        size={16}
                                    />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )
                }
            </header>

            <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-6 md:px-8 md:py-8">
                {children}
            </div>
        </main>
    )
}

function AdminNavLink({
    to,
    end = false,
    icon,
    children,
}: {
    to: string
    end?: boolean
    icon: ReactNode
    children: ReactNode
}) {

    return (
        <NavLink
            to={
                to
            }
            end={
                end
            }
            className={
                ({
                     isActive,
                 }) =>
                    isActive
                        ? 'relative inline-flex min-h-10 items-center gap-2 rounded-xl border border-sky-900/50 bg-sky-950/30 px-3.5 text-sm font-semibold text-sky-300 shadow-[inset_0_0_20px_rgba(14,165,233,0.03)]'
                        : 'inline-flex min-h-10 items-center gap-2 rounded-xl border border-transparent px-3.5 text-sm font-medium text-slate-500 transition duration-200 hover:border-slate-800 hover:bg-slate-900/60 hover:text-slate-200'
            }
        >
            {icon}

            <span>
                {children}
            </span>
        </NavLink>
    )
}

function MobileAdminLink({
    to,
    end = false,
    icon,
    children,
    onNavigate,
}: {
    to: string
    end?: boolean
    icon: ReactNode
    children: ReactNode
    onNavigate: () => void
}) {

    return (
        <NavLink
            to={
                to
            }
            end={
                end
            }
            onClick={
                onNavigate
            }
            className={
                ({
                     isActive,
                 }) =>
                    isActive
                        ? 'flex min-h-12 items-center gap-3 rounded-xl border border-sky-900/50 bg-sky-950/30 px-4 text-sm font-semibold text-sky-300'
                        : 'flex min-h-12 items-center gap-3 rounded-xl border border-transparent px-4 text-sm font-medium text-slate-500 transition hover:border-slate-800 hover:bg-slate-900/60 hover:text-slate-200'
            }
        >
            {icon}
            <span>
                {children}
            </span>
        </NavLink>
    )
}