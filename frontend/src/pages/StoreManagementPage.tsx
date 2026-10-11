import {
    useState,
} from 'react'

import type {
    KeyboardEvent,
    ReactNode,
} from 'react'

import {
    useQuery,
} from '@tanstack/react-query'

import {
    AnimatePresence,
    motion,
} from 'motion/react'

import {
    Activity,
    ArrowLeft,
    Boxes,
    LayoutDashboard,
    LogOut,
    Settings,
} from 'lucide-react'

import type {
    LucideIcon,
} from 'lucide-react'

import {
    Link,
    useNavigate,
    useParams,
} from 'react-router-dom'

import {
    getStore,
} from '../api/storeApi'

import InventoryManager from '../components/store/InventoryManager'
import StoreActivityPanel from '../components/store/StoreActivityPanel'
import StoreOverview from '../components/store/StoreOverview'
import StoreProfileEditor from '../components/store/StoreProfileEditor'

import ErrorState from '../components/ui/ErrorState'
import LoadingState from '../components/ui/LoadingState'
import PageHeader from '../components/ui/PageHeader'
import StatusBadge from '../components/ui/StatusBadge'

import {
    useAuth,
} from '../features/auth/authContext'

type StoreTab =
    | 'overview'
    | 'inventory'
    | 'activity'
    | 'profile'

interface StoreTabDefinition {
    id: StoreTab
    label: string
    panelId: string
    icon: LucideIcon
}

const STORE_TABS: StoreTabDefinition[] = [
    {
        id: 'overview',
        label: 'Overview',
        panelId: 'store-overview-panel',
        icon: LayoutDashboard,
    },
    {
        id: 'inventory',
        label: 'Inventory',
        panelId: 'store-inventory-panel',
        icon: Boxes,
    },
    {
        id: 'activity',
        label: 'Activity',
        panelId: 'store-activity-panel',
        icon: Activity,
    },
    {
        id: 'profile',
        label: 'Store profile',
        panelId: 'store-profile-panel',
        icon: Settings,
    },
]

