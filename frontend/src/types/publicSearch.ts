import type {
    Brand,
    Category,
    PageResponse,
    Product,
} from './catalog'

import type {
    StockStatus,
} from './store'


export interface PublicStore {
    id: number
    name: string
    address: string
    city: string
    latitude: number
    longitude: number
    phone: string | null
    workingHours: string | null
}


export interface PublicSearchResult {
    inventoryId: number
    product: Product
    store: PublicStore
    price: number
    quantity: number
    status: StockStatus
    updatedAt: string
    distanceKm: number | null
}


export interface PublicSearchFilters {
    brands: Brand[]
    categories: Category[]
    cities: string[]
    statuses: StockStatus[]
}


export type PublicSearchSort =
    | 'priceAsc'
    | 'priceDesc'
    | 'nameAsc'
    | 'nameDesc'
    | 'updatedDesc'
    | 'distanceAsc'


export interface PublicSearchParams {
    q?: string
    brandId?: number
    categoryId?: number
    status?: StockStatus
    city?: string
    page?: number
    size?: number
    sort?: PublicSearchSort
    latitude?: number
    longitude?: number
    radiusKm?: number
}


export type PublicSearchPage =
    PageResponse<PublicSearchResult>

export interface PublicProductDetail {
    product: Product
    offers: PublicSearchResult[]
    lowestPrice: number | null
    totalStores: number
    availableStores: number
}


export interface PublicStoreDetail {
    store: PublicStore
    inventory: PublicSearchResult[]
    totalProducts: number
    availableProducts: number
}