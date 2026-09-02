import type {
    PageResponse,
    Product,
} from './catalog'

export type StoreStatus =
    | 'PENDING'
    | 'ACTIVE'
    | 'INACTIVE'

export type StockStatus =
    | 'IN_STOCK'
    | 'LOW_STOCK'
    | 'OUT_OF_STOCK'

export interface Store {
    id: number
    name: string
    address: string
    city: string
    latitude: number
    longitude: number
    phone: string | null
    workingHours: string | null
    status: StoreStatus
    createdAt: string
}

export interface StoreUpdateRequest {
    name: string
    address: string
    city: string
    latitude: number
    longitude: number
    phone: string | null
    workingHours: string | null
}

export interface InventoryItem {
    id: number
    storeId: number
    product: Product
    price: number
    quantity: number
    status: StockStatus
    updatedAt: string
}

export interface InventoryCreateRequest {
    productId: number
    price: number
    quantity: number
    status: StockStatus
}

export interface InventoryUpdateRequest {
    price: number
    quantity: number
    status: StockStatus
}

export type InventoryPage =
    PageResponse<InventoryItem>

export interface StoreDashboardSummary {
    store: Store
    totalProducts: number
    availableProducts: number
    inStockProducts: number
    lowStockProducts: number
    outOfStockProducts: number
    totalUnits: number
    inventoryValue: number
    lastUpdatedAt: string | null
}

export interface OwnerDashboard {
    totalStores: number
    totalProducts: number
    availableProducts: number
    lowStockProducts: number
    outOfStockProducts: number
    totalUnits: number
    inventoryValue: number
    stores: StoreDashboardSummary[]
}

export interface StoreDashboard {
    store: Store
    totalProducts: number
    availableProducts: number
    inStockProducts: number
    lowStockProducts: number
    outOfStockProducts: number
    totalUnits: number
    inventoryValue: number
    lastUpdatedAt: string | null
    alerts: InventoryItem[]
    recentUpdates: InventoryItem[]
}