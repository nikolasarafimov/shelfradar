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
        <section>

            <div>

                <h2 className="text-xl font-bold">
                    Activity History
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                    Historical changes recorded for this store.
                </p>

            </div>


            {
                activityQuery.isLoading && (

                    <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
                        Loading activity...
                    </div>
                )
            }


            {
                activityQuery.isError && (

                    <div className="mt-5 rounded-2xl border border-red-900/50 bg-red-950/30 p-6 text-red-300">
                        Unable to load store activity.
                    </div>
                )
            }


            {
                data && (

                    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

                        {
                            data.content.length ===
                            0 ? (

                                <div className="p-10 text-center text-slate-500">
                                    No activity has been recorded yet.
                                </div>

                            ) : (

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
                            )
                        }


                        {
                            data.totalPages >
                            1 && (

                                <div className="flex items-center justify-between border-t border-slate-800 p-5">

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
                                        className="rounded-xl border border-slate-700 px-4 py-2 disabled:opacity-40"
                                    >
                                        Previous
                                    </button>


                                    <span className="text-sm text-slate-400">
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
                                        className="rounded-xl border border-slate-700 px-4 py-2 disabled:opacity-40"
                                    >
                                        Next
                                    </button>

                                </div>
                            )
                        }

                    </div>
                )
            }

        </section>
    )
}