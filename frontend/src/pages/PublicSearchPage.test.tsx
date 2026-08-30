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
    within,
} from '@testing-library/react'

import {
    describe,
    expect,
    it,
    vi,
} from 'vitest'

import PublicSearchPage
    from './PublicSearchPage'

vi.mock(
    '../api/publicSearchApi',
    () => ({

        getPublicSearchFilters:
            vi.fn()
                .mockResolvedValue({
                    brands: [
                        {
                            id: 1,
                            name:
                                'Coca-Cola',
                        },
                    ],

                    categories: [
                        {
                            id: 1,
                            name:
                                'Beverages',
                        },
                    ],

                    cities: [
                        'Skopje',
                    ],

                    statuses: [
                        'IN_STOCK',
                        'LOW_STOCK',
                        'OUT_OF_STOCK',
                    ],
                }),

        searchPublicProducts:
            vi.fn()
                .mockResolvedValue({

                    content: [
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

                    page: 0,
                    size: 12,
                    totalElements:
                        1,
                    totalPages:
                        1,
                    first: true,
                    last: true,
                }),
    }),
)

vi.mock(
    '../components/public/SearchResultsMap',
    () => ({
        default:
            () => (
                <div data-testid="search-results-map" />
            ),
    }),
)

describe(
    'PublicSearchPage',
    () => {

        it(
            'renders public search result',
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
                            '/search?q=Coca-Cola',
                        ]}
                    >

                        <QueryClientProvider
                            client={
                                queryClient
                            }
                        >

                            <PublicSearchPage />

                        </QueryClientProvider>

                    </MemoryRouter>,
                )

                expect(
                    await screen
                        .findByText(
                            'Coca-Cola Original 1L',
                        ),
                ).toBeInTheDocument()

                expect(
                    screen.getByText(
                        'Market Center',
                    ),
                ).toBeInTheDocument()

                const productName =
                    await screen.findByText(
                        'Coca-Cola Original 1L',
                    )

                const resultCard =
                    productName.closest('article')

                expect(
                    resultCard,
                ).not.toBeNull()

                expect(
                    within(
                        resultCard as HTMLElement,
                    ).getByText(
                        'In stock',
                    ),
                ).toBeInTheDocument()
            },
        )
    },
)