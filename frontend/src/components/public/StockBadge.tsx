import type {
    StockStatus,
} from '../../types/store'

export default function StockBadge({
    status,
}: {
    status: StockStatus
}) {
    const config =
        status ===
        'IN_STOCK'
            ? {
                label:
                    'In stock',

                styles:
                    'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',

                dot:
                    'bg-emerald-400',
            }
            : status ===
            'LOW_STOCK'
                ? {
                    label:
                        'Low stock',

                    styles:
                        'border-amber-500/20 bg-amber-500/10 text-amber-300',

                    dot:
                        'bg-amber-400',
                }
                : {
                    label:
                        'Out of stock',

                    styles:
                        'border-red-500/20 bg-red-500/10 text-red-300',

                    dot:
                        'bg-red-400',
                }

    return (
        <span
            className={`inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold ${config.styles}`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
            />
            {
                config.label
            }
        </span>
    )
}