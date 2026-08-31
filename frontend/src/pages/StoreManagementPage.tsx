import {
    useState,
} from 'react'

import type {
    ReactNode,
} from 'react'

import {
    useQuery,
} from '@tanstack/react-query'

import {
    Activity,
    ArrowLeft,
    Boxes,
    LayoutDashboard,
    Settings,
} from 'lucide-react'

import {
    Link,
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
                parsedStoreId !== null,
        })


    if (
        parsedStoreId ===
        null
    ) {

        return (
            <StoreWorkspaceShell>

                <ErrorState
                    title="Invalid store"
                    message="The store identifier in this URL is not valid."
                />

            </StoreWorkspaceShell>
        )
    }


    if (
        storeQuery.isLoading
    ) {

        return (
            <StoreWorkspaceShell>

                <LoadingState
                    message="Loading store workspace..."
                />

            </StoreWorkspaceShell>
        )
    }


    if (
        storeQuery.isError ||
        !storeQuery.data
    ) {

        return (
            <StoreWorkspaceShell>

                <ErrorState
                    title="Store unavailable"
                    message="ShelfRadar could not load this store, or you do not have access to it."
                    onRetry={
                        () => {
                            void storeQuery
                                .refetch()
                        }
                    }
                />

            </StoreWorkspaceShell>
        )
    }


    const store =
        storeQuery.data


    return (
        <StoreWorkspaceShell>

            <Link
                to="/store"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
                <ArrowLeft
                    size={17}
                />

                Back to dashboard
            </Link>


            <div className="mt-6">

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

            </div>


            <div className="mt-8 overflow-x-auto">

                <div className="flex min-w-max gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1">

                    <TabButton
                        active={
                            activeTab ===
                            'overview'
                        }
                        onClick={
                            () =>
                                setActiveTab(
                                    'overview',
                                )
                        }
                        icon={
                            <LayoutDashboard
                                size={17}
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
                        onClick={
                            () =>
                                setActiveTab(
                                    'inventory',
                                )
                        }
                        icon={
                            <Boxes
                                size={17}
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
                        onClick={
                            () =>
                                setActiveTab(
                                    'activity',
                                )
                        }
                        icon={
                            <Activity
                                size={17}
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
                        onClick={
                            () =>
                                setActiveTab(
                                    'profile',
                                )
                        }
                        icon={
                            <Settings
                                size={17}
                            />
                        }
                    >
                        Store Profile
                    </TabButton>

                </div>

            </div>


            <div className="mt-6">

                {
                    activeTab ===
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
                    )
                }


                {
                    activeTab ===
                    'inventory' && (

                        <InventoryManager
                            storeId={
                                parsedStoreId
                            }
                        />
                    )
                }


                {
                    activeTab ===
                    'activity' && (

                        <StoreActivityPanel
                            storeId={
                                parsedStoreId
                            }
                        />
                    )
                }


                {
                    activeTab ===
                    'profile' && (

                        <StoreProfileEditor
                            store={
                                store
                            }
                        />
                    )
                }

            </div>

        </StoreWorkspaceShell>
    )
}


function TabButton({
                       active,
                       onClick,
                       icon,
                       children,
                   }: {
    active: boolean
    onClick: () => void
    icon: ReactNode
    children: ReactNode
}) {

    return (
        <button
            type="button"
            aria-pressed={
                active
            }
            onClick={
                onClick
            }
            className={
                active
                    ? 'inline-flex min-h-10 items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white'
                    : 'inline-flex min-h-10 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500'
            }
        >
            {icon}
            {children}
        </button>
    )
}


function StoreWorkspaceShell({
                                 children,
                             }: {
    children: ReactNode
}) {

    return (
        <main className="min-h-screen bg-slate-950 text-white">

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                {children}
            </div>

        </main>
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