import {
    useState,
} from 'react'

import type {
    FormEvent,
} from 'react'

import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'

import {
    ArrowLeft,
    CheckCircle2,
    Power,
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

import type {
    AdminStoreDetail,
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
                parsedStoreId !== null,
        })


    const ownersQuery =
        useQuery({
            queryKey: [
                'admin-store-owners',
            ],

            queryFn:
            getAdminStoreOwners,
        })


    const statusMutation =
        useMutation({
            mutationFn:
                (
                    status:
                    StoreStatus,
                ) =>
                    updateAdminStoreStatus(
                        parsedStoreId!,
                        status,
                    ),

            onSuccess:
                async () => {

                    await refreshAdminData(
                        queryClient,
                        parsedStoreId!,
                    )
                },
        })


    if (
        parsedStoreId === null
    ) {

        return (
            <AdminLayout>
                <p>
                    Invalid store.
                </p>
            </AdminLayout>
        )
    }


    if (storeQuery.isLoading) {

        return (
            <AdminLayout>
                <p className="text-slate-400">
                    Loading store...
                </p>
            </AdminLayout>
        )
    }


    if (
        storeQuery.isError ||
        !storeQuery.data
    ) {

        return (
            <AdminLayout>
                <p>
                    Store not found.
                </p>
            </AdminLayout>
        )
    }


    const detail =
        storeQuery.data


    return (
        <AdminLayout>

            <Link
                to="/admin/stores"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
            >
                <ArrowLeft
                    size={17}
                />

                Back to stores
            </Link>


            <div className="mt-6 flex flex-col justify-between gap-5 md:flex-row md:items-start">

                <div>

                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-400">
                        Store Administration
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        {
                            detail.store.name
                        }
                    </h1>

                    <p className="mt-2 text-slate-400">
                        {
                            detail.store.address
                        }
                        ,{' '}
                        {
                            detail.store.city
                        }
                    </p>

                </div>


                <div className="flex flex-wrap gap-2">

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
                                        statusMutation.mutate(
                                            'ACTIVE',
                                        )
                                }
                                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-slate-950"
                            >
                                <CheckCircle2
                                    size={17}
                                />

                                {
                                    detail.store.status ===
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

                                        if (
                                            window.confirm(
                                                'Deactivate this store?',
                                            )
                                        ) {

                                            statusMutation.mutate(
                                                'INACTIVE',
                                            )
                                        }
                                    }
                                }
                                className="flex items-center gap-2 rounded-xl border border-red-900 px-4 py-2.5 font-semibold text-red-400"
                            >
                                <Power
                                    size={17}
                                />

                                Deactivate
                            </button>
                        )
                    }

                </div>

            </div>


            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <Metric
                    label="Products"
                    value={
                        detail.totalProducts
                    }
                />

                <Metric
                    label="Available"
                    value={
                        detail.availableProducts
                    }
                />

                <Metric
                    label="Low stock"
                    value={
                        detail.lowStockProducts
                    }
                />

                <Metric
                    label="Out of stock"
                    value={
                        detail.outOfStockProducts
                    }
                />

            </section>


            <section className="mt-4 grid gap-4 sm:grid-cols-2">

                <Info
                    label="Units"
                    value={
                        formatNumber(
                            detail.totalUnits,
                        )
                    }
                />

                <Info
                    label="Inventory value"
                    value={
                        `${formatPrice(
                            detail.inventoryValue,
                        )} MKD`
                    }
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
            />

        </AdminLayout>
    )
}


function AdminStoreEditor({
                              detail,
                              owners,
                          }: {
    detail: AdminStoreDetail
    owners:
        Array<{
            id: number
            fullName: string
            email: string
        }>
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
        message,
        setMessage,
    ] =
        useState<string | null>(
            null,
        )


    const mutation =
        useMutation({
            mutationFn:
                () =>
                    updateAdminStore(
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

                            ownerId:
                                Number(
                                    ownerId,
                                ),
                        },
                    ),

            onSuccess:
                async () => {

                    setMessage(
                        'Store updated successfully.',
                    )

                    await refreshAdminData(
                        queryClient,
                        store.id,
                    )
                },

            onError:
                () => {

                    setMessage(
                        'Unable to update store.',
                    )
                },
        })


    function handleSubmit(
        event:
        FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault()

        setMessage(
            null,
        )

        mutation.mutate()
    }


    return (
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="text-xl font-semibold">
                Store Configuration
            </h2>

            <p className="mt-1 text-sm text-slate-400">
                Update store information or assign it to another Store Owner.
            </p>


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
                />

                <Field
                    label="City"
                    value={
                        city
                    }
                    onChange={
                        setCity
                    }
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
                />


                <Field
                    label="Phone"
                    value={
                        phone
                    }
                    onChange={
                        setPhone
                    }
                />

                <Field
                    label="Working Hours"
                    value={
                        workingHours
                    }
                    onChange={
                        setWorkingHours
                    }
                />


                <label className="block md:col-span-2">

                    <span className="mb-2 block text-sm text-slate-300">
                        Store Owner
                    </span>

                    <select
                        value={
                            ownerId
                        }
                        onChange={
                            event =>
                                setOwnerId(
                                    event.target.value,
                                )
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                    >

                        {
                            owners.map(
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

                </label>


                {
                    message && (

                        <p className="text-sm text-slate-300 md:col-span-2">
                            {message}
                        </p>
                    )
                }


                <div className="md:col-span-2">

                    <button
                        type="submit"
                        disabled={
                            mutation.isPending
                        }
                        className="rounded-xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50"
                    >
                        {
                            mutation.isPending
                                ? 'Saving...'
                                : 'Save Configuration'
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
                onChange={
                    event =>
                        onChange(
                            event.target.value,
                        )
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

        </label>
    )
}


function Metric({
                    label,
                    value,
                }: {
    label: string
    value: number
}) {

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

            <p className="text-3xl font-bold">
                {
                    formatNumber(
                        value,
                    )
                }
            </p>

            <p className="mt-1 text-sm text-slate-400">
                {label}
            </p>

        </div>
    )
}


function Info({
                  label,
                  value,
              }: {
    label: string
    value: string
}) {

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

            <p className="text-sm text-slate-500">
                {label}
            </p>

            <p className="mt-2 text-xl font-semibold">
                {value}
            </p>

        </div>
    )
}


async function refreshAdminData(
    queryClient:
    ReturnType<typeof useQueryClient>,
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
    ])
}


function parseId(
    value: string | undefined,
): number | null {

    if (!value) {
        return null
    }

    const parsed =
        Number(value)

    return Number.isInteger(parsed) &&
    parsed > 0
        ? parsed
        : null
}


function formatNumber(
    value: number,
): string {

    return new Intl.NumberFormat(
        'en-US',
    ).format(value)
}


function formatPrice(
    value: number,
): string {

    return new Intl.NumberFormat(
        'en-US',
        {
            maximumFractionDigits: 2,
        },
    ).format(value)
}