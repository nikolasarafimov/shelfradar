export function formatNumber(
    value: number,
): string {

    return new Intl.NumberFormat(
        'en-US',
    ).format(value)
}

export function formatMkd(
    value: number,
): string {

    return `${new Intl.NumberFormat(
        'en-US',
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        },
    ).format(value)} MKD`
}

export function formatDateTime(
    value: string | null,
): string {
    if (!value) {
        return 'Never'
    }

    return new Intl.DateTimeFormat(
        'en-GB',
        {
            dateStyle: 'medium',
            timeStyle: 'short',
        },
    ).format(
        new Date(value),
    )
}

export function formatDistance(
    distanceKm: number | null,
): string | null {

    if (distanceKm === null) {
        return null
    }

    if (distanceKm < 1) {

        return `${Math.round(
            distanceKm * 1000,
        )} m`
    }
    return `${distanceKm.toFixed(1)} km`
}