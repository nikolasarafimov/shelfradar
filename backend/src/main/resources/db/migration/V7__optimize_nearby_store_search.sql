CREATE INDEX idx_stores_active_location_gist
    ON stores
    USING GIST (location)
    WHERE status = 'ACTIVE';