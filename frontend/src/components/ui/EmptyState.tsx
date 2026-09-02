import {
    PackageSearch,
} from 'lucide-react'

import type {
    ReactNode,
} from 'react'

export default function EmptyState({
    title,
    message,
    action,
}: {
    title: string
    message: string
    action?: ReactNode
}) {
    return (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
                <PackageSearch size={22}/>
            </div>

            <h2 className="mt-4 font-semibold text-white">
                {title}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                {message}
            </p>
            {
                action && (
                    <div className="mt-5 flex justify-center">
                        {action}
                    </div>
                )
            }
        </div>
    )
}