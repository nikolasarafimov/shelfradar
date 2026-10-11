ALTER TABLE audit_logs
ALTER COLUMN store_name_snapshot
        TYPE VARCHAR(200);

ALTER TABLE audit_logs
    ADD CONSTRAINT chk_audit_logs_actor_role
        CHECK (
            actor_role IN (
                           'ADMIN',
                           'STORE_OWNER'
                )
            );

ALTER TABLE audit_logs
    ADD CONSTRAINT chk_audit_logs_action
        CHECK (
    action IN (
    'INVENTORY_CREATED',
    'INVENTORY_UPDATED',
    'INVENTORY_DELETED',

    'STORE_PROFILE_UPDATED',
    'STORE_STATUS_CHANGED',
    'STORE_OWNER_CHANGED',

    'PRODUCT_CREATED',
    'PRODUCT_UPDATED',
    'PRODUCT_DELETED',

    'BRAND_CREATED',
    'BRAND_UPDATED',
    'BRAND_DELETED',

    'CATEGORY_CREATED',
    'CATEGORY_UPDATED',
    'CATEGORY_DELETED'
    )
    );

ALTER TABLE audit_logs
    ADD CONSTRAINT chk_audit_logs_entity_type
        CHECK (
            entity_type IN (
                            'INVENTORY',
                            'STORE',
                            'PRODUCT',
                            'BRAND',
                            'CATEGORY'
                )
            );

CREATE INDEX idx_audit_logs_entity_type_occurred_at
    ON audit_logs (
                   entity_type,
                   occurred_at DESC
        );