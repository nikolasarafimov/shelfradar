import type {
    StockStatus,
    StoreStatus,
} from '../../types/store'

type Status =
    | StockStatus
    | StoreStatus

interface StatusConfig {
    label: string
    className: string
    dotClassName: string
}

const STATUS_CONFIG: Record<
    Status,
    StatusConfig
> = {
    ACTIVE: {
        label: 'Active',
        className:
            'bg-emerald-400/[0.08] text-emerald-300 ring-emerald-300/15',
        dotClassName:
            'bg-emerald-400',
    },

    PENDING: {
        label: 'Pending',
        className:
            'bg-amber-400/[0.08] text-amber-300 ring-amber-300/15',
        dotClassName:
            'bg-amber-400',
    },

    INACTIVE: {
        label: 'Inactive',
        className:
            'bg-slate-400/[0.07] text-slate-400 ring-slate-300/10',
        dotClassName:
            'bg-slate-500',
    },

    IN_STOCK: {
        label: 'In stock',
        className:
            'bg-emerald-400/[0.08] text-emerald-300 ring-emerald-300/15',
        dotClassName:
            'bg-emerald-400',
    },

    LOW_STOCK: {
        label: 'Low stock',
        className:
            'bg-amber-400/[0.08] text-amber-300 ring-amber-300/15',
        dotClassName:
            'bg-amber-400',
    },

    OUT_OF_STOCK: {
        label: 'Out of stock',
        className:
            'bg-rose-400/[0.08] text-rose-300 ring-rose-300/15',
        dotClassName:
            'bg-rose-400',
    },
}

interface StatusBadgeProps {
    status: Status
}

export default function StatusBadge({
                                        status,
                                    }: StatusBadgeProps) {
    const config =
        STATUS_CONFIG[status]

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none ring-1 ring-inset ${config.className}`}
        >
            <span
                aria-hidden="true"
                className={`size-1.5 shrink-0 rounded-full ${config.dotClassName}`}
            />

            {config.label}
        </span>
    )
}