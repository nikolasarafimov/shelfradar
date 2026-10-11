import {
    useState,
} from 'react'

import type {
    FormEvent,
    ReactNode,
} from 'react'

import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'

import type {
    QueryClient,
} from '@tanstack/react-query'

import {
    AnimatePresence,
    motion,
} from 'motion/react'

import {
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    Boxes,
    Building2,
    CheckCircle2,
    Clock3,
    LoaderCircle,
    MapPin,
    PackageCheck,
    PackageX,
    Phone,
    Power,
    Save,
    UserRound,
    WalletCards,
} from 'lucide-react'

import {
    Link,
    useParams,
} from 'react-router-dom'

import {
    getAdminStore,
    getAdminStoreOwners,
    updateAdminStore,
    updateAdminStoreStatus,
} from '../api/adminApi'

import AdminLayout from '../components/admin/AdminLayout'
import ErrorState from '../components/ui/ErrorState'
import LoadingState from '../components/ui/LoadingState'
import MetricCard from '../components/ui/MetricCard'
import PageHeader from '../components/ui/PageHeader'
import StatusBadge from '../components/ui/StatusBadge'

import {
    formatMkd,
    formatNumber,
} from '../lib/format'

import type {
    AdminOwner,
    AdminStoreDetail,
    AdminStoreUpdate,
} from '../types/admin'

import type {
    StoreStatus,
} from '../types/store'

interface StoreEditorFormState {
    name: string
    address: string
    city: string
    latitude: string
    longitude: string
    phone: string
    workingHours: string
    ownerId: string
}

type AdminStoreUpdateBuildResult =
    | {
    success: true
    request: AdminStoreUpdate
}
    | {
    success: false
    error: string
}

const inputClassName =
    'field min-h-12 w-full px-4 text-sm disabled:cursor-not-allowed disabled:opacity-50'

