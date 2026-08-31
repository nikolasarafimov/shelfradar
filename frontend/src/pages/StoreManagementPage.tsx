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

import StoreOverview
    from '../components/store/StoreOverview'

import StoreProfileEditor
    from '../components/store/StoreProfileEditor'

import StoreActivityPanel
    from '../components/store/StoreActivityPanel'


type StoreTab =
    | 'overview'
    | 'inventory'
    | 'activity'
    | 'profile'


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
        parsedStoreId === null
    ) {

        return (
            <StoreError />
        )
    }


    if (storeQuery.isLoading) {

        return (
            <main className="min-h-screen bg-slate-950 p-10 text-center text-slate-400">
                Loading store...
            </main>
        )
    }


    if (
        storeQuery.isError ||
        !storeQuery.data
    ) {

        return (
            <StoreError />
        )
    }


    const store =
        storeQuery.data


    return (
        <main className="min-h-screen bg-slate-950 text-white">

            <header className="border-b border-slate-800">

                <div className="mx-auto max-w-7xl px-5 py-5 md:px-8">

                    <Link
                        to="/store"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
                    >
                        <ArrowLeft
                            size={17}
                        />

                        Back to dashboard
                    </Link>

                </div>

            </header>


            <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">

                <section>

                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

                        <div>

                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-400">
                                Store Workspace
                            </p>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight">
                                {
                                    store.name
                                }
                            </h1>

                            <p className="mt-2 text-sm text-slate-400">
                                {
                                    store.address
                                }
                                ,{' '}
                                {
                                    store.city
                                }
                            </p>

                        </div>


                        <StoreStatusBadge
                            status={
                                store.status
                            }
                        />

                    </div>

                </section>


                <nav className="mt-8 flex overflow-x-auto border-b border-slate-800">

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

                </nav>


                <section className="py-8">

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
                        'profile' && (

                            <StoreProfileEditor
                                store={
                                    store
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

                </section>

            </div>

        </main>
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
    icon: React.ReactNode
    children: React.ReactNode
}) {

    return (
        <button
            type="button"
            onClick={
                onClick
            }
            className={
                active
                    ? 'flex shrink-0 items-center gap-2 border-b-2 border-sky-400 px-5 py-4 text-sm font-semibold text-white'
                    : 'flex shrink-0 items-center gap-2 border-b-2 border-transparent px-5 py-4 text-sm font-medium text-slate-500 transition hover:text-slate-300'
            }
        >
            {icon}
            {children}
        </button>
    )
}


function StoreStatusBadge({
                              status,
                          }: {
    status:
        | 'PENDING'
        | 'ACTIVE'
        | 'INACTIVE'
}) {

    const styles =
        status === 'ACTIVE'
            ? 'bg-emerald-950 text-emerald-300 ring-emerald-700'
            : status === 'PENDING'
                ? 'bg-amber-950 text-amber-300 ring-amber-700'
                : 'bg-slate-800 text-slate-400 ring-slate-700'


    return (
        <span
            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles}`}
        >
            {status}
        </span>
    )
}


function StoreError() {

    return (
        <main className="min-h-screen bg-slate-950 p-10 text-center text-white">

            <h1 className="text-2xl font-bold">
                Store not found
            </h1>

            <p className="mt-2 text-slate-400">
                The store does not exist or does not belong to your account.
            </p>

            <Link
                to="/store"
                className="mt-5 inline-block text-sm font-semibold text-sky-400"
            >
                Return to dashboard
            </Link>

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
        Number(value)

    if (
        !Number.isInteger(parsed) ||
        parsed <= 0
    ) {
        return null
    }

    return parsed
}