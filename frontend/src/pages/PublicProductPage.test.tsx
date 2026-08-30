import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

import {
    MemoryRouter,
    Route,
    Routes,
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

import PublicProductPage
    from './PublicProductPage'


vi.mock(
    '../components/public/SearchResultsMap',
    () => ({
        default:
            () => (
                <div data-testid="product-map" />
            ),
    }),
)


vi.mock(
    '../api/publicBrowseApi',
    () => ({
        getPublicProduct:
            vi.fn()
                .mockResolvedValue({
                    product: {
                        id: 1,
                        name:
                            'Coca-Cola Original 1L',
                        description:
                            'Classic Coca-Cola.',
                        imageUrl:
                            null,
                        brand: {
                            id: 1,
                            name:
                                'Coca-Cola',
                        },
                        category: {
                            id: 1,
                            name:
                                'Beverages',
                        },
                        createdAt:
                            '2026-01-01T00:00:00Z',
                    },

                    offers: [
                        {
                            inventoryId:
                                1,

                            product: {
                                id: 1,
                                name:
                                    'Coca-Cola Original 1L',
                                description:
                                    null,
                                imageUrl:
                                    null,
                                brand: {
                                    id: 1,
                                    name:
                                        'Coca-Cola',
                                },
                                category: {
                                    id: 1,
                                    name:
                                        'Beverages',
                                },
                                createdAt:
                                    '2026-01-01T00:00:00Z',
                            },

                            store: {
                                id: 1,
                                name:
                                    'Market Center',
                                address:
                                    'Macedonia Square 1',
                                city:
                                    'Skopje',
                                latitude:
                                    41.9981,
                                longitude:
                                    21.4254,
                                phone:
                                    null,
                                workingHours:
                                    null,
                            },

                            price:
                                72,
                            quantity:
                                25,
                            status:
                                'IN_STOCK',
                            updatedAt:
                                '2026-01-01T00:00:00Z',
                            distanceKm:
                                null,
                        },
                    ],

                    lowestPrice:
                        72,
                    totalStores:
                        1,
                    availableStores:
                        1,
                }),
    }),
)


describe(
    'PublicProductPage',
    () => {

        it(
            'renders product details and offers',
            async () => {

                const queryClient =
                    new QueryClient({
                        defaultOptions: {
                            queries: {
                                retry:
                                    false,
                            },
                        },
                    })


                render(
                    <MemoryRouter
                        initialEntries={[
                            '/products/1',
                        ]}
                    >

                        <QueryClientProvider
                            client={
                                queryClient
                            }
                        >

                            <Routes>

                                <Route
                                    path="/products/:productId"
                                    element={
                                        <PublicProductPage />
                                    }
                                />

                            </Routes>

                        </QueryClientProvider>

                    </MemoryRouter>,
                )


                expect(
                    await screen.findByRole(
                        'heading',
                        {
                            name:
                                'Coca-Cola Original 1L',
                        },
                    ),
                ).toBeInTheDocument()


                expect(
                    screen.getByText(
                        'Market Center',
                    ),
                ).toBeInTheDocument()


                expect(
                    screen.getByText(
                        '72 MKD',
                    ),
                ).toBeInTheDocument()
            },
        )
    },
)