export default function AdminStoreDetailPage() {
    const {
        storeId,
    } = useParams()

    const parsedStoreId =
        parseId(
            storeId,
        )

    const queryClient =
        useQueryClient()

    const [
        statusMessage,
        setStatusMessage,
    ] = useState<string | null>(
        null,
    )

    const [
        statusError,
        setStatusError,
    ] = useState<string | null>(
        null,
    )

    const [
        deactivateConfirmationOpen,
        setDeactivateConfirmationOpen,
    ] = useState(false)

    const storeQuery =
        useQuery({
            queryKey: [
                'admin-store',
                parsedStoreId,
            ],

            queryFn:
                () =>
                    getAdminStore(
                        parsedStoreId!,
                    ),

            enabled:
                parsedStoreId !==
                null,
        })

    const ownersQuery =
        useQuery({
            queryKey: [
                'admin-store-owners',
            ],

            queryFn:
            getAdminStoreOwners,

            enabled:
                parsedStoreId !==
                null,
        })

    const statusMutation =
        useMutation({
            mutationFn:
                (
                    status: StoreStatus,
                ) =>
                    updateAdminStoreStatus(
                        parsedStoreId!,
                        status,
                    ),

            onSuccess:
                async (
                    _data,
                    status,
                ) => {
                    setDeactivateConfirmationOpen(
                        false,
                    )

                    setStatusError(
                        null,
                    )

                    setStatusMessage(
                        status === 'ACTIVE'
                            ? 'Store activated successfully.'
                            : 'Store deactivated successfully.',
                    )

                    await refreshAdminData(
                        queryClient,
                        parsedStoreId!,
                    )
                },

            onError:
                () => {
                    setDeactivateConfirmationOpen(
                        false,
                    )

                    setStatusMessage(
                        null,
                    )

                    setStatusError(
                        'Unable to update the store status.',
                    )
                },
        })

    function changeStatus(
        status: StoreStatus,
    ) {
        setStatusMessage(
            null,
        )

        setStatusError(
            null,
        )

        statusMutation.mutate(
            status,
        )
    }

    if (parsedStoreId === null) {
        return (
            <AdminLayout>
                <div className="space-y-6">
                    <BackToStores />

                    <ErrorState
                        title="Invalid store"
                        message="The requested store identifier is not valid."
                    />
                </div>
            </AdminLayout>
        )
    }

    if (storeQuery.isLoading) {
        return (
            <AdminLayout>
                <div className="space-y-6">
                    <BackToStores />

                    <LoadingState
                        message="Loading store..."
                    />
                </div>
            </AdminLayout>
        )
    }

    if (
        storeQuery.isError ||
        !storeQuery.data
    ) {
        return (
            <AdminLayout>
                <div className="space-y-6">
                    <BackToStores />

                    <ErrorState
                        title="Store unavailable"
                        message="ShelfRadar could not load this store."
                        onRetry={
                            () => {
                                void storeQuery.refetch()
                            }
                        }
                    />
                </div>
            </AdminLayout>
        )
    }

    const detail =
        storeQuery.data

    return (
        <AdminLayout>
            <div className="space-y-8">
                <BackToStores />

                <PageHeader
                    eyebrow="Store Administration"
                    title={
                        detail.store.name
                    }
                    description={
                        `${detail.store.address}, ${detail.store.city}`
                    }
                    actions={
                        <div className="flex flex-wrap items-center gap-2.5">
                            <StatusBadge
                                status={
                                    detail.store.status
                                }
                            />

                            <StoreStatusAction
                                status={
                                    detail.store.status
                                }
                                pending={
                                    statusMutation.isPending
                                }
                                onActivate={
                                    () =>
                                        changeStatus(
                                            'ACTIVE',
                                        )
                                }
                                onDeactivate={
                                    () =>
                                        setDeactivateConfirmationOpen(
                                            true,
                                        )
                                }
                            />
                        </div>
                    }
                />

                {statusMessage && (
                    <FeedbackMessage
                        tone="success"
                    >
                        {statusMessage}
                    </FeedbackMessage>
                )}

                {statusError && (
                    <FeedbackMessage
                        tone="error"
                    >
                        {statusError}
                    </FeedbackMessage>
                )}

                <section
                    aria-label="Store inventory statistics"
                    className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                >
                    <MetricCard
                        icon={
                            <Boxes
                                className="size-5"
                            />
                        }
                        label="Products"
                        value={
                            formatNumber(
                                detail.totalProducts,
                            )
                        }
                    />

                    <MetricCard
                        icon={
                            <PackageCheck
                                className="size-5"
                            />
                        }
                        label="Available"
                        value={
                            formatNumber(
                                detail.availableProducts,
                            )
                        }
                    />

                    <MetricCard
                        icon={
                            <AlertTriangle
                                className="size-5"
                            />
                        }
                        label="Low stock"
                        value={
                            formatNumber(
                                detail.lowStockProducts,
                            )
                        }
                        attention={
                            detail.lowStockProducts >
                            0
                        }
                    />

                    <MetricCard
                        icon={
                            <PackageX
                                className="size-5"
                            />
                        }
                        label="Out of stock"
                        value={
                            formatNumber(
                                detail.outOfStockProducts,
                            )
                        }
                        attention={
                            detail.outOfStockProducts >
                            0
                        }
                    />
                </section>

                <section
                    aria-label="Store inventory totals"
                    className="grid gap-4 sm:grid-cols-2"
                >
                    <MetricCard
                        icon={
                            <Boxes
                                className="size-5"
                            />
                        }
                        label="Units"
                        value={
                            formatNumber(
                                detail.totalUnits,
                            )
                        }
                    />

                    <MetricCard
                        icon={
                            <WalletCards
                                className="size-5"
                            />
                        }
                        label="Inventory value"
                        value={
                            formatMkd(
                                detail.inventoryValue,
                            )
                        }
                        hint="Current stock value, not revenue"
                    />
                </section>

                <AdminStoreEditor
                    key={
                        detail.store.id
                    }
                    detail={detail}
                    owners={
                        ownersQuery.data ??
                        []
                    }
                    ownersLoading={
                        ownersQuery.isLoading
                    }
                    ownersError={
                        ownersQuery.isError
                    }
                />
            </div>

            <AnimatePresence>
                {deactivateConfirmationOpen && (
                    <DeactivateStoreDialog
                        storeName={
                            detail.store.name
                        }
                        pending={
                            statusMutation.isPending
                        }
                        onCancel={
                            () =>
                                setDeactivateConfirmationOpen(
                                    false,
                                )
                        }
                        onConfirm={
                            () =>
                                changeStatus(
                                    'INACTIVE',
                                )
                        }
                    />
                )}
            </AnimatePresence>
        </AdminLayout>
    )
}

