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
    AlertCircle,
    Building2,
    CheckCircle2,
    Clock3,
    LoaderCircle,
    MapPin,
    Phone,
    Save,
} from 'lucide-react'

import {
    updateStore,
} from '../../api/storeApi'

import type {
    Store,
    StoreUpdateRequest,
} from '../../types/store'

import StatusBadge
    from '../ui/StatusBadge'

export default function StoreProfileEditor({
    store,
}: {
    store: Store
}) {
    return (
        <StoreProfileEditorForm
            key={
                store.id
            }
            store={
                store
            }
        />
    )
}

function StoreProfileEditorForm({
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
            store.phone ??
            '',
        )

    const [
        workingHours,
        setWorkingHours,
    ] =
        useState(
            store.workingHours ??
            '',
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
                (
                    request: StoreUpdateRequest,
                ) =>
                    updateStore(
                        store.id,
                        request,
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

    function clearMessages() {
        if (
            successMessage
        ) {

            setSuccessMessage(
                null,
            )
        }

        if (
            errorMessage
        ) {

            setErrorMessage(
                null,
            )
        }
    }


    function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault()


        const trimmedName =
            name.trim()


        const trimmedAddress =
            address.trim()


        const trimmedCity =
            city.trim()


        const trimmedLatitude =
            latitude.trim()


        const trimmedLongitude =
            longitude.trim()


        const trimmedPhone =
            phone.trim()


        const trimmedWorkingHours =
            workingHours.trim()


        setSuccessMessage(
            null,
        )

        setErrorMessage(
            null,
        )


        if (
            !trimmedName
        ) {

            setErrorMessage(
                'Store name is required.',
            )

            return
        }


        if (
            !trimmedAddress
        ) {

            setErrorMessage(
                'Address is required.',
            )

            return
        }


        if (
            !trimmedCity
        ) {

            setErrorMessage(
                'City is required.',
            )

            return
        }


        if (
            !trimmedLatitude
        ) {

            setErrorMessage(
                'Latitude is required.',
            )

            return
        }


        if (
            !trimmedLongitude
        ) {

            setErrorMessage(
                'Longitude is required.',
            )

            return
        }


        const numericLatitude =
            Number(
                trimmedLatitude,
            )


        const numericLongitude =
            Number(
                trimmedLongitude,
            )


        if (
            !Number.isFinite(
                numericLatitude,
            ) ||
            numericLatitude <
            -90 ||
            numericLatitude >
            90
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
            numericLongitude <
            -180 ||
            numericLongitude >
            180
        ) {

            setErrorMessage(
                'Longitude must be between -180 and 180.',
            )

            return
        }


        mutation.mutate({
            name:
            trimmedName,

            address:
            trimmedAddress,

            city:
            trimmedCity,

            latitude:
            numericLatitude,

            longitude:
            numericLongitude,

            phone:
                trimmedPhone ||
                null,

            workingHours:
                trimmedWorkingHours ||
                null,
        })
    }


    return (
        <section className="premium-card overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/55 shadow-[0_24px_70px_-45px_rgba(14,165,233,0.2)] backdrop-blur-xl">

            <div className="flex flex-col gap-4 border-b border-slate-800/80 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">

                <div className="flex min-w-0 items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-900/50 bg-sky-950/30 text-sky-400">

                        <Building2
                            size={17}
                        />

                    </div>


                    <div className="min-w-0">

                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-sky-400">
                            Public information
                        </p>


                        <h2 className="mt-0.5 text-xl font-bold tracking-tight text-white">
                            Store Profile
                        </h2>


                        <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                            Update the information customers see for this store, including its address and map location.
                        </p>

                    </div>

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
                className="grid gap-5 p-5 md:grid-cols-2 sm:p-6"
            >

                <Field
                    id="store-profile-name"
                    label="Store Name"
                    value={
                        name
                    }
                    onChange={
                        value => {

                            setName(
                                value,
                            )

                            clearMessages()
                        }
                    }
                    disabled={
                        mutation.isPending
                    }
                    required
                    icon={
                        <Building2
                            size={15}
                        />
                    }
                />


                <Field
                    id="store-profile-city"
                    label="City"
                    value={
                        city
                    }
                    onChange={
                        value => {

                            setCity(
                                value,
                            )

                            clearMessages()
                        }
                    }
                    disabled={
                        mutation.isPending
                    }
                    required
                    icon={
                        <MapPin
                            size={15}
                        />
                    }
                />


                <div className="md:col-span-2">

                    <Field
                        id="store-profile-address"
                        label="Address"
                        value={
                            address
                        }
                        onChange={
                            value => {

                                setAddress(
                                    value,
                                )

                                clearMessages()
                            }
                        }
                        disabled={
                            mutation.isPending
                        }
                        required
                        icon={
                            <MapPin
                                size={15}
                            />
                        }
                    />

                </div>


                <Field
                    id="store-profile-latitude"
                    label="Latitude"
                    value={
                        latitude
                    }
                    onChange={
                        value => {

                            setLatitude(
                                value,
                            )

                            clearMessages()
                        }
                    }
                    type="number"
                    min={
                        -90
                    }
                    max={
                        90
                    }
                    step="any"
                    disabled={
                        mutation.isPending
                    }
                    required
                    icon={
                        <MapPin
                            size={15}
                        />
                    }
                />


                <Field
                    id="store-profile-longitude"
                    label="Longitude"
                    value={
                        longitude
                    }
                    onChange={
                        value => {

                            setLongitude(
                                value,
                            )

                            clearMessages()
                        }
                    }
                    type="number"
                    min={
                        -180
                    }
                    max={
                        180
                    }
                    step="any"
                    disabled={
                        mutation.isPending
                    }
                    required
                    icon={
                        <MapPin
                            size={15}
                        />
                    }
                />


                <Field
                    id="store-profile-phone"
                    label="Phone"
                    value={
                        phone
                    }
                    onChange={
                        value => {

                            setPhone(
                                value,
                            )

                            clearMessages()
                        }
                    }
                    type="tel"
                    autoComplete="tel"
                    placeholder="+389..."
                    disabled={
                        mutation.isPending
                    }
                    icon={
                        <Phone
                            size={15}
                        />
                    }
                />


                <Field
                    id="store-profile-hours"
                    label="Working Hours"
                    value={
                        workingHours
                    }
                    onChange={
                        value => {

                            setWorkingHours(
                                value,
                            )

                            clearMessages()
                        }
                    }
                    placeholder="Mon-Sun 08:00-22:00"
                    disabled={
                        mutation.isPending
                    }
                    icon={
                        <Clock3
                            size={15}
                        />
                    }
                />


                {
                    successMessage && (

                        <div
                            role="status"
                            className="flex items-start gap-2.5 rounded-xl border border-emerald-900/50 bg-emerald-950/20 px-4 py-3 text-xs leading-5 text-emerald-300 md:col-span-2"
                        >

                            <CheckCircle2
                                size={15}
                                className="mt-0.5 shrink-0"
                            />

                            <span>
                                {successMessage}
                            </span>

                        </div>
                    )
                }


                {
                    errorMessage && (

                        <div
                            role="alert"
                            className="flex items-start gap-2.5 rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-3 text-xs leading-5 text-red-300 md:col-span-2"
                        >

                            <AlertCircle
                                size={15}
                                className="mt-0.5 shrink-0"
                            />

                            <span>
                                {errorMessage}
                            </span>

                        </div>
                    )
                }


                <div className="md:col-span-2">

                    <button
                        type="submit"
                        disabled={
                            mutation.isPending
                        }
                        className="shine-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 text-sm font-bold text-slate-950 transition duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-45"
                    >

                        {
                            mutation.isPending
                                ? (
                                    <>
                                        <LoaderCircle
                                            size={15}
                                            className="animate-spin"
                                        />

                                        Saving...
                                    </>
                                )
                                : (
                                    <>
                                        <Save
                                            size={15}
                                        />

                                        Save Changes
                                    </>
                                )
                        }

                    </button>

                </div>

            </form>

        </section>
    )
}

function Field({
                   id,
                   label,
                   value,
                   onChange,
                   type = 'text',
                   placeholder,
                   required = false,
                   disabled = false,
                   min,
                   max,
                   step,
                   autoComplete,
                   icon,
               }: {
    id: string
    label: string
    value: string
    onChange: (value: string) => void
    type?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    min?: number
    max?: number
    step?: string
    autoComplete?: string
    icon?: React.ReactNode
}) {

    return (
        <div>
            <label
                htmlFor={
                    id
                }
                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500"
            >
                {label}
            </label>

            <div className="relative">
                {
                    icon && (

                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
                            {icon}
                        </span>
                    )
                }

                <input
                    id={
                        id
                    }
                    type={
                        type
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
                    disabled={
                        disabled
                    }
                    min={
                        min
                    }
                    max={
                        max
                    }
                    step={
                        step
                    }
                    autoComplete={
                        autoComplete
                    }
                    onChange={
                        event =>
                            onChange(
                                event.target.value,
                            )
                    }
                    className={`min-h-12 w-full rounded-xl border border-slate-700 bg-[#020817]/85 px-4 text-sm text-white outline-none transition duration-200 placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:opacity-50 ${
                        icon
                            ? 'pl-11'
                            : ''
                    }`}
                />
            </div>
        </div>
    )
}