import {
    CircleMarker,
    MapContainer,
    Popup,
    TileLayer,
} from 'react-leaflet'

import type {
    PublicSearchResult,
} from '../../types/publicSearch'


interface UserLocation {
    latitude: number
    longitude: number
}


interface SearchResultsMapProps {
    results: PublicSearchResult[]
    userLocation: UserLocation | null
}


export default function SearchResultsMap({
                                             results,
                                             userLocation,
                                         }: SearchResultsMapProps) {

    const uniqueStores =
        Array.from(
            new Map(
                results.map(
                    result => [
                        result.store.id,
                        result,
                    ],
                ),
            ).values(),
        )


    if (
        uniqueStores.length === 0 &&
        !userLocation
    ) {
        return null
    }


    const center:
        [number, number] =
        userLocation
            ? [
                userLocation.latitude,
                userLocation.longitude,
            ]
            : [
                uniqueStores[0]
                    .store
                    .latitude,

                uniqueStores[0]
                    .store
                    .longitude,
            ]


    const mapKey =
        [
            center[0],
            center[1],
            ...uniqueStores.map(
                result =>
                    result.store.id,
            ),
        ].join('-')


    return (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <MapContainer
                key={mapKey}
                center={center}
                zoom={13}
                scrollWheelZoom
                className="h-[420px] w-full"
            >

                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />


                {
                    userLocation && (

                        <CircleMarker
                            center={[
                                userLocation.latitude,
                                userLocation.longitude,
                            ]}
                            radius={9}
                        >
                            <Popup>
                                Your location
                            </Popup>
                        </CircleMarker>
                    )
                }


                {
                    uniqueStores.map(
                        result => (

                            <CircleMarker
                                key={
                                    result.store.id
                                }
                                center={[
                                    result.store.latitude,
                                    result.store.longitude,
                                ]}
                                radius={7}
                            >

                                <Popup>

                                    <div className="space-y-1">

                                        <strong>
                                            {
                                                result
                                                    .store
                                                    .name
                                            }
                                        </strong>

                                        <div>
                                            {
                                                result
                                                    .store
                                                    .address
                                            }
                                        </div>

                                        {
                                            result.distanceKm !==
                                            null && (

                                                <div>
                                                    {
                                                        formatDistance(
                                                            result.distanceKm,
                                                        )
                                                    } away
                                                </div>
                                            )
                                        }

                                    </div>

                                </Popup>

                            </CircleMarker>
                        ),
                    )
                }

            </MapContainer>

        </div>
    )
}


function formatDistance(
    distanceKm: number,
): string {

    if (distanceKm < 1) {

        return `${Math.round(
            distanceKm * 1000,
        )} m`
    }

    return `${distanceKm.toFixed(1)} km`
}