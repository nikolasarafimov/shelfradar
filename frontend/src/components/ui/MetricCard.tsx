import type {
    ReactNode,
} from 'react'

import {
    motion,
} from 'motion/react'

interface MetricCardProps {
    icon: ReactNode
    label: string
    value: ReactNode
    hint?: string
    attention?: boolean
}

export default function MetricCard({
                                       icon,
                                       label,
                                       value,
                                       hint,
                                       attention = false,
                                   }: MetricCardProps) {
    return (
        <motion.article
            whileHover={{
                y: -3,
            }}
            transition={{
                duration: 0.2,
                ease: 'easeOut',
            }}
            className={
                attention
                    ? 'premium-card group rounded-2xl border-amber-400/20 bg-amber-400/[0.055] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.2)]'
                    : 'premium-card interactive-card group rounded-2xl p-5'
            }
        >
            <div className="relative flex items-start justify-between gap-5">
                <div className="min-w-0">
                    <p
                        className={
                            attention
                                ? 'text-[11px] font-bold uppercase tracking-[0.14em] text-amber-300/75'
                                : 'text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500'
                        }
                    >
                        {label}
                    </p>

                    <div className="mt-2.5 text-2xl font-semibold tracking-[-0.03em] text-slate-50 sm:text-[1.7rem]">
                        {value}
                    </div>

                    {hint && (
                        <p
                            className={
                                attention
                                    ? 'mt-2 text-xs leading-5 text-amber-200/55'
                                    : 'mt-2 text-xs leading-5 text-slate-500'
                            }
                        >
                            {hint}
                        </p>
                    )}
                </div>

                <div
                    className={
                        attention
                            ? 'flex size-11 shrink-0 items-center justify-center rounded-xl border border-amber-300/15 bg-amber-300/10 text-amber-300 shadow-[0_10px_30px_rgba(245,158,11,0.08)] transition duration-200 group-hover:bg-amber-300/15'
                            : 'flex size-11 shrink-0 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-300/[0.08] text-sky-300 shadow-[0_10px_30px_rgba(14,165,233,0.08)] transition duration-200 group-hover:border-sky-300/25 group-hover:bg-sky-300/12'
                    }
                >
                    {icon}
                </div>
            </div>

            <div
                aria-hidden="true"
                className={
                    attention
                        ? 'pointer-events-none absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-300/20 to-transparent'
                        : 'pointer-events-none absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-sky-300/15 to-transparent'
                }
            />
        </motion.article>
    )
}