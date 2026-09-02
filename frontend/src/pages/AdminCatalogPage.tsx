import {
    useState,
} from 'react'

import {
    Boxes,
    PackageSearch,
    Tags,
} from 'lucide-react'

import AdminLayout
    from '../components/admin/AdminLayout'

import BrandManager
    from '../components/admin/BrandManager'

import CategoryManager
    from '../components/admin/CategoryManager'

import ProductManager
    from '../components/admin/ProductManager'

import PageHeader
    from '../components/ui/PageHeader'


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
        <AdminLayout>
            <div className="space-y-8">
                <PageHeader
                    eyebrow="ShelfRadar Admin"
                    title="Catalog Management"
                    description="Manage the products, brands and categories available across the ShelfRadar platform."
                />

                <nav
                    aria-label="Catalog management sections"
                    className="premium-card flex w-full gap-1 overflow-x-auto rounded-2xl border border-slate-800/90 bg-slate-900/50 p-1.5 backdrop-blur-xl sm:w-fit"
                >
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
                        icon={
                            <PackageSearch
                                size={15}
                            />
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
                        icon={
                            <Tags
                                size={15}
                            />
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
                        icon={
                            <Boxes
                                size={15}
                            />
                        }
                    >
                        Categories
                    </TabButton>
                </nav>

                <div>
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

        </AdminLayout>
    )
}

function TabButton({
                       active,
                       onClick,
                       icon,
                       children,
                   }: {
    active: boolean
    onClick: () => void
    icon: React.ReactNode
    children: string
}) {

    return (
        <button
            type="button"
            onClick={
                onClick
            }
            aria-pressed={
                active
            }
            className={
                active
                    ? 'inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-sky-900/50 bg-sky-950/35 px-4 text-sm font-semibold text-sky-300 shadow-[inset_0_0_20px_rgba(14,165,233,0.04)]'
                    : 'inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-transparent px-4 text-sm font-medium text-slate-500 transition duration-200 hover:border-slate-800 hover:bg-slate-800/50 hover:text-slate-200'
            }
        >

            {icon}

            <span>
                {children}
            </span>
        </button>
    )
}