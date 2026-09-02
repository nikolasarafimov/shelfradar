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
        <article className="group border-b border-slate-800/70 px-5 py-5 transition duration-200 last:border-b-0 hover:bg-slate-800/20 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-900/50 bg-sky-950/25 text-sky-400">
                            <Activity size={15}/>
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-100">
                                    {
                                        formatAction(
                                            entry.action,
                                        )
                                    }
                                </h3>

                                <RoleBadge
                                    role={
                                        entry.actorRole
                                    }
                                />
                            </div>

                            <time
                                dateTime={
                                    entry.occurredAt
                                }
                                className="mt-1 block text-[11px] text-slate-600 lg:hidden"
                            >
                                {
                                    formatDateTime(
                                        entry.occurredAt,
                                    )
                                }
                            </time>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <MetadataBadge
                            icon={
                                <User
                                    size={12}
                                />
                            }
                        >
                            {
                                entry.actorEmail
                            }
                        </MetadataBadge>
                        {
                            entry.storeName && (

                                <MetadataBadge
                                    icon={
                                        <Store
                                            size={12}
                                        />
                                    }
                                >
                                    {
                                        entry.storeName
                                    }
                                </MetadataBadge>
                            )
                        }

                        {
                            entry.productName && (

                                <MetadataBadge
                                    icon={
                                        <Package
                                            size={12}
                                        />
                                    }
                                >
                                    {
                                        entry.productName
                                    }
                                </MetadataBadge>
                            )
                        }
                    </div>
                    {
                        entry.details && (

                            <div className="mt-4 rounded-xl border border-slate-800/80 bg-[#020817]/45 px-4 py-3">

                                <p className="text-xs leading-5 text-slate-400">
                                    {
                                        entry.details
                                    }
                                </p>
                            </div>
                        )
                    }
                </div>

                <time
                    dateTime={
                        entry.occurredAt
                    }
                    className="hidden shrink-0 rounded-lg border border-slate-800 bg-[#020817]/50 px-3 py-2 text-[11px] font-medium text-slate-500 lg:block"
                >
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

function MetadataBadge({
    icon,
    children,
}: {
    icon: React.ReactNode
    children: React.ReactNode
}) {

    return (
        <span className="inline-flex min-w-0 items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/50 px-2.5 py-1.5 text-[11px] text-slate-500">
            <span className="shrink-0 text-slate-600">
                {icon}
            </span>

            <span className="truncate">
                {children}
            </span>
        </span>
    )
}

function RoleBadge({
    role,
}: {
    role:
        | 'ADMIN'
        | 'STORE_OWNER'
}) {

    if (
        role ===
        'ADMIN'
    ) {
        return (
            <span className="rounded-full border border-sky-900/60 bg-sky-950/30 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-sky-400">
                Admin
            </span>
        )
    }

    return (
        <span className="rounded-full border border-violet-900/50 bg-violet-950/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-violet-300">
            Store Owner
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
                word.charAt(
                    0,
                ).toUpperCase() +
                word.slice(
                    1,
                ),
        )
        .join(
            ' ',
        )
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
        new Date(
            value,
        ),
    )
}