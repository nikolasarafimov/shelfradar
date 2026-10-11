import type {
    ReactNode,
} from 'react'

interface PageHeaderProps {
    eyebrow?: string
    title: string
    description?: string
    actions?: ReactNode
}

export default function PageHeader({
                                       eyebrow,
                                       title,
                                       description,
                                       actions,
                                   }: PageHeaderProps) {
    return (
        <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
                {eyebrow && (
                    <p className="eyebrow">
                        {eyebrow}
                    </p>
                )}

                <h1 className="mt-2.5 max-w-3xl text-2xl font-semibold tracking-[-0.035em] text-slate-50 sm:text-3xl lg:text-[2.15rem] lg:leading-tight">
                    {title}
                </h1>

                {description && (
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-[0.95rem] sm:leading-7">
                        {description}
                    </p>
                )}
            </div>

            {actions && (
                <div className="flex shrink-0 flex-wrap items-center gap-2.5 sm:justify-end">
                    {actions}
                </div>
            )}
        </header>
    )
}