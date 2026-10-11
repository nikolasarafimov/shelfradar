import {
    PackageSearch,
} from 'lucide-react'

import type {
    ReactNode,
} from 'react'

interface EmptyStateProps {
    title: string
    message: string
    action?: ReactNode
}

export default function EmptyState({
                                       title,
                                       message,
                                       action,
                                   }: EmptyStateProps) {
    return (
        <div className="premium-card relative overflow-hidden border-dashed px-6 py-14 text-center sm:px-10">
            <div
                className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-40 max-w-xl bg-sky-400/5 blur-3xl"
                aria-hidden="true"
            />

            <div className="relative">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-sky-400/15 bg-sky-400/10 text-sky-300 shadow-[0_12px_36px_rgba(14,165,233,0.12)]">
                    <PackageSearch
                        className="size-6"
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />
                </div>

                <h2 className="mt-5 text-base font-semibold tracking-tight text-slate-50">
                    {title}
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                    {message}
                </p>

                {action && (
                    <div className="mt-6 flex justify-center">
                        {action}
                    </div>
                )}
            </div>
        </div>
    )
}