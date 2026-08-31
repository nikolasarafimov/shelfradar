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
        ])
    }


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
            Number(productId)

        const numericPrice =
            Number(price)

        const numericQuantity =
            Number(quantity)


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

        window.scrollTo({
            top: 0,
            behavior:
                'smooth',
        })
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

        const confirmed =
            window.confirm(
                `Remove ${item.product.name} from this store?`,
            )


        if (!confirmed) {
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

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <h2 className="text-xl font-semibold">
                    {
                        editingItem
                            ? 'Update Inventory'
                            : 'Add Product to Inventory'
                    }
                </h2>


                <p className="mt-1 text-sm text-slate-400">
                    {
                        editingItem
                            ? `Editing ${editingItem.product.name}`
                            : 'Add a catalog product and set its current price and stock.'
                    }
                </p>


                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="mt-6 grid gap-4 md:grid-cols-4"
                >

                    <div>

                        <label
                            htmlFor="inventory-product"
                            className="mb-2 block text-sm text-slate-300"
                        >
                            Product
                        </label>

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
                                        event
                                            .target
                                            .value,
                                    )
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 disabled:cursor-not-allowed disabled:opacity-60"
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

                        <label
                            htmlFor="inventory-price"
                            className="mb-2 block text-sm text-slate-300"
                        >
                            Price
                        </label>

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
                                        event
                                            .target
                                            .value,
                                    )
                            }
                            placeholder="0.00"
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                        />

                    </div>


                    <div>

                        <label
                            htmlFor="inventory-quantity"
                            className="mb-2 block text-sm text-slate-300"
                        >
                            Quantity
                        </label>

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
                                        event
                                            .target
                                            .value,
                                    )
                            }
                            placeholder="0"
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                        />

                    </div>


                    <div>

                        <label
                            htmlFor="inventory-status"
                            className="mb-2 block text-sm text-slate-300"
                        >
                            Status
                        </label>

                        <select
                            id="inventory-status"
                            value={
                                status
                            }
                            onChange={
                                event =>
                                    setStatus(
                                        event
                                            .target
                                            .value as StockStatus,
                                    )
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


                    <div className="flex flex-wrap gap-3 md:col-span-4">

                        <button
                            type="submit"
                            disabled={
                                saveMutation
                                    .isPending
                            }
                            className="rounded-xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-wait disabled:opacity-60"
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
                                    disabled={
                                        saveMutation
                                            .isPending
                                    }
                                    className="rounded-xl border border-slate-700 px-5 py-3 text-slate-200 transition hover:border-slate-500 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            )
                        }

                    </div>

                </form>

            </section>


            <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

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
                            }{' '}
                            products
                        </p>

                    </div>


                    <form
                        onSubmit={
                            handleSearch
                        }
                        className="flex w-full gap-2 md:w-auto"
                    >

                        <input
                            type="search"
                            aria-label="Search inventory"
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
                            className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 md:w-64"
                        />

                        <button
                            type="submit"
                            className="rounded-xl border border-slate-700 px-4 py-2 transition hover:border-slate-500"
                        >
                            Search
                        </button>

                    </form>

                </div>


                {
                    inventoryQuery.isLoading && (

                        <div className="p-10 text-center text-slate-400">
                            Loading inventory...
                        </div>
                    )
                }


                {
                    inventoryQuery.isError && (

                        <div className="p-6 text-red-400">
                            Unable to load inventory.
                        </div>
                    )
                }


                {
                    data &&
                    data.content.length ===
                    0 &&
                    !inventoryQuery.isLoading &&
                    !inventoryQuery.isError && (

                        <div className="p-10 text-center">

                            <h3 className="font-semibold">
                                No inventory items
                            </h3>

                            <p className="mt-2 text-sm text-slate-400">
                                {
                                    search
                                        ? 'No products match your search.'
                                        : 'Add a product to start building this store inventory.'
                                }
                            </p>

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
                                            className="grid gap-4 p-6 md:grid-cols-[1fr_auto]"
                                        >

                                            <div>

                                                <h3 className="font-semibold">
                                                    {
                                                        item.product.name
                                                    }
                                                </h3>

                                                <p className="mt-1 text-sm text-slate-400">
                                                    {
                                                        item.product.brand.name
                                                    }
                                                    {' · '}
                                                    {
                                                        item.product.category.name
                                                    }
                                                </p>


                                                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">

                                                    <span className="font-medium text-slate-200">
                                                        {
                                                            formatPrice(
                                                                item.price,
                                                            )
                                                        }{' '}
                                                        MKD
                                                    </span>

                                                    <span className="text-slate-400">
                                                        Qty:{' '}
                                                        {
                                                            item.quantity
                                                        }
                                                    </span>

                                                    <InventoryStatusBadge
                                                        status={
                                                            item.status
                                                        }
                                                    />

                                                </div>

                                            </div>


                                            <div className="flex items-start gap-2">

                                                <button
                                                    type="button"
                                                    onClick={
                                                        () =>
                                                            beginEdit(
                                                                item,
                                                            )
                                                    }
                                                    disabled={
                                                        saveMutation
                                                            .isPending ||
                                                        deleteMutation
                                                            .isPending
                                                    }
                                                    className="rounded-lg border border-slate-700 px-3 py-2 text-sm transition hover:border-slate-500 disabled:opacity-50"
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
                                                        saveMutation
                                                            .isPending ||
                                                        deleteMutation
                                                            .isPending
                                                    }
                                                    className="rounded-lg border border-red-900 px-3 py-2 text-sm text-red-400 transition hover:border-red-700 disabled:opacity-50"
                                                >
                                                    {
                                                        deleteMutation
                                                            .isPending
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

                        <div className="flex items-center justify-between border-t border-slate-800 p-6">

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
                                className="rounded-lg border border-slate-700 px-4 py-2 text-sm transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Previous
                            </button>


                            <span className="text-sm text-slate-400">
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
                                className="rounded-lg border border-slate-700 px-4 py-2 text-sm transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
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


function InventoryStatusBadge({
                                  status,
                              }: {
    status: StockStatus
}) {

    const styles =
        status === 'IN_STOCK'
            ? 'bg-emerald-950 text-emerald-300 ring-emerald-800'
            : status === 'LOW_STOCK'
                ? 'bg-amber-950 text-amber-300 ring-amber-800'
                : 'bg-red-950 text-red-300 ring-red-800'


    const label =
        status === 'IN_STOCK'
            ? 'In stock'
            : status === 'LOW_STOCK'
                ? 'Low stock'
                : 'Out of stock'


    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles}`}
        >
            {label}
        </span>
    )
}


function formatPrice(
    value: number,
): string {

    return new Intl.NumberFormat(
        'en-US',
        {
            minimumFractionDigits:
                0,

            maximumFractionDigits:
                2,
        },
    ).format(
        value,
    )
}