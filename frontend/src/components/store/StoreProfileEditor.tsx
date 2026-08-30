import {
    useState,
} from 'react'

import type {
    FormEvent,
} from 'react'

import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'

import {
    updateStore,
} from '../../api/storeApi'

import type {
    Store,
} from '../../types/store'

export default function StoreProfileEditor({
                                               store,
                                           }: {
    store: Store
}) {

    const queryClient =
        useQueryClient()

    const [name, setName] =
        useState(store.name)

    const [address, setAddress] =
        useState(store.address)

    const [city, setCity] =
        useState(store.city)

    const [latitude, setLatitude] =
        useState(
            String(
                store.latitude,
            ),
        )

    const [longitude, setLongitude] =
        useState(
            String(
                store.longitude,
            ),
        )

    const [phone, setPhone] =
        useState(
            store.phone ?? '',
        )

    const [
        workingHours,
        setWorkingHours,
    ] =
        useState(
            store.workingHours ??
            '',
        )

    const [message, setMessage] =
        useState<string | null>(
            null,
        )

    const mutation =
        useMutation({

            mutationFn:
                () =>
                    updateStore(
                        store.id,
                        {
                            name,
                            address,
                            city,

                            latitude:
                                Number(
                                    latitude,
                                ),

                            longitude:
                                Number(
                                    longitude,
                                ),

                            phone:
                                phone.trim() ||
                                null,

                            workingHours:
                                workingHours
                                    .trim() ||
                                null,
                        },
                    ),

            onSuccess:
                async () => {

                    setMessage(
                        'Store information updated successfully.',
                    )

                    await queryClient
                        .invalidateQueries({
                            queryKey: [
                                'store',
                                store.id,
                            ],
                        })

                    await queryClient
                        .invalidateQueries({
                            queryKey: [
                                'my-stores',
                            ],
                        })
                },

            onError:
                () =>
                    setMessage(
                        'Unable to update store information.',
                    ),
        })

    function handleSubmit(
        event:
        FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault()

        setMessage(null)

        mutation.mutate()
    }

    return (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="text-xl font-semibold">
                Store Profile
            </h2>

            <p className="mt-1 text-sm text-slate-400">
                Store status: {store.status}
            </p>

            <form
                onSubmit={handleSubmit}
                className="mt-6 grid gap-5 md:grid-cols-2"
            >

                <Field
                    label="Store Name"
                    value={name}
                    onChange={setName}
                />

                <Field
                    label="City"
                    value={city}
                    onChange={setCity}
                />

                <div className="md:col-span-2">
                    <Field
                        label="Address"
                        value={address}
                        onChange={
                            setAddress
                        }
                    />
                </div>

                <Field
                    label="Latitude"
                    value={latitude}
                    onChange={
                        setLatitude
                    }
                    type="number"
                />

                <Field
                    label="Longitude"
                    value={longitude}
                    onChange={
                        setLongitude
                    }
                    type="number"
                />

                <Field
                    label="Phone"
                    value={phone}
                    onChange={setPhone}
                />

                <Field
                    label="Working Hours"
                    value={workingHours}
                    onChange={
                        setWorkingHours
                    }
                />

                {
                    message && (
                        <p className="md:col-span-2 text-sm text-slate-300">
                            {message}
                        </p>
                    )
                }

                <div className="md:col-span-2">

                    <button
                        disabled={
                            mutation.isPending
                        }
                        className="rounded-xl bg-sky-500 px-5 py-3 font-semibold text-slate-950"
                    >
                        {
                            mutation.isPending
                                ? 'Saving...'
                                : 'Save Changes'
                        }
                    </button>

                </div>

            </form>

        </section>
    )
}


function Field({
                   label,
                   value,
                   onChange,
                   type = 'text',
               }: {
    label: string
    value: string
    onChange:
        (value: string) => void
    type?: string
}) {

    return (
        <label className="block">

            <span className="mb-2 block text-sm text-slate-300">
                {label}
            </span>

            <input
                type={type}
                step={
                    type === 'number'
                        ? 'any'
                        : undefined
                }
                value={value}
                onChange={
                    event =>
                        onChange(
                            event.target.value,
                        )
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-sky-500"
            />

        </label>
    )
}