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