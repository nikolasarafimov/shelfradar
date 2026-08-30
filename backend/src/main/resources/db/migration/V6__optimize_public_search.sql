CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_products_name_trgm
    ON products
    USING GIN (
    LOWER(name) gin_trgm_ops
    );

CREATE INDEX idx_stores_city_lower
    ON stores (
               LOWER(city)
        );

CREATE INDEX idx_inventory_status_price
    ON inventory (
                  status,
                  price
        );