import type {
    PageResponse,
} from './catalog'

import type {
    StoreStatus,
} from './store'

export interface AdminOwner {
    id: number
    fullName: string
    email: string
}

export interface AdminStore {
    id: number
    name: string
    address: string
    city: string
    latitude: number
    longitude: number
    phone: string | null
    workingHours: string | null
    status: StoreStatus
    owner: AdminOwner
    createdAt: string
}

export interface AdminStoreDetail {
    store: AdminStore
    totalProducts: number
    availableProducts: number
    inStockProducts: number
    lowStockProducts: number
    outOfStockProducts: number
    totalUnits: number
    inventoryValue: number
    lastInventoryUpdate: string | null
}

export interface AdminDashboard {
    totalStores: number
    activeStores: number
    pendingStores: number
    inactiveStores: number
    totalProducts: number
    storeOwners: number
    inventoryItems: number
    lowStockItems: number
    outOfStockItems: number
    totalUnits: number
    inventoryValue: number
    pendingStorePreview: AdminStore[]
}

export interface AdminStoreFilters {
    cities: string[]
    statuses: StoreStatus[]
}

export type AdminStoreSort =
    | 'newest'
    | 'oldest'
    | 'nameAsc'
    | 'nameDesc'
    | 'statusAsc'

export interface AdminStoreSearchParams {
    q?: string
    status?: StoreStatus
    city?: string
    page?: number
    size?: number
    sort?: AdminStoreSort
}

export type AdminStorePage =
    PageResponse<AdminStore>

export interface AdminStoreUpdate {
    name: string
    address: string
    city: string
    latitude: number
    longitude: number
    phone: string | null
    workingHours: string | null
    ownerId: number
}