import type {
    PageResponse,
} from './catalog'


export type AuditAction =
    | 'INVENTORY_CREATED'
    | 'INVENTORY_UPDATED'
    | 'INVENTORY_DELETED'
    | 'STORE_PROFILE_UPDATED'
    | 'STORE_STATUS_CHANGED'
    | 'STORE_OWNER_CHANGED'
    | 'PRODUCT_CREATED'
    | 'PRODUCT_UPDATED'
    | 'PRODUCT_DELETED'
    | 'BRAND_CREATED'
    | 'BRAND_UPDATED'
    | 'BRAND_DELETED'
    | 'CATEGORY_CREATED'
    | 'CATEGORY_UPDATED'
    | 'CATEGORY_DELETED'


export type AuditEntityType =
    | 'INVENTORY'
    | 'STORE'
    | 'PRODUCT'
    | 'BRAND'
    | 'CATEGORY'


export interface AuditLogEntry {
    id: number
    actorUserId: number | null
    actorEmail: string
    actorRole: 'ADMIN' | 'STORE_OWNER'
    action: AuditAction
    entityType: AuditEntityType
    entityId: number | null
    storeId: number | null
    storeName: string | null
    productId: number | null
    productName: string | null
    details: string | null
    occurredAt: string
}


export interface DailyActivity {
    date: string
    actions: number
}


export interface StoreActivitySummary {
    storeId: number
    storeName: string | null
    actions: number
}


export interface AdminAnalytics {
    activityLast24Hours: number
    activityLast7Days: number
    inventoryChangesLast7Days: number
    storeChangesLast7Days: number
    dailyActivity: DailyActivity[]
    mostActiveStores: StoreActivitySummary[]
    recentActivity: AuditLogEntry[]
}


export interface AuditSearchParams {
    q?: string
    action?: AuditAction
    entityType?: AuditEntityType
    storeId?: number
    page?: number
    size?: number
}


export type AuditLogPage =
    PageResponse<AuditLogEntry>