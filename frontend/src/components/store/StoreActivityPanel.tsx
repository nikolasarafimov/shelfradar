import {
    useState,
} from 'react'

import {
    useQuery,
} from '@tanstack/react-query'

import {
    getStoreActivity,
} from '../../api/auditApi'

import AuditRow
    from '../audit/AuditRow'

import EmptyState
    from '../ui/EmptyState'

import ErrorState
    from '../ui/ErrorState'

import LoadingState
    from '../ui/LoadingState'


export default function StoreActivityPanel({
                                               storeId,
                                           }: {
    storeId: number
}) {

    const [
        page,
        setPage,
    ] =
        useState(0)


    const activityQuery =
        useQuery({
            queryKey: [
                'store-activity',
                storeId,
                page,
            ],

            queryFn:
                () =>
                    getStoreActivity(
                        storeId,
                        page,
                        20,
                    ),
        })


    const data =
        activityQuery.data


    return (
        <section
            aria-labelledby="store-activity-heading"
        >

            <div>

                <h2
                    id="store-activity-heading"
                    className="text-xl font-bold tracking-tight sm:text-2xl"
                >
                    Activity History
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                    Review inventory and store-profile changes recorded for this store.
                </p>

            </div>


            {
                activityQuery.isLoading && (

                    <div className="mt-6">

                        <LoadingState
                            message="Loading store activity..."
                        />

                    </div>
                )
            }


            {
                activityQuery.isError && (

                    <div className="mt-6">

                        <ErrorState
                            title="Activity unavailable"
                            message="ShelfRadar could not load the activity history for this store."
                            onRetry={
                                () => {
                                    void activityQuery
                                        .refetch()
                                }
                            }
                        />

                    </div>
                )
            }


            {
                data &&
                !activityQuery.isLoading &&
                !activityQuery.isError && (

                    <>
                        {
                            data.content.length ===
                            0 ? (

                                <div className="mt-6">

                                    <EmptyState
                                        title="No activity recorded"
                                        message="Inventory and store profile changes will appear here as they happen."
                                    />

                                </div>

                            ) : (

                                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

                                    <div className="divide-y divide-slate-800">

                                        {
                                            data.content.map(
                                                entry => (

                                                    <AuditRow
                                                        key={
                                                            entry.id
                                                        }
                                                        entry={
                                                            entry
                                                        }
                                                    />
                                                ),
                                            )
                                        }

                                    </div>


                                    {
                                        data.totalPages >
                                        1 && (

                                            <div className="flex items-center justify-between gap-4 border-t border-slate-800 p-5">

                                                <button
                                                    type="button"
                                                    disabled={
                                                        data.first
                                                    }
                                                    onClick={
                                                        () =>
                                                            setPage(
                                                                current =>
                                                                    Math.max(
                                                                        0,
                                                                        current -
                                                                        1,
                                                                    ),
                                                            )
                                                    }
                                                    className="min-h-10 rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    Previous
                                                </button>


                                                <span className="text-center text-sm text-slate-400">
                                                    Page{' '}
                                                    {
                                                        data.page +
                                                        1
                                                    }{' '}
                                                    of{' '}
                                                    {
                                                        data.totalPages
                                                    }
                                                </span>


                                                <button
                                                    type="button"
                                                    disabled={
                                                        data.last
                                                    }
                                                    onClick={
                                                        () =>
                                                            setPage(
                                                                current =>
                                                                    current +
                                                                    1,
                                                            )
                                                    }
                                                    className="min-h-10 rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    Next
                                                </button>

                                            </div>
                                        )
                                    }

                                </div>
                            )
                        }
                    </>
                )
            }

        </section>
    )
}