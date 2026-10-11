import {
    useState,
} from 'react'

import type {
    FormEvent,
    ReactNode,
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
    motion,
} from 'motion/react'

import {
    updateStore,
} from '../../api/storeApi'

import type {
    Store,
    StoreUpdateRequest,
} from '../../types/store'

import StatusBadge from '../ui/StatusBadge'

interface StoreProfileEditorProps {
    store: Store
}

interface StoreProfileFormState {
    name: string
    address: string
    city: string
    latitude: string
    longitude: string
    phone: string
    workingHours: string
}

type StoreProfileValidationResult =
    | {
    success: true
    request: StoreUpdateRequest
}
    | {
    success: false
    error: string
}

export default function StoreProfileEditor({
                                               store,
                                           }: StoreProfileEditorProps) {
    return (
        <StoreProfileEditorForm
            key={store.id}
            store={store}
        />
    )
}

function StoreProfileEditorForm({
                                    store,
                                }: StoreProfileEditorProps) {
    const queryClient =
        useQueryClient()

    const [
        form,
        setForm,
    ] = useState<StoreProfileFormState>(
        createFormState(
            store,
        ),
    )

    const [
        successMessage,
        setSuccessMessage,
    ] = useState<string | null>(
        null,
    )

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<string | null>(
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
                    setForm(
                        createFormState(
                            updatedStore,
                        ),
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

    function updateField(
        field: keyof StoreProfileFormState,
        value: string,
    ) {
        setForm(
            current => ({
                ...current,
                [field]: value,
            }),
        )

        clearMessages()
    }

    function clearMessages() {
        if (successMessage) {
            setSuccessMessage(
                null,
            )
        }

        if (errorMessage) {
            setErrorMessage(
                null,
            )
        }
    }

    function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()

        setSuccessMessage(
            null,
        )

        setErrorMessage(
            null,
        )

        const result =
            validateStoreProfile(
                form,
            )

        if (!result.success) {
            setErrorMessage(
                result.error,
            )

            return
        }

        mutation.mutate(
            result.request,
        )
    }

    return (
        <motion.section
            initial={{
                opacity: 0,
                y: 12,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.4,
                ease: [
                    0.16,
                    1,
                    0.3,
                    1,
                ],
            }}
            className="premium-card overflow-hidden rounded-2xl"
        >
            <div className="relative flex flex-col gap-4 border-b border-slate-800/80 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-20 -top-24 size-48 rounded-full bg-sky-400/[0.055] blur-3xl"
                />

                <div className="relative flex min-w-0 items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-300/[0.08] text-sky-300 shadow-[0_10px_30px_rgba(14,165,233,0.08)]">
                        <Building2
                            className="size-[18px]"
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />
                    </div>

                    <div className="min-w-0">
                        <p className="eyebrow">
                            Public information
                        </p>

                        <h2 className="mt-1.5 text-xl font-semibold tracking-[-0.03em] text-slate-50">
                            Store profile
                        </h2>

                        <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                            Update the information customers see for this store, including its contact details and map location.
                        </p>
                    </div>
                </div>

                <div className="relative shrink-0">
                    <StatusBadge
                        status={store.status}
                    />
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="grid gap-5 p-5 sm:p-6 md:grid-cols-2"
            >
                <Field
                    id="store-profile-name"
                    label="Store name"
                    value={form.name}
                    onChange={
                        value =>
                            updateField(
                                'name',
                                value,
                            )
                    }
                    disabled={mutation.isPending}
                    required
                    icon={
                        <Building2
                            className="size-4"
                            aria-hidden="true"
                        />
                    }
                />

                <Field
                    id="store-profile-city"
                    label="City"
                    value={form.city}
                    onChange={
                        value =>
                            updateField(
                                'city',
                                value,
                            )
                    }
                    disabled={mutation.isPending}
                    required
                    icon={
                        <MapPin
                            className="size-4"
                            aria-hidden="true"
                        />
                    }
                />

                <div className="md:col-span-2">
                    <Field
                        id="store-profile-address"
                        label="Address"
                        value={form.address}
                        onChange={
                            value =>
                                updateField(
                                    'address',
                                    value,
                                )
                        }
                        disabled={mutation.isPending}
                        required
                        icon={
                            <MapPin
                                className="size-4"
                                aria-hidden="true"
                            />
                        }
                    />
                </div>

                <Field
                    id="store-profile-latitude"
                    label="Latitude"
                    value={form.latitude}
                    onChange={
                        value =>
                            updateField(
                                'latitude',
                                value,
                            )
                    }
                    type="number"
                    min={-90}
                    max={90}
                    step="any"
                    disabled={mutation.isPending}
                    required
                    icon={
                        <MapPin
                            className="size-4"
                            aria-hidden="true"
                        />
                    }
                />

                <Field
                    id="store-profile-longitude"
                    label="Longitude"
                    value={form.longitude}
                    onChange={
                        value =>
                            updateField(
                                'longitude',
                                value,
                            )
                    }
                    type="number"
                    min={-180}
                    max={180}
                    step="any"
                    disabled={mutation.isPending}
                    required
                    icon={
                        <MapPin
                            className="size-4"
                            aria-hidden="true"
                        />
                    }
                />

                <Field
                    id="store-profile-phone"
                    label="Phone"
                    value={form.phone}
                    onChange={
                        value =>
                            updateField(
                                'phone',
                                value,
                            )
                    }
                    type="tel"
                    autoComplete="tel"
                    placeholder="+389..."
                    disabled={mutation.isPending}
                    icon={
                        <Phone
                            className="size-4"
                            aria-hidden="true"
                        />
                    }
                />

                <Field
                    id="store-profile-hours"
                    label="Working hours"
                    value={form.workingHours}
                    onChange={
                        value =>
                            updateField(
                                'workingHours',
                                value,
                            )
                    }
                    placeholder="Mon-Sun 08:00-22:00"
                    disabled={mutation.isPending}
                    icon={
                        <Clock3
                            className="size-4"
                            aria-hidden="true"
                        />
                    }
                />

                {successMessage && (
                    <FeedbackMessage
                        tone="success"
                        icon={
                            <CheckCircle2
                                className="size-4"
                                aria-hidden="true"
                            />
                        }
                    >
                        {successMessage}
                    </FeedbackMessage>
                )}

                {errorMessage && (
                    <FeedbackMessage
                        tone="error"
                        icon={
                            <AlertCircle
                                className="size-4"
                                aria-hidden="true"
                            />
                        }
                    >
                        {errorMessage}
                    </FeedbackMessage>
                )}

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="shine-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-300 px-5 text-sm font-semibold text-slate-950 shadow-[0_12px_32px_rgba(14,165,233,0.18)] transition duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                        {mutation.isPending ? (
                            <>
                                <LoaderCircle
                                    className="size-4 animate-spin"
                                    aria-hidden="true"
                                />

                                Saving...
                            </>
                        ) : (
                            <>
                                <Save
                                    className="size-4"
                                    aria-hidden="true"
                                />

                                Save changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </motion.section>
    )
}

function createFormState(
    store: Store,
): StoreProfileFormState {
    return {
        name:
        store.name,

        address:
        store.address,

        city:
        store.city,

        latitude:
            String(
                store.latitude,
            ),

        longitude:
            String(
                store.longitude,
            ),

        phone:
            store.phone ??
            '',

        workingHours:
            store.workingHours ??
            '',
    }
}

function validateStoreProfile(
    form: StoreProfileFormState,
): StoreProfileValidationResult {
    const name =
        form.name.trim()

    const address =
        form.address.trim()

    const city =
        form.city.trim()

    const latitudeText =
        form.latitude.trim()

    const longitudeText =
        form.longitude.trim()

    const phone =
        form.phone.trim()

    const workingHours =
        form.workingHours.trim()

    if (!name) {
        return {
            success: false,
            error:
                'Store name is required.',
        }
    }

    if (!address) {
        return {
            success: false,
            error:
                'Address is required.',
        }
    }

    if (!city) {
        return {
            success: false,
            error:
                'City is required.',
        }
    }

    if (!latitudeText) {
        return {
            success: false,
            error:
                'Latitude is required.',
        }
    }

    if (!longitudeText) {
        return {
            success: false,
            error:
                'Longitude is required.',
        }
    }

    const latitude =
        Number(
            latitudeText,
        )

    const longitude =
        Number(
            longitudeText,
        )

    if (
        !Number.isFinite(
            latitude,
        ) ||
        latitude < -90 ||
        latitude > 90
    ) {
        return {
            success: false,
            error:
                'Latitude must be between -90 and 90.',
        }
    }

    if (
        !Number.isFinite(
            longitude,
        ) ||
        longitude < -180 ||
        longitude > 180
    ) {
        return {
            success: false,
            error:
                'Longitude must be between -180 and 180.',
        }
    }

    return {
        success: true,
        request: {
            name,
            address,
            city,
            latitude,
            longitude,

            phone:
                phone ||
                null,

            workingHours:
                workingHours ||
                null,
        },
    }
}

interface FieldProps {
    id: string
    label: string
    value: string
    onChange: (value: string) => void
    type?: 'text' | 'number' | 'tel'
    placeholder?: string
    required?: boolean
    disabled?: boolean
    min?: number
    max?: number
    step?: string
    autoComplete?: string
    icon?: ReactNode
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
               }: FieldProps) {
    return (
        <div>
            <label
                htmlFor={id}
                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500"
            >
                {label}
            </label>

            <div className="relative">
                {icon && (
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
                        {icon}
                    </span>
                )}

                <input
                    id={id}
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    min={min}
                    max={max}
                    step={step}
                    autoComplete={autoComplete}
                    onChange={
                        event =>
                            onChange(
                                event.target.value,
                            )
                    }
                    className={`field min-h-12 w-full px-4 text-sm disabled:cursor-not-allowed disabled:opacity-50 ${
                        icon
                            ? 'pl-11'
                            : ''
                    }`}
                />
            </div>
        </div>
    )
}

function FeedbackMessage({
                             tone,
                             icon,
                             children,
                         }: {
    tone: 'success' | 'error'
    icon: ReactNode
    children: ReactNode
}) {
    const success =
        tone ===
        'success'

    return (
        <div
            role={
                success
                    ? 'status'
                    : 'alert'
            }
            className={
                success
                    ? 'flex items-start gap-2.5 rounded-xl border border-emerald-300/10 bg-emerald-300/[0.05] px-4 py-3 text-xs leading-5 text-emerald-200/80 md:col-span-2'
                    : 'flex items-start gap-2.5 rounded-xl border border-rose-300/10 bg-rose-300/[0.05] px-4 py-3 text-xs leading-5 text-rose-200/80 md:col-span-2'
            }
        >
            <span
                className={
                    success
                        ? 'mt-0.5 shrink-0 text-emerald-300'
                        : 'mt-0.5 shrink-0 text-rose-300'
                }
            >
                {icon}
            </span>

            <span>
                {children}
            </span>
        </div>
    )
}