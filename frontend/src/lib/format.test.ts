import {
    describe,
    expect,
    it,
} from 'vitest'

import {
    formatDateTime,
    formatDistance,
    formatMkd,
    formatNumber,
} from './format'

describe('formatNumber', () => {
    it('formats numbers with en-US thousands separators', () => {
        expect(
            formatNumber(
                1234567,
            ),
        ).toBe(
            '1,234,567',
        )
    })

    it('preserves decimal values', () => {
        expect(
            formatNumber(
                1234.5,
            ),
        ).toBe(
            '1,234.5',
        )
    })
})

describe('formatMkd', () => {
    it('formats a whole monetary value in MKD', () => {
        expect(
            formatMkd(
                2500,
            ),
        ).toBe(
            '2,500 MKD',
        )
    })

    it('keeps up to two decimal places', () => {
        expect(
            formatMkd(
                1234.567,
            ),
        ).toBe(
            '1,234.57 MKD',
        )
    })

    it('does not force trailing decimal zeros', () => {
        expect(
            formatMkd(
                99.5,
            ),
        ).toBe(
            '99.5 MKD',
        )
    })
})

describe('formatDateTime', () => {
    it('returns Never when the value is null', () => {
        expect(
            formatDateTime(
                null,
            ),
        ).toBe(
            'Never',
        )
    })

    it('formats a valid timestamp using the configured locale', () => {
        const value =
            '2026-10-11T12:30:00Z'

        const expected =
            new Intl.DateTimeFormat(
                'en-GB',
                {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                },
            ).format(
                new Date(
                    value,
                ),
            )

        expect(
            formatDateTime(
                value,
            ),
        ).toBe(
            expected,
        )
    })
})

describe('formatDistance', () => {
    it('returns null when distance is unavailable', () => {
        expect(
            formatDistance(
                null,
            ),
        ).toBeNull()
    })

    it('formats distances below one kilometre in metres', () => {
        expect(
            formatDistance(
                0.42,
            ),
        ).toBe(
            '420 m',
        )
    })

    it('rounds metre values to the nearest whole metre', () => {
        expect(
            formatDistance(
                0.4216,
            ),
        ).toBe(
            '422 m',
        )
    })

    it('formats one kilometre and above in kilometres', () => {
        expect(
            formatDistance(
                1,
            ),
        ).toBe(
            '1.0 km',
        )
    })

    it('formats kilometre values with one decimal place', () => {
        expect(
            formatDistance(
                12.34,
            ),
        ).toBe(
            '12.3 km',
        )
    })

    it('switches to kilometres when rounded metres reach 1000', () => {
        expect(
            formatDistance(
                0.9996,
            ),
        ).toBe(
            '1.0 km',
        )
    })
})