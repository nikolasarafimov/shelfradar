interface LoadingStateProps {
    message?: string
}

export default function LoadingState({
                                         message = 'Loading...',
                                     }: LoadingStateProps) {
    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className="premium-card p-6 sm:p-8"
        >
            <div
                aria-hidden="true"
                className="space-y-4"
            >
                <div className="skeleton h-5 w-40 rounded-lg" />

                <div className="space-y-3">
                    <div className="skeleton h-4 w-full max-w-xl rounded-lg" />
                    <div className="skeleton h-4 w-4/5 max-w-lg rounded-lg" />
                    <div className="skeleton h-4 w-2/3 max-w-md rounded-lg" />
                </div>
            </div>

            <span className="sr-only">
                {message}
            </span>
        </div>
    )
}