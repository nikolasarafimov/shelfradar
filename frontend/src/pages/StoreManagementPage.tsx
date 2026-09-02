import type {
    ReactNode,
} from 'react'

import {
    useState,
} from 'react'

import {
    useQuery,
} from '@tanstack/react-query'

import {
    Activity,
    ArrowLeft,
    Boxes,
    LayoutDashboard,
    LogOut,
    Settings,
} from 'lucide-react'

import {
    Link,
    useNavigate,
    useParams,
} from 'react-router-dom'

import {
    getStore,
} from '../api/storeApi'

import InventoryManager
    from '../components/store/InventoryManager'

import StoreActivityPanel
    from '../components/store/StoreActivityPanel'

import StoreOverview
    from '../components/store/StoreOverview'

import StoreProfileEditor
    from '../components/store/StoreProfileEditor'

import ErrorState
    from '../components/ui/ErrorState'

import LoadingState
    from '../components/ui/LoadingState'

import PageHeader
    from '../components/ui/PageHeader'

import StatusBadge
    from '../components/ui/StatusBadge'

import {
    useAuth,
} from '../features/auth/useAuth'


type StoreTab =
    | 'overview'
    | 'inventory'
    | 'activity'
    | 'profile'


export default function StoreManagementPage() {

    const {
        storeId,
    } =
        useParams()


    const parsedStoreId =
        parseStoreId(
            storeId,
        )


    const [
        activeTab,
        setActiveTab,
    ] =
        useState<StoreTab>(
            'overview',
        )


    const navigate =
        useNavigate()


    const {
        user,
        logout,
    } =
        useAuth()


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
                replace:
                    true,
            },
        )
    }


    if (
        parsedStoreId ===
        null
    ) {

        return (
            <StoreWorkspaceShell
                ownerName={
                    user?.fullName
                }
                onLogout={
                    handleLogout
                }
            >

                <div className="space-y-6">

                    <BackToDashboard />

                    <ErrorState
                        title="Invalid store"
                        message="The store identifier in this URL is not valid."
                    />

                </div>

            </StoreWorkspaceShell>
        )
    }


    if (
        storeQuery.isLoading
    ) {

        return (
            <StoreWorkspaceShell
                ownerName={
                    user?.fullName
                }
                onLogout={
                    handleLogout
                }
            >

                <div className="space-y-6">

                    <BackToDashboard />

                    <LoadingState
                        message="Loading store workspace..."
                    />

                </div>

            </StoreWorkspaceShell>
        )
    }


    if (
        storeQuery.isError ||
        !storeQuery.data
    ) {

        return (
            <StoreWorkspaceShell
                ownerName={
                    user?.fullName
                }
                onLogout={
                    handleLogout
                }
            >

                <div className="space-y-6">

                    <BackToDashboard />

                    <ErrorState
                        title="Store unavailable"
                        message="ShelfRadar could not load this store, or you do not have access to it."
                        onRetry={
                            () => {
                                void storeQuery.refetch()
                            }
                        }
                    />

                </div>

            </StoreWorkspaceShell>
        )
    }


    const store =
        storeQuery.data


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


                <div className="overflow-x-auto">

                    <div
                        role="tablist"
                        aria-label="Store workspace sections"
                        className="premium-card flex min-w-max gap-1 rounded-2xl border border-slate-800/90 bg-slate-900/55 p-1.5 backdrop-blur-xl"
                    >

                        <TabButton
                            active={
                                activeTab ===
                                'overview'
                            }
                            controls="store-overview-panel"
                            onClick={
                                () =>
                                    setActiveTab(
                                        'overview',
                                    )
                            }
                            icon={
                                <LayoutDashboard
                                    size={16}
                                />
                            }
                        >
                            Overview
                        </TabButton>


                        <TabButton
                            active={
                                activeTab ===
                                'inventory'
                            }
                            controls="store-inventory-panel"
                            onClick={
                                () =>
                                    setActiveTab(
                                        'inventory',
                                    )
                            }
                            icon={
                                <Boxes
                                    size={16}
                                />
                            }
                        >
                            Inventory
                        </TabButton>


                        <TabButton
                            active={
                                activeTab ===
                                'activity'
                            }
                            controls="store-activity-panel"
                            onClick={
                                () =>
                                    setActiveTab(
                                        'activity',
                                    )
                            }
                            icon={
                                <Activity
                                    size={16}
                                />
                            }
                        >
                            Activity
                        </TabButton>


                        <TabButton
                            active={
                                activeTab ===
                                'profile'
                            }
                            controls="store-profile-panel"
                            onClick={
                                () =>
                                    setActiveTab(
                                        'profile',
                                    )
                            }
                            icon={
                                <Settings
                                    size={16}
                                />
                            }
                        >
                            Store Profile
                        </TabButton>

                    </div>

                </div>


                {
                    activeTab ===
                    'overview' && (

                        <div
                            id="store-overview-panel"
                            role="tabpanel"
                        >

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

                        </div>
                    )
                }


                {
                    activeTab ===
                    'inventory' && (

                        <div
                            id="store-inventory-panel"
                            role="tabpanel"
                        >

                            <InventoryManager
                                storeId={
                                    parsedStoreId
                                }
                            />

                        </div>
                    )
                }


                {
                    activeTab ===
                    'activity' && (

                        <div
                            id="store-activity-panel"
                            role="tabpanel"
                        >

                            <StoreActivityPanel
                                storeId={
                                    parsedStoreId
                                }
                            />

                        </div>
                    )
                }


                {
                    activeTab ===
                    'profile' && (

                        <div
                            id="store-profile-panel"
                            role="tabpanel"
                        >

                            <StoreProfileEditor
                                store={
                                    store
                                }
                            />

                        </div>
                    )
                }

            </div>

        </StoreWorkspaceShell>
    )
}


