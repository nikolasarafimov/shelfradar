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

import StatusBadge
    from '../ui/StatusBadge'


export default function StoreProfileEditor({
                                               store,
                                           }: {
    store: Store
}) {

    const queryClient =
        useQueryClient()


    const [
        name,
        setName,
    ] =
        useState(
            store.name,
        )


    const [
        address,
        setAddress,
    ] =
        useState(
            store.address,
        )


    const [
        city,
        setCity,
    ] =
        useState(
            store.city,
        )


    const [
        latitude,
        setLatitude,
    ] =
        useState(
            String(
                store.latitude,
            ),
        )


    const [
        longitude,
        setLongitude,
    ] =
        useState(
            String(
                store.longitude,
            ),
        )


    const [
        phone,
        setPhone,
    ] =
        useState(
            store.phone ?? '',
        )


    const [
        workingHours,
        setWorkingHours,
    ] =
        useState(
            store.workingHours ?? '',
        )


    const [
        successMessage,
        setSuccessMessage,
    ] =
        useState<string | null>(
            null,
        )


    const [
        errorMessage,
        setErrorMessage,
    ] =
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
                            name:
                                name.trim(),

                            address:
                                address.trim(),

                            city:
                                city.trim(),

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
                                workingHours.trim() ||
                                null,
                        },
                    ),

            onSuccess:
                async updatedStore => {

                    setName(
                        updatedStore.name,
                    )

                    setAddress(
                        updatedStore.address,
                    )

                    setCity(
                        updatedStore.city,
                    )

                    setLatitude(
                        String(
                            updatedStore.latitude,
                        ),
                    )

                    setLongitude(
                        String(
                            updatedStore.longitude,
                        ),
                    )

                    setPhone(
                        updatedStore.phone ??
                        '',
                    )

                    setWorkingHours(
                        updatedStore.workingHours ??
                        '',
                    )


                    setErrorMessage(
                        null,
                    )

                    setSuccessMessage(
                        'Store information updated successfully.',
                    )


                    await Promise.all([
                        queryClient.invalidateQueries({
                            queryKey: [
                                'store',
                                store.id,
                            ],
                        }),

                        queryClient.invalidateQueries({
                            queryKey: [
                                'my-stores',
                            ],
                        }),

                        queryClient.invalidateQueries({
                            queryKey: [
                                'store-dashboard',
                                store.id,
                            ],
                        }),

                        queryClient.invalidateQueries({
                            queryKey: [
                                'owner-dashboard',
                            ],
                        }),

                        queryClient.invalidateQueries({
                            queryKey: [
                                'store-activity',
                                store.id,
                            ],
                        }),
                    ])
                },

            onError:
                () => {

                    setSuccessMessage(
                        null,
                    )

                    setErrorMessage(
                        'Unable to update store information.',
                    )
                },
        })


    function handleSubmit(
        event:
        FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault()


        const trimmedName =
            name.trim()

        const trimmedAddress =
            address.trim()

        const trimmedCity =
            city.trim()

        const numericLatitude =
            Number(
                latitude,
            )

        const numericLongitude =
            Number(
                longitude,
            )


        setSuccessMessage(
            null,
        )

        setErrorMessage(
            null,
        )


        if (!trimmedName) {

            setErrorMessage(
                'Store name is required.',
            )

            return
        }


        if (!trimmedAddress) {

            setErrorMessage(
                'Address is required.',
            )

            return
        }


        if (!trimmedCity) {

            setErrorMessage(
                'City is required.',
            )

            return
        }


        if (
            !Number.isFinite(
                numericLatitude,
            ) ||
            numericLatitude < -90 ||
            numericLatitude > 90
        ) {

            setErrorMessage(
                'Latitude must be between -90 and 90.',
            )

            return
        }


        if (
            !Number.isFinite(
                numericLongitude,
            ) ||
            numericLongitude < -180 ||
            numericLongitude > 180
        ) {

            setErrorMessage(
                'Longitude must be between -180 and 180.',
            )

            return
        }


        mutation.mutate()
    }


    return (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div>

                    <h2 className="text-xl font-semibold">
                        Store Profile
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                        Update public store information and location details.
                    </p>

                </div>


                <StatusBadge
                    status={
                        store.status
                    }
                />

            </div>


            <form
                onSubmit={
                    handleSubmit
                }
                className="mt-6 grid gap-5 md:grid-cols-2"
            >

                <Field
                    label="Store Name"
                    value={
                        name
                    }
                    onChange={
                        setName
                    }
                    required
                />


                <Field
                    label="City"
                    value={
                        city
                    }
                    onChange={
                        setCity
                    }
                    required
                />


                <div className="md:col-span-2">

                    <Field
                        label="Address"
                        value={
                            address
                        }
                        onChange={
                            setAddress
                        }
                        required
                    />

                </div>


                <Field
                    label="Latitude"
                    value={
                        latitude
                    }
                    onChange={
                        setLatitude
                    }
                    type="number"
                    required
                />


                <Field
                    label="Longitude"
                    value={
                        longitude
                    }
                    onChange={
                        setLongitude
                    }
                    type="number"
                    required
                />


                <Field
                    label="Phone"
                    value={
                        phone
                    }
                    onChange={
                        setPhone
                    }
                    type="tel"
                    placeholder="+389..."
                />


                <Field
                    label="Working Hours"
                    value={
                        workingHours
                    }
                    onChange={
                        setWorkingHours
                    }
                    placeholder="Mon-Sun 08:00-22:00"
                />


                {
                    successMessage && (

                        <p
                            role="status"
                            className="rounded-xl border border-emerald-900 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-300 md:col-span-2"
                        >
                            {successMessage}
                        </p>
                    )
                }


                {
                    errorMessage && (

                        <p
                            role="alert"
                            className="rounded-xl border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-300 md:col-span-2"
                        >
                            {errorMessage}
                        </p>
                    )
                }


                <div className="md:col-span-2">

                    <button
                        type="submit"
                        disabled={
                            mutation.isPending
                        }
                        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-sky-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
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
                   placeholder,
                   required = false,
               }: {
    label: string
    value: string
    onChange:
        (value: string) => void
    type?: string
    placeholder?: string
    required?: boolean
}) {

    return (
        <label className="block">

            <span className="mb-2 block text-sm font-medium text-slate-300">
                {label}
            </span>


            <input
                type={
                    type
                }
                step={
                    type === 'number'
                        ? 'any'
                        : undefined
                }
                value={
                    value
                }
                placeholder={
                    placeholder
                }
                required={
                    required
                }
                onChange={
                    event =>
                        onChange(
                            event.target.value,
                        )
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            />

        </label>
    )
}