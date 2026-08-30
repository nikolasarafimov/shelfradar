import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

import {
    MemoryRouter,
} from 'react-router-dom'

import {
    render,
    screen,
} from '@testing-library/react'

import {
    describe,
    expect,
    it,
    vi,
} from 'vitest'

import AdminCatalogPage
    from './AdminCatalogPage'

vi.mock(
    '../api/catalogApi',
    () => ({

        getBrands:
            vi.fn().mockResolvedValue([
                {
                    id: 1,
                    name: 'Coca-Cola',
                },
            ]),

        getCategories:
            vi.fn().mockResolvedValue([
                {
                    id: 1,
                    name: 'Beverages',
                },
            ]),

        getProducts:
            vi.fn().mockResolvedValue({
                content: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                first: true,
                last: true,
            }),

        createBrand:
            vi.fn(),

        updateBrand:
            vi.fn(),

        deleteBrand:
            vi.fn(),

        createCategory:
            vi.fn(),

        updateCategory:
            vi.fn(),

        deleteCategory:
            vi.fn(),

        createProduct:
            vi.fn(),

        updateProduct:
            vi.fn(),

        deleteProduct:
            vi.fn(),
    }),
)

describe(
    'AdminCatalogPage',
    () => {

        it(
            'renders catalog management',
            async () => {

                const queryClient =
                    new QueryClient({
                        defaultOptions: {
                            queries: {
                                retry: false,
                            },
                        },
                    })

                render(
                    <MemoryRouter>

                        <QueryClientProvider
                            client={queryClient}
                        >

                            <AdminCatalogPage />

                        </QueryClientProvider>

                    </MemoryRouter>,
                )

                expect(
                    screen.getByRole(
                        'heading',
                        {
                            name:
                                'Catalog Management',
                        },
                    ),
                ).toBeInTheDocument()

                expect(
                    screen.getByRole(
                        'button',
                        {
                            name:
                                'Products',
                        },
                    ),
                ).toBeInTheDocument()

                expect(
                    screen.getByRole(
                        'button',
                        {
                            name:
                                'Brands',
                        },
                    ),
                ).toBeInTheDocument()

                expect(
                    screen.getByRole(
                        'button',
                        {
                            name:
                                'Categories',
                        },
                    ),
                ).toBeInTheDocument()
            },
        )
    },
)