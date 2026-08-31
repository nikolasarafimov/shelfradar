import type {
    ReactNode,
} from 'react'


export default function PageHeader({
                                       eyebrow,
                                       title,
                                       description,
                                       actions,
                                   }: {
    eyebrow?: string
    title: string
    description?: string
    actions?: ReactNode
}) {

    return (
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

            <div className="min-w-0">

                {
                    eyebrow && (

                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
                            {eyebrow}
                        </p>
                    )
                }

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                    {title}
                </h1>

                {
                    description && (

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                            {description}
                        </p>
                    )
                }

            </div>


            {
                actions && (

                    <div className="flex shrink-0 flex-wrap gap-2">
                        {actions}
                    </div>
                )
            }

        </div>
    )
}