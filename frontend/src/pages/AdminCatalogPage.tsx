import {
    useState,
} from 'react'

import type {
    ReactNode,
} from 'react'

import {
    Boxes,
    PackageSearch,
    Tags,
} from 'lucide-react'

import {
    AnimatePresence,
    motion,
} from 'motion/react'

import {
    createBrand,
    createCategory,
    deleteBrand,
    deleteCategory,
    getBrands,
    getCategories,
    updateBrand,
    updateCategory,
} from '../api/adminApi'

import AdminLayout from '../components/admin/AdminLayout'
import CatalogNameManager from '../components/admin/CatalogNameManager'
import ProductManager from '../components/admin/ProductManager'
import PageHeader from '../components/ui/PageHeader'

type CatalogTab =
    | 'products'
    | 'brands'
    | 'categories'

export default function AdminCatalogPage() {
    const [
        activeTab,
        setActiveTab,
    ] = useState<CatalogTab>(
        'products',
    )

    return (
        <AdminLayout>
            <div className="space-y-8">
                <PageHeader
                    eyebrow="ShelfRadar Admin"
                    title="Catalog management"
                    description="Manage the products, brands and categories available across the ShelfRadar platform."
                />

                <nav
                    aria-label="Catalog management sections"
                    className="premium-card flex w-full gap-1 overflow-x-auto rounded-2xl p-1.5 sm:w-fit"
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
                                className="size-4"
                                aria-hidden="true"
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
                                className="size-4"
                                aria-hidden="true"
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
                                className="size-4"
                                aria-hidden="true"
                            />
                        }
                    >
                        Categories
                    </TabButton>
                </nav>

                <AnimatePresence
                    mode="wait"
                    initial={false}
                >
                    <motion.div
                        key={activeTab}
                        initial={{
                            opacity: 0,
                            y: 8,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            y: -6,
                        }}
                        transition={{
                            duration: 0.2,
                            ease: [
                                0.16,
                                1,
                                0.3,
                                1,
                            ],
                        }}
                    >
                        {activeTab ===
                            'products' && (
                                <ProductManager />
                            )}

                        {activeTab ===
                            'brands' && (
                                <CatalogNameManager
                                    title="Brands"
                                    singular="Brand"
                                    queryKey={[
                                        'admin-brands',
                                    ]}
                                    loadItems={
                                        getBrands
                                    }
                                    createItem={
                                        createBrand
                                    }
                                    updateItem={
                                        updateBrand
                                    }
                                    deleteItem={
                                        deleteBrand
                                    }
                                />
                            )}

                        {activeTab ===
                            'categories' && (
                                <CatalogNameManager
                                    title="Categories"
                                    singular="Category"
                                    queryKey={[
                                        'admin-categories',
                                    ]}
                                    loadItems={
                                        getCategories
                                    }
                                    createItem={
                                        createCategory
                                    }
                                    updateItem={
                                        updateCategory
                                    }
                                    deleteItem={
                                        deleteCategory
                                    }
                                />
                            )}
                    </motion.div>
                </AnimatePresence>
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
    icon: ReactNode
    children: string
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={
                active
                    ? 'inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-sky-300/15 bg-sky-300/[0.07] px-4 text-sm font-semibold text-sky-300 shadow-[inset_0_0_20px_rgba(56,189,248,0.025)]'
                    : 'inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-transparent px-4 text-sm font-medium text-slate-500 transition duration-200 hover:border-slate-800/80 hover:bg-slate-900/50 hover:text-slate-200'
            }
        >
            {icon}

            <span>
                {children}
            </span>
        </button>
    )
}