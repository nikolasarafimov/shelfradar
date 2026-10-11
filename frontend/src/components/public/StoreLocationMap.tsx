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
} from '../../types/public'

interface StoreLocationMapProps {
    store: PublicStore
}

type MapPoint = [
    number,
    number,
]

export default function StoreLocationMap({
                                             store,
                                         }: StoreLocationMapProps) {
    const center: MapPoint = [
        store.latitude,
        store.longitude,
    ]

    const mapKey =
        `${store.id}-${store.latitude}-${store.longitude}`

    return (
        <section className="premium-card overflow-hidden rounded-2xl">
            <div className="relative flex items-center gap-3 border-b border-slate-800/80 px-5 py-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-300/[0.08] text-sky-300">
                    <MapPin
                        className="size-4"
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />
                </div>

                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold tracking-tight text-slate-50">
                        Store location
                    </p>

                    <p className="mt-0.5 truncate text-[11px] text-slate-500">
                        {store.address}, {store.city}
                    </p>
                </div>
            </div>

            <div className="shelfradar-map rounded-none border-0 shadow-none">
                <MapContainer
                    key={mapKey}
                    center={center}
                    zoom={15}
                    scrollWheelZoom={false}
                    className="h-[300px] w-full sm:h-[330px]"
                >
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <CircleMarker
                        center={center}
                        radius={9}
                        pathOptions={{
                            color: '#0284c7',
                            fillColor: '#38bdf8',
                            fillOpacity: 0.95,
                            weight: 3,
                        }}
                    >
                        <Popup>
                            <div className="min-w-[175px]">
                                <strong>
                                    {store.name}
                                </strong>

                                <div className="mt-1 text-xs">
                                    {store.address}
                                </div>

                                <div className="text-xs">
                                    {store.city}
                                </div>
                            </div>
                        </Popup>
                    </CircleMarker>
                </MapContainer>
            </div>

            <div className="relative flex items-center justify-between gap-3 border-t border-slate-800/80 bg-slate-950/25 px-5 py-3">
                <span className="inline-flex items-center gap-2">
                    <span
                        aria-hidden="true"
                        className="size-2 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.7)]"
                    />

                    <span className="text-[10px] font-medium text-slate-500">
                        ShelfRadar store
                    </span>
                </span>

                <span className="truncate text-[10px] text-slate-600">
                    {store.city}
                </span>
            </div>
        </section>
    )
}