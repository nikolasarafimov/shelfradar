import {
    AlertCircle,
    RotateCcw,
} from 'lucide-react'

interface ErrorStateProps {
    title?: string
    message: string
    onRetry?: () => void
}

export default function ErrorState({
                                       title = 'Something went wrong',
                                       message,
                                       onRetry,
                                   }: ErrorStateProps) {
    return (
        <div
            role="alert"
            className="relative overflow-hidden rounded-2xl border border-rose-400/15 bg-rose-500/[0.06] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
        >
            <div
                className="pointer-events-none absolute -right-10 -top-16 size-40 rounded-full bg-rose-500/10 blur-3xl"
                aria-hidden="true"
            />

            <div className="relative flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-rose-400/15 bg-rose-400/10 text-rose-300">
                    <AlertCircle
                        className="size-5"
                        strokeWidth={1.9}
                        aria-hidden="true"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-semibold tracking-tight text-rose-100">
                        {title}
                    </h2>

                    <p className="mt-1.5 max-w-2xl text-sm leading-6 text-rose-200/70">
                        {message}
                    </p>

                    {onRetry && (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-400/10 px-3.5 py-2 text-sm font-medium text-rose-100 transition duration-200 hover:border-rose-400/30 hover:bg-rose-400/15 focus-visible:outline-rose-300"
                        >
                            <RotateCcw
                                className="size-4"
                                strokeWidth={1.9}
                                aria-hidden="true"
                            />

                            Try again
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}