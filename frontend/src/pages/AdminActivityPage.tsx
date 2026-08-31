import type {
    FormEvent,
} from 'react'

import {
    useQuery,
} from '@tanstack/react-query'

import {
    Activity,
    Boxes,
    Clock3,
    Store,
} from 'lucide-react'

import {
    useSearchParams,
} from 'react-router-dom'

import {
    getAdminAnalytics,
    getAdminAudit,
} from '../api/auditApi'

import AdminLayout
    from '../components/admin/AdminLayout'

import AuditRow
    from '../components/audit/AuditRow'

import type {
    AuditAction,
    AuditEntityType,
} from '../types/audit'


export default function AdminActivityPage() {

    const [
        searchParams,
        setSearchParams,
    ] =
        useSearchParams()


    const query =
        searchParams.get('q') ??
        ''

    const action =
        toAuditAction(
            searchParams.get(
                'action',
            ),
        )

    const entityType =
        toEntityType(
            searchParams.get(
                'entityType',
            ),
        )

    const page =
        toPage(
            searchParams.get(
                'page',
            ),
        )


    const analyticsQuery =
        useQuery({
            queryKey: [
                'admin-analytics',
            ],

            queryFn:
            getAdminAnalytics,
        })


    const auditQuery =
        useQuery({
            queryKey: [
                'admin-audit',
                query,
                action,
                entityType,
                page,
            ],

            queryFn:
                () =>
                    getAdminAudit({
                        q:
                        query,

                        action,

                        entityType,

                        page,

                        size:
                            20,
                    }),
        })


    function handleSubmit(
        event:
        FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault()

        const formData =
            new FormData(
                event.currentTarget,
            )


        const next =
            new URLSearchParams()


        const nextQuery =
            String(
                formData.get('q') ??
                '',
            ).trim()

        const nextAction =
            String(
                formData.get('action') ??
                '',
            )

        const nextEntityType =
            String(
                formData.get('entityType') ??
                '',
            )


        if (nextQuery) {
            next.set(
                'q',
                nextQuery,
            )
        }

        if (nextAction) {
            next.set(
                'action',
                nextAction,
            )
        }

        if (nextEntityType) {
            next.set(
                'entityType',
                nextEntityType,
            )
        }


        next.set(
            'page',
            '0',
        )

        setSearchParams(
            next,
        )
    }


    function changePage(
        nextPage: number,
    ) {

        const next =
            new URLSearchParams(
                searchParams,
            )

        next.set(
            'page',
            String(
                Math.max(
                    0,
                    nextPage,
                ),
            ),
        )

        setSearchParams(
            next,
        )
    }


    const analytics =
        analyticsQuery.data

    const audit =
        auditQuery.data


    return (
        <AdminLayout>

            <div>

                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-400">
                    Analytics & Audit
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Platform Activity
                </h1>

                <p className="mt-2 text-slate-400">
                    Review operational activity and historical changes across ShelfRadar.
                </p>

            </div>


            {
                analytics && (

                    <>
                        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                            <Metric
                                icon={
                                    <Clock3 />
                                }
                                label="Last 24 hours"
                                value={
                                    analytics.activityLast24Hours
                                }
                            />

                            <Metric
                                icon={
                                    <Activity />
                                }
                                label="Last 7 days"
                                value={
                                    analytics.activityLast7Days
                                }
                            />

                            <Metric
                                icon={
                                    <Boxes />
                                }
                                label="Inventory changes"
                                value={
                                    analytics.inventoryChangesLast7Days
                                }
                            />

                            <Metric
                                icon={
                                    <Store />
                                }
                                label="Store changes"
                                value={
                                    analytics.storeChangesLast7Days
                                }
                            />

                        </section>


                        <section className="mt-6 grid gap-6 lg:grid-cols-2">

                            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

                                <h2 className="font-semibold">
                                    Daily activity
                                </h2>

                                <div className="mt-5 space-y-3">

                                    {
                                        analytics.dailyActivity.length ===
                                        0 ? (

                                            <p className="text-sm text-slate-500">
                                                No activity recorded yet.
                                            </p>

                                        ) : (

                                            analytics.dailyActivity.map(
                                                item => (

                                                    <div
                                                        key={
                                                            item.date
                                                        }
                                                        className="flex items-center justify-between rounded-xl bg-slate-950 p-3"
                                                    >

                                                        <span className="text-sm text-slate-400">
                                                            {
                                                                formatDate(
                                                                    item.date,
                                                                )
                                                            }
                                                        </span>

                                                        <span className="font-semibold">
                                                            {
                                                                item.actions
                                                            }
                                                        </span>

                                                    </div>
                                                ),
                                            )
                                        )
                                    }

                                </div>

                            </div>


                            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

                                <h2 className="font-semibold">
                                    Most active stores
                                </h2>

                                <div className="mt-5 space-y-3">

                                    {
                                        analytics.mostActiveStores.length ===
                                        0 ? (

                                            <p className="text-sm text-slate-500">
                                                No store activity recorded yet.
                                            </p>

                                        ) : (

                                            analytics.mostActiveStores.map(
                                                item => (

                                                    <div
                                                        key={
                                                            item.storeId
                                                        }
                                                        className="flex items-center justify-between rounded-xl bg-slate-950 p-3"
                                                    >

                                                        <span className="text-sm">
                                                            {
                                                                item.storeName ??
                                                                `Store ${item.storeId}`
                                                            }
                                                        </span>

                                                        <span className="font-semibold">
                                                            {
                                                                item.actions
                                                            } actions
                                                        </span>

                                                    </div>
                                                ),
                                            )
                                        )
                                    }

                                </div>

                            </div>

                        </section>
                    </>
                )
            }


            <section className="mt-10">

                <h2 className="text-2xl font-bold">
                    Audit Log
                </h2>


                <form
                    key={
                        searchParams.toString()
                    }
                    onSubmit={
                        handleSubmit
                    }
                    className="mt-5 grid gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-5 lg:grid-cols-[minmax(0,1fr)_220px_180px_auto]"
                >

                    <input
                        name="q"
                        type="search"
                        defaultValue={
                            query
                        }
                        placeholder="Actor, store, product..."
                        className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5"
                    />


                    <select
                        name="action"
                        defaultValue={
                            action ?? ''
                        }
                        className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5"
                    >
                        <option value="">
                            All actions
                        </option>

                        <option value="INVENTORY_CREATED">
                            Inventory created
                        </option>

                        <option value="INVENTORY_UPDATED">
                            Inventory updated
                        </option>

                        <option value="INVENTORY_DELETED">
                            Inventory deleted
                        </option>

                        <option value="STORE_PROFILE_UPDATED">
                            Store updated
                        </option>

                        <option value="STORE_STATUS_CHANGED">
                            Store status changed
                        </option>

                        <option value="STORE_OWNER_CHANGED">
                            Store owner changed
                        </option>
                    </select>


                    <select
                        name="entityType"
                        defaultValue={
                            entityType ?? ''
                        }
                        className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5"
                    >
                        <option value="">
                            All entities
                        </option>

                        <option value="INVENTORY">
                            Inventory
                        </option>

                        <option value="STORE">
                            Store
                        </option>

                        <option value="PRODUCT">
                            Product
                        </option>

                        <option value="BRAND">
                            Brand
                        </option>

                        <option value="CATEGORY">
                            Category
                        </option>
                    </select>


                    <button
                        type="submit"
                        className="rounded-xl bg-white px-5 py-2.5 font-semibold text-slate-950"
                    >
                        Apply
                    </button>

                </form>


                {
                    auditQuery.isLoading && (

                        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
                            Loading audit log...
                        </div>
                    )
                }


                {
                    auditQuery.isError && (

                        <div className="mt-5 rounded-2xl border border-red-900/50 bg-red-950/30 p-6 text-red-300">
                            Unable to load audit log.
                        </div>
                    )
                }


                {
                    audit && (

                        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

                            {
                                audit.content.length ===
                                0 ? (

                                    <div className="p-10 text-center text-slate-500">
                                        No audit entries found.
                                    </div>

                                ) : (

                                    audit.content.map(
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
                                audit.totalPages >
                                1 && (

                                    <div className="flex items-center justify-between border-t border-slate-800 p-5">

                                        <button
                                            type="button"
                                            disabled={
                                                audit.first
                                            }
                                            onClick={
                                                () =>
                                                    changePage(
                                                        audit.page -
                                                        1,
                                                    )
                                            }
                                            className="rounded-xl border border-slate-700 px-4 py-2 disabled:opacity-40"
                                        >
                                            Previous
                                        </button>


                                        <span className="text-sm text-slate-400">
                                            Page{' '}
                                            {
                                                audit.page +
                                                1
                                            }{' '}
                                            of{' '}
                                            {
                                                audit.totalPages
                                            }
                                        </span>


                                        <button
                                            type="button"
                                            disabled={
                                                audit.last
                                            }
                                            onClick={
                                                () =>
                                                    changePage(
                                                        audit.page +
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

        </AdminLayout>
    )
}


function Metric({
                    icon,
                    label,
                    value,
                }: {
    icon: React.ReactNode
    label: string
    value: number
}) {

    return (
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-sky-400">
                {icon}
            </div>

            <p className="mt-4 text-3xl font-bold">
                {value}
            </p>

            <p className="mt-1 text-sm text-slate-400">
                {label}
            </p>

        </article>
    )
}


function toAuditAction(
    value: string | null,
): AuditAction | undefined {

    const actions:
        AuditAction[] = [
        'INVENTORY_CREATED',
        'INVENTORY_UPDATED',
        'INVENTORY_DELETED',
        'STORE_PROFILE_UPDATED',
        'STORE_STATUS_CHANGED',
        'STORE_OWNER_CHANGED',
        'PRODUCT_CREATED',
        'PRODUCT_UPDATED',
        'PRODUCT_DELETED',
        'BRAND_CREATED',
        'BRAND_UPDATED',
        'BRAND_DELETED',
        'CATEGORY_CREATED',
        'CATEGORY_UPDATED',
        'CATEGORY_DELETED',
    ]


    return actions.includes(
        value as AuditAction,
    )
        ? value as AuditAction
        : undefined
}


function toEntityType(
    value: string | null,
): AuditEntityType | undefined {

    if (
        value === 'INVENTORY' ||
        value === 'STORE' ||
        value === 'PRODUCT' ||
        value === 'BRAND' ||
        value === 'CATEGORY'
    ) {
        return value
    }

    return undefined
}


function toPage(
    value: string | null,
): number {

    const parsed =
        Number(value)

    return Number.isInteger(parsed) &&
    parsed >= 0
        ? parsed
        : 0
}


function formatDate(
    value: string,
): string {

    return new Intl.DateTimeFormat(
        'en-GB',
        {
            dateStyle:
                'medium',
        },
    ).format(
        new Date(
            `${value}T00:00:00Z`,
        ),
    )
}