function StoreStatusAction({
                               status,
                               pending,
                               onActivate,
                               onDeactivate,
                           }: {
    status: StoreStatus
    pending: boolean
    onActivate: () => void
    onDeactivate: () => void
}) {
    if (status === 'ACTIVE') {
        return (
            <button
                type="button"
                disabled={pending}
                onClick={onDeactivate}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-300/10 bg-rose-300/[0.05] px-4 text-sm font-medium text-rose-300 transition duration-200 hover:border-rose-300/20 hover:bg-rose-300/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
            >
                {pending ? (
                    <LoaderCircle
                        className="size-4 animate-spin"
                        aria-hidden="true"
                    />
                ) : (
                    <Power
                        className="size-4"
                        aria-hidden="true"
                    />
                )}

                {pending
                    ? 'Updating...'
                    : 'Deactivate'}
            </button>
        )
    }

    return (
        <button
            type="button"
            disabled={pending}
            onClick={onActivate}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.06] px-4 text-sm font-medium text-emerald-300 transition duration-200 hover:border-emerald-300/25 hover:bg-emerald-300/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
        >
            {pending ? (
                <LoaderCircle
                    className="size-4 animate-spin"
                    aria-hidden="true"
                />
            ) : (
                <CheckCircle2
                    className="size-4"
                    aria-hidden="true"
                />
            )}

            {pending
                ? 'Updating...'
                : status === 'PENDING'
                    ? 'Approve store'
                    : 'Activate store'}
        </button>
    )
}

