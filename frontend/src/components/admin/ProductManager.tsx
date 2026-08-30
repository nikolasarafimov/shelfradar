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

    const [page, setPage] =
        useState(0)

    const [searchInput, setSearchInput] =
        useState('')

    const [search, setSearch] =
        useState('')

    const [
        editingProduct,
        setEditingProduct,
    ] =
        useState<Product | null>(null)

    const [name, setName] =
        useState('')

    const [
        description,
        setDescription,
    ] =
        useState('')

    const [imageUrl, setImageUrl] =
        useState('')

    const [brandId, setBrandId] =
        useState('')

    const [
        categoryId,
        setCategoryId,
    ] =
        useState('')

    const [error, setError] =
        useState<string | null>(null)

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
            queryFn: getBrands,
        })

    const categoriesQuery =
        useQuery({
            queryKey: [
                'admin-categories',
            ],
            queryFn: getCategories,
        })

    const saveMutation =
        useMutation({

            mutationFn:
                async (
                    request:
                    ProductRequest,
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
                async () => {

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
                        'Unable to delete product.',
                    )
                },
        })

    function handleSearch(
        event: FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault()

        setPage(0)

        setSearch(
            searchInput.trim(),
        )
    }

    function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault()

        if (
            !name.trim() ||
            !brandId ||
            !categoryId
        ) {

            setError(
                'Name, brand and category are required.',
            )

            return
        }

        setError(null)

        saveMutation.mutate({
            name: name.trim(),
            description:
                description.trim() ||
                null,
            imageUrl:
                imageUrl.trim() ||
                null,
            brandId:
                Number(brandId),
            categoryId:
                Number(categoryId),
        })
    }

    function beginEdit(
        product: Product,
    ) {

        setEditingProduct(
            product
        )

        setName(
            product.name
        )

        setDescription(
            product.description ?? ''
        )

        setImageUrl(
            product.imageUrl ?? ''
        )

        setBrandId(
            String(
                product.brand.id,
            )
        )

        setCategoryId(
            String(
                product.category.id,
            )
        )

        setError(null)
    }

    function resetForm() {

        setEditingProduct(null)

        setName('')
        setDescription('')
        setImageUrl('')
        setBrandId('')
        setCategoryId('')
        setError(null)
    }

    function handleDelete(
        product: Product,
    ) {

        const confirmed =
            window.confirm(
                `Delete ${product.name}?`,
            )

        if (!confirmed) {
            return
        }

        deleteMutation.mutate(
            product.id,
        )
    }

    const data =
        productsQuery.data

    return (
        <section className="space-y-6">

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <h2 className="text-xl font-semibold">
                    {
                        editingProduct
                            ? 'Edit Product'
                            : 'Add Product'
                    }
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="mt-5 grid gap-4 md:grid-cols-2"
                >

                    <div>

                        <label className="mb-2 block text-sm text-slate-300">
                            Product name
                        </label>

                        <input
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

                    <div>

                        <label className="mb-2 block text-sm text-slate-300">
                            Brand
                        </label>

                        <select
                            value={brandId}
                            onChange={
                                event =>
                                    setBrandId(
                                        event.target.value,
                                    )
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                        >

                            <option value="">
                                Select brand
                            </option>

                            {brandsQuery.data?.map(
                                brand => (

                                    <option
                                        key={
                                            brand.id
                                        }
                                        value={
                                            brand.id
                                        }
                                    >
                                        {brand.name}
                                    </option>
                                ),
                            )}

                        </select>

                    </div>

                    <div>

                        <label className="mb-2 block text-sm text-slate-300">
                            Category
                        </label>

                        <select
                            value={categoryId}
                            onChange={
                                event =>
                                    setCategoryId(
                                        event.target.value,
                                    )
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                        >

                            <option value="">
                                Select category
                            </option>

                            {categoriesQuery.data?.map(
                                category => (

                                    <option
                                        key={
                                            category.id
                                        }
                                        value={
                                            category.id
                                        }
                                    >
                                        {category.name}
                                    </option>
                                ),
                            )}

                        </select>

                    </div>

                    <div>

                        <label className="mb-2 block text-sm text-slate-300">
                            Image URL
                        </label>

                        <input
                            value={imageUrl}
                            onChange={
                                event =>
                                    setImageUrl(
                                        event.target.value,
                                    )
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-sky-500"
                        />

                    </div>

                    <div className="md:col-span-2">

                        <label className="mb-2 block text-sm text-slate-300">
                            Description
                        </label>

                        <textarea
                            rows={4}
                            value={description}
                            onChange={
                                event =>
                                    setDescription(
                                        event.target.value,
                                    )
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-sky-500"
                        />

                    </div>

                    {error && (
                        <p
                            role="alert"
                            className="text-sm text-red-400 md:col-span-2"
                        >
                            {error}
                        </p>
                    )}

                    <div className="flex gap-3 md:col-span-2">

                        <button
                            type="submit"
                            disabled={
                                saveMutation.isPending
                            }
                            className="rounded-xl bg-sky-500 px-5 py-3 font-semibold text-slate-950"
                        >
                            {
                                saveMutation.isPending
                                    ? 'Saving...'
                                    : editingProduct
                                        ? 'Save changes'
                                        : 'Add product'
                            }
                        </button>

                        {editingProduct && (

                            <button
                                type="button"
                                onClick={
                                    resetForm
                                }
                                className="rounded-xl border border-slate-700 px-5 py-3"
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </form>

            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900">

                <div className="border-b border-slate-800 p-6">

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>

                            <h2 className="text-xl font-semibold">
                                Products
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                {
                                    data?.totalElements ??
                                    0
                                } products
                            </p>

                        </div>

                        <form
                            onSubmit={handleSearch}
                            className="flex gap-2"
                        >

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
                                placeholder="Search products..."
                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 outline-none focus:border-sky-500"
                            />

                            <button
                                className="rounded-xl border border-slate-700 px-4 py-2"
                            >
                                Search
                            </button>

                        </form>

                    </div>

                </div>

                {productsQuery.isLoading && (

                    <p className="p-6 text-slate-400">
                        Loading products...
                    </p>
                )}

                {productsQuery.isError && (

                    <p className="p-6 text-red-400">
                        Unable to load products.
                    </p>
                )}

                <div className="divide-y divide-slate-800">

                    {data?.content.map(
                        product => (

                            <div
                                key={
                                    product.id
                                }
                                className="grid gap-4 p-6 md:grid-cols-[1fr_auto]"
                            >

                                <div>

                                    <h3 className="font-semibold">
                                        {product.name}
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-400">
                                        {
                                            product.brand.name
                                        }
                                        {' · '}
                                        {
                                            product.category.name
                                        }
                                    </p>

                                    {product.description && (

                                        <p className="mt-3 max-w-3xl text-sm text-slate-300">
                                            {
                                                product.description
                                            }
                                        </p>
                                    )}

                                </div>

                                <div className="flex items-start gap-2">

                                    <button
                                        type="button"
                                        onClick={
                                            () =>
                                                beginEdit(
                                                    product,
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
                                                    product,
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

                {data &&
                    data.totalPages > 1 && (

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
                                                    current - 1,
                                                ),
                                        )
                                }
                                className="rounded-lg border border-slate-700 px-4 py-2 disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <span className="text-sm text-slate-400">
                            Page {
                                data.page + 1
                            } of {
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
                                                current + 1,
                                        )
                                }
                                className="rounded-lg border border-slate-700 px-4 py-2 disabled:opacity-40"
                            >
                                Next
                            </button>

                        </div>
                    )}

            </div>

        </section>
    )
}