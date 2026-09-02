import type {
    StockStatus,
    StoreStatus,
} from '../../types/store'

type Status =
    StockStatus |
    StoreStatus

export default function StatusBadge({
    status,
}: {
    status: Status
}) {

    const config =
        getStatusConfig(
            status,
        )

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${config.className}`}
        >
            {config.label}
        </span>
    )
}

function getStatusConfig(
    status: Status,
): {
    label: string
    className: string
} {
    switch (status) {
        case 'ACTIVE':
            return {
                label:
                    'Active',

                className:
                    'bg-emerald-950 text-emerald-300 ring-emerald-800',
            }

        case 'PENDING':
            return {
                label:
                    'Pending',

                className:
                    'bg-amber-950 text-amber-300 ring-amber-800',
            }

        case 'INACTIVE':
            return {
                label:
                    'Inactive',

                className:
                    'bg-slate-800 text-slate-400 ring-slate-700',
            }

        case 'IN_STOCK':
            return {
                label:
                    'In stock',

                className:
                    'bg-emerald-950 text-emerald-300 ring-emerald-800',
            }

        case 'LOW_STOCK':
            return {
                label:
                    'Low stock',

                className:
                    'bg-amber-950 text-amber-300 ring-amber-800',
            }

        case 'OUT_OF_STOCK':
            return {
                label:
                    'Out of stock',

                className:
                    'bg-red-950 text-red-300 ring-red-800',
            }
    }
}