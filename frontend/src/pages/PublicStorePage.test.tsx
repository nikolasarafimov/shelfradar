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

import PublicStorePage
    from './PublicStorePage'


vi.mock(
    '../components/public/StoreLocationMap',
    () => ({
        default:
            () => (
                <div data-testid="store-map" />
            ),
    }),
)


vi.mock(
    '../api/publicBrowseApi',
    () => ({
        getPublicStore:
            vi.fn()
                .mockResolvedValue({
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
                            '+389 2 555 1001',
                        workingHours:
                            'Mon-Sun 08:00-22:00',
                    },

                    inventory: [
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
                                    '+389 2 555 1001',
                                workingHours:
                                    'Mon-Sun 08:00-22:00',
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

                    totalProducts:
                        1,
                    availableProducts:
                        1,
                }),
    }),
)


describe(
    'PublicStorePage',
    () => {

        it(
            'renders store and inventory',
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
                            '/stores/1',
                        ]}
                    >

                        <QueryClientProvider
                            client={
                                queryClient
                            }
                        >

                            <Routes>

                                <Route
                                    path="/stores/:storeId"
                                    element={
                                        <PublicStorePage />
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
                                'Market Center',
                        },
                    ),
                ).toBeInTheDocument()


                expect(
                    screen.getByText(
                        'Coca-Cola Original 1L',
                    ),
                ).toBeInTheDocument()


                expect(
                    screen.getByTestId(
                        'store-map',
                    ),
                ).toBeInTheDocument()
            },
        )
    },
)