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

        logout()

        navigate('/')
    }


    return (
        <main className="min-h-screen bg-slate-950 text-white">

            <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur">

                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                    <div className="flex items-center gap-8">

                        <Link
                            to="/admin"
                            className="flex items-center gap-2 text-lg font-bold tracking-tight"
                        >

                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 font-black text-slate-950">
                                S
                            </span>

                            <span>
                                ShelfRadar
                            </span>

                        </Link>


                        <nav className="hidden items-center gap-1 md:flex">

                            <AdminNavLink
                                to="/admin"
                                end
                                icon={
                                    <LayoutDashboard
                                        size={17}
                                    />
                                }
                            >
                                Dashboard
                            </AdminNavLink>


                            <AdminNavLink
                                to="/admin/stores"
                                icon={
                                    <Store
                                        size={17}
                                    />
                                }
                            >
                                Stores
                            </AdminNavLink>


                            <AdminNavLink
                                to="/admin/catalog"
                                icon={
                                    <PackageSearch
                                        size={17}
                                    />
                                }
                            >
                                Catalog
                            </AdminNavLink>


                            <AdminNavLink
                                to="/admin/activity"
                                icon={
                                    <Activity
                                        size={17}
                                    />
                                }
                            >
                                Activity
                            </AdminNavLink>

                        </nav>

                    </div>


                    <div className="hidden items-center gap-4 md:flex">

                        <div className="text-right">

                            <p className="max-w-48 truncate text-sm font-medium">
                                {
                                    user?.fullName ??
                                    'Administrator'
                                }
                            </p>

                            <p className="text-xs text-slate-500">
                                Administrator
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={
                                handleLogout
                            }
                            className="flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:bg-slate-900 hover:text-white"
                        >
                            <LogOut
                                size={16}
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
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 text-slate-300 md:hidden"
                    >
                        {
                            mobileMenuOpen
                                ? (
                                    <X
                                        size={20}
                                    />
                                )
                                : (
                                    <Menu
                                        size={20}
                                    />
                                )
                        }
                    </button>

                </div>


                {
                    mobileMenuOpen && (

                        <div className="border-t border-slate-800 px-4 py-4 md:hidden">

                            <nav className="space-y-1">

                                <MobileAdminLink
                                    to="/admin"
                                    end
                                    icon={
                                        <LayoutDashboard
                                            size={18}
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
                                            size={18}
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
                                            size={18}
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
                                            size={18}
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


                            <div className="mt-4 border-t border-slate-800 pt-4">

                                <p className="text-sm font-medium">
                                    {
                                        user?.fullName ??
                                        'Administrator'
                                    }
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    Administrator
                                </p>


                                <button
                                    type="button"
                                    onClick={
                                        handleLogout
                                    }
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-300"
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


            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
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
                ({isActive}) =>
                    isActive
                        ? 'flex items-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-sm font-semibold text-white'
                        : 'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white'
            }
        >
            {icon}
            {children}
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
                ({isActive}) =>
                    isActive
                        ? 'flex items-center gap-3 rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white'
                        : 'flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400'
            }
        >
            {icon}
            {children}
        </NavLink>
    )
}