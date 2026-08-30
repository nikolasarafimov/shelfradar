export default function UnauthorizedPage() {

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">

            <div className="text-center">

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-400">
                    403
                </p>

                <h1 className="mt-3 text-4xl font-bold">
                    Access denied
                </h1>

                <p className="mt-4 text-slate-400">
                    Your account does not have permission to access this section.
                </p>

                <a
                    href="/"
                    className="mt-8 inline-block rounded-xl bg-sky-500 px-5 py-3 font-semibold text-slate-950"
                >
                    Return home
                </a>

            </div>

        </main>
    )
}