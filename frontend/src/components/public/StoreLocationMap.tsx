import {
    CircleMarker,
    MapContainer,
    Popup,
    TileLayer,
} from 'react-leaflet'

import {
    MapPin,
} from 'lucide-react'

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

    const mapKey =
        `${store.id}-${store.latitude}-${store.longitude}`

    return (
        <section className="premium-card overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-[0_25px_70px_-40px_rgba(14,165,233,0.22)] backdrop-blur-xl">
            <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-900/50 bg-sky-950/30 text-sky-400">
                    <MapPin size={15}/>
                </div>

                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-200">
                        Store location
                    </p>

                    <p className="mt-0.5 truncate text-[11px] text-slate-500">
                        {
                            store.address
                        }
                        ,{' '}
                        {
                            store.city
                        }
                    </p>
                </div>
            </div>

            <div className="shelfradar-map">
                <MapContainer
                    key={
                        mapKey
                    }
                    center={
                        center
                    }
                    zoom={
                        15
                    }
                    scrollWheelZoom={
                        false
                    }
                    className="h-[300px] w-full sm:h-[330px]"
                >
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <CircleMarker
                        center={
                            center
                        }
                        radius={
                            9
                        }
                        pathOptions={{
                            color:
                                '#0891b2',

                            fillColor:
                                '#22d3ee',

                            fillOpacity:
                                0.95,

                            weight:
                                3,
                        }}
                    >
                        <Popup>
                            <div className="min-w-[170px]">
                                <strong>
                                    {
                                        store.name
                                    }
                                </strong>

                                <div className="mt-1">
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

            <div className="flex items-center justify-between gap-3 border-t border-slate-800 bg-[#020817]/35 px-4 py-2.5">
                <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.75)]" />
                    <span className="text-[10px] text-slate-500">
                        ShelfRadar store
                    </span>
                </span>

                <span className="truncate text-[10px] text-slate-600">
                    {
                        store.city
                    }
                </span>
            </div>
        </section>
    )
}