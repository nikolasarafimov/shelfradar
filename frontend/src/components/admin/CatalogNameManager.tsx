import {
    useState,
} from 'react'

import type {
    FormEvent,
} from 'react'

import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'

import type {
    QueryKey,
} from '@tanstack/react-query'

import {
    AnimatePresence,
    motion,
} from 'motion/react'

import {
    AlertCircle,
    Check,
    LoaderCircle,
    Pencil,
    Plus,
    Tags,
    Trash2,
    X,
} from 'lucide-react'

import ErrorState from '../ui/ErrorState'
import LoadingState from '../ui/LoadingState'

interface NamedEntity {
    id: number
    name: string
}

interface CatalogNameRequest {
    name: string
}

interface CatalogNameManagerProps {
    title: string
    singular: string
    queryKey: QueryKey
    loadItems: () => Promise<NamedEntity[]>
    createItem: (
        request: CatalogNameRequest,
    ) => Promise<NamedEntity>
    updateItem: (
        id: number,
        request: CatalogNameRequest,
    ) => Promise<NamedEntity>
    deleteItem: (
        id: number,
    ) => Promise<void>
}

export default function CatalogNameManager({
                                               title,
                                               singular,
                                               queryKey,
                                               loadItems,
                                               createItem,
                                               updateItem,
                                               deleteItem,
                                           }: CatalogNameManagerProps) {
    const queryClient =
        useQueryClient()

    const [
        name,
        setName,
    ] = useState('')

    const [
        editingId,
        setEditingId,
    ] = useState<number | null>(
        null,
    )

    const [
        error,
        setError,
    ] = useState<string | null>(
        null,
    )

    const [
        deleteTarget,
        setDeleteTarget,
    ] = useState<NamedEntity | null>(
        null,
    )

    const itemsQuery =
        useQuery({
            queryKey,
            queryFn: loadItems,
        })

    const saveMutation =
        useMutation({
            mutationFn:
                async () => {
                    const normalizedName =
                        name.trim()

                    if (editingId !== null) {
                        return updateItem(
                            editingId,
                            {
                                name:
                                normalizedName,
                            },
                        )
                    }

                    return createItem({
                        name:
                        normalizedName,
                    })
                },

            onSuccess:
                async () => {
                    resetEditor()

                    await queryClient.invalidateQueries({
                        queryKey,
                    })
                },

            onError:
                () => {
                    setError(
                        `Unable to save ${singular.toLowerCase()}.`,
                    )
                },
        })

    const deleteMutation =
        useMutation({
            mutationFn:
            deleteItem,

            onSuccess:
                async (
                    _data,
                    deletedId,
                ) => {
                    if (
                        editingId ===
                        deletedId
                    ) {
                        resetEditor()
                    }

                    setDeleteTarget(
                        null,
                    )

                    setError(
                        null,
                    )

                    await queryClient.invalidateQueries({
                        queryKey,
                    })
                },

            onError:
                () => {
                    setDeleteTarget(
                        null,
                    )

                    setError(
                        `${singular} cannot be deleted. It may still be used by products.`,
                    )
                },
        })

    function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()

        if (!name.trim()) {
            setError(
                'Name is required.',
            )

            return
        }

        setError(
            null,
        )

        saveMutation.mutate()
    }

    function handleNameChange(
        value: string,
    ) {
        setName(
            value,
        )

        if (error) {
            setError(
                null,
            )
        }
    }

    function beginEdit(
        item: NamedEntity,
    ) {
        setEditingId(
            item.id,
        )

        setName(
            item.name,
        )

        setError(
            null,
        )
    }

    function resetEditor() {
        setEditingId(
            null,
        )

        setName(
            '',
        )

        setError(
            null,
        )
    }

    const isMutating =
        saveMutation.isPending ||
        deleteMutation.isPending

    const items =
        itemsQuery.data ??
        []

    const inputId =
        `${singular
            .toLowerCase()
            .replaceAll(' ', '-')}-name`

    return (
        <>
            <section className="grid items-start gap-5 lg:grid-cols-[330px_minmax(0,1fr)]">
                <div className="premium-card overflow-hidden rounded-2xl">
                    <div className="relative border-b border-slate-800/80 p-5">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -left-16 -top-20 size-40 rounded-full bg-sky-400/[0.06] blur-3xl"
                        />

                        <div className="relative flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-300/[0.08] text-sky-300">
                                {editingId !== null ? (
                                    <Pencil
                                        className="size-4"
                                        strokeWidth={1.8}
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <Plus
                                        className="size-[18px]"
                                        strokeWidth={1.8}
                                        aria-hidden="true"
                                    />
                                )}
                            </div>

                            <div>
                                <p className="eyebrow">
                                    {editingId !== null
                                        ? 'Edit entry'
                                        : 'New entry'}
                                </p>

                                <h2 className="mt-1.5 text-lg font-semibold tracking-[-0.025em] text-slate-50">
                                    {editingId !== null
                                        ? `Edit ${singular}`
                                        : `Add ${singular}`}
                                </h2>
                            </div>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="p-5"
                    >
                        <label
                            htmlFor={inputId}
                            className="block"
                        >
                            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                                Name
                            </span>

                            <input
                                id={inputId}
                                value={name}
                                onChange={
                                    event =>
                                        handleNameChange(
                                            event.target.value,
                                        )
                                }
                                disabled={isMutating}
                                autoComplete="off"
                                placeholder={
                                    `Enter ${singular.toLowerCase()} name`
                                }
                                className="field min-h-12 w-full px-4 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                            />
                        </label>

                        {error && (
                            <div
                                role="alert"
                                className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-300/10 bg-rose-300/[0.05] p-3 text-xs leading-5 text-rose-200/80"
                            >
                                <AlertCircle
                                    className="mt-0.5 size-4 shrink-0 text-rose-300"
                                    aria-hidden="true"
                                />

                                <span>
                                    {error}
                                </span>
                            </div>
                        )}

                        <div className="mt-5 flex gap-2">
                            <button
                                type="submit"
                                disabled={
                                    isMutating ||
                                    !name.trim()
                                }
                                className="shine-button inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-300 px-4 text-sm font-semibold text-slate-950 shadow-[0_12px_30px_rgba(14,165,233,0.16)] transition duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
                            >
                                {saveMutation.isPending ? (
                                    <>
                                        <LoaderCircle
                                            className="size-4 animate-spin"
                                            aria-hidden="true"
                                        />

                                        Saving...
                                    </>
                                ) : editingId !== null ? (
                                    <>
                                        <Check
                                            className="size-4"
                                            aria-hidden="true"
                                        />

                                        Save changes
                                    </>
                                ) : (
                                    <>
                                        <Plus
                                            className="size-4"
                                            aria-hidden="true"
                                        />

                                        Add {singular}
                                    </>
                                )}
                            </button>

                            {editingId !== null && (
                                <button
                                    type="button"
                                    onClick={resetEditor}
                                    disabled={isMutating}
                                    aria-label="Cancel editing"
                                    className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900/50 text-slate-400 transition duration-200 hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <X
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {itemsQuery.isLoading ? (
                    <LoadingState
                        message={
                            `Loading ${title.toLowerCase()}...`
                        }
                    />
                ) : itemsQuery.isError ? (
                    <ErrorState
                        title={
                            `Unable to load ${title.toLowerCase()}`
                        }
                        message="ShelfRadar could not load these catalog entries."
                        onRetry={
                            () => {
                                void itemsQuery.refetch()
                            }
                        }
                    />
                ) : (
                    <div className="premium-card min-w-0 overflow-hidden rounded-2xl">
                        <div className="relative flex items-center justify-between gap-4 border-b border-slate-800/80 px-5 py-4 sm:px-6">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/10 bg-sky-300/[0.06] text-sky-300">
                                    <Tags
                                        className="size-[18px]"
                                        strokeWidth={1.8}
                                        aria-hidden="true"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <h2 className="truncate text-lg font-semibold tracking-[-0.025em] text-slate-50">
                                        {title}
                                    </h2>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Manage catalog {title.toLowerCase()}.
                                    </p>
                                </div>
                            </div>

                            <span className="shrink-0 rounded-full bg-slate-400/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 ring-1 ring-inset ring-slate-300/10">
                                {items.length} total
                            </span>
                        </div>

                        {items.length === 0 ? (
                            <div className="flex min-h-56 items-center justify-center p-6 text-center">
                                <div>
                                    <div className="mx-auto flex size-11 items-center justify-center rounded-xl border border-slate-800/80 bg-slate-950/40 text-slate-600">
                                        <Tags
                                            className="size-[18px]"
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <p className="mt-3 text-sm font-semibold text-slate-300">
                                        No {title.toLowerCase()} yet
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-slate-600">
                                        Add the first {singular.toLowerCase()} using the form.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-800/70">
                                <AnimatePresence initial={false}>
                                    {items.map(
                                        (
                                            item,
                                            index,
                                        ) => {
                                            const isEditing =
                                                editingId ===
                                                item.id

                                            const isDeleting =
                                                deleteMutation.isPending &&
                                                deleteMutation.variables ===
                                                item.id

                                            return (
                                                <motion.div
                                                    key={item.id}
                                                    layout
                                                    initial={{
                                                        opacity: 0,
                                                        y: 6,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        x: 12,
                                                    }}
                                                    transition={{
                                                        duration: 0.25,
                                                        delay:
                                                            Math.min(
                                                                index,
                                                                6,
                                                            ) * 0.025,
                                                    }}
                                                    className={
                                                        isEditing
                                                            ? 'flex min-h-[72px] items-center justify-between gap-4 bg-sky-300/[0.045] px-5 py-3.5 sm:px-6'
                                                            : 'flex min-h-[72px] items-center justify-between gap-4 px-5 py-3.5 transition-colors duration-200 hover:bg-white/[0.018] sm:px-6'
                                                    }
                                                >
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <div
                                                            className={
                                                                isEditing
                                                                    ? 'flex size-9 shrink-0 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-300/[0.08] text-sky-300'
                                                                    : 'flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-800/80 bg-slate-950/40 text-slate-600'
                                                            }
                                                        >
                                                            <Tags
                                                                className="size-3.5"
                                                                aria-hidden="true"
                                                            />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-semibold text-slate-200">
                                                                {item.name}
                                                            </p>

                                                            {isEditing && (
                                                                <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-sky-300">
                                                                    Editing
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex shrink-0 items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                () =>
                                                                    beginEdit(
                                                                        item,
                                                                    )
                                                            }
                                                            disabled={isMutating}
                                                            aria-label={
                                                                `Edit ${item.name}`
                                                            }
                                                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/40 px-3 text-xs font-medium text-slate-400 transition duration-200 hover:border-sky-300/15 hover:bg-sky-300/[0.05] hover:text-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
                                                        >
                                                            <Pencil
                                                                className="size-3.5"
                                                                aria-hidden="true"
                                                            />

                                                            <span className="hidden sm:inline">
                                                                Edit
                                                            </span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={
                                                                () =>
                                                                    setDeleteTarget(
                                                                        item,
                                                                    )
                                                            }
                                                            disabled={isMutating}
                                                            aria-label={
                                                                `Delete ${item.name}`
                                                            }
                                                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-300/10 bg-rose-300/[0.045] px-3 text-xs font-medium text-rose-300/80 transition duration-200 hover:border-rose-300/20 hover:bg-rose-300/[0.08] hover:text-rose-200 disabled:cursor-not-allowed disabled:opacity-40"
                                                        >
                                                            {isDeleting ? (
                                                                <LoaderCircle
                                                                    className="size-3.5 animate-spin"
                                                                    aria-hidden="true"
                                                                />
                                                            ) : (
                                                                <Trash2
                                                                    className="size-3.5"
                                                                    aria-hidden="true"
                                                                />
                                                            )}

                                                            <span className="hidden sm:inline">
                                                                {isDeleting
                                                                    ? 'Deleting'
                                                                    : 'Delete'}
                                                            </span>
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )
                                        },
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                )}
            </section>

            <AnimatePresence>
                {deleteTarget && (
                    <DeleteConfirmation
                        item={deleteTarget}
                        singular={singular}
                        pending={
                            deleteMutation.isPending
                        }
                        onCancel={
                            () =>
                                setDeleteTarget(
                                    null,
                                )
                        }
                        onConfirm={
                            () =>
                                deleteMutation.mutate(
                                    deleteTarget.id,
                                )
                        }
                    />
                )}
            </AnimatePresence>
        </>
    )
}

function DeleteConfirmation({
                                item,
                                singular,
                                pending,
                                onCancel,
                                onConfirm,
                            }: {
    item: NamedEntity
    singular: string
    pending: boolean
    onCancel: () => void
    onConfirm: () => void
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            exit={{
                opacity: 0,
            }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
        >
            <button
                type="button"
                aria-label="Close delete confirmation"
                onClick={onCancel}
                disabled={pending}
                className="absolute inset-0 cursor-default bg-slate-950/75 backdrop-blur-sm"
            />

            <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="catalog-delete-title"
                initial={{
                    opacity: 0,
                    scale: 0.96,
                    y: 12,
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                }}
                exit={{
                    opacity: 0,
                    scale: 0.97,
                    y: 8,
                }}
                transition={{
                    duration: 0.2,
                }}
                className="premium-card relative z-10 w-full max-w-md rounded-2xl p-6 shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
            >
                <div className="flex size-11 items-center justify-center rounded-xl border border-rose-300/15 bg-rose-300/[0.08] text-rose-300">
                    <Trash2
                        className="size-5"
                        aria-hidden="true"
                    />
                </div>

                <h2
                    id="catalog-delete-title"
                    className="mt-5 text-lg font-semibold tracking-tight text-slate-50"
                >
                    Delete {singular.toLowerCase()}?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                    <strong className="font-semibold text-slate-200">
                        {item.name}
                    </strong>{' '}
                    will be removed from the catalog. This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-2.5">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={pending}
                        className="min-h-10 rounded-xl border border-slate-700/80 bg-slate-900/50 px-4 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-100 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={pending}
                        className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-rose-500 px-4 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {pending ? (
                            <LoaderCircle
                                className="size-4 animate-spin"
                                aria-hidden="true"
                            />
                        ) : (
                            <Trash2
                                className="size-4"
                                aria-hidden="true"
                            />
                        )}

                        {pending
                            ? 'Deleting...'
                            : 'Delete'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}