import type {
    ReactNode,
} from 'react'

import {
    LayoutDashboard,
    LogOut,
    PackageSearch,
    Store,
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

    const {
        user,
        logout,
    } = useAuth()


    function handleLogout() {

        logout()

        navigate('/')
    }


    return (
        <main className="min-h-screen bg-slate-950 text-white">

            <header className="border-b border-slate-800 bg-slate-950">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">

                    <Link
                        to="/admin"
                        className="text-xl font-bold tracking-tight"
                    >
                        ShelfRadar
                    </Link>


                    <div className="flex items-center gap-4">

                        <div className="hidden text-right sm:block">

                            <p className="text-sm font-medium">
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
                            className="flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white"
                        >
                            <LogOut
                                size={16}
                            />

                            Logout
                        </button>

                    </div>

                </div>


                <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 md:px-8">

                    <NavigationLink
                        to="/admin"
                        end
                        icon={
                            <LayoutDashboard
                                size={17}
                            />
                        }
                    >
                        Dashboard
                    </NavigationLink>

                    <NavigationLink
                        to="/admin/stores"
                        icon={
                            <Store
                                size={17}
                            />
                        }
                    >
                        Stores
                    </NavigationLink>

                    <NavigationLink
                        to="/admin/catalog"
                        icon={
                            <PackageSearch
                                size={17}
                            />
                        }
                    >
                        Catalog
                    </NavigationLink>

                </nav>

            </header>


            <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
                {children}
            </div>

        </main>
    )
}


function NavigationLink({
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
            to={to}
            end={end}
            className={
                ({isActive}) =>
                    isActive
                        ? 'flex shrink-0 items-center gap-2 border-b-2 border-sky-400 px-4 py-4 text-sm font-semibold text-white'
                        : 'flex shrink-0 items-center gap-2 border-b-2 border-transparent px-4 py-4 text-sm font-medium text-slate-500 transition hover:text-slate-300'
            }
        >
            {icon}
            {children}
        </NavLink>
    )
}