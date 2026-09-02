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
                    ? 'premium-card rounded-3xl border border-amber-900/60 bg-amber-950/15 p-5 shadow-[0_20px_60px_-45px_rgba(245,158,11,0.3)] backdrop-blur-xl transition duration-200 hover:border-amber-800/70 hover:bg-amber-950/20'
                    : 'premium-card rounded-3xl border border-slate-800/90 bg-slate-900/55 p-5 shadow-[0_20px_60px_-45px_rgba(0,0,0,0.8)] backdrop-blur-xl transition duration-200 hover:border-slate-700 hover:bg-slate-900/70'
            }
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p
                        className={
                            attention
                                ? 'text-[10px] font-bold uppercase tracking-[0.14em] text-amber-400/80'
                                : 'text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500'
                        }
                    >
                        {label}
                    </p>

                    <div className="mt-2 text-2xl font-bold tracking-tight text-white">
                        {value}
                    </div>
                    {
                        hint && (
                            <p
                                className={
                                    attention
                                        ? 'mt-1.5 text-xs leading-5 text-amber-300/60'
                                        : 'mt-1.5 text-xs leading-5 text-slate-500'
                                }
                            >
                                {hint}
                            </p>
                        )
                    }
                </div>

                <div
                    className={
                        attention
                            ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-900/50 bg-amber-950/30 text-amber-400'
                            : 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-900/50 bg-sky-950/30 text-sky-400'
                    }
                >
                    {icon}
                </div>
            </div>
        </article>
    )
}