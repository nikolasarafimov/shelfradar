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
} from '../../api/storeApi'

import AuditRow from '../audit/AuditRow'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import LoadingState from '../ui/LoadingState'

interface StoreActivityPanelProps {
    storeId: number
}

interface PaginationState {
    storeId: number
    page: number
}

export default function StoreActivityPanel({
                                               storeId,
                                           }: StoreActivityPanelProps) {
    const [
        pagination,
        setPagination,
    ] = useState<PaginationState>({
        storeId,
        page: 0,
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-300/[0.08] text-sky-300 shadow-[0_10px_30px_rgba(14,165,233,0.08)]">
                            <Activity
                                className="size-[18px]"
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />
                        </div>

                        <div>
                            <p className="eyebrow">
                                Audit trail
                            </p>

                            <h2
                                id="store-activity-heading"
                                className="mt-1.5 text-xl font-semibold tracking-[-0.03em] text-slate-50 sm:text-2xl"
                            >
                                Activity history
                            </h2>
                        </div>
                    </div>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                        Review inventory and store-profile changes recorded for this store.
                    </p>
                </div>

                {activityQuery.isFetching &&
                    !activityQuery.isLoading && (
                        <span className="inline-flex items-center gap-2 self-start rounded-full border border-sky-300/10 bg-sky-300/[0.05] px-3 py-1.5 text-[10px] font-semibold text-slate-400 sm:self-auto">
                            <LoaderCircle
                                className="size-3 animate-spin text-sky-300"
                                aria-hidden="true"
                            />

                            Updating
                        </span>
                    )}
            </div>

            {activityQuery.isLoading && (
                <LoadingState
                    message="Loading store activity..."
                />
            )}

            {activityQuery.isError && (
                <ErrorState
                    title="Activity unavailable"
                    message="ShelfRadar could not load the activity history for this store."
                    onRetry={
                        () => {
                            void activityQuery.refetch()
                        }
                    }
                />
            )}

            {data &&
                !activityQuery.isLoading &&
                !activityQuery.isError &&
                data.content.length === 0 && (
                    <EmptyState
                        title="No activity recorded"
                        message="Inventory and store profile changes will appear here as they happen."
                    />
                )}

            {data &&
                !activityQuery.isLoading &&
                !activityQuery.isError &&
                data.content.length > 0 && (
                    <div className="premium-card overflow-hidden rounded-2xl">
                        <div className="divide-y divide-slate-800/70">
                            {data.content.map(
                                entry => (
                                    <AuditRow
                                        key={entry.id}
                                        entry={entry}
                                    />
                                ),
                            )}
                        </div>

                        {data.totalPages > 1 && (
                            <div className="flex flex-col gap-3 border-t border-slate-800/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                <PaginationButton
                                    direction="previous"
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
                                />

                                <span className="text-center text-xs text-slate-500">
                                    Page{' '}
                                    <strong className="font-semibold text-slate-300">
                                        {data.page + 1}
                                    </strong>
                                    {' '}of{' '}
                                    <strong className="font-semibold text-slate-300">
                                        {data.totalPages}
                                    </strong>
                                </span>

                                <PaginationButton
                                    direction="next"
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
                                />
                            </div>
                        )}
                    </div>
                )}
        </section>
    )
}

function PaginationButton({
                              direction,
                              disabled,
                              onClick,
                          }: {
    direction: 'previous' | 'next'
    disabled: boolean
    onClick: () => void
}) {
    const previous =
        direction ===
        'previous'

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/40 px-4 text-xs font-medium text-slate-400 transition duration-200 hover:border-slate-600 hover:bg-slate-800/70 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-35"
        >
            {previous && (
                <ChevronLeft
                    className="size-3.5"
                    aria-hidden="true"
                />
            )}

            {previous
                ? 'Previous'
                : 'Next'}

            {!previous && (
                <ChevronRight
                    className="size-3.5"
                    aria-hidden="true"
                />
            )}
        </button>
    )
}