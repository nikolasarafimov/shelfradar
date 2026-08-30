import {
    useState,
} from 'react'

import {
    Link,
    useParams,
} from 'react-router-dom'

import {
    useQuery,
} from '@tanstack/react-query'

import {
    getStore,
} from '../api/storeApi'

import InventoryManager
    from '../components/store/InventoryManager'

import StoreProfileEditor
    from '../components/store/StoreProfileEditor'

type Tab =
    | 'inventory'
    | 'profile'

export default function StoreManagementPage() {

    const params =
        useParams()

    const storeId =
        Number(
            params.storeId,
        )

    const [tab, setTab] =
        useState<Tab>(
            'inventory',
        )

    const storeQuery =
        useQuery({
            queryKey: [
                'store',
                storeId,
            ],

            queryFn:
                () =>
                    getStore(
                        storeId,
                    ),

            enabled:
                Number.isFinite(
                    storeId,
                ),
        })

    if (
        !Number.isFinite(storeId)
    ) {

        return (
            <p>
                Invalid store.
            </p>
        )
    }

    return (
        <main className="min-h-screen bg-slate-950 px-5 py-8 text-white md:px-8">

            <div className="mx-auto max-w-7xl">

                <Link
                    to="/store"
                    className="text-sm text-slate-400 hover:text-white"
                >
                    ← Store Dashboard
                </Link>

                {
                    storeQuery.isLoading && (
                        <p className="mt-8 text-slate-400">
                            Loading store...
                        </p>
                    )
                }

                {
                    storeQuery.isError && (
                        <p className="mt-8 text-red-400">
                            Store not found or access denied.
                        </p>
                    )
                }

                {
                    storeQuery.data && (

                        <>

                            <header className="mt-8">

                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">
                                    Store Management
                                </p>

                                <h1 className="mt-2 text-4xl font-bold">
                                    {
                                        storeQuery
                                            .data
                                            .name
                                    }
                                </h1>

                                <p className="mt-2 text-slate-400">
                                    {
                                        storeQuery
                                            .data
                                            .address
                                    }
                                    ,{' '}
                                    {
                                        storeQuery
                                            .data
                                            .city
                                    }
                                </p>

                            </header>

                            <div className="mt-8 flex gap-2 border-b border-slate-800">

                                <button
                                    onClick={
                                        () =>
                                            setTab(
                                                'inventory',
                                            )
                                    }
                                    className={
                                        tab ===
                                        'inventory'
                                            ? 'border-b-2 border-sky-400 px-4 py-3'
                                            : 'px-4 py-3 text-slate-400'
                                    }
                                >
                                    Inventory
                                </button>

                                <button
                                    onClick={
                                        () =>
                                            setTab(
                                                'profile',
                                            )
                                    }
                                    className={
                                        tab ===
                                        'profile'
                                            ? 'border-b-2 border-sky-400 px-4 py-3'
                                            : 'px-4 py-3 text-slate-400'
                                    }
                                >
                                    Store Profile
                                </button>

                            </div>

                            <div className="mt-8">

                                {
                                    tab ===
                                    'inventory'
                                        ? (
                                            <InventoryManager
                                                storeId={
                                                    storeId
                                                }
                                            />
                                        )
                                        : (
                                            <StoreProfileEditor
                                                store={
                                                    storeQuery.data
                                                }
                                            />
                                        )
                                }

                            </div>

                        </>
                    )
                }

            </div>

        </main>
    )
}