import {
    CircleMarker,
    MapContainer,
    Popup,
    TileLayer,
} from 'react-leaflet'

import type {
    PublicStore,
} from '../../types/publicSearch'


export default function StoreLocationMap({
                                             store,
                                         }: {
    store: PublicStore
}) {

    const center:
        [number, number] = [
        store.latitude,
        store.longitude,
    ]


    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <MapContainer
                center={center}
                zoom={15}
                scrollWheelZoom
                className="h-[360px] w-full"
            >

                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />


                <CircleMarker
                    center={center}
                    radius={9}
                >

                    <Popup>

                        <div className="space-y-1">

                            <strong>
                                {
                                    store.name
                                }
                            </strong>

                            <div>
                                {
                                    store.address
                                }
                            </div>

                            <div>
                                {
                                    store.city
                                }
                            </div>

                        </div>

                    </Popup>

                </CircleMarker>

            </MapContainer>

        </div>
    )
}