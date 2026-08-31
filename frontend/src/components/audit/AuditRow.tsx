import {
    Activity,
    Package,
    Store,
    User,
} from 'lucide-react'

import type {
    AuditLogEntry,
} from '../../types/audit'


export default function AuditRow({
                                     entry,
                                 }: {
    entry: AuditLogEntry
}) {

    return (
        <article className="border-b border-slate-800 p-5 last:border-b-0">

            <div className="flex flex-col justify-between gap-4 md:flex-row">

                <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-2">

                        <Activity
                            size={17}
                            className="text-sky-400"
                        />

                        <span className="font-semibold">
                            {
                                formatAction(
                                    entry.action,
                                )
                            }
                        </span>

                        <RoleBadge
                            role={
                                entry.actorRole
                            }
                        />

                    </div>


                    <div className="mt-3 space-y-1.5 text-sm text-slate-400">

                        <div className="flex items-center gap-2">

                            <User
                                size={14}
                            />

                            {
                                entry.actorEmail
                            }

                        </div>


                        {
                            entry.storeName && (

                                <div className="flex items-center gap-2">

                                    <Store
                                        size={14}
                                    />

                                    {
                                        entry.storeName
                                    }

                                </div>
                            )
                        }


                        {
                            entry.productName && (

                                <div className="flex items-center gap-2">

                                    <Package
                                        size={14}
                                    />

                                    {
                                        entry.productName
                                    }

                                </div>
                            )
                        }

                    </div>


                    {
                        entry.details && (

                            <p className="mt-3 text-sm leading-6 text-slate-300">
                                {
                                    entry.details
                                }
                            </p>
                        )
                    }

                </div>


                <time className="shrink-0 text-xs text-slate-500">
                    {
                        formatDateTime(
                            entry.occurredAt,
                        )
                    }
                </time>

            </div>

        </article>
    )
}


function RoleBadge({
                       role,
                   }: {
    role:
        | 'ADMIN'
        | 'STORE_OWNER'
}) {

    return (
        <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-400">
            {
                role === 'ADMIN'
                    ? 'Admin'
                    : 'Store Owner'
            }
        </span>
    )
}


function formatAction(
    action: string,
): string {

    return action
        .toLowerCase()
        .split('_')
        .map(
            word =>
                word.charAt(0).toUpperCase() +
                word.slice(1),
        )
        .join(' ')
}


function formatDateTime(
    value: string,
): string {

    return new Intl.DateTimeFormat(
        'en-GB',
        {
            dateStyle:
                'medium',

            timeStyle:
                'short',
        },
    ).format(
        new Date(value),
    )
}