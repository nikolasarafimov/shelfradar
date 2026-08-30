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

export interface PublicSearchParams {
    q?: string
    brandId?: number
    categoryId?: number
    status?: StockStatus
    city?: string
    page?: number
    size?: number
    sort?: PublicSearchSort
}

export type PublicSearchPage =
    PageResponse<PublicSearchResult>