import {
    useState,
} from 'react'

import {
    useQuery,
} from '@tanstack/react-query'

import {
    Activity,
    ChevronLeft,
    ChevronRight,
    LoaderCircle,
} from 'lucide-react'

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

interface PaginationState {
    storeId: number
    page: number
}

export default function StoreActivityPanel({
    storeId,
}: {
    storeId: number
}) {
    const [
        pagination,
        setPagination,
    ] =
        useState<PaginationState>({
            storeId,
            page:
                0,
        })

    const page =
        pagination.storeId ===
        storeId
            ? pagination.page
            : 0

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

    function goToPage(
        nextPage: number,
    ) {

        setPagination({
            storeId,
            page:
                Math.max(
                    0,
                    nextPage,
                ),
        })
    }

    return (
        <section
            aria-labelledby="store-activity-heading"
            className="space-y-5"
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-900/50 bg-sky-950/30 text-sky-400">
                            <Activity size={17}/>
                        </div>

                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-sky-400">
                                Audit trail
                            </p>

                            <h2
                                id="store-activity-heading"
                                className="mt-0.5 text-xl font-bold tracking-tight text-white sm:text-2xl"
                            >
                                Activity History
                            </h2>
                        </div>
                    </div>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                        Review inventory and store-profile changes recorded for this store.
                    </p>
                </div>
                {
                    activityQuery.isFetching &&
                    !activityQuery.isLoading && (
                        <span className="inline-flex items-center gap-2 self-start rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-[10px] font-semibold text-slate-500 sm:self-auto">
                            <LoaderCircle
                                size={12}
                                className="animate-spin text-sky-400"
                            />
                            Updating
                        </span>
                    )
                }
            </div>
            {
                activityQuery.isLoading && (
                    <div className="premium-card rounded-3xl border border-slate-800/90 bg-slate-900/55 p-5 backdrop-blur-xl sm:p-6">
                        <LoadingState
                            message="Loading store activity..."
                        />
                    </div>
                )
            }

            {
                activityQuery.isError && (
                    <div className="premium-card rounded-3xl border border-slate-800/90 bg-slate-900/55 p-5 backdrop-blur-xl sm:p-6">
                        <ErrorState
                            title="Activity unavailable"
                            message="ShelfRadar could not load the activity history for this store."
                            onRetry={
                                () => {
                                    void activityQuery.refetch()
                                }
                            }
                        />
                    </div>
                )
            }

            {
                data &&
                !activityQuery.isLoading &&
                !activityQuery.isError &&
                data.content.length ===
                0 && (
                    <div className="premium-card rounded-3xl border border-slate-800/90 bg-slate-900/55 p-5 backdrop-blur-xl sm:p-6">
                        <EmptyState
                            title="No activity recorded"
                            message="Inventory and store profile changes will appear here as they happen."
                        />
                    </div>
                )
            }

            {
                data &&
                !activityQuery.isLoading &&
                !activityQuery.isError &&
                data.content.length >
                0 && (
                    <div className="premium-card overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/55 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                        <div>
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
                                <div className="flex flex-col gap-3 border-t border-slate-800/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                    <button
                                        type="button"
                                        disabled={
                                            data.first ||
                                            activityQuery.isFetching
                                        }
                                        onClick={
                                            () =>
                                                goToPage(
                                                    page - 1,
                                                )
                                        }
                                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/40 px-4 text-xs font-semibold text-slate-400 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                                    >
                                        <ChevronLeft size={14}/>
                                        Previous
                                    </button>

                                    <span className="text-center text-xs text-slate-500">

                                        Page{' '}

                                        <strong className="font-semibold text-slate-300">
                                            {
                                                data.page +
                                                1
                                            }
                                        </strong>

                                        {' '}of{' '}

                                        <strong className="font-semibold text-slate-300">
                                            {
                                                data.totalPages
                                            }
                                        </strong>
                                    </span>

                                    <button
                                        type="button"
                                        disabled={
                                            data.last ||
                                            activityQuery.isFetching
                                        }
                                        onClick={
                                            () =>
                                                goToPage(
                                                    page + 1,
                                                )
                                        }
                                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/40 px-4 text-xs font-semibold text-slate-400 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                                    >
                                        Next
                                        <ChevronRight size={14}/>
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