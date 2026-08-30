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

import {
    createInventoryItem,
    deleteInventoryItem,
    getInventory,
    getStoreCatalogProducts,
    updateInventoryItem,
} from '../../api/storeApi'

import type {
    InventoryItem,
    StockStatus,
} from '../../types/store'

export default function InventoryManager({
                                             storeId,
                                         }: {
    storeId: number
}) {

    const queryClient =
        useQueryClient()

    const [page, setPage] =
        useState(0)

    const [searchInput, setSearchInput] =
        useState('')

    const [search, setSearch] =
        useState('')

    const [
        editingItem,
        setEditingItem,
    ] =
        useState<InventoryItem | null>(
            null,
        )

    const [productId, setProductId] =
        useState('')

    const [price, setPrice] =
        useState('')

    const [quantity, setQuantity] =
        useState('')

    const [status, setStatus] =
        useState<StockStatus>(
            'IN_STOCK',
        )

    const [error, setError] =
        useState<string | null>(null)

    const inventoryQuery =
        useQuery({

            queryKey: [
                'store-inventory',
                storeId,
                search,
                page,
            ],

            queryFn:
                () =>
                    getInventory(
                        storeId,
                        {
                            q: search,
                            page,
                            size: 10,
                            sort:
                                'nameAsc',
                        },
                    ),
        })

    const productsQuery =
        useQuery({

            queryKey: [
                'store-product-catalog',
            ],

            queryFn:
                () =>
                    getStoreCatalogProducts(),
        })

    const saveMutation =
        useMutation({

            mutationFn:
                async () => {

                    const numericPrice =
                        Number(price)

                    const numericQuantity =
                        Number(quantity)

                    if (editingItem) {

                        return updateInventoryItem(
                            storeId,
                            editingItem.id,
                            {
                                price:
                                numericPrice,

                                quantity:
                                numericQuantity,

                                status,
                            },
                        )
                    }

                    return createInventoryItem(
                        storeId,
                        {
                            productId:
                                Number(
                                    productId,
                                ),

                            price:
                            numericPrice,

                            quantity:
                            numericQuantity,

                            status,
                        },
                    )
                },

            onSuccess:
                async () => {

                    resetForm()

                    await queryClient
                        .invalidateQueries({
                            queryKey: [
                                'store-inventory',
                                storeId,
                            ],
                        })
                },

            onError:
                () => {

                    setError(
                        'Unable to save inventory item. Check product, quantity, status and duplicates.',
                    )
                },
        })

    const deleteMutation =
        useMutation({

            mutationFn:
                (
                    inventoryId:
                    number,
                ) =>
                    deleteInventoryItem(
                        storeId,
                        inventoryId,
                    ),

            onSuccess:
                async () => {

                    await queryClient
                        .invalidateQueries({
                            queryKey: [
                                'store-inventory',
                                storeId,
                            ],
                        })
                },
        })

    function handleSearch(
        event:
        FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault()

        setPage(0)

        setSearch(
            searchInput.trim(),
        )
    }

    function handleSubmit(
        event:
        FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault()

        if (
            !editingItem &&
            !productId
        ) {

            setError(
                'Product is required.',
            )

            return
        }

        if (
            price === '' ||
            quantity === ''
        ) {

            setError(
                'Price and quantity are required.',
            )

            return
        }

        setError(null)

        saveMutation.mutate()
    }

    function beginEdit(
        item: InventoryItem,
    ) {

        setEditingItem(
            item
        )

        setProductId(
            String(
                item.product.id,
            )
        )

        setPrice(
            String(
                item.price,
            )
        )

        setQuantity(
            String(
                item.quantity,
            )
        )

        setStatus(
            item.status
        )

        setError(null)
    }

    function resetForm() {

        setEditingItem(null)
        setProductId('')
        setPrice('')
        setQuantity('')
        setStatus('IN_STOCK')
        setError(null)
    }

    function handleDelete(
        item: InventoryItem,
    ) {

        if (
            !window.confirm(
                `Remove ${item.product.name} from this store?`,
            )
        ) {
            return
        }

        deleteMutation.mutate(
            item.id,
        )
    }

    const data =
        inventoryQuery.data

    return (
        <div className="space-y-6">

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <h2 className="text-xl font-semibold">
                    {
                        editingItem
                            ? 'Update Inventory'
                            : 'Add Product to Inventory'
                    }
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 grid gap-4 md:grid-cols-4"
                >

                    <div>

                        <label className="mb-2 block text-sm text-slate-300">
                            Product
                        </label>

                        <select
                            value={
                                productId
                            }
                            disabled={
                                editingItem !==
                                null
                            }
                            onChange={
                                event =>
                                    setProductId(
                                        event
                                            .target
                                            .value,
                                    )
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 disabled:opacity-60"
                        >

                            <option value="">
                                Select product
                            </option>

                            {
                                productsQuery
                                    .data
                                    ?.content
                                    .map(
                                        product => (

                                            <option
                                                key={
                                                    product.id
                                                }
                                                value={
                                                    product.id
                                                }
                                            >
                                                {
                                                    product.name
                                                }
                                            </option>
                                        ),
                                    )
                            }

                        </select>

                    </div>

                    <div>

                        <label className="mb-2 block text-sm text-slate-300">
                            Price
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={price}
                            onChange={
                                event =>
                                    setPrice(
                                        event
                                            .target
                                            .value,
                                    )
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm text-slate-300">
                            Quantity
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={
                                quantity
                            }
                            onChange={
                                event =>
                                    setQuantity(
                                        event
                                            .target
                                            .value,
                                    )
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm text-slate-300">
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(event.target.value as StockStatus)
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                        >
                            <option value="IN_STOCK">
                                In Stock
                            </option>

                            <option value="LOW_STOCK">
                                Low Stock
                            </option>

                            <option value="OUT_OF_STOCK">
                                Out of Stock
                            </option>
                        </select>

                    </div>

                    {
                        error && (
                            <p className="text-sm text-red-400 md:col-span-4">
                                {error}
                            </p>
                        )
                    }

                    <div className="flex gap-3 md:col-span-4">

                        <button
                            disabled={
                                saveMutation
                                    .isPending
                            }
                            className="rounded-xl bg-sky-500 px-5 py-3 font-semibold text-slate-950"
                        >
                            {
                                saveMutation
                                    .isPending
                                    ? 'Saving...'
                                    : editingItem
                                        ? 'Save Changes'
                                        : 'Add Product'
                            }
                        </button>

                        {
                            editingItem && (

                                <button
                                    type="button"
                                    onClick={
                                        resetForm
                                    }
                                    className="rounded-xl border border-slate-700 px-5 py-3"
                                >
                                    Cancel
                                </button>
                            )
                        }

                    </div>

                </form>

            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900">

                <div className="flex flex-col gap-4 border-b border-slate-800 p-6 md:flex-row md:items-center md:justify-between">

                    <div>

                        <h2 className="text-xl font-semibold">
                            Inventory
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            {
                                data
                                    ?.totalElements ??
                                0
                            } products
                        </p>

                    </div>

                    <form
                        onSubmit={
                            handleSearch
                        }
                        className="flex gap-2"
                    >

                        <input
                            placeholder="Search inventory..."
                            value={
                                searchInput
                            }
                            onChange={
                                event =>
                                    setSearchInput(
                                        event
                                            .target
                                            .value,
                                    )
                            }
                            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2"
                        />

                        <button className="rounded-xl border border-slate-700 px-4 py-2">
                            Search
                        </button>

                    </form>

                </div>

                <div className="divide-y divide-slate-800">

                    {
                        data?.content.map(
                            item => (

                                <article
                                    key={
                                        item.id
                                    }
                                    className="grid gap-4 p-6 md:grid-cols-[1fr_auto]"
                                >

                                    <div>

                                        <h3 className="font-semibold">
                                            {
                                                item
                                                    .product
                                                    .name
                                            }
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-400">
                                            {
                                                item
                                                    .product
                                                    .brand
                                                    .name
                                            }
                                            {' · '}
                                            {
                                                item
                                                    .product
                                                    .category
                                                    .name
                                            }
                                        </p>

                                        <div className="mt-4 flex flex-wrap gap-4 text-sm">

                                            <span>
                                                {
                                                    item.price
                                                } MKD
                                            </span>

                                            <span>
                                                Qty:{' '}
                                                {
                                                    item.quantity
                                                }
                                            </span>

                                            <span>
                                                {
                                                    item.status
                                                        .replaceAll(
                                                            '_',
                                                            ' ',
                                                        )
                                                }
                                            </span>

                                        </div>

                                    </div>

                                    <div className="flex gap-2">

                                        <button
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

                                </article>
                            ),
                        )
                    }

                </div>

                {
                    data &&
                    data.totalPages > 1 && (

                        <div className="flex items-center justify-between border-t border-slate-800 p-6">

                            <button
                                disabled={
                                    data.first
                                }
                                onClick={
                                    () =>
                                        setPage(
                                            current =>
                                                Math.max(
                                                    0,
                                                    current -
                                                    1,
                                                ),
                                        )
                                }
                            >
                                Previous
                            </button>

                            <span className="text-sm text-slate-400">
                                Page {
                                data.page +
                                1
                            } of {
                                data
                                    .totalPages
                            }
                            </span>

                            <button
                                disabled={
                                    data.last
                                }
                                onClick={
                                    () =>
                                        setPage(
                                            current =>
                                                current +
                                                1,
                                        )
                                }
                            >
                                Next
                            </button>

                        </div>
                    )
                }

            </section>

        </div>
    )
}