export default function StoreManagementPage() {
    const {
        storeId,
    } = useParams()

    const parsedStoreId =
        parseStoreId(
            storeId,
        )

    const [
        activeTab,
        setActiveTab,
    ] = useState<StoreTab>(
        'overview',
    )

    const navigate =
        useNavigate()

    const {
        user,
        logout,
    } = useAuth()

    const storeQuery =
        useQuery({
            queryKey: [
                'store',
                parsedStoreId,
            ],

            queryFn:
                () =>
                    getStore(
                        parsedStoreId!,
                    ),

            enabled:
                parsedStoreId !==
                null,
        })

    function handleLogout() {
        logout()

        navigate(
            '/',
            {
                replace: true,
            },
        )
    }

    function handleTabKeyDown(
        event: KeyboardEvent<HTMLDivElement>,
    ) {
        if (
            event.key !== 'ArrowLeft' &&
            event.key !== 'ArrowRight' &&
            event.key !== 'Home' &&
            event.key !== 'End'
        ) {
            return
        }

        event.preventDefault()

        const currentIndex =
            STORE_TABS.findIndex(
                tab =>
                    tab.id ===
                    activeTab,
            )

        let nextIndex =
            currentIndex

        if (
            event.key ===
            'ArrowRight'
        ) {
            nextIndex =
                (
                    currentIndex +
                    1
                ) %
                STORE_TABS.length
        }

        if (
            event.key ===
            'ArrowLeft'
        ) {
            nextIndex =
                (
                    currentIndex -
                    1 +
                    STORE_TABS.length
                ) %
                STORE_TABS.length
        }

        if (
            event.key ===
            'Home'
        ) {
            nextIndex = 0
        }

        if (
            event.key ===
            'End'
        ) {
            nextIndex =
                STORE_TABS.length -
                1
        }

        const nextTab =
            STORE_TABS[
                nextIndex
                ]

        setActiveTab(
            nextTab.id,
        )

        window.requestAnimationFrame(
            () => {
                document
                    .getElementById(
                        `store-tab-${nextTab.id}`,
                    )
                    ?.focus()
            },
        )
    }

    const store =
        storeQuery.data

    const activeTabDefinition =
        STORE_TABS.find(
            tab =>
                tab.id ===
                activeTab,
        ) ??
        STORE_TABS[0]

    return (
        <StoreWorkspaceShell
            ownerName={
                user?.fullName
            }
            onLogout={
                handleLogout
            }
        >
            <div className="space-y-8">
                <BackToDashboard />

                {parsedStoreId === null && (
                    <ErrorState
                        title="Invalid store"
                        message="The store identifier in this URL is not valid."
                    />
                )}

                {parsedStoreId !== null &&
                    storeQuery.isLoading && (
                        <LoadingState
                            message="Loading store workspace..."
                        />
                    )}

                {parsedStoreId !== null &&
                    !storeQuery.isLoading &&
                    (
                        storeQuery.isError ||
                        !store
                    ) && (
                        <ErrorState
                            title="Store unavailable"
                            message="ShelfRadar could not load this store, or you do not have access to it."
                            onRetry={
                                () => {
                                    void storeQuery.refetch()
                                }
                            }
                        />
                    )}

                {parsedStoreId !== null &&
                    store &&
                    !storeQuery.isLoading &&
                    !storeQuery.isError && (
                        <>
                            <PageHeader
                                eyebrow="Store Workspace"
                                title={
                                    store.name
                                }
                                description={
                                    `${store.address}, ${store.city}`
                                }
                                actions={
                                    <StatusBadge
                                        status={
                                            store.status
                                        }
                                    />
                                }
                            />

                            <div className="-mx-1 overflow-x-auto px-1 pb-1">
                                <div
                                    role="tablist"
                                    aria-label="Store workspace sections"
                                    onKeyDown={
                                        handleTabKeyDown
                                    }
                                    className="premium-card flex min-w-max gap-1 rounded-2xl p-1.5"
                                >
                                    {STORE_TABS.map(
                                        tab => (
                                            <TabButton
                                                key={
                                                    tab.id
                                                }
                                                tab={
                                                    tab
                                                }
                                                active={
                                                    activeTab ===
                                                    tab.id
                                                }
                                                onClick={
                                                    () =>
                                                        setActiveTab(
                                                            tab.id,
                                                        )
                                                }
                                            />
                                        ),
                                    )}
                                </div>
                            </div>

                            <AnimatePresence
                                mode="wait"
                                initial={false}
                            >
                                <motion.div
                                    key={
                                        activeTab
                                    }
                                    id={
                                        activeTabDefinition.panelId
                                    }
                                    role="tabpanel"
                                    aria-labelledby={
                                        `store-tab-${activeTab}`
                                    }
                                    tabIndex={0}
                                    initial={{
                                        opacity: 0,
                                        y: 8,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: -4,
                                    }}
                                    transition={{
                                        duration: 0.22,
                                        ease: [
                                            0.16,
                                            1,
                                            0.3,
                                            1,
                                        ],
                                    }}
                                    className="outline-none"
                                >
                                    {activeTab ===
                                        'overview' && (
                                            <StoreOverview
                                                storeId={
                                                    parsedStoreId
                                                }
                                                onManageInventory={
                                                    () =>
                                                        setActiveTab(
                                                            'inventory',
                                                        )
                                                }
                                                onEditProfile={
                                                    () =>
                                                        setActiveTab(
                                                            'profile',
                                                        )
                                                }
                                            />
                                        )}

                                    {activeTab ===
                                        'inventory' && (
                                            <InventoryManager
                                                storeId={
                                                    parsedStoreId
                                                }
                                            />
                                        )}

                                    {activeTab ===
                                        'activity' && (
                                            <StoreActivityPanel
                                                storeId={
                                                    parsedStoreId
                                                }
                                            />
                                        )}

                                    {activeTab ===
                                        'profile' && (
                                            <StoreProfileEditor
                                                store={
                                                    store
                                                }
                                            />
                                        )}
                                </motion.div>
                            </AnimatePresence>
                        </>
                    )}
            </div>
        </StoreWorkspaceShell>
    )
}

