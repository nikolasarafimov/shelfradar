import {
    ArrowLeft,
    ShieldX,
} from 'lucide-react'

import {
    Link,
} from 'react-router-dom'

export default function UnauthorizedPage() {
    return (
        <main className="relative flex min-h-dvh items-center justify-center overflow-x-clip bg-[#020817] px-5 py-12 text-white">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-[-220px] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-red-500/[0.055] blur-[140px]" />
                <div className="absolute bottom-[-180px] left-1/2 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-sky-500/[0.045] blur-[140px]" />

                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(148,163,184,0.28) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.28) 1px, transparent 1px)',

                        backgroundSize:
                            '46px 46px',
                    }}
                />
            </div>

            <section
                aria-labelledby="unauthorized-title"
                className="premium-card relative z-10 w-full max-w-lg rounded-[2rem] border border-slate-800/90 bg-slate-900/60 p-7 text-center shadow-[0_35px_110px_-45px_rgba(239,68,68,0.22)] backdrop-blur-xl sm:p-10"
            >
                <Link
                    to="/"
                    aria-label="ShelfRadar home"
                    className="group mx-auto inline-flex items-center"
                >
                    <img
                        src="/shelfradar-logo.png"
                        alt="ShelfRadar"
                        className="h-14 w-auto object-contain drop-shadow-[0_0_18px_rgba(56,189,248,0.1)] transition duration-300 group-hover:scale-[1.025]"
                    />
                </Link>

                <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-900/60 bg-red-950/25 text-red-400 shadow-[0_0_35px_rgba(239,68,68,0.08)]">
                    <ShieldX size={28}/>
                </div>

                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.24em] text-red-400">
                    Error 403
                </p>

                <h1 id="unauthorized-title" className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Access denied
                </h1>

                <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-400">
                    Your account does not have permission to access this section of ShelfRadar.
                </p>

                <Link to="/" className="group mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 text-sm font-bold text-slate-950 transition duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 motion-reduce:transform-none">
                    <ArrowLeft
                        size={15}
                        className="transition-transform group-hover:-translate-x-1"
                    />
                    Return home
                </Link>
            </section>
        </main>
    )
}