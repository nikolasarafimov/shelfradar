import {
    useState,
} from 'react'

import {
    Link,
} from 'react-router-dom'

import BrandManager
    from '../components/admin/BrandManager'

import CategoryManager
    from '../components/admin/CategoryManager'

import ProductManager
    from '../components/admin/ProductManager'

type CatalogTab =
    | 'products'
    | 'brands'
    | 'categories'

export default function AdminCatalogPage() {

    const [
        activeTab,
        setActiveTab,
    ] =
        useState<CatalogTab>(
            'products',
        )

    return (
        <main className="min-h-screen bg-slate-950 px-5 py-8 text-white md:px-8">

            <div className="mx-auto max-w-7xl">

                <div>

                    <Link
                        to="/admin"
                        className="text-sm text-slate-400 hover:text-white"
                    >
                        ← Admin Dashboard
                    </Link>

                    <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">
                        ShelfRadar Admin
                    </p>

                    <h1 className="mt-2 text-4xl font-bold">
                        Catalog Management
                    </h1>

                    <p className="mt-3 text-slate-400">
                        Manage products, brands and categories available across ShelfRadar.
                    </p>

                </div>

                <div className="mt-8 flex gap-2 border-b border-slate-800">

                    <TabButton
                        active={
                            activeTab ===
                            'products'
                        }
                        onClick={
                            () =>
                                setActiveTab(
                                    'products',
                                )
                        }
                    >
                        Products
                    </TabButton>

                    <TabButton
                        active={
                            activeTab ===
                            'brands'
                        }
                        onClick={
                            () =>
                                setActiveTab(
                                    'brands',
                                )
                        }
                    >
                        Brands
                    </TabButton>

                    <TabButton
                        active={
                            activeTab ===
                            'categories'
                        }
                        onClick={
                            () =>
                                setActiveTab(
                                    'categories',
                                )
                        }
                    >
                        Categories
                    </TabButton>

                </div>

                <div className="mt-8">

                    {
                        activeTab ===
                        'products' && (
                            <ProductManager />
                        )
                    }

                    {
                        activeTab ===
                        'brands' && (
                            <BrandManager />
                        )
                    }

                    {
                        activeTab ===
                        'categories' && (
                            <CategoryManager />
                        )
                    }

                </div>

            </div>

        </main>
    )
}

interface TabButtonProps {
    active: boolean
    onClick: () => void
    children: string
}

function TabButton({
                       active,
                       onClick,
                       children,
                   }: TabButtonProps) {

    return (
        <button
            type="button"
            onClick={onClick}
            className={
                active
                    ? 'border-b-2 border-sky-400 px-4 py-3 font-medium text-white'
                    : 'px-4 py-3 text-slate-400 hover:text-white'
            }
        >
            {children}
        </button>
    )
}