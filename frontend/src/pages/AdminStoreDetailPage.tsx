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
    ArrowLeft,
    Boxes,
    Building2,
    CheckCircle2,
    CircleDollarSign,
    Clock3,
    LoaderCircle,
    MapPin,
    PackageCheck,
    PackageX,
    Phone,
    Power,
    Save,
    UserRound,
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
} from '../api/adminStoreApi'

import AdminLayout
    from '../components/admin/AdminLayout'

import ErrorState
    from '../components/ui/ErrorState'

import LoadingState
    from '../components/ui/LoadingState'

import MetricCard
    from '../components/ui/MetricCard'

import PageHeader
    from '../components/ui/PageHeader'

import StatusBadge
    from '../components/ui/StatusBadge'

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


export default function AdminStoreDetailPage() {

    const {
        storeId,
    } =
        useParams()


    const parsedStoreId =
        parseId(
            storeId,
        )


    const queryClient =
        useQueryClient()


    const [
        statusMessage,
        setStatusMessage,
    ] =
        useState<string | null>(
            null,
        )


    const [
        statusError,
        setStatusError,
    ] =
        useState<string | null>(
            null,
        )


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
                async () => {

                    setStatusError(
                        null,
                    )

                    setStatusMessage(
                        'Store status updated successfully.',
                    )


                    await refreshAdminData(
                        queryClient,
                        parsedStoreId!,
                    )
                },

            onError:
                () => {

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


    if (
        parsedStoreId ===
        null
    ) {

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


    if (
        storeQuery.isLoading
    ) {

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
                        <>
                            <StatusBadge
                                status={
                                    detail.store.status
                                }
                            />


                            {
                                detail.store.status !==
                                'ACTIVE' && (

                                    <button
                                        type="button"
                                        disabled={
                                            statusMutation.isPending
                                        }
                                        onClick={
                                            () =>
                                                changeStatus(
                                                    'ACTIVE',
                                                )
                                        }
                                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-800/60 bg-emerald-950/30 px-4 text-sm font-semibold text-emerald-300 transition hover:border-emerald-700 hover:bg-emerald-950/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                        {
                                            statusMutation.isPending
                                                ? (
                                                    <LoaderCircle
                                                        size={15}
                                                        className="animate-spin"
                                                    />
                                                )
                                                : (
                                                    <CheckCircle2
                                                        size={15}
                                                    />
                                                )
                                        }


                                        {
                                            statusMutation.isPending
                                                ? 'Updating...'
                                                : detail.store.status ===
                                                'PENDING'
                                                    ? 'Approve Store'
                                                    : 'Activate Store'
                                        }

                                    </button>
                                )
                            }


                            {
                                detail.store.status ===
                                'ACTIVE' && (

                                    <button
                                        type="button"
                                        disabled={
                                            statusMutation.isPending
                                        }
                                        onClick={
                                            () => {

                                                const confirmed =
                                                    window.confirm(
                                                        'Deactivate this store?',
                                                    )


                                                if (
                                                    confirmed
                                                ) {

                                                    changeStatus(
                                                        'INACTIVE',
                                                    )
                                                }
                                            }
                                        }
                                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-900/60 bg-red-950/15 px-4 text-sm font-semibold text-red-400 transition hover:border-red-800 hover:bg-red-950/30 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                        {
                                            statusMutation.isPending
                                                ? (
                                                    <LoaderCircle
                                                        size={15}
                                                        className="animate-spin"
                                                    />
                                                )
                                                : (
                                                    <Power
                                                        size={15}
                                                    />
                                                )
                                        }


                                        {
                                            statusMutation.isPending
                                                ? 'Updating...'
                                                : 'Deactivate'
                                        }

                                    </button>
                                )
                            }
                        </>
                    }
                />


                {
                    statusMessage && (

                        <div
                            role="status"
                            className="flex items-start gap-2.5 rounded-xl border border-emerald-900/50 bg-emerald-950/20 px-4 py-3 text-xs leading-5 text-emerald-300"
                        >

                            <CheckCircle2
                                size={15}
                                className="mt-0.5 shrink-0"
                            />

                            <span>
                                {statusMessage}
                            </span>

                        </div>
                    )
                }


                {
                    statusError && (

                        <div
                            role="alert"
                            className="rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-3 text-xs leading-5 text-red-300"
                        >
                            {statusError}
                        </div>
                    )
                }


                <section
                    aria-label="Store inventory statistics"
                    className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                >

                    <MetricCard
                        icon={
                            <Boxes
                                size={20}
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
                                size={20}
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
                            <Clock3
                                size={20}
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
                                size={20}
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
                                size={20}
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
                            <CircleDollarSign
                                size={20}
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
                    detail={
                        detail
                    }
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

        </AdminLayout>
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
        ownerId,
        setOwnerId,
    ] =
        useState(
            String(
                store.owner.id,
            ),
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

                    setName(
                        request.name,
                    )

                    setAddress(
                        request.address,
                    )

                    setCity(
                        request.city,
                    )

                    setLatitude(
                        String(
                            request.latitude,
                        ),
                    )

                    setLongitude(
                        String(
                            request.longitude,
                        ),
                    )

                    setPhone(
                        request.phone ??
                        '',
                    )

                    setWorkingHours(
                        request.workingHours ??
                        '',
                    )

                    setOwnerId(
                        String(
                            request.ownerId,
                        ),
                    )


                    setErrorMessage(
                        null,
                    )

                    setSuccessMessage(
                        'Store updated successfully.',
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


        const numericOwnerId =
            Number(
                ownerId,
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


        if (
            !Number.isInteger(
                numericOwnerId,
            ) ||
            numericOwnerId <=
            0
        ) {

            setErrorMessage(
                'Select a valid Store Owner.',
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

            ownerId:
            numericOwnerId,
        })
    }


    return (
        <section className="premium-card overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/55 shadow-[0_24px_70px_-45px_rgba(14,165,233,0.18)] backdrop-blur-xl">

            <div className="flex items-start gap-3 border-b border-slate-800/80 px-5 py-5 sm:px-6">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-900/50 bg-sky-950/30 text-sky-400">

                    <Building2
                        size={17}
                    />

                </div>


                <div>

                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-sky-400">
                        Administration
                    </p>


                    <h2 className="mt-0.5 text-xl font-bold tracking-tight text-white">
                        Store Configuration
                    </h2>


                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        Update store information, map location or assign the store to another Store Owner.
                    </p>

                </div>

            </div>


            <form
                onSubmit={
                    handleSubmit
                }
                className="grid gap-5 p-5 md:grid-cols-2 sm:p-6"
            >

                <Field
                    id="admin-store-name"
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
                    id="admin-store-city"
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
                        id="admin-store-address"
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
                    id="admin-store-latitude"
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
                    id="admin-store-longitude"
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
                    id="admin-store-phone"
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
                    id="admin-store-hours"
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


                <div className="md:col-span-2">

                    <label
                        htmlFor="admin-store-owner"
                        className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500"
                    >
                        Store Owner
                    </label>


                    <div className="relative">

                        <UserRound
                            size={15}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                        />


                        <select
                            id="admin-store-owner"
                            value={
                                ownerId
                            }
                            disabled={
                                mutation.isPending ||
                                ownersLoading ||
                                ownersError
                            }
                            onChange={
                                event => {

                                    setOwnerId(
                                        event.target.value,
                                    )

                                    clearMessages()
                                }
                            }
                            className={`${inputClassName} pl-11`}
                        >

                            {
                                ownerOptions.map(
                                    owner => (

                                        <option
                                            key={
                                                owner.id
                                            }
                                            value={
                                                owner.id
                                            }
                                        >
                                            {
                                                owner.fullName
                                            }
                                            {' — '}
                                            {
                                                owner.email
                                            }
                                        </option>
                                    ),
                                )
                            }

                        </select>

                    </div>


                    {
                        ownersLoading && (

                            <p className="mt-2 text-xs text-slate-500">
                                Loading Store Owners...
                            </p>
                        )
                    }


                    {
                        ownersError && (

                            <p className="mt-2 text-xs text-amber-400">
                                Store Owner list is unavailable. The current owner will remain assigned.
                            </p>
                        )
                    }

                </div>


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
                            className="rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-3 text-xs leading-5 text-red-300 md:col-span-2"
                        >
                            {errorMessage}
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

                                        Save Configuration
                                    </>
                                )
                        }

                    </button>

                </div>

            </form>

        </section>
    )
}


function BackToStores() {

    return (
        <Link
            to="/admin/stores"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >

            <ArrowLeft
                size={16}
            />

            Back to stores

        </Link>
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
    icon?: ReactNode
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

    if (
        !value
    ) {
        return null
    }


    const parsed =
        Number(
            value,
        )


    return Number.isInteger(
        parsed,
    ) &&
    parsed >
    0
        ? parsed
        : null
}

const inputClassName =
    'min-h-12 w-full rounded-xl border border-slate-700 bg-[#020817]/85 px-4 text-sm text-white outline-none transition duration-200 placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:opacity-50'