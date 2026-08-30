ALTER TABLE inventory
    ADD CONSTRAINT chk_inventory_quantity_status_consistency
        CHECK (
            (
                quantity = 0
                    AND status = 'OUT_OF_STOCK'
                )
                OR
            (
                quantity > 0
                    AND status IN (
                                   'IN_STOCK',
                                   'LOW_STOCK'
                    )
                )
            );

CREATE INDEX idx_inventory_store_updated_at
    ON inventory (
                  store_id,
                  updated_at DESC
        );