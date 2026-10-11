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

import type {
    LucideIcon,
} from 'lucide-react'

import {
    Link,
    NavLink,
    useNavigate,
} from 'react-router-dom'

import {
    AnimatePresence,
    motion,
} from 'motion/react'

import {
    useAuth,
} from '../../features/auth/authContext'

interface AdminLayoutProps {
    children: ReactNode
}

interface NavigationItem {
    to: string
    label: string
    icon: LucideIcon
    end?: boolean
}

const navigationItems: NavigationItem[] = [
    {
        to: '/admin',
        label: 'Dashboard',
        icon: LayoutDashboard,
        end: true,
    },
    {
        to: '/admin/stores',
        label: 'Stores',
        icon: Store,
    },
    {
        to: '/admin/catalog',
        label: 'Catalog',
        icon: PackageSearch,
    },
    {
        to: '/admin/activity',
        label: 'Activity',
        icon: Activity,
    },
]

export default function AdminLayout({
                                        children,
                                    }: AdminLayoutProps) {
    const navigate =
        useNavigate()

    const [
        mobileMenuOpen,
        setMobileMenuOpen,
    ] = useState(false)

    const {
        user,
        logout,
    } = useAuth()

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
        <main className="relative min-h-dvh overflow-x-clip text-slate-50">
            <AdminBackground />

            <header className="sticky top-0 z-50 border-b border-slate-800/70 bg-[#05080f]/82 backdrop-blur-2xl">
                <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 md:px-8">
                    <div className="flex min-w-0 items-center gap-7">
                        <Link
                            to="/admin"
                            aria-label="ShelfRadar admin dashboard"
                            className="group flex shrink-0 items-center gap-3"
                        >
                            <img
                                src="/shelfradar-logo.png"
                                alt="ShelfRadar"
                                className="h-11 w-auto object-contain drop-shadow-[0_0_20px_rgba(56,189,248,0.08)] transition-transform duration-300 group-hover:scale-[1.02]"
                            />

                            <span className="hidden items-center gap-1.5 rounded-full bg-sky-300/[0.07] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-sky-300 ring-1 ring-inset ring-sky-300/15 xl:inline-flex">
                                <ShieldCheck
                                    className="size-3"
                                    aria-hidden="true"
                                />

                                Admin
                            </span>
                        </Link>

                        <nav
                            aria-label="Admin navigation"
                            className="hidden items-center gap-1 lg:flex"
                        >
                            {navigationItems.map(
                                item => (
                                    <AdminNavLink
                                        key={item.to}
                                        item={item}
                                    />
                                ),
                            )}
                        </nav>
                    </div>

                    <div className="hidden items-center gap-3 lg:flex">
                        <div className="border-r border-slate-800/80 pr-4 text-right">
                            <p className="max-w-44 truncate text-sm font-semibold text-slate-200">
                                {
                                    user?.fullName ??
                                    'Administrator'
                                }
                            </p>

                            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-600">
                                Administrator
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="group inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-700/70 bg-slate-900/40 px-3.5 text-sm font-medium text-slate-400 transition duration-200 hover:border-rose-300/15 hover:bg-rose-300/[0.06] hover:text-rose-300"
                        >
                            <LogOut
                                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                                aria-hidden="true"
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
                        aria-expanded={mobileMenuOpen}
                        onClick={
                            () =>
                                setMobileMenuOpen(
                                    current =>
                                        !current,
                                )
                        }
                        className="flex size-10 items-center justify-center rounded-xl border border-slate-700/70 bg-slate-900/45 text-slate-300 transition duration-200 hover:border-slate-600 hover:bg-slate-800/70 hover:text-white lg:hidden"
                    >
                        <AnimatePresence
                            mode="wait"
                            initial={false}
                        >
                            {mobileMenuOpen ? (
                                <motion.span
                                    key="close"
                                    initial={{
                                        opacity: 0,
                                        rotate: -45,
                                        scale: 0.8,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        rotate: 0,
                                        scale: 1,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        rotate: 45,
                                        scale: 0.8,
                                    }}
                                    transition={{
                                        duration: 0.15,
                                    }}
                                >
                                    <X
                                        className="size-[18px]"
                                        aria-hidden="true"
                                    />
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="menu"
                                    initial={{
                                        opacity: 0,
                                        rotate: 45,
                                        scale: 0.8,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        rotate: 0,
                                        scale: 1,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        rotate: -45,
                                        scale: 0.8,
                                    }}
                                    transition={{
                                        duration: 0.15,
                                    }}
                                >
                                    <Menu
                                        className="size-[18px]"
                                        aria-hidden="true"
                                    />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>

                <AnimatePresence initial={false}>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                height: 0,
                            }}
                            animate={{
                                opacity: 1,
                                height: 'auto',
                            }}
                            exit={{
                                opacity: 0,
                                height: 0,
                            }}
                            transition={{
                                duration: 0.24,
                                ease: [
                                    0.16,
                                    1,
                                    0.3,
                                    1,
                                ],
                            }}
                            className="overflow-hidden border-t border-slate-800/70 bg-[#05080f]/96 backdrop-blur-2xl lg:hidden"
                        >
                            <div className="mx-auto max-w-7xl px-5 py-4 md:px-8">
                                <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/40 p-4">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-200">
                                            {
                                                user?.fullName ??
                                                'Administrator'
                                            }
                                        </p>

                                        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-sky-300">
                                            Administrator
                                        </p>
                                    </div>

                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-300/[0.07] text-sky-300">
                                        <ShieldCheck
                                            className="size-[18px]"
                                            aria-hidden="true"
                                        />
                                    </div>
                                </div>

                                <nav
                                    aria-label="Mobile admin navigation"
                                    className="grid gap-1 sm:grid-cols-2"
                                >
                                    {navigationItems.map(
                                        item => (
                                            <MobileAdminLink
                                                key={item.to}
                                                item={item}
                                                onNavigate={
                                                    () =>
                                                        setMobileMenuOpen(
                                                            false,
                                                        )
                                                }
                                            />
                                        ),
                                    )}
                                </nav>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-rose-300/10 bg-rose-300/[0.05] px-4 text-sm font-medium text-rose-300 transition duration-200 hover:border-rose-300/20 hover:bg-rose-300/[0.08]"
                                >
                                    <LogOut
                                        className="size-4"
                                        aria-hidden="true"
                                    />

                                    Logout
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <motion.div
                initial={{
                    opacity: 0,
                    y: 8,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.35,
                    ease: [
                        0.16,
                        1,
                        0.3,
                        1,
                    ],
                }}
                className="relative z-10 mx-auto w-full max-w-7xl px-5 py-6 md:px-8 md:py-8"
            >
                {children}
            </motion.div>
        </main>
    )
}

