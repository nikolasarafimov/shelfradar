import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

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

import StoreOverview
    from './StoreOverview'


vi.mock(
    '../../api/storeApi',
    () => ({
        getStoreDashboard:
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
                            null,
                        workingHours:
                            null,
                        status:
                            'ACTIVE',
                        createdAt:
                            '2026-01-01T00:00:00Z',
                    },

                    totalProducts:
                        4,

                    availableProducts:
                        3,

                    inStockProducts:
                        2,

                    lowStockProducts:
                        1,

                    outOfStockProducts:
                        1,

                    totalUnits:
                        42,

                    inventoryValue:
                        3850,

                    lastUpdatedAt:
                        '2026-08-30T20:00:00Z',

                    alerts: [
                        {
                            id: 2,
                            storeId: 1,

                            product: {
                                id: 2,
                                name:
                                    'Coca-Cola Zero 1.5L',
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

                            price:
                                80,

                            quantity:
                                2,

                            status:
                                'LOW_STOCK',

                            updatedAt:
                                '2026-08-30T20:00:00Z',
                        },
                    ],

                    recentUpdates: [],
                }),
    }),
)


describe(
    'StoreOverview',
    () => {

        it(
            'renders metrics and inventory alerts',
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
                    <QueryClientProvider
                        client={
                            queryClient
                        }
                    >

                        <StoreOverview
                            storeId={1}
                            onManageInventory={
                                vi.fn()
                            }
                            onEditProfile={
                                vi.fn()
                            }
                        />

                    </QueryClientProvider>,
                )


                expect(
                    await screen.findByText(
                        'Inventory alerts',
                    ),
                ).toBeInTheDocument()


                expect(
                    screen.getByText(
                        'Coca-Cola Zero 1.5L',
                    ),
                ).toBeInTheDocument()


                expect(
                    screen.getByText(
                        '42',
                    ),
                ).toBeInTheDocument()


                expect(
                    screen.getByText(
                        '3,850 MKD',
                    ),
                ).toBeInTheDocument()
            },
        )
    },
)