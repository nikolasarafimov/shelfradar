import {
    AlertCircle,
} from 'lucide-react'


export default function ErrorState({
                                       title = 'Something went wrong',
                                       message,
                                       onRetry,
                                   }: {
    title?: string
    message: string
    onRetry?: () => void
}) {

    return (
        <div
            role="alert"
            className="rounded-2xl border border-red-900/50 bg-red-950/20 p-6"
        >

            <div className="flex gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-950 text-red-400">
                    <AlertCircle
                        size={20}
                    />
                </div>


                <div>

                    <h2 className="font-semibold text-red-200">
                        {title}
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-red-300/80">
                        {message}
                    </p>


                    {
                        onRetry && (

                            <button
                                type="button"
                                onClick={
                                    onRetry
                                }
                                className="mt-4 rounded-lg border border-red-800 px-3 py-2 text-sm font-medium text-red-200 transition hover:bg-red-950"
                            >
                                Try again
                            </button>
                        )
                    }

                </div>

            </div>

        </div>
    )
}