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
    AnimatePresence,
    motion,
} from 'motion/react'

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
    TriangleAlert,
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

import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import LoadingState from '../ui/LoadingState'
import StatusBadge from '../ui/StatusBadge'

interface InventoryManagerProps {
    storeId: number
}

interface InventoryFormState {
    productId: string
    price: string
    quantity: string
    status: StockStatus
}

const EMPTY_FORM: InventoryFormState = {
    productId: '',
    price: '',
    quantity: '',
    status: 'IN_STOCK',
}

const inputClassName =
    'field min-h-12 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-50'

export default function InventoryManager({
                                             storeId,
                                         }: InventoryManagerProps) {
    const queryClient =
        useQueryClient()

    const [
        page,
        setPage,
    ] = useState(0)

    const [
        searchInput,
        setSearchInput,
    ] = useState('')

    const [
        search,
        setSearch,
    ] = useState('')

    const [
        editingItem,
        setEditingItem,
    ] = useState<InventoryItem | null>(
        null,
    )

    const [
        form,
        setForm,
    ] = useState<InventoryFormState>({
        ...EMPTY_FORM,
    })

    const [
        error,
        setError,
    ] = useState<string | null>(
        null,
    )

    const [
        deleteTarget,
        setDeleteTarget,
    ] = useState<InventoryItem | null>(
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
                            q: search,
                            page,
                            size: 10,
                            sort: 'nameAsc',
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
                            form.price,
                        )

                    const numericQuantity =
                        Number(
                            form.quantity,
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

                                status:
                                form.status,
                            },
                        )
                    }

                    return createInventoryItem(
                        storeId,
                        {
                            productId:
                                Number(
                                    form.productId,
                                ),

                            price:
                            numericPrice,

                            quantity:
                            numericQuantity,

                            status:
                            form.status,
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
                        'Unable to save this inventory item. Check the product, price, quantity and stock status.',
                    )
                },
        })

    const deleteMutation =
        useMutation({
            mutationFn:
                (inventoryId: number) =>
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
                        currentData.content.length === 1 &&
                        page > 0
                    ) {
                        setPage(
                            current =>
                                Math.max(
                                    0,
                                    current - 1,
                                ),
                        )
                    }

                    setDeleteTarget(
                        null,
                    )

                    setError(
                        null,
                    )

                    await refreshStoreData()
                },

            onError:
                () => {
                    setDeleteTarget(
                        null,
                    )

                    setError(
                        'Unable to remove this inventory item.',
                    )
                },
        })

    function updateForm(
        values: Partial<InventoryFormState>,
    ) {
        setForm(
            current => ({
                ...current,
                ...values,
            }),
        )

        clearFormError()
    }

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

        const validationError =
            validateInventoryForm(
                form,
                editingItem !== null,
            )

        if (validationError) {
            setError(
                validationError,
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

        setForm({
            productId:
                String(
                    item.product.id,
                ),

            price:
                String(
                    item.price,
                ),

            quantity:
                String(
                    item.quantity,
                ),

            status:
            item.status,
        })

        setError(
            null,
        )

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    function resetForm() {
        setEditingItem(
            null,
        )

        setForm({
            ...EMPTY_FORM,
        })

        setError(
            null,
        )
    }

    function clearFormError() {
        if (error) {
            setError(
                null,
            )
        }
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
        <>
            <div className="space-y-6">
                <section className="premium-card overflow-hidden rounded-2xl">
                    <div className="relative flex items-center gap-3 border-b border-slate-800/80 px-5 py-5 sm:px-6">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-300/[0.08] text-sky-300">
                            {editingItem ? (
                                <Pencil
                                    className="size-4"
                                    strokeWidth={1.8}
                                    aria-hidden="true"
                                />
                            ) : (
                                <PackagePlus
                                    className="size-[18px]"
                                    strokeWidth={1.8}
                                    aria-hidden="true"
                                />
                            )}
                        </div>

                        <div className="min-w-0">
                            <p className="eyebrow">
                                {editingItem
                                    ? 'Edit store offer'
                                    : 'New store offer'}
                            </p>

                            <h2 className="mt-1.5 truncate text-lg font-semibold tracking-[-0.025em] text-slate-50">
                                {editingItem
                                    ? 'Update inventory'
                                    : 'Add product to inventory'}
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                {editingItem
                                    ? `Editing ${editingItem.product.name}`
                                    : 'Set the product price, quantity and current availability.'}
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-4"
                    >
                        <FieldWrapper
                            label="Product"
                            htmlFor="inventory-product"
                        >
                            <select
                                id="inventory-product"
                                value={form.productId}
                                disabled={
                                    editingItem !== null ||
                                    isMutating ||
                                    productsQuery.isLoading ||
                                    productsQuery.isError
                                }
                                onChange={
                                    event =>
                                        updateForm({
                                            productId:
                                            event.target.value,
                                        })
                                }
                                className={inputClassName}
                            >
                                <option value="">
                                    {productsQuery.isLoading
                                        ? 'Loading products...'
                                        : productsQuery.isError
                                            ? 'Catalog unavailable'
                                            : 'Select product'}
                                </option>

                                {productsQuery.data?.content.map(
                                    product => (
                                        <option
                                            key={product.id}
                                            value={product.id}
                                        >
                                            {product.name}
                                        </option>
                                    ),
                                )}
                            </select>
                        </FieldWrapper>

                        <FieldWrapper
                            label="Price"
                            htmlFor="inventory-price"
                        >
                            <div className="relative">
                                <CircleDollarSign
                                    className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-600"
                                    aria-hidden="true"
                                />

                                <input
                                    id="inventory-price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.price}
                                    disabled={isMutating}
                                    onChange={
                                        event =>
                                            updateForm({
                                                price:
                                                event.target.value,
                                            })
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
                                    className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-600"
                                    aria-hidden="true"
                                />

                                <input
                                    id="inventory-quantity"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={form.quantity}
                                    disabled={isMutating}
                                    onChange={
                                        event =>
                                            updateForm({
                                                quantity:
                                                event.target.value,
                                            })
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
                                value={form.status}
                                disabled={isMutating}
                                onChange={
                                    event =>
                                        updateForm({
                                            status:
                                                event.target.value as StockStatus,
                                        })
                                }
                                className={inputClassName}
                            >
                                <option value="IN_STOCK">
                                    In stock
                                </option>

                                <option value="LOW_STOCK">
                                    Low stock
                                </option>

                                <option value="OUT_OF_STOCK">
                                    Out of stock
                                </option>
                            </select>
                        </FieldWrapper>

                        {!editingItem &&
                            productsQuery.isError && (
                                <div className="sm:col-span-2 xl:col-span-4">
                                    <InlineAlert>
                                        Product catalog could not be loaded. Adding a new inventory item is temporarily unavailable.
                                    </InlineAlert>
                                </div>
                            )}

                        {error && (
                            <div className="sm:col-span-2 xl:col-span-4">
                                <InlineAlert>
                                    {error}
                                </InlineAlert>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2.5 sm:col-span-2 xl:col-span-4">
                            <button
                                type="submit"
                                disabled={
                                    isMutating ||
                                    catalogUnavailable ||
                                    (
                                        !editingItem &&
                                        !form.productId
                                    ) ||
                                    form.price === '' ||
                                    form.quantity === ''
                                }
                                className="shine-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-300 px-5 text-sm font-semibold text-slate-950 shadow-[0_12px_32px_rgba(14,165,233,0.18)] transition duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
                            >
                                {saveMutation.isPending ? (
                                    <>
                                        <LoaderCircle
                                            className="size-4 animate-spin"
                                            aria-hidden="true"
                                        />

                                        Saving...
                                    </>
                                ) : editingItem ? (
                                    <>
                                        <Pencil
                                            className="size-3.5"
                                            aria-hidden="true"
                                        />

                                        Save changes
                                    </>
                                ) : (
                                    <>
                                        <PackagePlus
                                            className="size-4"
                                            aria-hidden="true"
                                        />

                                        Add product
                                    </>
                                )}
                            </button>

                            {editingItem && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    disabled={isMutating}
                                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/50 px-4 text-sm font-medium text-slate-400 transition duration-200 hover:border-slate-600 hover:bg-slate-800/70 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <X
                                        className="size-4"
                                        aria-hidden="true"
                                    />

                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                <section className="premium-card overflow-hidden rounded-2xl">
                    <div className="relative flex flex-col gap-5 border-b border-slate-800/80 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="eyebrow">
                                Store catalog
                            </p>

                            <h2 className="mt-1.5 text-xl font-semibold tracking-[-0.03em] text-slate-50">
                                Inventory
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                {inventoryQuery.isLoading
                                    ? 'Loading inventory...'
                                    : data
                                        ? `${data.totalElements} products`
                                        : 'Manage products available at this store.'}
                            </p>
                        </div>

                        <form
                            onSubmit={handleSearch}
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
                                    className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-600"
                                    aria-hidden="true"
                                />

                                <input
                                    id="inventory-search"
                                    type="search"
                                    placeholder="Search inventory..."
                                    value={searchInput}
                                    onChange={
                                        event =>
                                            setSearchInput(
                                                event.target.value,
                                            )
                                    }
                                    className="field min-h-11 w-full pl-10 pr-10 text-sm"
                                />

                                {searchInput && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        aria-label="Clear inventory search"
                                        className="absolute right-2.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-600 transition duration-200 hover:bg-slate-800 hover:text-slate-300"
                                    >
                                        <X
                                            className="size-3.5"
                                            aria-hidden="true"
                                        />
                                    </button>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/50 px-4 text-sm font-medium text-slate-300 transition duration-200 hover:border-sky-300/20 hover:bg-sky-300/[0.06] hover:text-sky-300"
                            >
                                <Search
                                    className="size-4"
                                    aria-hidden="true"
                                />

                                <span className="hidden sm:inline">
                                    Search
                                </span>
                            </button>
                        </form>
                    </div>

                    {inventoryQuery.isLoading && (
                        <div className="p-5 sm:p-6">
                            <LoadingState
                                message="Loading inventory..."
                            />
                        </div>
                    )}

                    {inventoryQuery.isError && (
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
                    )}

                    {data &&
                        data.content.length === 0 &&
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
                                    action={
                                        search ? (
                                            <button
                                                type="button"
                                                onClick={clearSearch}
                                                className="rounded-xl border border-sky-300/15 bg-sky-300/[0.07] px-4 py-2 text-xs font-semibold text-sky-300 transition hover:bg-sky-300/10"
                                            >
                                                Clear search
                                            </button>
                                        ) : undefined
                                    }
                                />
                            </div>
                        )}

                    {data &&
                        data.content.length > 0 &&
                        !inventoryQuery.isLoading &&
                        !inventoryQuery.isError && (
                            <div className="divide-y divide-slate-800/70">
                                {data.content.map(
                                    (
                                        item,
                                        index,
                                    ) => {
                                        const isEditing =
                                            editingItem?.id ===
                                            item.id

                                        const isDeleting =
                                            deleteMutation.isPending &&
                                            deleteMutation.variables ===
                                            item.id

                                        return (
                                            <motion.article
                                                key={item.id}
                                                initial={{
                                                    opacity: 0,
                                                    y: 8,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                transition={{
                                                    duration: 0.3,
                                                    delay:
                                                        Math.min(
                                                            index,
                                                            7,
                                                        ) * 0.035,
                                                }}
                                                className={
                                                    isEditing
                                                        ? 'grid gap-5 bg-sky-400/[0.045] px-5 py-4 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto]'
                                                        : 'grid gap-5 px-5 py-4 transition-colors duration-200 hover:bg-white/[0.018] sm:px-6 md:grid-cols-[minmax(0,1fr)_auto]'
                                                }
                                            >
                                                <div className="flex min-w-0 items-start gap-4">
                                                    <ProductArtwork
                                                        item={item}
                                                    />

                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2.5">
                                                            <h3 className="truncate text-sm font-semibold text-slate-100">
                                                                {
                                                                    item.product.name
                                                                }
                                                            </h3>

                                                            <StatusBadge
                                                                status={
                                                                    item.status
                                                                }
                                                            />

                                                            {isEditing && (
                                                                <span className="rounded-full bg-amber-300/[0.08] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-amber-300 ring-1 ring-inset ring-amber-300/15">
                                                                    Editing
                                                                </span>
                                                            )}
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
                                                            <span className="text-sm font-semibold text-slate-200">
                                                                {
                                                                    formatMkd(
                                                                        item.price,
                                                                    )
                                                                }
                                                            </span>

                                                            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                                                                <Boxes
                                                                    className="size-3"
                                                                    aria-hidden="true"
                                                                />

                                                                Quantity:

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
                                                        disabled={isMutating}
                                                        aria-label={
                                                            `Edit ${item.product.name}`
                                                        }
                                                        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/50 px-3 text-xs font-medium text-slate-400 transition duration-200 hover:border-sky-300/20 hover:bg-sky-300/[0.06] hover:text-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <Pencil
                                                            className="size-3.5"
                                                            aria-hidden="true"
                                                        />

                                                        Edit
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
                                                            `Delete ${item.product.name}`
                                                        }
                                                        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-rose-300/10 bg-rose-300/[0.05] px-3 text-xs font-medium text-rose-300/80 transition duration-200 hover:border-rose-300/20 hover:bg-rose-300/[0.09] hover:text-rose-200 disabled:cursor-not-allowed disabled:opacity-40"
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

                                                        {isDeleting
                                                            ? 'Deleting'
                                                            : 'Delete'}
                                                    </button>
                                                </div>
                                            </motion.article>
                                        )
                                    },
                                )}
                            </div>
                        )}

                    {data &&
                        data.totalPages > 1 &&
                        !inventoryQuery.isError && (
                            <div className="flex flex-col gap-3 border-t border-slate-800/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                <PaginationButton
                                    direction="previous"
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
                                />

                                <span className="text-center text-xs text-slate-500">
                                    Page{' '}
                                    <strong className="font-semibold text-slate-300">
                                        {data.page + 1}
                                    </strong>
                                    {' '}of{' '}
                                    <strong className="font-semibold text-slate-300">
                                        {data.totalPages}
                                    </strong>
                                </span>

                                <PaginationButton
                                    direction="next"
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
                                />
                            </div>
                        )}
                </section>
            </div>

            <AnimatePresence>
                {deleteTarget && (
                    <DeleteConfirmation
                        item={deleteTarget}
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

function validateInventoryForm(
    form: InventoryFormState,
    editing: boolean,
): string | null {
    if (
        !editing &&
        !form.productId
    ) {
        return 'Product is required.'
    }

    if (
        form.price === '' ||
        form.quantity === ''
    ) {
        return 'Price and quantity are required.'
    }

    const productId =
        Number(
            form.productId,
        )

    const price =
        Number(
            form.price,
        )

    const quantity =
        Number(
            form.quantity,
        )

    if (
        !editing &&
        (
            !Number.isInteger(
                productId,
            ) ||
            productId <= 0
        )
    ) {
        return 'Select a valid product.'
    }

    if (
        !Number.isFinite(
            price,
        ) ||
        price < 0
    ) {
        return 'Price must be zero or greater.'
    }

    if (
        !Number.isInteger(
            quantity,
        ) ||
        quantity < 0
    ) {
        return 'Quantity must be a whole number of zero or greater.'
    }

    if (
        quantity === 0 &&
        form.status !==
        'OUT_OF_STOCK'
    ) {
        return 'Quantity 0 must use Out of Stock status.'
    }

    if (
        quantity > 0 &&
        form.status ===
        'OUT_OF_STOCK'
    ) {
        return 'A product with quantity above 0 cannot be Out of Stock.'
    }

    return null
}

function ProductArtwork({
                            item,
                        }: {
    item: InventoryItem
}) {
    if (item.product.imageUrl) {
        return (
            <img
                src={item.product.imageUrl}
                alt={item.product.name}
                loading="lazy"
                decoding="async"
                className="size-14 shrink-0 rounded-2xl border border-slate-700/60 bg-slate-950 object-cover"
            />
        )
    }

    return (
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-950/70 text-slate-600">
            <Package
                className="size-5"
                strokeWidth={1.6}
                aria-hidden="true"
            />
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
                htmlFor={htmlFor}
                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500"
            >
                {label}
            </label>

            {children}
        </div>
    )
}

function InlineAlert({
                         children,
                     }: {
    children: ReactNode
}) {
    return (
        <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-rose-300/10 bg-rose-300/[0.05] px-4 py-3 text-xs leading-5 text-rose-200/80"
        >
            <TriangleAlert
                className="mt-0.5 size-4 shrink-0 text-rose-300"
                aria-hidden="true"
            />

            <span>
                {children}
            </span>
        </div>
    )
}

function PaginationButton({
                              direction,
                              disabled,
                              onClick,
                          }: {
    direction: 'previous' | 'next'
    disabled: boolean
    onClick: () => void
}) {
    const previous =
        direction ===
        'previous'

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/40 px-4 text-xs font-medium text-slate-400 transition duration-200 hover:border-slate-600 hover:bg-slate-800/70 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-35"
        >
            {previous && (
                <ChevronLeft
                    className="size-3.5"
                    aria-hidden="true"
                />
            )}

            {previous
                ? 'Previous'
                : 'Next'}

            {!previous && (
                <ChevronRight
                    className="size-3.5"
                    aria-hidden="true"
                />
            )}
        </button>
    )
}

function DeleteConfirmation({
                                item,
                                pending,
                                onCancel,
                                onConfirm,
                            }: {
    item: InventoryItem
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
                aria-labelledby="delete-inventory-title"
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
                    id="delete-inventory-title"
                    className="mt-5 text-lg font-semibold tracking-tight text-slate-50"
                >
                    Remove inventory item?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                    <strong className="font-semibold text-slate-200">
                        {item.product.name}
                    </strong>{' '}
                    will be removed from this store inventory.
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
                            ? 'Removing...'
                            : 'Remove'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}