function TabButton({
                       tab,
                       active,
                       onClick,
                   }: {
    tab: StoreTabDefinition
    active: boolean
    onClick: () => void
}) {
    const Icon =
        tab.icon

    return (
        <button
            id={
                `store-tab-${tab.id}`
            }
            type="button"
            role="tab"
            aria-selected={
                active
            }
            aria-controls={
                tab.panelId
            }
            tabIndex={
                active
                    ? 0
                    : -1
            }
            onClick={
                onClick
            }
            className={
                active
                    ? 'relative inline-flex min-h-10 items-center gap-2 overflow-hidden rounded-xl border border-sky-300/15 bg-sky-300/[0.08] px-4 text-sm font-semibold text-sky-300 shadow-[0_8px_25px_rgba(14,165,233,0.06)]'
                    : 'inline-flex min-h-10 items-center gap-2 rounded-xl border border-transparent px-4 text-sm font-medium text-slate-500 transition duration-200 hover:border-slate-800/80 hover:bg-slate-800/45 hover:text-slate-200'
            }
        >
            {active && (
                <motion.span
                    layoutId="store-active-tab"
                    aria-hidden="true"
                    className="absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-sky-300/80 to-transparent"
                />
            )}

            <Icon
                className="relative size-4"
                strokeWidth={1.8}
                aria-hidden="true"
            />

            <span className="relative">
                {tab.label}
            </span>
        </button>
    )
}

function BackToDashboard() {
    return (
        <Link
            to="/store"
            className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-500 transition duration-200 hover:text-sky-300"
        >
            <ArrowLeft
                className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                aria-hidden="true"
            />

            Back to dashboard
        </Link>
    )
}

function StoreWorkspaceShell({
                                 ownerName,
                                 onLogout,
                                 children,
                             }: {
    ownerName?: string
    onLogout: () => void
    children: ReactNode
}) {
    return (
        <main className="relative min-h-dvh overflow-x-clip bg-slate-950 text-white">
            <StoreWorkspaceBackground />

            <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/85 backdrop-blur-2xl">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
                    <Link
                        to="/store"
                        aria-label="ShelfRadar Store Owner dashboard"
                        className="group flex min-w-0 items-center gap-3"
                    >
                        <img
                            src="/shelfradar-logo.png"
                            alt="ShelfRadar"
                            className="h-13 w-auto object-contain drop-shadow-[0_0_18px_rgba(56,189,248,0.08)] transition duration-300 group-hover:scale-[1.025]"
                        />

                        <span className="hidden rounded-full border border-sky-300/10 bg-sky-300/[0.055] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-sky-300 md:inline-flex">
                            Store Owner
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="hidden max-w-52 text-right sm:block">
                            <p className="truncate text-sm font-semibold text-slate-200">
                                {
                                    ownerName ??
                                    'Store Owner'
                                }
                            </p>

                            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-600">
                                Store Owner
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={
                                onLogout
                            }
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/50 px-3.5 text-sm font-medium text-slate-300 transition duration-200 hover:border-slate-600 hover:bg-slate-800/70 hover:text-white"
                        >
                            <LogOut
                                className="size-4"
                                aria-hidden="true"
                            />

                            <span className="hidden sm:inline">
                                Logout
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="relative z-10 mx-auto max-w-7xl px-5 py-7 md:px-8 md:py-8">
                {children}
            </div>
        </main>
    )
}

function StoreWorkspaceBackground() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 overflow-hidden"
        >
            <div className="animate-glow-drift absolute left-1/2 top-[-280px] h-[580px] w-[880px] -translate-x-1/2 rounded-full bg-sky-400/[0.06] blur-[150px] motion-reduce:animate-none" />

            <div className="animate-glow-drift absolute -left-56 top-[430px] size-[430px] rounded-full bg-cyan-400/[0.025] blur-[135px] [animation-delay:900ms] motion-reduce:animate-none" />

            <div
                className="absolute inset-0 opacity-[0.022]"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(148,163,184,0.28) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.28) 1px, transparent 1px)',

                    backgroundSize:
                        '46px 46px',
                }}
            />
        </div>
    )
}

function parseStoreId(
    value: string | undefined,
): number | null {
    if (!value) {
        return null
    }

    const parsed =
        Number(
            value,
        )

    return Number.isInteger(
        parsed,
    ) &&
    parsed > 0
        ? parsed
        : null
}