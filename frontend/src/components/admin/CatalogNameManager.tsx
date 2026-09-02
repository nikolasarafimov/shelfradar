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
    AlertCircle,
    Check,
    LoaderCircle,
    Pencil,
    Plus,
    Tags,
    Trash2,
    X,
} from 'lucide-react'

interface NamedEntity {
    id: number
    name: string
}

interface CatalogNameManagerProps {
    title: string
    singular: string
    queryKey: QueryKey
    loadItems: () => Promise<NamedEntity[]>
    createItem: (
        request: {
            name: string
        },
    ) => Promise<NamedEntity>
    updateItem: (
        id: number,
        request: {
            name: string
        },
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
    ] =
        useState('')

    const [
        editingId,
        setEditingId,
    ] =
        useState<number | null>(
            null,
        )

    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null,
        )

    const {
        data = [],
        isLoading,
        isError,
    } =
        useQuery({
            queryKey,
            queryFn:
            loadItems,
        })

    const saveMutation =
        useMutation({

            mutationFn:
                async () => {

                    const normalizedName =
                        name.trim()


                    if (
                        editingId !==
                        null
                    ) {

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

                    setName(
                        '',
                    )

                    setEditingId(
                        null,
                    )

                    setError(
                        null,
                    )


                    await queryClient
                        .invalidateQueries({
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

                        setEditingId(
                            null,
                        )

                        setName(
                            '',
                        )
                    }

                    setError(
                        null,
                    )

                    await queryClient
                        .invalidateQueries({
                            queryKey,
                        })
                },

            onError:
                () => {

                    setError(
                        `${singular} cannot be deleted. It may still be used by products.`,
                    )
                },
        })

    function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault()

        const normalizedName =
            name.trim()

        if (
            !normalizedName
        ) {

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

        if (
            error
        ) {
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

    function cancelEdit() {

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

    function handleDelete(
        item: NamedEntity,
    ) {

        const confirmed =
            window.confirm(
                `Delete ${item.name}?`,
            )

        if (
            !confirmed
        ) {
            return
        }

        setError(
            null,
        )

        deleteMutation.mutate(
            item.id,
        )
    }

    const isMutating =
        saveMutation.isPending ||
        deleteMutation.isPending


    return (
        <section className="grid items-start gap-5 lg:grid-cols-[330px_minmax(0,1fr)]">
            <div className="premium-card overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/55 shadow-[0_24px_70px_-45px_rgba(14,165,233,0.2)] backdrop-blur-xl">
                <div className="border-b border-slate-800/80 p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-900/50 bg-sky-950/30 text-sky-400">
                            {
                                editingId !==
                                null
                                    ? (
                                        <Pencil
                                            size={16}
                                        />
                                    )
                                    : (
                                        <Plus
                                            size={17}
                                        />
                                    )
                            }
                        </div>

                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-sky-400">
                                {
                                    editingId !==
                                    null
                                        ? 'Edit entry'
                                        : 'New entry'
                                }
                            </p>

                            <h2 className="mt-0.5 text-lg font-bold tracking-tight text-white">
                                {
                                    editingId !==
                                    null
                                        ? `Edit ${singular}`
                                        : `Add ${singular}`
                                }
                            </h2>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="p-5"
                >
                    <label
                        htmlFor={
                            `${singular.toLowerCase()}-name`
                        }
                        className="block"
                    >
                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                            Name
                        </span>

                        <input
                            id={
                                `${singular.toLowerCase()}-name`
                            }
                            value={
                                name
                            }
                            onChange={
                                event =>
                                    handleNameChange(
                                        event.target.value,
                                    )
                            }
                            disabled={
                                isMutating
                            }
                            autoComplete="off"
                            placeholder={
                                `Enter ${singular.toLowerCase()} name`
                            }
                            className="min-h-12 w-full rounded-xl border border-slate-700 bg-[#020817]/85 px-4 text-sm text-white outline-none transition duration-200 placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                    </label>
                    {
                        error && (
                            <div
                                role="alert"
                                className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-900/40 bg-red-950/20 p-3 text-xs leading-5 text-red-300"
                            >
                                <AlertCircle
                                    size={15}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>
                                    {error}
                                </span>
                            </div>
                        )
                    }

                    <div className="mt-5 flex gap-2">
                        <button
                            type="submit"
                            disabled={
                                isMutating ||
                                !name.trim()
                            }
                            className="shine-button inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 text-sm font-bold text-slate-950 transition duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                            {
                                saveMutation.isPending
                                    ? (
                                        <>
                                            <LoaderCircle
                                                size={15}
                                                className="animate-spin"
                                            />

                                            Saving...
                                        </>
                                    )
                                    : editingId !==
                                    null
                                        ? (
                                            <>
                                                <Check
                                                    size={15}
                                                />

                                                Save changes
                                            </>
                                        )
                                        : (
                                            <>
                                                <Plus
                                                    size={15}
                                                />

                                                Add {singular}
                                            </>
                                        )
                            }
                        </button>
                        {
                            editingId !==
                            null && (

                                <button
                                    type="button"
                                    onClick={
                                        cancelEdit
                                    }
                                    disabled={
                                        isMutating
                                    }
                                    aria-label="Cancel editing"
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 text-slate-400 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <X size={16}/>
                                </button>
                            )
                        }
                    </div>
                </form>
            </div>

            <div className="premium-card min-w-0 overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/55 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 px-5 py-4 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950/70 text-sky-400">
                            <Tags
                                size={17}
                            />
                        </div>

                        <div className="min-w-0">
                            <h2 className="truncate text-lg font-bold tracking-tight text-white">
                                {title}
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Manage catalog {title.toLowerCase()}
                            </p>
                        </div>
                    </div>
                    {
                        !isLoading &&
                        !isError && (

                            <span className="shrink-0 rounded-full border border-slate-800 bg-[#020817]/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                {data.length} total
                            </span>
                        )
                    }
                </div>
                {
                    isLoading && (
                        <div className="flex min-h-52 items-center justify-center p-6">
                            <div className="text-center">
                                <LoaderCircle
                                    size={22}
                                    className="mx-auto animate-spin text-sky-400"
                                />

                                <p className="mt-3 text-sm text-slate-500">
                                    Loading {title.toLowerCase()}...
                                </p>
                            </div>
                        </div>
                    )
                }

                {
                    isError && (
                        <div className="flex min-h-52 items-center justify-center p-6 text-center">
                            <div>
                                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-red-900/40 bg-red-950/20 text-red-400">
                                    <AlertCircle size={18}/>
                                </div>

                                <p className="mt-3 text-sm font-semibold text-red-300">
                                    Unable to load {title.toLowerCase()}
                                </p>

                                <p className="mt-1 text-xs text-slate-600">
                                    Please try again later.
                                </p>
                            </div>
                        </div>
                    )
                }

                {
                    !isLoading &&
                    !isError &&
                    data.length ===
                    0 && (
                        <div className="flex min-h-52 items-center justify-center p-6 text-center">
                            <div>
                                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 text-slate-600">
                                    <Tags size={18}/>
                                </div>

                                <p className="mt-3 text-sm font-semibold text-slate-300">
                                    No {title.toLowerCase()} yet
                                </p>

                                <p className="mt-1 text-xs text-slate-600">
                                    Add the first {singular.toLowerCase()} using the form.
                                </p>
                            </div>
                        </div>
                    )
                }

                {
                    !isLoading &&
                    !isError &&
                    data.length >
                    0 && (
                        <div className="divide-y divide-slate-800/70">
                            {
                                data.map(
                                    item => {

                                        const isEditing =
                                            editingId ===
                                            item.id

                                        const isDeleting =
                                            deleteMutation.isPending &&
                                            deleteMutation.variables ===
                                            item.id

                                        return (
                                            <div
                                                key={
                                                    item.id
                                                }
                                                className={
                                                    isEditing
                                                        ? 'flex min-h-[72px] items-center justify-between gap-4 bg-sky-950/15 px-5 py-3.5 sm:px-6'
                                                        : 'flex min-h-[72px] items-center justify-between gap-4 px-5 py-3.5 transition duration-200 hover:bg-slate-800/30 sm:px-6'
                                                }
                                            >

                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div
                                                        className={
                                                            isEditing
                                                                ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-900/60 bg-sky-950/30 text-sky-400'
                                                                : 'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-[#020817]/60 text-slate-600'
                                                        }
                                                    >

                                                        <Tags size={14}/>
                                                    </div>

                                                    <div className="min-w-0">

                                                        <p className="truncate text-sm font-semibold text-slate-200">
                                                            {
                                                                item.name
                                                            }
                                                        </p>

                                                        {
                                                            isEditing && (

                                                                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-sky-400">
                                                                    Editing
                                                                </p>
                                                            )
                                                        }
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
                                                        disabled={
                                                            isMutating
                                                        }
                                                        aria-label={
                                                            `Edit ${item.name}`
                                                        }
                                                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/40 px-3 text-xs font-semibold text-slate-400 transition hover:border-sky-900 hover:bg-sky-950/20 hover:text-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >

                                                        <Pencil size={13}/>

                                                        <span className="hidden sm:inline">
                                                            Edit
                                                        </span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={
                                                            () =>
                                                                handleDelete(
                                                                    item,
                                                                )
                                                        }
                                                        disabled={
                                                            isMutating
                                                        }
                                                        aria-label={
                                                            `Delete ${item.name}`
                                                        }
                                                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-950 bg-red-950/10 px-3 text-xs font-semibold text-red-400 transition hover:border-red-900 hover:bg-red-950/30 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        {
                                                            isDeleting
                                                                ? (
                                                                    <LoaderCircle
                                                                        size={13}
                                                                        className="animate-spin"
                                                                    />
                                                                )
                                                                : (
                                                                    <Trash2
                                                                        size={13}
                                                                    />
                                                                )
                                                        }

                                                        <span className="hidden sm:inline">
                                                            {
                                                                isDeleting
                                                                    ? 'Deleting'
                                                                    : 'Delete'
                                                            }
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    },
                                )
                            }
                        </div>
                    )
                }
            </div>
        </section>
    )
}