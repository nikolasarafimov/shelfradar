import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
    render,
    screen,
} from '@testing-library/react'

import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest'

import HomePage from './HomePage'
import { getHealth } from '../api/healthApi'

vi.mock('../api/healthApi', () => ({
    getHealth: vi.fn(),
}))

describe('HomePage', () => {

    beforeEach(() => {

        vi.mocked(getHealth).mockResolvedValue({
            status: 'UP',
            database: 'UP',
            postgis: 'PostGIS Test Version',
        })

    })

    it('displays the ShelfRadar application', async () => {

        const queryClient =
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: false,
                    },
                },
            })

        render(
            <QueryClientProvider client={queryClient}>
                <HomePage />
            </QueryClientProvider>,
        )

        expect(
            screen.getByRole(
                'heading',
                {
                    name: 'ShelfRadar',
                },
            ),
        ).toBeInTheDocument()

        expect(
            await screen.findByText(/PostGIS Test Version/),
        ).toBeInTheDocument()
    })
})