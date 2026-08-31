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

import {
    formatMkd,
} from '../../lib/format'

import type {
    InventoryItem,
    StockStatus,
} from '../../types/store'

import EmptyState
    from '../ui/EmptyState'

import ErrorState
    from '../ui/ErrorState'

import LoadingState
    from '../ui/LoadingState'

import StatusBadge
    from '../ui/StatusBadge'


export default function InventoryManager({
                                             storeId,
                                         }: {
    storeId: number
}) {

    const queryClient =
        useQueryClient()


    const [
        page,
        setPage,
    ] =
        useState(0)


    const [
        searchInput,
        setSearchInput,
    ] =
        useState('')


    const [
        search,
        setSearch,
    ] =
        useState('')


    const [
        editingItem,
        setEditingItem,
    ] =
        useState<InventoryItem | null>(
            null,
        )


    const [
        productId,
        setProductId,
    ] =
        useState('')


    const [
        price,
        setPrice,
    ] =
        useState('')


    const [
        quantity,
        setQuantity,
    ] =
        useState('')


    const [
        status,
        setStatus,
    ] =
        useState<StockStatus>(
            'IN_STOCK',
        )


    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null,
        )


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
                            q:
                            search,

                            page,

                            size:
                                10,

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


    async function refreshStoreData() {

        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: [
                    'store-inventory',
                    storeId,
                ],
            }),

            queryClient.invalidateQueries({
                queryKey: [
                    'store-dashboard',
                    storeId,
                ],
            }),

            queryClient.invalidateQueries({
                queryKey: [
                    'owner-dashboard',
                ],
            }),

            queryClient.invalidateQueries({
                queryKey: [
                    'store-activity',
                    storeId,
                ],
            }),
        ])
    }


    const saveMutation =
        useMutation({
            mutationFn:
                async () => {

                    const numericPrice =
                        Number(
                            price,
                        )

                    const numericQuantity =
                        Number(
                            quantity,
                        )


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

                    await refreshStoreData()
                },

            onError:
                () => {

                    setError(
                        'Unable to save inventory item. Check product, price, quantity, status and duplicates.',
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
                async (
                    _data,
                    inventoryId,
                ) => {

                    if (
                        editingItem?.id ===
                        inventoryId
                    ) {
                        resetForm()
                    }


                    setError(
                        null,
                    )


                    await refreshStoreData()
                },

            onError:
                () => {

                    setError(
                        'Unable to delete inventory item.',
                    )
                },
        })


    function handleSearch(
        event:
        FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault()

        setPage(
            0,
        )

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


        const numericProductId =
            Number(
                productId,
            )

        const numericPrice =
            Number(
                price,
            )

        const numericQuantity =
            Number(
                quantity,
            )


        if (
            !editingItem &&
            (
                !Number.isInteger(
                    numericProductId,
                ) ||
                numericProductId <= 0
            )
        ) {

            setError(
                'Select a valid product.',
            )

            return
        }


        if (
            !Number.isFinite(
                numericPrice,
            ) ||
            numericPrice < 0
        ) {

            setError(
                'Price must be zero or greater.',
            )

            return
        }


        if (
            !Number.isInteger(
                numericQuantity,
            ) ||
            numericQuantity < 0
        ) {

            setError(
                'Quantity must be a whole number of zero or greater.',
            )

            return
        }


        if (
            numericQuantity === 0 &&
            status !==
            'OUT_OF_STOCK'
        ) {

            setError(
                'Quantity 0 must use Out of Stock status.',
            )

            return
        }


        if (
            numericQuantity > 0 &&
            status ===
            'OUT_OF_STOCK'
        ) {

            setError(
                'A product with quantity above 0 cannot be Out of Stock.',
            )

            return
        }


        setError(
            null,
        )

        saveMutation.mutate()
    }


    function beginEdit(
        item: InventoryItem,
    ) {

        setEditingItem(
            item,
        )

        setProductId(
            String(
                item.product.id,
            ),
        )

        setPrice(
            String(
                item.price,
            ),
        )

        setQuantity(
            String(
                item.quantity,
            ),
        )

        setStatus(
            item.status,
        )

        setError(
            null,
        )
    }


    function resetForm() {

        setEditingItem(
            null,
        )

        setProductId(
            '',
        )

        setPrice(
            '',
        )

        setQuantity(
            '',
        )

        setStatus(
            'IN_STOCK',
        )

        setError(
            null,
        )
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


        setError(
            null,
        )

        deleteMutation.mutate(
            item.id,
        )
    }


    const data =
        inventoryQuery.data


    return (
        <div className="space-y-6">

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">

                <div>

                    <h2 className="text-xl font-semibold">
                        {
                            editingItem
                                ? 'Update Inventory'
                                : 'Add Product to Inventory'
                        }
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                        {
                            editingItem
                                ? `Editing ${editingItem.product.name}.`
                                : 'Add a catalog product and define its current price and stock.'
                        }
                    </p>

                </div>


                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                >

                    <FieldWrapper
                        label="Product"
                        htmlFor="inventory-product"
                    >

                        <select
                            id="inventory-product"
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
                                        event.target.value,
                                    )
                            }
                            className={inputClassName}
                        >

                            <option value="">
                                Select product
                            </option>


                            {
                                productsQuery.data?.content.map(
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

                    </FieldWrapper>


                    <FieldWrapper
                        label="Price"
                        htmlFor="inventory-price"
                    >

                        <input
                            id="inventory-price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                                price
                            }
                            onChange={
                                event =>
                                    setPrice(
                                        event.target.value,
                                    )
                            }
                            placeholder="0.00"
                            className={inputClassName}
                        />

                    </FieldWrapper>


                    <FieldWrapper
                        label="Quantity"
                        htmlFor="inventory-quantity"
                    >

                        <input
                            id="inventory-quantity"
                            type="number"
                            min="0"
                            step="1"
                            value={
                                quantity
                            }
                            onChange={
                                event =>
                                    setQuantity(
                                        event.target.value,
                                    )
                            }
                            placeholder="0"
                            className={inputClassName}
                        />

                    </FieldWrapper>


                    <FieldWrapper
                        label="Status"
                        htmlFor="inventory-status"
                    >

                        <select
                            id="inventory-status"
                            value={
                                status
                            }
                            onChange={
                                event =>
                                    setStatus(
                                        event.target.value as StockStatus,
                                    )
                            }
                            className={inputClassName}
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

                    </FieldWrapper>


                    {
                        error && (

                            <p
                                role="alert"
                                className="rounded-xl border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-300 sm:col-span-2 xl:col-span-4"
                            >
                                {error}
                            </p>
                        )
                    }


                    <div className="flex flex-wrap gap-3 sm:col-span-2 xl:col-span-4">

                        <button
                            type="submit"
                            disabled={
                                saveMutation.isPending
                            }
                            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-sky-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {
                                saveMutation.isPending
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
                                    disabled={
                                        saveMutation.isPending
                                    }
                                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-700 px-5 py-2.5 font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            )
                        }

                    </div>

                </form>

            </section>


            <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

                <div className="flex flex-col gap-4 border-b border-slate-800 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">

                    <div>

                        <h2 className="text-xl font-semibold">
                            Inventory
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            {
                                data
                                    ? `${data.totalElements} products`
                                    : 'Manage products available at this store.'
                            }
                        </p>

                    </div>


                    <form
                        onSubmit={
                            handleSearch
                        }
                        className="flex w-full flex-col gap-2 sm:flex-row md:w-auto"
                    >

                        <label className="sr-only" htmlFor="inventory-search">
                            Search inventory
                        </label>

                        <input
                            id="inventory-search"
                            type="search"
                            placeholder="Search inventory..."
                            value={
                                searchInput
                            }
                            onChange={
                                event =>
                                    setSearchInput(
                                        event.target.value,
                                    )
                            }
                            className={`${inputClassName} sm:w-64`}
                        />

                        <button
                            type="submit"
                            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold transition hover:border-slate-500 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                        >
                            Search
                        </button>

                    </form>

                </div>


                {
                    inventoryQuery.isLoading && (

                        <div className="p-5 sm:p-6">

                            <LoadingState
                                message="Loading inventory..."
                            />

                        </div>
                    )
                }


                {
                    inventoryQuery.isError && (

                        <div className="p-5 sm:p-6">

                            <ErrorState
                                title="Inventory unavailable"
                                message="ShelfRadar could not load this store inventory."
                                onRetry={
                                    () => {
                                        void inventoryQuery
                                            .refetch()
                                    }
                                }
                            />

                        </div>
                    )
                }


                {
                    data &&
                    data.content.length ===
                    0 &&
                    !inventoryQuery.isLoading &&
                    !inventoryQuery.isError && (

                        <div className="p-5 sm:p-6">

                            <EmptyState
                                title={
                                    search
                                        ? 'No matching products'
                                        : 'No inventory items yet'
                                }
                                message={
                                    search
                                        ? 'No inventory products match the current search.'
                                        : 'Add your first product to make this store searchable.'
                                }
                            />

                        </div>
                    )
                }


                {
                    data &&
                    data.content.length >
                    0 && (

                        <div className="divide-y divide-slate-800">

                            {
                                data.content.map(
                                    item => (

                                        <article
                                            key={
                                                item.id
                                            }
                                            className="grid gap-5 p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_auto]"
                                        >

                                            <div className="min-w-0">

                                                <div className="flex flex-wrap items-center gap-3">

                                                    <h3 className="font-semibold">
                                                        {
                                                            item.product.name
                                                        }
                                                    </h3>


                                                    <StatusBadge
                                                        status={
                                                            item.status
                                                        }
                                                    />

                                                </div>


                                                <p className="mt-1 text-sm text-slate-400">
                                                    {
                                                        item.product.brand.name
                                                    }
                                                    {' · '}
                                                    {
                                                        item.product.category.name
                                                    }
                                                </p>


                                                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">

                                                    <span className="font-semibold text-slate-200">
                                                        {
                                                            formatMkd(
                                                                item.price,
                                                            )
                                                        }
                                                    </span>

                                                    <span className="text-slate-400">
                                                        Quantity:{' '}
                                                        {
                                                            item.quantity
                                                        }
                                                    </span>

                                                </div>

                                            </div>


                                            <div className="flex flex-wrap gap-2 md:justify-end">

                                                <button
                                                    type="button"
                                                    onClick={
                                                        () =>
                                                            beginEdit(
                                                                item,
                                                            )
                                                    }
                                                    disabled={
                                                        saveMutation.isPending ||
                                                        deleteMutation.isPending
                                                    }
                                                    className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium transition hover:border-slate-500 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-50"
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
                                                    disabled={
                                                        saveMutation.isPending ||
                                                        deleteMutation.isPending
                                                    }
                                                    className="inline-flex min-h-10 items-center justify-center rounded-lg border border-red-900 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-950/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50"
                                                >
                                                    {
                                                        deleteMutation.isPending &&
                                                        deleteMutation.variables ===
                                                        item.id
                                                            ? 'Deleting...'
                                                            : 'Delete'
                                                    }
                                                </button>

                                            </div>

                                        </article>
                                    ),
                                )
                            }

                        </div>
                    )
                }


                {
                    data &&
                    data.totalPages >
                    1 && (

                        <div className="flex items-center justify-between gap-4 border-t border-slate-800 p-5 sm:p-6">

                            <button
                                type="button"
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
                                className="min-h-10 rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Previous
                            </button>


                            <span className="text-center text-sm text-slate-400">
                                Page{' '}
                                {
                                    data.page +
                                    1
                                }{' '}
                                of{' '}
                                {
                                    data.totalPages
                                }
                            </span>


                            <button
                                type="button"
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
                                className="min-h-10 rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
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


function FieldWrapper({
                          label,
                          htmlFor,
                          children,
                      }: {
    label: string
    htmlFor: string
    children: React.ReactNode
}) {

    return (
        <div>

            <label
                htmlFor={
                    htmlFor
                }
                className="mb-2 block text-sm font-medium text-slate-300"
            >
                {label}
            </label>

            {children}

        </div>
    )
}


const inputClassName =
    'w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60'