function TabButton({
                       active,
                       controls,
                       onClick,
                       icon,
                       children,
                   }: {
    active: boolean
    controls: string
    onClick: () => void
    icon: ReactNode
    children: ReactNode
}) {

    return (
        <button
            type="button"
            role="tab"
            aria-selected={
                active
            }
            aria-controls={
                controls
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
                    ? 'inline-flex min-h-10 items-center gap-2 rounded-xl border border-sky-900/50 bg-sky-950/35 px-4 text-sm font-semibold text-sky-300'
                    : 'inline-flex min-h-10 items-center gap-2 rounded-xl border border-transparent px-4 text-sm font-medium text-slate-500 transition hover:border-slate-800 hover:bg-slate-800/50 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500'
            }
        >

            {icon}

            <span>
                {children}
            </span>

        </button>
    )
}


function BackToDashboard() {

    return (
        <Link
            to="/store"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >

            <ArrowLeft
                size={16}
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
        <main className="relative min-h-dvh overflow-x-clip bg-[#020817] text-white">

            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 overflow-hidden"
            >

                <div className="animate-glow-drift absolute left-1/2 top-[-280px] h-[580px] w-[880px] -translate-x-1/2 rounded-full bg-sky-500/[0.065] blur-[150px]" />

                <div className="animate-glow-drift absolute -left-56 top-[430px] h-[430px] w-[430px] rounded-full bg-cyan-500/[0.025] blur-[135px] [animation-delay:900ms]" />


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


            <header className="sticky top-0 z-50 border-b border-slate-900/90 bg-[#020817]/90 backdrop-blur-xl">

                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">

                    <Link
                        to="/store"
                        aria-label="ShelfRadar Store Owner dashboard"
                        className="group flex min-w-0 items-center gap-3"
                    >

                        <img
                            src="/shelfradar-logo.png"
                            alt="ShelfRadar"
                            className="h-14 w-auto object-contain drop-shadow-[0_0_18px_rgba(56,189,248,0.1)] transition duration-300 group-hover:scale-[1.025]"
                        />


                        <span className="hidden rounded-full border border-sky-900/50 bg-sky-950/25 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-sky-400 md:inline-flex">
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


                            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-600">
                                Store Owner
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={
                                onLogout
                            }
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/50 px-3.5 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                        >

                            <LogOut
                                size={15}
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

function parseStoreId(
    value: string | undefined,
): number | null {

    if (
        !value
    ) {
        return null
    }

    const parsed =
        Number(
            value,
        )

    return Number.isInteger(
        parsed,
    ) &&
    parsed >
    0
        ? parsed
        : null
}