function AdminStoreEditor({
                              detail,
                              owners,
                              ownersLoading,
                              ownersError,
                          }: {
    detail: AdminStoreDetail
    owners: AdminOwner[]
    ownersLoading: boolean
    ownersError: boolean
}) {
    const queryClient =
        useQueryClient()

    const store =
        detail.store

    const [
        form,
        setForm,
    ] = useState<StoreEditorFormState>(
        createStoreFormState(
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

    const ownerOptions =
        owners.some(
            owner =>
                owner.id ===
                store.owner.id,
        )
            ? owners
            : [
                store.owner,
                ...owners,
            ]

    const mutation =
        useMutation({
            mutationFn:
                (
                    request: AdminStoreUpdate,
                ) =>
                    updateAdminStore(
                        store.id,
                        request,
                    ),

            onSuccess:
                async (
                    _data,
                    request,
                ) => {
                    setForm(
                        formStateFromRequest(
                            request,
                        ),
                    )

                    setErrorMessage(
                        null,
                    )

                    setSuccessMessage(
                        'Store configuration updated successfully.',
                    )

                    await refreshAdminData(
                        queryClient,
                        store.id,
                    )
                },

            onError:
                () => {
                    setSuccessMessage(
                        null,
                    )

                    setErrorMessage(
                        'Unable to update store configuration.',
                    )
                },
        })

    function updateField(
        field: keyof StoreEditorFormState,
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
            buildAdminStoreUpdate(
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
                y: 10,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.35,
                ease: [
                    0.16,
                    1,
                    0.3,
                    1,
                ],
            }}
            className="premium-card overflow-hidden rounded-2xl"
        >
            <div className="relative flex items-start gap-3 border-b border-slate-800/80 px-5 py-5 sm:px-6">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-20 -top-20 size-44 rounded-full bg-sky-400/[0.055] blur-3xl"
                />

                <div className="relative flex size-11 shrink-0 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-300/[0.08] text-sky-300">
                    <Building2
                        className="size-[18px]"
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />
                </div>

                <div className="relative">
                    <p className="eyebrow">
                        Administration
                    </p>

                    <h2 className="mt-1.5 text-xl font-semibold tracking-[-0.03em] text-slate-50">
                        Store configuration
                    </h2>

                    <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                        Update store information, map location or assign the store to another Store Owner.
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="grid gap-5 p-5 sm:p-6 md:grid-cols-2"
            >
                <Field
                    id="admin-store-name"
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
                    id="admin-store-city"
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
                        id="admin-store-address"
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
                    id="admin-store-latitude"
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
                    id="admin-store-longitude"
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
                    id="admin-store-phone"
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
                    id="admin-store-hours"
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

                <div className="md:col-span-2">
                    <label
                        htmlFor="admin-store-owner"
                        className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500"
                    >
                        Store owner
                    </label>

                    <div className="relative">
                        <UserRound
                            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-600"
                            aria-hidden="true"
                        />

                        <select
                            id="admin-store-owner"
                            value={form.ownerId}
                            disabled={
                                mutation.isPending ||
                                ownersLoading ||
                                ownersError
                            }
                            onChange={
                                event =>
                                    updateField(
                                        'ownerId',
                                        event.target.value,
                                    )
                            }
                            className={`${inputClassName} pl-11`}
                        >
                            {ownerOptions.map(
                                owner => (
                                    <option
                                        key={owner.id}
                                        value={owner.id}
                                    >
                                        {owner.fullName}
                                        {' — '}
                                        {owner.email}
                                    </option>
                                ),
                            )}
                        </select>
                    </div>

                    {ownersLoading && (
                        <p className="mt-2 inline-flex items-center gap-2 text-xs text-slate-500">
                            <LoaderCircle
                                className="size-3.5 animate-spin text-sky-300"
                                aria-hidden="true"
                            />

                            Loading Store Owners...
                        </p>
                    )}

                    {ownersError && (
                        <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-amber-300/80">
                            <AlertTriangle
                                className="mt-0.5 size-3.5 shrink-0"
                                aria-hidden="true"
                            />

                            Store Owner list is unavailable. The current owner will remain assigned.
                        </p>
                    )}
                </div>

                {successMessage && (
                    <div className="md:col-span-2">
                        <FeedbackMessage
                            tone="success"
                        >
                            {successMessage}
                        </FeedbackMessage>
                    </div>
                )}

                {errorMessage && (
                    <div className="md:col-span-2">
                        <FeedbackMessage
                            tone="error"
                        >
                            {errorMessage}
                        </FeedbackMessage>
                    </div>
                )}

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="shine-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-300 px-5 text-sm font-semibold text-slate-950 shadow-[0_12px_32px_rgba(14,165,233,0.17)] transition duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
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

                                Save configuration
                            </>
                        )}
                    </button>
                </div>
            </form>
        </motion.section>
    )
}

function createStoreFormState(
    store: AdminStoreDetail['store'],
): StoreEditorFormState {
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

        ownerId:
            String(
                store.owner.id,
            ),
    }
}

function formStateFromRequest(
    request: AdminStoreUpdate,
): StoreEditorFormState {
    return {
        name:
        request.name,

        address:
        request.address,

        city:
        request.city,

        latitude:
            String(
                request.latitude,
            ),

        longitude:
            String(
                request.longitude,
            ),

        phone:
            request.phone ??
            '',

        workingHours:
            request.workingHours ??
            '',

        ownerId:
            String(
                request.ownerId,
            ),
    }
}

