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
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Image,
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
} from '../../api/catalogApi'

import type {
    Product,
    ProductRequest,
} from '../../types/catalog'

export default function ProductManager() {

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
        editingProduct,
        setEditingProduct,
    ] =
        useState<Product | null>(
            null,
        )

    const [
        name,
        setName,
    ] =
        useState('')

    const [
        description,
        setDescription,
    ] =
        useState('')

    const [
        imageUrl,
        setImageUrl,
    ] =
        useState('')

    const [
        brandId,
        setBrandId,
    ] =
        useState('')

    const [
        categoryId,
        setCategoryId,
    ] =
        useState('')

    const [
        error,
        setError,
    ] =
        useState<string | null>(
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
                        q:
                        search,

                        page,

                        size:
                            10,

                        sort:
                            'nameAsc',
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

    const saveMutation =
        useMutation({

            mutationFn:
                async (
                    request: ProductRequest,
                ) => {

                    if (
                        editingProduct !==
                        null
                    ) {

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


                    await queryClient
                        .invalidateQueries({
                            queryKey: [
                                'admin-products',
                            ],
                        })
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

                    setError(
                        null,
                    )

                    await queryClient
                        .invalidateQueries({
                            queryKey: [
                                'admin-products',
                            ],
                        })
                },

            onError:
                () => {

                    setError(
                        'Unable to delete product. It may still be referenced by store inventory.',
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

        const normalizedName =
            name.trim()

        const normalizedDescription =
            description.trim()

        const normalizedImageUrl =
            imageUrl.trim()

        if (
            !normalizedName ||
            !brandId ||
            !categoryId
        ) {

            setError(
                'Name, brand and category are required.',
            )
            return
        }

        const parsedBrandId =
            Number(
                brandId,
            )

        const parsedCategoryId =
            Number(
                categoryId,
            )

        if (
            !Number.isInteger(
                parsedBrandId,
            ) ||
            parsedBrandId <=
            0 ||
            !Number.isInteger(
                parsedCategoryId,
            ) ||
            parsedCategoryId <=
            0
        ) {

            setError(
                'Please select a valid brand and category.',
            )
            return
        }

        setError(
            null,
        )

        saveMutation.mutate({
            name:
            normalizedName,

            description:
                normalizedDescription ||
                null,

            imageUrl:
                normalizedImageUrl ||
                null,

            brandId:
            parsedBrandId,

            categoryId:
            parsedCategoryId,
        })
    }

    function beginEdit(
        product: Product,
    ) {

        setEditingProduct(
            product,
        )

        setName(
            product.name,
        )

        setDescription(
            product.description ??
            '',
        )

        setImageUrl(
            product.imageUrl ??
            '',
        )

        setBrandId(
            String(
                product.brand.id,
            ),
        )

        setCategoryId(
            String(
                product.category.id,
            ),
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

        setEditingProduct(
            null,
        )

        setName(
            '',
        )

        setDescription(
            '',
        )

        setImageUrl(
            '',
        )

        setBrandId(
            '',
        )

        setCategoryId(
            '',
        )

        setError(
            null,
        )
    }

    function handleDelete(
        product: Product,
    ) {

        const confirmed =
            window.confirm(
                `Delete ${product.name}?`,
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
            product.id,
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
        <section className="space-y-6">
            <div className="premium-card overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/55 shadow-[0_24px_70px_-45px_rgba(14,165,233,0.2)] backdrop-blur-xl">
                <div className="flex items-center gap-3 border-b border-slate-800/80 px-5 py-5 sm:px-6">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-900/50 bg-sky-950/30 text-sky-400">
                        {
                            editingProduct
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
                                editingProduct
                                    ? 'Edit catalog entry'
                                    : 'New catalog entry'
                            }
                        </p>

                        <h2 className="mt-0.5 text-lg font-bold tracking-tight text-white">
                            {
                                editingProduct
                                    ? 'Edit Product'
                                    : 'Add Product'
                            }
                        </h2>
                    </div>
                </div>

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="grid gap-5 p-5 md:grid-cols-2 sm:p-6"
                >
                    <label
                        htmlFor="product-name"
                        className="block"
                    >

                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                            Product name
                        </span>

                        <input
                            id="product-name"
                            value={
                                name
                            }
                            onChange={
                                event => {

                                    setName(
                                        event.target.value,
                                    )

                                    clearFormError()
                                }
                            }
                            disabled={
                                isMutating
                            }
                            autoComplete="off"
                            placeholder="Enter product name"
                            className={inputClassName}
                        />
                    </label>

                    <label
                        htmlFor="product-brand"
                        className="block"
                    >
                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                            Brand
                        </span>

                        <select
                            id="product-brand"
                            value={
                                brandId
                            }
                            onChange={
                                event => {

                                    setBrandId(
                                        event.target.value,
                                    )

                                    clearFormError()
                                }
                            }
                            disabled={
                                isMutating ||
                                referenceDataLoading ||
                                referenceDataError
                            }
                            className={inputClassName}
                        >

                            <option value="">
                                {
                                    brandsQuery.isLoading
                                        ? 'Loading brands...'
                                        : 'Select brand'
                                }
                            </option>

                            {
                                brandsQuery.data?.map(
                                    brand => (

                                        <option
                                            key={
                                                brand.id
                                            }
                                            value={
                                                brand.id
                                            }
                                        >
                                            {
                                                brand.name
                                            }
                                        </option>
                                    ),
                                )
                            }
                        </select>
                    </label>

                    <label
                        htmlFor="product-category"
                        className="block"
                    >

                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                            Category
                        </span>

                        <select
                            id="product-category"
                            value={
                                categoryId
                            }
                            onChange={
                                event => {

                                    setCategoryId(
                                        event.target.value,
                                    )

                                    clearFormError()
                                }
                            }
                            disabled={
                                isMutating ||
                                referenceDataLoading ||
                                referenceDataError
                            }
                            className={inputClassName}
                        >

                            <option value="">
                                {
                                    categoriesQuery.isLoading
                                        ? 'Loading categories...'
                                        : 'Select category'
                                }
                            </option>

                            {
                                categoriesQuery.data?.map(
                                    category => (

                                        <option
                                            key={
                                                category.id
                                            }
                                            value={
                                                category.id
                                            }
                                        >
                                            {
                                                category.name
                                            }
                                        </option>
                                    ),
                                )
                            }
                        </select>
                    </label>

                    <label
                        htmlFor="product-image-url"
                        className="block"
                    >

                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                            Image URL
                        </span>

                        <div className="relative">
                            <Image
                                size={15}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                            />

                            <input
                                id="product-image-url"
                                type="url"
                                value={
                                    imageUrl
                                }
                                onChange={
                                    event => {

                                        setImageUrl(
                                            event.target.value,
                                        )

                                        clearFormError()
                                    }
                                }
                                disabled={
                                    isMutating
                                }
                                autoComplete="off"
                                placeholder="https://..."
                                className={`${inputClassName} pl-11`}
                            />
                        </div>
                    </label>

                    <label
                        htmlFor="product-description"
                        className="block md:col-span-2"
                    >
                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                            Description
                        </span>

                        <textarea
                            id="product-description"
                            rows={
                                4
                            }
                            value={
                                description
                            }
                            onChange={
                                event => {

                                    setDescription(
                                        event.target.value,
                                    )

                                    clearFormError()
                                }
                            }
                            disabled={
                                isMutating
                            }
                            placeholder="Optional product description"
                            className={`${inputClassName} resize-y py-3`}
                        />
                    </label>
                    {
                        referenceDataError && (

                            <div
                                role="alert"
                                className="flex items-start gap-2.5 rounded-xl border border-red-900/40 bg-red-950/20 p-3 text-xs leading-5 text-red-300 md:col-span-2"
                            >

                                <AlertCircle
                                    size={15}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>
                                    Unable to load brands or categories. Product editing is temporarily unavailable.
                                </span>

                            </div>
                        )
                    }

                    {
                        error && (
                            <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-900/40 bg-red-950/20 p-3 text-xs leading-5 text-red-300 md:col-span-2">
                                <AlertCircle size={15} className="mt-0.5 shrink-0"/>

                                <span>
                                    {error}
                                </span>
                            </div>
                        )
                    }

                    <div className="flex flex-wrap gap-2 md:col-span-2">
                        <button
                            type="submit"
                            disabled={
                                isMutating ||
                                referenceDataLoading ||
                                referenceDataError ||
                                !name.trim() ||
                                !brandId ||
                                !categoryId
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
                                    : editingProduct
                                        ? (
                                            <>
                                                <Pencil
                                                    size={14}
                                                />

                                                Save changes
                                            </>
                                        )
                                        : (
                                            <>
                                                <Plus
                                                    size={15}
                                                />

                                                Add product
                                            </>
                                        )
                            }
                        </button>
                        {
                            editingProduct && (

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
            </div>

            <div className="premium-card overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/55 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                <div className="border-b border-slate-800/80 px-5 py-5 sm:px-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-sky-400">
                                Catalog
                            </p>

                            <h2 className="mt-1 text-xl font-bold tracking-tight text-white">
                                Products
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                {
                                    productsQuery.isLoading
                                        ? 'Loading catalog...'
                                        : `${data?.totalElements ?? 0} products`
                                }
                            </p>
                        </div>

                        <form
                            onSubmit={
                                handleSearch
                            }
                            className="flex w-full gap-2 lg:w-auto"
                        >
                            <div className="relative min-w-0 flex-1 lg:w-72">

                                <Search
                                    size={15}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                                />

                                <input
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
                                    className="min-h-11 w-full rounded-xl border border-slate-700 bg-[#020817]/80 pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
                                />
                                {
                                    searchInput && (

                                        <button
                                            type="button"
                                            onClick={
                                                clearSearch
                                            }
                                            aria-label="Clear product search"
                                            className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-800 hover:text-slate-300"
                                        >
                                            <X size={13}/>

                                        </button>
                                    )
                                }
                            </div>

                            <button type="submit" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-4 text-sm font-semibold text-slate-300 transition hover:border-sky-900 hover:bg-sky-950/20 hover:text-sky-300">
                                <Search size={14}/>

                                <span className="hidden sm:inline">
                                    Search
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
                {
                    productsQuery.isLoading && (
                        <div className="flex min-h-60 items-center justify-center p-6">
                            <div className="text-center">
                                <LoaderCircle
                                    size={22}
                                    className="mx-auto animate-spin text-sky-400"
                                />

                                <p className="mt-3 text-sm text-slate-500">
                                    Loading products...
                                </p>
                            </div>
                        </div>
                    )
                }

                {
                    productsQuery.isError && (
                        <div className="flex min-h-60 items-center justify-center p-6 text-center">
                            <div>
                                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-red-900/40 bg-red-950/20 text-red-400">
                                    <AlertCircle size={18}/>
                                </div>

                                <p className="mt-3 text-sm font-semibold text-red-300">
                                    Unable to load products
                                </p>

                                <p className="mt-1 text-xs text-slate-600">
                                    Please try again later.
                                </p>
                            </div>
                        </div>
                    )
                }

                {
                    !productsQuery.isLoading &&
                    !productsQuery.isError &&
                    data &&
                    data.content.length ===
                    0 && (
                        <div className="flex min-h-60 items-center justify-center p-6 text-center">
                            <div className="max-w-sm">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-[#020817]/60 text-slate-600">
                                    <Package size={20}/>
                                </div>

                                <p className="mt-4 text-sm font-semibold text-slate-300">
                                    {
                                        search
                                            ? 'No matching products'
                                            : 'No products yet'
                                    }
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-600">
                                    {
                                        search
                                            ? 'Try a different search term.'
                                            : 'Add the first product using the form above.'
                                    }
                                </p>
                                {
                                    search && (
                                        <button
                                            type="button"
                                            onClick={
                                                clearSearch
                                            }
                                            className="mt-4 text-xs font-semibold text-sky-400 transition hover:text-sky-300"
                                        >
                                            Clear search
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    )
                }

                {
                    !productsQuery.isLoading &&
                    !productsQuery.isError &&
                    data &&
                    data.content.length >
                    0 && (
                        <div className="divide-y divide-slate-800/70">
                            {
                                data.content.map(
                                    product => {

                                        const isEditing =
                                            editingProduct?.id ===
                                            product.id

                                        const isDeleting =
                                            deleteMutation.isPending &&
                                            deleteMutation.variables ===
                                            product.id

                                        return (
                                            <article
                                                key={
                                                    product.id
                                                }
                                                className={
                                                    isEditing
                                                        ? 'flex flex-col gap-4 bg-sky-950/15 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between'
                                                        : 'flex flex-col gap-4 px-5 py-4 transition duration-200 hover:bg-slate-800/25 sm:px-6 lg:flex-row lg:items-center lg:justify-between'
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
                                                            <span className="rounded-full border border-sky-900/50 bg-sky-950/25 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-sky-400">
                                                                {
                                                                    product.brand.name
                                                                }
                                                            </span>

                                                            <span className="rounded-full border border-slate-800 bg-[#020817]/50 px-2.5 py-1 text-[9px] font-semibold text-slate-500">
                                                                {
                                                                    product.category.name
                                                                }
                                                            </span>
                                                            {
                                                                isEditing && (

                                                                    <span className="rounded-full border border-amber-900/50 bg-amber-950/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-amber-400">
                                                                        Editing
                                                                    </span>
                                                                )
                                                            }
                                                        </div>

                                                        <h3 className="mt-2 text-sm font-bold text-slate-100">
                                                            {
                                                                product.name
                                                            }
                                                        </h3>
                                                        {
                                                            product.description && (
                                                                <p className="mt-1.5 max-w-3xl text-xs leading-5 text-slate-500">
                                                                    {
                                                                        product.description
                                                                    }
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
                                                                    product,
                                                                )
                                                        }
                                                        disabled={
                                                            isMutating
                                                        }
                                                        aria-label={
                                                            `Edit ${product.name}`
                                                        }
                                                        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/50 px-3 text-xs font-semibold text-slate-400 transition hover:border-sky-900 hover:bg-sky-950/20 hover:text-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <Pencil size={13}/>
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={
                                                            () =>
                                                                handleDelete(
                                                                    product,
                                                                )
                                                        }
                                                        disabled={
                                                            isMutating
                                                        }
                                                        aria-label={
                                                            `Delete ${product.name}`
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
                    1 && (
                        <div className="flex flex-col gap-3 border-t border-slate-800/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <button
                                type="button"
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
                                    productsQuery.isFetching
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
                                <ChevronRight
                                    size={14}
                                />
                            </button>
                        </div>
                    )
                }
            </div>
        </section>
    )
}

function ProductThumbnail({
    product,
}: {
    product: Product
}) {

    if (
        product.imageUrl
    ) {

        return (
            <img
                src={
                    product.imageUrl
                }
                alt={
                    product.name
                }
                className="h-16 w-16 shrink-0 rounded-2xl border border-slate-800 bg-[#020817] object-cover shadow-lg shadow-black/20"
            />
        )
    }

    return (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-800 bg-[#020817]/70 text-slate-600">
            <Package
                size={23}
                strokeWidth={1.5}
            />
        </div>
    )
}

const inputClassName =
    'min-h-12 w-full rounded-xl border border-slate-700 bg-[#020817]/85 px-4 text-sm text-white outline-none transition duration-200 placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:opacity-50'