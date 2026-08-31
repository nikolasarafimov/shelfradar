import type {
    ReactNode,
} from 'react'


export default function MetricCard({
                                       icon,
                                       label,
                                       value,
                                       hint,
                                       attention = false,
                                   }: {
    icon: ReactNode
    label: string
    value: ReactNode
    hint?: string
    attention?: boolean
}) {

    return (
        <article
            className={
                attention
                    ? 'rounded-2xl border border-amber-800/60 bg-amber-950/20 p-5'
                    : 'rounded-2xl border border-slate-800 bg-slate-900 p-5'
            }
        >

            <div className="flex items-start justify-between gap-4">

                <div>

                    <p className="text-sm font-medium text-slate-400">
                        {label}
                    </p>

                    <p className="mt-2 text-2xl font-bold tracking-tight text-white">
                        {value}
                    </p>

                    {
                        hint && (

                            <p className="mt-1 text-xs text-slate-500">
                                {hint}
                            </p>
                        )
                    }

                </div>


                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-sky-400">
                    {icon}
                </div>

            </div>

        </article>
    )
}