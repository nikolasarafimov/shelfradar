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
} from 'vitest'

import HomePage
    from './HomePage'

describe(
    'HomePage',
    () => {

        it(
            'renders public product search',
            () => {

                render(
                    <MemoryRouter>
                        <HomePage />
                    </MemoryRouter>,
                )

                expect(
                    screen.getByRole(
                        'heading',
                        {
                            name:
                                /Find the product you need/i,
                        },
                    ),
                ).toBeInTheDocument()

                expect(
                    screen.getByPlaceholderText(
                        /Search Coca-Cola/i,
                    ),
                ).toBeInTheDocument()

                expect(
                    screen.getByRole(
                        'button',
                        {
                            name:
                                'Search',
                        },
                    ),
                ).toBeInTheDocument()
            },
        )
    },
)