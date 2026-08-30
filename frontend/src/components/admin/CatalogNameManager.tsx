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

interface NamedEntity {
    id: number
    name: string
}

interface CatalogNameManagerProps {

    title: string

    singular: string

    queryKey: QueryKey

    loadItems:
        () => Promise<NamedEntity[]>

    createItem:
        (
            request: {
                name: string
            },
        ) => Promise<NamedEntity>

    updateItem:
        (
            id: number,
            request: {
                name: string
            },
        ) => Promise<NamedEntity>

    deleteItem:
        (
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

    const [name, setName] =
        useState('')

    const [
        editingId,
        setEditingId,
    ] =
        useState<number | null>(null)

    const [error, setError] =
        useState<string | null>(null)

    const {
        data = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey,
        queryFn: loadItems,
    })

    const saveMutation =
        useMutation({

            mutationFn:
                async () => {

                    if (editingId) {

                        return updateItem(
                            editingId,
                            {
                                name,
                            },
                        )
                    }

                    return createItem({
                        name,
                    })
                },

            onSuccess:
                async () => {

                    setName('')
                    setEditingId(null)
                    setError(null)

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
                async () => {

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

        if (!name.trim()) {
            setError(
                'Name is required.',
            )
            return
        }

        setError(null)

        saveMutation.mutate()
    }

    function beginEdit(
        item: NamedEntity,
    ) {

        setEditingId(item.id)
        setName(item.name)
        setError(null)
    }

    function cancelEdit() {

        setEditingId(null)
        setName('')
        setError(null)
    }

    function handleDelete(
        item: NamedEntity,
    ) {

        const confirmed =
            window.confirm(
                `Delete ${item.name}?`,
            )

        if (!confirmed) {
            return
        }

        deleteMutation.mutate(
            item.id,
        )
    }

    return (
        <section>

            <div className="flex flex-col gap-6 lg:flex-row">

                <div className="w-full lg:w-96">

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                        <h2 className="text-xl font-semibold">
                            {
                                editingId
                                    ? `Edit ${singular}`
                                    : `Add ${singular}`
                            }
                        </h2>

                        <form
                            className="mt-5 space-y-4"
                            onSubmit={handleSubmit}
                        >

                            <div>

                                <label
                                    htmlFor={`${singular}-name`}
                                    className="mb-2 block text-sm font-medium text-slate-300"
                                >
                                    Name
                                </label>

                                <input
                                    id={`${singular}-name`}
                                    value={name}
                                    onChange={
                                        event =>
                                            setName(
                                                event.target.value,
                                            )
                                    }
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-sky-500"
                                />

                            </div>

                            {error && (
                                <p
                                    role="alert"
                                    className="text-sm text-red-400"
                                >
                                    {error}
                                </p>
                            )}

                            <div className="flex gap-3">

                                <button
                                    type="submit"
                                    disabled={
                                        saveMutation.isPending
                                    }
                                    className="rounded-xl bg-sky-500 px-4 py-2 font-semibold text-slate-950"
                                >
                                    {
                                        saveMutation.isPending
                                            ? 'Saving...'
                                            : editingId
                                                ? 'Save changes'
                                                : `Add ${singular}`
                                    }
                                </button>

                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={
                                            cancelEdit
                                        }
                                        className="rounded-xl border border-slate-700 px-4 py-2"
                                    >
                                        Cancel
                                    </button>
                                )}

                            </div>

                        </form>

                    </div>

                </div>

                <div className="min-w-0 flex-1">

                    <div className="rounded-2xl border border-slate-800 bg-slate-900">

                        <div className="border-b border-slate-800 px-6 py-5">

                            <h2 className="text-xl font-semibold">
                                {title}
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                {data.length} total
                            </p>

                        </div>

                        {isLoading && (
                            <p className="p-6 text-slate-400">
                                Loading...
                            </p>
                        )}

                        {isError && (
                            <p className="p-6 text-red-400">
                                Unable to load data.
                            </p>
                        )}

                        {!isLoading &&
                            !isError &&
                            data.length === 0 && (

                                <p className="p-6 text-slate-400">
                                    No items found.
                                </p>
                            )}

                        <div className="divide-y divide-slate-800">

                            {data.map(
                                item => (

                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between gap-4 px-6 py-4"
                                    >

                                        <span className="font-medium">
                                            {item.name}
                                        </span>

                                        <div className="flex gap-2">

                                            <button
                                                type="button"
                                                onClick={
                                                    () =>
                                                        beginEdit(
                                                            item,
                                                        )
                                                }
                                                className="rounded-lg border border-slate-700 px-3 py-2 text-sm"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={
                                                    () =>
                                                        handleDelete(
                                                            item,
                                                        )
                                                }
                                                className="rounded-lg border border-red-900 px-3 py-2 text-sm text-red-400"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>
                                ),
                            )}

                        </div>

                    </div>

                </div>

            </div>

        </section>
    )
}