function AdminBackground() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 overflow-hidden"
        >
            <div className="absolute left-1/2 top-[-330px] h-[650px] w-[920px] -translate-x-1/2 rounded-full bg-sky-400/[0.055] blur-[160px]" />

            <div className="absolute -right-64 top-1/3 size-[520px] rounded-full bg-emerald-400/[0.025] blur-[150px]" />

            <div
                className="absolute inset-0 opacity-[0.018]"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(148,163,184,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.25) 1px, transparent 1px)',

                    backgroundSize:
                        '48px 48px',
                }}
            />

            <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-sky-400/[0.018] to-transparent" />
        </div>
    )
}

function AdminNavLink({
                          item,
                      }: {
    item: NavigationItem
}) {
    const Icon =
        item.icon

    return (
        <NavLink
            to={item.to}
            end={item.end}
            className={
                ({
                     isActive,
                 }) =>
                    isActive
                        ? 'relative inline-flex min-h-10 items-center gap-2 rounded-xl border border-sky-300/15 bg-sky-300/[0.07] px-3.5 text-sm font-semibold text-sky-300 shadow-[inset_0_0_20px_rgba(56,189,248,0.025)]'
                        : 'inline-flex min-h-10 items-center gap-2 rounded-xl border border-transparent px-3.5 text-sm font-medium text-slate-500 transition duration-200 hover:border-slate-800/80 hover:bg-slate-900/50 hover:text-slate-200'
            }
        >
            <Icon
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
            />

            <span>
                {item.label}
            </span>
        </NavLink>
    )
}

function MobileAdminLink({
                             item,
                             onNavigate,
                         }: {
    item: NavigationItem
    onNavigate: () => void
}) {
    const Icon =
        item.icon

    return (
        <NavLink
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={
                ({
                     isActive,
                 }) =>
                    isActive
                        ? 'flex min-h-12 items-center gap-3 rounded-xl border border-sky-300/15 bg-sky-300/[0.07] px-4 text-sm font-semibold text-sky-300'
                        : 'flex min-h-12 items-center gap-3 rounded-xl border border-transparent px-4 text-sm font-medium text-slate-500 transition duration-200 hover:border-slate-800/80 hover:bg-slate-900/50 hover:text-slate-200'
            }
        >
            <Icon
                className="size-[18px]"
                strokeWidth={1.8}
                aria-hidden="true"
            />

            <span>
                {item.label}
            </span>
        </NavLink>
    )
}