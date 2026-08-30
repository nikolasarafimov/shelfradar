import type {
    StockStatus,
} from '../../types/store'


export default function StockBadge({
                                       status,
                                   }: {
    status: StockStatus
}) {

    const styles =
        status === 'IN_STOCK'
            ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
            : status === 'LOW_STOCK'
                ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
                : 'bg-red-50 text-red-700 ring-red-600/20'


    const label =
        status === 'IN_STOCK'
            ? 'In stock'
            : status === 'LOW_STOCK'
                ? 'Low stock'
                : 'Out of stock'


    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${styles}`}
        >
            {label}
        </span>
    )
}