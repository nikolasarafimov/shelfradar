import {
    useState,
} from 'react'

import type {
    FormEvent,
    ReactNode,
} from 'react'

import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'

import {
    Boxes,
    ChevronLeft,
    ChevronRight,
    CircleDollarSign,
    LoaderCircle,
    Package,
    PackagePlus,
    Pencil,
    Search,
    Trash2,
    X,
} from 'lucide-react'

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

                    if (
                        editingItem !==
                        null
                    ) {
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
                    inventoryId: number,
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

                    const currentData =
                        inventoryQuery.data

                    if (
                        currentData &&
                        currentData.content.length ===
                        1 &&
                        page >
                        0
                    ) {
                        setPage(
                            current =>
                                Math.max(
                                    0,
                                    current - 1,
                                ),
                        )
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
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()

        setPage(
            0,
        )

        setSearch(
            searchInput.trim(),
        )
    }

    function clearSearch() {

        setSearchInput(
            '',
        )

        setSearch(
            '',
        )

        setPage(
            0,
        )
    }

    function handleSubmit(
        event: FormEvent<HTMLFormElement>,
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
                numericProductId <=
                0
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
            numericPrice <
            0
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
            numericQuantity <
            0
        ) {
            setError(
                'Quantity must be a whole number of zero or greater.',
            )
            return
        }

        if (
            numericQuantity ===
            0 &&
            status !==
            'OUT_OF_STOCK'
        ) {
            setError(
                'Quantity 0 must use Out of Stock status.',
            )
            return
        }

        if (
            numericQuantity >
            0 &&
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
            top:
                0,

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

    function clearFormError() {

        if (
            error
        ) {

            setError(
                null,
            )
        }
    }

    function handleDelete(
        item: InventoryItem,
    ) {

        const confirmed =
            window.confirm(
                `Remove ${item.product.name} from this store?`,
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

    const data =
        inventoryQuery.data

    const isMutating =
        saveMutation.isPending ||
        deleteMutation.isPending

    const catalogUnavailable =
        !editingItem &&
        (
            productsQuery.isLoading ||
            productsQuery.isError
        )

    return (
        <div className="space-y-6">
            <section className="premium-card overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/55 shadow-[0_24px_70px_-45px_rgba(14,165,233,0.2)] backdrop-blur-xl">
                <div className="flex items-center gap-3 border-b border-slate-800/80 px-5 py-5 sm:px-6">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-900/50 bg-sky-950/30 text-sky-400">
                        {
                            editingItem
                                ? (
                                    <Pencil
                                        size={16}
                                    />
                                )
                                : (
                                    <PackagePlus
                                        size={17}
                                    />
                                )
                        }
                    </div>

                    <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-sky-400">
                            {
                                editingItem
                                    ? 'Edit store offer'
                                    : 'New store offer'
                            }
                        </p>

                        <h2 className="mt-0.5 truncate text-lg font-bold tracking-tight text-white">
                            {
                                editingItem
                                    ? 'Update Inventory'
                                    : 'Add Product to Inventory'
                            }
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            {
                                editingItem
                                    ? `Editing ${editingItem.product.name}`
                                    : 'Define the product price, quantity and availability.'
                            }
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-4"
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
                                null ||
                                isMutating ||
                                productsQuery.isLoading ||
                                productsQuery.isError
                            }
                            onChange={
                                event => {

                                    setProductId(
                                        event.target.value,
                                    )

                                    clearFormError()
                                }
                            }
                            className={inputClassName}
                        >
                            <option value="">
                                {
                                    productsQuery.isLoading
                                        ? 'Loading products...'
                                        : productsQuery.isError
                                            ? 'Catalog unavailable'
                                            : 'Select product'
                                }
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
                        <div className="relative">
                            <CircleDollarSign
                                size={15}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                            />

                            <input
                                id="inventory-price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={
                                    price
                                }
                                disabled={
                                    isMutating
                                }
                                onChange={
                                    event => {

                                        setPrice(
                                            event.target.value,
                                        )

                                        clearFormError()
                                    }
                                }
                                placeholder="0.00"
                                className={`${inputClassName} pl-11`}
                            />
                        </div>
                    </FieldWrapper>

                    <FieldWrapper
                        label="Quantity"
                        htmlFor="inventory-quantity"
                    >
                        <div className="relative">
                            <Boxes
                                size={15}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                            />

                            <input
                                id="inventory-quantity"
                                type="number"
                                min="0"
                                step="1"
                                value={
                                    quantity
                                }
                                disabled={
                                    isMutating
                                }
                                onChange={
                                    event => {

                                        setQuantity(
                                            event.target.value,
                                        )

                                        clearFormError()
                                    }
                                }
                                placeholder="0"
                                className={`${inputClassName} pl-11`}
                            />
                        </div>
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
                            disabled={
                                isMutating
                            }
                            onChange={
                                event => {

                                    setStatus(
                                        event.target.value as StockStatus,
                                    )

                                    clearFormError()
                                }
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
                        !editingItem &&
                        productsQuery.isError && (
                            <div
                                role="alert"
                                className="rounded-xl border border-red-900/40 bg-red-950/20 px-4 py-3 text-xs leading-5 text-red-300 sm:col-span-2 xl:col-span-4"
                            >
                                Product catalog could not be loaded. Adding a new inventory item is temporarily unavailable.
                            </div>
                        )
                    }

                    {
                        error && (
                            <div
                                role="alert"
                                className="rounded-xl border border-red-900/40 bg-red-950/20 px-4 py-3 text-xs leading-5 text-red-300 sm:col-span-2 xl:col-span-4"
                            >
                                {error}
                            </div>
                        )
                    }

                    <div className="flex flex-wrap gap-2 sm:col-span-2 xl:col-span-4">
                        <button
                            type="submit"
                            disabled={
                                isMutating ||
                                catalogUnavailable ||
                                (
                                    !editingItem &&
                                    !productId
                                ) ||
                                price ===
                                '' ||
                                quantity ===
                                ''
                            }
                            className="shine-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 text-sm font-bold text-slate-950 transition duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
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
                                    : editingItem
                                        ? (
                                            <>
                                                <Pencil
                                                    size={14}
                                                />

                                                Save Changes
                                            </>
                                        )
                                        : (
                                            <>
                                                <PackagePlus
                                                    size={15}
                                                />

                                                Add Product
                                            </>
                                        )
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
                                        isMutating
                                    }
                                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/50 px-4 text-sm font-semibold text-slate-400 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <X size={14}/>
                                    Cancel
                                </button>
                            )
                        }
                    </div>
                </form>
            </section>

            <section className="premium-card overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/55 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                <div className="flex flex-col gap-5 border-b border-slate-800/80 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-sky-400">
                            Store catalog
                        </p>

                        <h2 className="mt-1 text-xl font-bold tracking-tight text-white">
                            Inventory
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            {
                                inventoryQuery.isLoading
                                    ? 'Loading inventory...'
                                    : data
                                        ? `${data.totalElements} products`
                                        : 'Manage products available at this store.'
                            }
                        </p>
                    </div>

                    <form
                        onSubmit={
                            handleSearch
                        }
                        className="flex w-full gap-2 lg:w-auto"
                    >
                        <label
                            className="sr-only"
                            htmlFor="inventory-search"
                        >
                            Search inventory
                        </label>

                        <div className="relative min-w-0 flex-1 lg:w-72">
                            <Search
                                size={15}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                            />

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
                                className="min-h-11 w-full rounded-xl border border-slate-700 bg-[#020817]/80 pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
                            />
                            {
                                searchInput && (

                                    <button
                                        type="button"
                                        onClick={
                                            clearSearch
                                        }
                                        aria-label="Clear inventory search"
                                        className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-800 hover:text-slate-300"
                                    >

                                        <X
                                            size={13}
                                        />

                                    </button>
                                )
                            }
                        </div>

                        <button
                            type="submit"
                            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-4 text-sm font-semibold text-slate-300 transition hover:border-sky-900 hover:bg-sky-950/20 hover:text-sky-300"
                        >
                            <Search size={14}/>

                            <span className="hidden sm:inline">
                                Search
                            </span>
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
                                        void inventoryQuery.refetch()
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
                            {
                                search && (
                                    <div className="mt-4 text-center">
                                        <button
                                            type="button"
                                            onClick={
                                                clearSearch
                                            }
                                            className="text-xs font-semibold text-sky-400 transition hover:text-sky-300"
                                        >
                                            Clear search
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                    )
                }

                {
                    data &&
                    data.content.length >
                    0 &&
                    !inventoryQuery.isLoading &&
                    !inventoryQuery.isError && (
                        <div className="divide-y divide-slate-800/70">
                            {
                                data.content.map(
                                    item => {

                                        const isEditing =
                                            editingItem?.id ===
                                            item.id

                                        const isDeleting =
                                            deleteMutation.isPending &&
                                            deleteMutation.variables ===
                                            item.id

                                        return (
                                            <article
                                                key={
                                                    item.id
                                                }
                                                className={
                                                    isEditing
                                                        ? 'grid gap-5 bg-sky-950/15 px-5 py-4 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto]'
                                                        : 'grid gap-5 px-5 py-4 transition duration-200 hover:bg-slate-800/25 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto]'
                                                }
                                            >
                                                <div className="flex min-w-0 items-start gap-4">
                                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-800 bg-[#020817]/70 text-slate-600">
                                                        <Package
                                                            size={21}
                                                            strokeWidth={1.6}
                                                        />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2.5">
                                                            <h3 className="truncate text-sm font-bold text-slate-100">
                                                                {
                                                                    item.product.name
                                                                }
                                                            </h3>

                                                            <StatusBadge
                                                                status={
                                                                    item.status
                                                                }
                                                            />
                                                            {
                                                                isEditing && (

                                                                    <span className="rounded-full border border-amber-900/50 bg-amber-950/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-amber-400">
                                                                        Editing
                                                                    </span>
                                                                )
                                                            }
                                                        </div>

                                                        <p className="mt-1.5 truncate text-xs text-slate-500">
                                                            {
                                                                item.product.brand.name
                                                            }
                                                            <span className="mx-1.5 text-slate-700">
                                                                ·
                                                            </span>
                                                            {
                                                                item.product.category.name
                                                            }
                                                        </p>

                                                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                                                            <span className="text-sm font-bold text-slate-200">
                                                                {
                                                                    formatMkd(
                                                                        item.price,
                                                                    )
                                                                }
                                                            </span>

                                                            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                                                                <Boxes
                                                                    size={12}
                                                                />

                                                                Quantity:{' '}

                                                                <strong className="font-semibold text-slate-300">
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </strong>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex shrink-0 flex-wrap items-start gap-2 md:justify-end">
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
                                                            `Edit ${item.product.name}`
                                                        }
                                                        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/50 px-3 text-xs font-semibold text-slate-400 transition hover:border-sky-900 hover:bg-sky-950/20 hover:text-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <Pencil
                                                            size={13}
                                                        />
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
                                                            isMutating
                                                        }
                                                        aria-label={
                                                            `Delete ${item.product.name}`
                                                        }
                                                        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-red-950 bg-red-950/10 px-3 text-xs font-semibold text-red-400 transition hover:border-red-900 hover:bg-red-950/30 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
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

                                                        {
                                                            isDeleting
                                                                ? 'Deleting'
                                                                : 'Delete'
                                                        }
                                                    </button>
                                                </div>
                                            </article>
                                        )
                                    },
                                )
                            }
                        </div>
                    )
                }

                {
                    data &&
                    data.totalPages >
                    1 &&
                    !inventoryQuery.isError && (
                        <div className="flex flex-col gap-3 border-t border-slate-800/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <button
                                type="button"
                                disabled={
                                    data.first ||
                                    inventoryQuery.isFetching
                                }
                                onClick={
                                    () =>
                                        setPage(
                                            current =>
                                                Math.max(
                                                    0,
                                                    current - 1,
                                                ),
                                        )
                                }
                                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/40 px-4 text-xs font-semibold text-slate-400 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                            >
                                <ChevronLeft size={14}/>
                                Previous
                            </button>

                            <span className="text-center text-xs text-slate-500">
                                Page{' '}

                                <strong className="font-semibold text-slate-300">
                                    {
                                        data.page +
                                        1
                                    }
                                </strong>

                                {' '}of{' '}

                                <strong className="font-semibold text-slate-300">
                                    {
                                        data.totalPages
                                    }
                                </strong>
                            </span>

                            <button
                                type="button"
                                disabled={
                                    data.last ||
                                    inventoryQuery.isFetching
                                }
                                onClick={
                                    () =>
                                        setPage(
                                            current =>
                                                current + 1,
                                        )
                                }
                                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/40 px-4 text-xs font-semibold text-slate-400 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                            >
                                Next
                                <ChevronRight size={14}/>
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
    children: ReactNode
}) {
    return (
        <div>
            <label
                htmlFor={
                    htmlFor
                }
                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500"
            >
                {label}
            </label>
            {children}
        </div>
    )
}

const inputClassName =
    'min-h-12 w-full rounded-xl border border-slate-700 bg-[#020817]/85 px-4 text-sm text-white outline-none transition duration-200 placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:opacity-50'