function buildAdminStoreUpdate(
    form: StoreEditorFormState,
): AdminStoreUpdateBuildResult {
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

    const ownerId =
        Number(
            form.ownerId,
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

    if (
        !Number.isInteger(
            ownerId,
        ) ||
        ownerId <= 0
    ) {
        return {
            success: false,
            error:
                'Select a valid Store Owner.',
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

            ownerId,
        },
    }
}

function BackToStores() {
    return (
        <Link
            to="/admin/stores"
            className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-500 transition duration-200 hover:text-sky-300"
        >
            <ArrowLeft
                className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                aria-hidden="true"
            />

            Back to stores
        </Link>
    )
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
                    className={`${inputClassName} ${
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
                             children,
                         }: {
    tone: 'success' | 'error'
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
                    ? 'flex items-start gap-2.5 rounded-xl border border-emerald-300/10 bg-emerald-300/[0.05] px-4 py-3 text-xs leading-5 text-emerald-200/80'
                    : 'flex items-start gap-2.5 rounded-xl border border-rose-300/10 bg-rose-300/[0.05] px-4 py-3 text-xs leading-5 text-rose-200/80'
            }
        >
            {success ? (
                <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-emerald-300"
                    aria-hidden="true"
                />
            ) : (
                <AlertCircle
                    className="mt-0.5 size-4 shrink-0 text-rose-300"
                    aria-hidden="true"
                />
            )}

            <span>
                {children}
            </span>
        </div>
    )
}

function DeactivateStoreDialog({
                                   storeName,
                                   pending,
                                   onCancel,
                                   onConfirm,
                               }: {
    storeName: string
    pending: boolean
    onCancel: () => void
    onConfirm: () => void
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            exit={{
                opacity: 0,
            }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
        >
            <button
                type="button"
                aria-label="Close deactivation confirmation"
                disabled={pending}
                onClick={onCancel}
                className="absolute inset-0 cursor-default bg-slate-950/75 backdrop-blur-sm"
            />

            <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="deactivate-store-title"
                initial={{
                    opacity: 0,
                    scale: 0.96,
                    y: 12,
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                }}
                exit={{
                    opacity: 0,
                    scale: 0.97,
                    y: 8,
                }}
                transition={{
                    duration: 0.2,
                }}
                className="premium-card relative z-10 w-full max-w-md rounded-2xl p-6 shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
            >
                <div className="flex size-11 items-center justify-center rounded-xl border border-rose-300/15 bg-rose-300/[0.08] text-rose-300">
                    <Power
                        className="size-5"
                        aria-hidden="true"
                    />
                </div>

                <h2
                    id="deactivate-store-title"
                    className="mt-5 text-lg font-semibold tracking-tight text-slate-50"
                >
                    Deactivate store?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                    <strong className="font-semibold text-slate-200">
                        {storeName}
                    </strong>{' '}
                    will no longer be visible in public search while inactive.
                </p>

                <div className="mt-6 flex justify-end gap-2.5">
                    <button
                        type="button"
                        disabled={pending}
                        onClick={onCancel}
                        className="min-h-10 rounded-xl border border-slate-700/80 bg-slate-900/50 px-4 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-100 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        disabled={pending}
                        onClick={onConfirm}
                        className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-rose-500 px-4 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {pending ? (
                            <LoaderCircle
                                className="size-4 animate-spin"
                                aria-hidden="true"
                            />
                        ) : (
                            <Power
                                className="size-4"
                                aria-hidden="true"
                            />
                        )}

                        {pending
                            ? 'Deactivating...'
                            : 'Deactivate'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}

async function refreshAdminData(
    queryClient: QueryClient,
    storeId: number,
) {
    await Promise.all([
        queryClient.invalidateQueries({
            queryKey: [
                'admin-store',
                storeId,
            ],
        }),

        queryClient.invalidateQueries({
            queryKey: [
                'admin-stores',
            ],
        }),

        queryClient.invalidateQueries({
            queryKey: [
                'admin-dashboard',
            ],
        }),

        queryClient.invalidateQueries({
            queryKey: [
                'admin-store-filters',
            ],
        }),

        queryClient.invalidateQueries({
            queryKey: [
                'admin-audit',
            ],
        }),

        queryClient.invalidateQueries({
            queryKey: [
                'admin-analytics',
            ],
        }),
    ])
}

function parseId(
    value: string | undefined,
): number | null {
    if (!value) {
        return null
    }

    const parsed =
        Number(
            value,
        )

    return Number.isInteger(
        parsed,
    ) &&
    parsed > 0
        ? parsed
        : null
}