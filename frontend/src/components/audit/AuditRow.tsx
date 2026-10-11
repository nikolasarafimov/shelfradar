import type {
    ReactNode,
} from 'react'

import {
    Activity,
    Package,
    Store,
    User,
} from 'lucide-react'

import type {
    AuditAction,
    AuditLogEntry,
} from '../../types/audit'

import {
    formatDateTime,
} from '../../lib/format'

interface AuditRowProps {
    entry: AuditLogEntry
}

export default function AuditRow({
                                     entry,
                                 }: AuditRowProps) {
    return (
        <article className="group px-5 py-5 transition-colors duration-200 hover:bg-white/[0.018] sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-300/[0.07] text-sky-300">
                            <Activity
                                className="size-4"
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-semibold tracking-tight text-slate-100">
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
                                    className="size-3"
                                    aria-hidden="true"
                                />
                            }
                        >
                            {
                                entry.actorEmail
                            }
                        </MetadataBadge>

                        {entry.storeName && (
                            <MetadataBadge
                                icon={
                                    <Store
                                        className="size-3"
                                        aria-hidden="true"
                                    />
                                }
                            >
                                {
                                    entry.storeName
                                }
                            </MetadataBadge>
                        )}

                        {entry.productName && (
                            <MetadataBadge
                                icon={
                                    <Package
                                        className="size-3"
                                        aria-hidden="true"
                                    />
                                }
                            >
                                {
                                    entry.productName
                                }
                            </MetadataBadge>
                        )}
                    </div>

                    {entry.details && (
                        <div className="mt-4 rounded-xl border border-slate-800/70 bg-slate-950/35 px-4 py-3">
                            <p className="text-xs leading-5 text-slate-400">
                                {
                                    entry.details
                                }
                            </p>
                        </div>
                    )}
                </div>

                <time
                    dateTime={
                        entry.occurredAt
                    }
                    className="hidden shrink-0 rounded-lg border border-slate-800/70 bg-slate-950/35 px-3 py-2 text-[11px] font-medium text-slate-500 lg:block"
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
    icon: ReactNode
    children: ReactNode
}) {
    return (
        <span className="inline-flex min-w-0 items-center gap-1.5 rounded-lg border border-slate-800/70 bg-slate-950/35 px-2.5 py-1.5 text-[11px] text-slate-500">
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
    role: AuditLogEntry['actorRole']
}) {
    if (role === 'ADMIN') {
        return (
            <span className="rounded-full bg-sky-300/[0.08] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-sky-300 ring-1 ring-inset ring-sky-300/15">
                Admin
            </span>
        )
    }

    return (
        <span className="rounded-full bg-violet-300/[0.07] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-violet-300 ring-1 ring-inset ring-violet-300/15">
            Store owner
        </span>
    )
}

function formatAction(
    action: AuditAction,
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