const numberFormatter =
    new Intl.NumberFormat(
        'en-US',
    )

const mkdFormatter =
    new Intl.NumberFormat(
        'en-US',
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        },
    )

const dateTimeFormatter =
    new Intl.DateTimeFormat(
        'en-GB',
        {
            dateStyle: 'medium',
            timeStyle: 'short',
        },
    )

export function formatNumber(
    value: number,
): string {
    return numberFormatter.format(value)
}

export function formatMkd(
    value: number,
): string {
    return `${mkdFormatter.format(value)} MKD`
}

export function formatDateTime(
    value: string | null,
): string {
    if (!value) {
        return 'Never'
    }

    return dateTimeFormatter.format(
        new Date(value),
    )
}

export function formatDistance(
    distanceKm: number | null,
): string | null {
    if (distanceKm === null) {
        return null
    }

    const distanceMeters =
        Math.round(
            distanceKm * 1000,
        )

    if (distanceMeters < 1000) {
        return `${distanceMeters} m`
    }

    return `${distanceKm.toFixed(1)} km`
}