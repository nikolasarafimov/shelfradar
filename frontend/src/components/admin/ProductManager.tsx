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
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Image as ImageIcon,
    LoaderCircle,
    Package,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react'

import {
    createProduct,
    deleteProduct,
    getBrands,
    getCategories,
    getProducts,
    updateProduct,
} from '../../api/adminApi'

import type {
    Product,
    ProductRequest,
} from '../../types/catalog'

import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import LoadingState from '../ui/LoadingState'

interface ProductFormState {
    name: string
    description: string
    imageUrl: string
    brandId: string
    categoryId: string
}

type ProductRequestBuildResult =
    | {
    success: true
    request: ProductRequest
}
    | {
    success: false
    error: string
}

const EMPTY_FORM: ProductFormState = {
    name: '',
    description: '',
    imageUrl: '',
    brandId: '',
    categoryId: '',
}

const inputClassName =
    'field min-h-12 w-full px-4 text-sm disabled:cursor-not-allowed disabled:opacity-50'

export default function ProductManager() {
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
        editingProduct,
        setEditingProduct,
    ] = useState<Product | null>(
        null,
    )

    const [
        form,
        setForm,
    ] = useState<ProductFormState>({
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
    ] = useState<Product | null>(
        null,
    )

    const productsQuery =
        useQuery({
            queryKey: [
                'admin-products',
                search,
                page,
            ],

            queryFn:
                () =>
                    getProducts({
                        q: search,
                        page,
                        size: 10,
                        sort: 'nameAsc',
                    }),
        })

    const brandsQuery =
        useQuery({
            queryKey: [
                'admin-brands',
            ],

            queryFn:
            getBrands,
        })

    const categoriesQuery =
        useQuery({
            queryKey: [
                'admin-categories',
            ],

            queryFn:
            getCategories,
        })

    async function refreshProductData() {
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: [
                    'admin-products',
                ],
            }),

            queryClient.invalidateQueries({
                queryKey: [
                    'store-product-catalog',
                ],
            }),
        ])
    }

    const saveMutation =
        useMutation({
            mutationFn:
                (
                    request: ProductRequest,
                ) => {
                    if (editingProduct) {
                        return updateProduct(
                            editingProduct.id,
                            request,
                        )
                    }

                    return createProduct(
                        request,
                    )
                },

            onSuccess:
                async () => {
                    resetForm()

                    await refreshProductData()
                },

            onError:
                () => {
                    setError(
                        'Unable to save product. Check for duplicate or invalid data.',
                    )
                },
        })

    const deleteMutation =
        useMutation({
            mutationFn:
            deleteProduct,

            onSuccess:
                async (
                    _data,
                    deletedProductId,
                ) => {
                    if (
                        editingProduct?.id ===
                        deletedProductId
                    ) {
                        resetForm()
                    }

                    const currentData =
                        productsQuery.data

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

                    setDeleteTarget(
                        null,
                    )

                    setError(
                        null,
                    )

                    await refreshProductData()
                },

            onError:
                () => {
                    setDeleteTarget(
                        null,
                    )

                    setError(
                        'Unable to delete product.',
                    )
                },
        })

    function updateForm(
        values: Partial<ProductFormState>,
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

        const result =
            buildProductRequest(
                form,
            )

        if (!result.success) {
            setError(
                result.error,
            )

            return
        }

        setError(
            null,
        )

        saveMutation.mutate(
            result.request,
        )
    }

    function beginEdit(
        product: Product,
    ) {
        setEditingProduct(
            product,
        )

        setForm({
            name:
            product.name,

            description:
                product.description ??
                '',

            imageUrl:
                product.imageUrl ??
                '',

            brandId:
                String(
                    product.brand.id,
                ),

            categoryId:
                String(
                    product.category.id,
                ),
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
        setEditingProduct(
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
        productsQuery.data

    const referenceDataLoading =
        brandsQuery.isLoading ||
        categoriesQuery.isLoading

    const referenceDataError =
        brandsQuery.isError ||
        categoriesQuery.isError

    const isMutating =
        saveMutation.isPending ||
        deleteMutation.isPending

    return (
        <>
            <section className="space-y-6">
                <div className="premium-card overflow-hidden rounded-2xl">
                    <div className="relative flex items-center gap-3 border-b border-slate-800/80 px-5 py-5 sm:px-6">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -left-20 -top-20 size-44 rounded-full bg-sky-400/[0.06] blur-3xl"
                        />

                        <div className="relative flex size-11 shrink-0 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-300/[0.08] text-sky-300">
                            {editingProduct ? (
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

                        <div className="relative">
                            <p className="eyebrow">
                                {editingProduct
                                    ? 'Edit catalog entry'
                                    : 'New catalog entry'}
                            </p>

                            <h2 className="mt-1.5 text-lg font-semibold tracking-[-0.025em] text-slate-50">
                                {editingProduct
                                    ? 'Edit product'
                                    : 'Add product'}
                            </h2>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="grid gap-5 p-5 sm:p-6 md:grid-cols-2"
                    >
                        <FieldLabel
                            htmlFor="product-name"
                            label="Product name"
                        >
                            <input
                                id="product-name"
                                value={form.name}
                                onChange={
                                    event =>
                                        updateForm({
                                            name:
                                            event.target.value,
                                        })
                                }
                                disabled={isMutating}
                                autoComplete="off"
                                placeholder="Enter product name"
                                className={inputClassName}
                            />
                        </FieldLabel>

                        <FieldLabel
                            htmlFor="product-brand"
                            label="Brand"
                        >
                            <select
                                id="product-brand"
                                value={form.brandId}
                                onChange={
                                    event =>
                                        updateForm({
                                            brandId:
                                            event.target.value,
                                        })
                                }
                                disabled={
                                    isMutating ||
                                    referenceDataLoading ||
                                    referenceDataError
                                }
                                className={inputClassName}
                            >
                                <option value="">
                                    {brandsQuery.isLoading
                                        ? 'Loading brands...'
                                        : brandsQuery.isError
                                            ? 'Brands unavailable'
                                            : 'Select brand'}
                                </option>

                                {brandsQuery.data?.map(
                                    brand => (
                                        <option
                                            key={brand.id}
                                            value={brand.id}
                                        >
                                            {brand.name}
                                        </option>
                                    ),
                                )}
                            </select>
                        </FieldLabel>

                        <FieldLabel
                            htmlFor="product-category"
                            label="Category"
                        >
                            <select
                                id="product-category"
                                value={form.categoryId}
                                onChange={
                                    event =>
                                        updateForm({
                                            categoryId:
                                            event.target.value,
                                        })
                                }
                                disabled={
                                    isMutating ||
                                    referenceDataLoading ||
                                    referenceDataError
                                }
                                className={inputClassName}
                            >
                                <option value="">
                                    {categoriesQuery.isLoading
                                        ? 'Loading categories...'
                                        : categoriesQuery.isError
                                            ? 'Categories unavailable'
                                            : 'Select category'}
                                </option>

                                {categoriesQuery.data?.map(
                                    category => (
                                        <option
                                            key={category.id}
                                            value={
                                                category.id
                                            }
                                        >
                                            {
                                                category.name
                                            }
                                        </option>
                                    ),
                                )}
                            </select>
                        </FieldLabel>

                        <FieldLabel
                            htmlFor="product-image-url"
                            label="Image URL"
                        >
                            <div className="relative">
                                <ImageIcon
                                    className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-600"
                                    aria-hidden="true"
                                />

                                <input
                                    id="product-image-url"
                                    type="url"
                                    value={
                                        form.imageUrl
                                    }
                                    onChange={
                                        event =>
                                            updateForm({
                                                imageUrl:
                                                event.target.value,
                                            })
                                    }
                                    disabled={isMutating}
                                    autoComplete="off"
                                    placeholder="https://..."
                                    className={`${inputClassName} pl-11`}
                                />
                            </div>
                        </FieldLabel>

                        <FieldLabel
                            htmlFor="product-description"
                            label="Description"
                            className="md:col-span-2"
                        >
                            <textarea
                                id="product-description"
                                rows={4}
                                value={
                                    form.description
                                }
                                onChange={
                                    event =>
                                        updateForm({
                                            description:
                                            event.target.value,
                                        })
                                }
                                disabled={isMutating}
                                placeholder="Optional product description"
                                className="field min-h-28 w-full resize-y px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </FieldLabel>

                        {referenceDataError && (
                            <div className="md:col-span-2">
                                <InlineAlert>
                                    Unable to load brands or categories. Product editing is temporarily unavailable.
                                </InlineAlert>
                            </div>
                        )}

                        {error && (
                            <div className="md:col-span-2">
                                <InlineAlert>
                                    {error}
                                </InlineAlert>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2.5 md:col-span-2">
                            <button
                                type="submit"
                                disabled={
                                    isMutating ||
                                    referenceDataLoading ||
                                    referenceDataError ||
                                    !form.name.trim() ||
                                    !form.brandId ||
                                    !form.categoryId
                                }
                                className="shine-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-300 px-5 text-sm font-semibold text-slate-950 shadow-[0_12px_32px_rgba(14,165,233,0.17)] transition duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
                            >
                                {saveMutation.isPending ? (
                                    <>
                                        <LoaderCircle
                                            className="size-4 animate-spin"
                                            aria-hidden="true"
                                        />

                                        Saving...
                                    </>
                                ) : editingProduct ? (
                                    <>
                                        <Pencil
                                            className="size-3.5"
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

                                        Add product
                                    </>
                                )}
                            </button>

                            {editingProduct && (
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
                </div>

                {productsQuery.isLoading ? (
                    <LoadingState
                        message="Loading products..."
                    />
                ) : productsQuery.isError ? (
                    <ErrorState
                        title="Unable to load products"
                        message="ShelfRadar could not load the product catalog."
                        onRetry={
                            () => {
                                void productsQuery.refetch()
                            }
                        }
                    />
                ) : (
                    <div className="premium-card overflow-hidden rounded-2xl">
                        <div className="relative border-b border-slate-800/80 px-5 py-5 sm:px-6">
                            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <p className="eyebrow">
                                        Catalog
                                    </p>

                                    <h2 className="mt-1.5 text-xl font-semibold tracking-[-0.03em] text-slate-50">
                                        Products
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {
                                            `${data?.totalElements ?? 0} products`
                                        }
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleSearch}
                                    className="flex w-full gap-2 lg:w-auto"
                                >
                                    <label
                                        htmlFor="product-search"
                                        className="sr-only"
                                    >
                                        Search products
                                    </label>

                                    <div className="relative min-w-0 flex-1 lg:w-72">
                                        <Search
                                            className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-600"
                                            aria-hidden="true"
                                        />

                                        <input
                                            id="product-search"
                                            type="search"
                                            value={
                                                searchInput
                                            }
                                            onChange={
                                                event =>
                                                    setSearchInput(
                                                        event.target.value,
                                                    )
                                            }
                                            autoComplete="off"
                                            placeholder="Search products..."
                                            className="field min-h-11 w-full pl-10 pr-10 text-sm"
                                        />

                                        {searchInput && (
                                            <button
                                                type="button"
                                                onClick={
                                                    clearSearch
                                                }
                                                aria-label="Clear product search"
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
                        </div>

                        {data &&
                        data.content.length === 0 ? (
                            <div className="p-5 sm:p-6">
                                <EmptyState
                                    title={
                                        search
                                            ? 'No matching products'
                                            : 'No products yet'
                                    }
                                    message={
                                        search
                                            ? 'No catalog products match the current search.'
                                            : 'Add the first product using the form above.'
                                    }
                                    action={
                                        search ? (
                                            <button
                                                type="button"
                                                onClick={
                                                    clearSearch
                                                }
                                                className="rounded-xl border border-sky-300/15 bg-sky-300/[0.07] px-4 py-2 text-xs font-semibold text-sky-300 transition hover:bg-sky-300/10"
                                            >
                                                Clear search
                                            </button>
                                        ) : undefined
                                    }
                                />
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-800/70">
                                <AnimatePresence initial={false}>
                                    {data?.content.map(
                                        (
                                            product,
                                            index,
                                        ) => {
                                            const isEditing =
                                                editingProduct?.id ===
                                                product.id

                                            const isDeleting =
                                                deleteMutation.isPending &&
                                                deleteMutation.variables ===
                                                product.id

                                            return (
                                                <motion.article
                                                    key={
                                                        product.id
                                                    }
                                                    layout
                                                    initial={{
                                                        opacity: 0,
                                                        y: 7,
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
                                                        duration: 0.26,
                                                        delay:
                                                            Math.min(
                                                                index,
                                                                7,
                                                            ) * 0.025,
                                                    }}
                                                    className={
                                                        isEditing
                                                            ? 'flex flex-col gap-4 bg-sky-300/[0.045] px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between'
                                                            : 'flex flex-col gap-4 px-5 py-4 transition-colors duration-200 hover:bg-white/[0.018] sm:px-6 lg:flex-row lg:items-center lg:justify-between'
                                                    }
                                                >
                                                    <div className="flex min-w-0 items-start gap-4">
                                                        <ProductThumbnail
                                                            product={
                                                                product
                                                            }
                                                        />

                                                        <div className="min-w-0">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <span className="rounded-full bg-sky-300/[0.07] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-sky-300 ring-1 ring-inset ring-sky-300/15">
                                                                    {
                                                                        product.brand.name
                                                                    }
                                                                </span>

                                                                <span className="rounded-full bg-slate-400/[0.05] px-2.5 py-1 text-[9px] font-semibold text-slate-500 ring-1 ring-inset ring-slate-300/10">
                                                                    {
                                                                        product.category.name
                                                                    }
                                                                </span>

                                                                {isEditing && (
                                                                    <span className="rounded-full bg-amber-300/[0.07] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-amber-300 ring-1 ring-inset ring-amber-300/15">
                                                                        Editing
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <h3 className="mt-2 text-sm font-semibold text-slate-100">
                                                                {
                                                                    product.name
                                                                }
                                                            </h3>

                                                            {product.description && (
                                                                <p className="mt-1.5 max-w-3xl text-xs leading-5 text-slate-500">
                                                                    {
                                                                        product.description
                                                                    }
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
                                                                        product,
                                                                    )
                                                            }
                                                            disabled={
                                                                isMutating
                                                            }
                                                            aria-label={
                                                                `Edit ${product.name}`
                                                            }
                                                            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/50 px-3 text-xs font-medium text-slate-400 transition duration-200 hover:border-sky-300/15 hover:bg-sky-300/[0.05] hover:text-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
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
                                                                        product,
                                                                    )
                                                            }
                                                            disabled={
                                                                isMutating
                                                            }
                                                            aria-label={
                                                                `Delete ${product.name}`
                                                            }
                                                            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-rose-300/10 bg-rose-300/[0.045] px-3 text-xs font-medium text-rose-300/80 transition duration-200 hover:border-rose-300/20 hover:bg-rose-300/[0.08] hover:text-rose-200 disabled:cursor-not-allowed disabled:opacity-40"
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
                                </AnimatePresence>
                            </div>
                        )}

                        {data &&
                            data.totalPages > 1 && (
                                <div className="flex flex-col gap-3 border-t border-slate-800/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                    <PaginationButton
                                        direction="previous"
                                        disabled={
                                            data.first ||
                                            productsQuery.isFetching
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
                                            productsQuery.isFetching
                                        }
                                        onClick={
                                            () =>
                                                setPage(
                                                    current =>
                                                        current +
                                                        1,
                                                )
                                        }
                                    />
                                </div>
                            )}
                    </div>
                )}
            </section>

            <AnimatePresence>
                {deleteTarget && (
                    <DeleteConfirmation
                        product={
                            deleteTarget
                        }
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

function buildProductRequest(
    form: ProductFormState,
): ProductRequestBuildResult {
    const name =
        form.name.trim()

    const description =
        form.description.trim()

    const imageUrl =
        form.imageUrl.trim()

    if (
        !name ||
        !form.brandId ||
        !form.categoryId
    ) {
        return {
            success: false,
            error:
                'Name, brand and category are required.',
        }
    }

    const brandId =
        Number(
            form.brandId,
        )

    const categoryId =
        Number(
            form.categoryId,
        )

    if (
        !Number.isInteger(
            brandId,
        ) ||
        brandId <=
        0 ||
        !Number.isInteger(
            categoryId,
        ) ||
        categoryId <=
        0
    ) {
        return {
            success: false,
            error:
                'Please select a valid brand and category.',
        }
    }

    return {
        success: true,
        request: {
            name,

            description:
                description ||
                null,

            imageUrl:
                imageUrl ||
                null,

            brandId,
            categoryId,
        },
    }
}

function FieldLabel({
                        htmlFor,
                        label,
                        className = '',
                        children,
                    }: {
    htmlFor: string
    label: string
    className?: string
    children: ReactNode
}) {
    return (
        <label
            htmlFor={htmlFor}
            className={`block ${className}`}
        >
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                {label}
            </span>

            {children}
        </label>
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
            className="flex items-start gap-2.5 rounded-xl border border-rose-300/10 bg-rose-300/[0.05] p-3 text-xs leading-5 text-rose-200/80"
        >
            <AlertCircle
                className="mt-0.5 size-4 shrink-0 text-rose-300"
                aria-hidden="true"
            />

            <span>
                {children}
            </span>
        </div>
    )
}

function ProductThumbnail({
                              product,
                          }: {
    product: Product
}) {
    if (product.imageUrl) {
        return (
            <img
                src={
                    product.imageUrl
                }
                alt={
                    product.name
                }
                loading="lazy"
                decoding="async"
                className="size-16 shrink-0 rounded-2xl border border-slate-700/60 bg-slate-950 object-cover shadow-lg shadow-black/20"
            />
        )
    }

    return (
        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-950/70 text-slate-600">
            <Package
                className="size-6"
                strokeWidth={1.5}
                aria-hidden="true"
            />
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
            disabled={
                disabled
            }
            onClick={
                onClick
            }
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
                                product,
                                pending,
                                onCancel,
                                onConfirm,
                            }: {
    product: Product
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
                onClick={
                    onCancel
                }
                disabled={
                    pending
                }
                className="absolute inset-0 cursor-default bg-slate-950/75 backdrop-blur-sm"
            />

            <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="product-delete-title"
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
                    id="product-delete-title"
                    className="mt-5 text-lg font-semibold tracking-tight text-slate-50"
                >
                    Delete product?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                    <strong className="font-semibold text-slate-200">
                        {product.name}
                    </strong>{' '}
                    will be removed from the catalog. This action cannot be undone and may affect store inventory that references this product.
                </p>

                <div className="mt-6 flex justify-end gap-2.5">
                    <button
                        type="button"
                        onClick={
                            onCancel
                        }
                        disabled={
                            pending
                        }
                        className="min-h-10 rounded-xl border border-slate-700/80 bg-slate-900/50 px-4 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-100 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={
                            onConfirm
                        }
                        disabled={
                            pending
                        }
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