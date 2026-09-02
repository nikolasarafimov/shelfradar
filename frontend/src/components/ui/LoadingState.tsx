export default function LoadingState({
    message = 'Loading...',
}: {
    message?: string
}) {
    return (
        <div role="status" aria-live="polite" aria-busy="true" className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8">
            <div aria-hidden="true" className="animate-pulse space-y-4">
                <div className="h-5 w-40 rounded bg-slate-800" />
                <div className="h-4 w-full max-w-lg rounded bg-slate-800" />
                <div className="h-4 w-2/3 rounded bg-slate-800" />
            </div>

            <span className="sr-only">
                {message}
            </span>
        </div>
    )
}