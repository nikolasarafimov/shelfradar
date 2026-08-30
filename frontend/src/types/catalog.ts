export interface Brand {
    id: number
    name: string
}

export interface Category {
    id: number
    name: string
}

export interface Product {
    id: number
    name: string
    description: string | null
    imageUrl: string | null
    brand: Brand
    category: Category
    createdAt: string
}

export interface CatalogNameRequest {
    name: string
}

export interface ProductRequest {
    name: string
    description: string | null
    imageUrl: string | null
    brandId: number
    categoryId: number
}

export interface PageResponse<T> {
    content: T[]
    page: number
    size: number
    totalElements: number
    totalPages: number
    first: boolean
    last: boolean
}