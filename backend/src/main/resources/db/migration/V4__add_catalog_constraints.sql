CREATE UNIQUE INDEX uq_products_identity_ci
    ON products (
                 LOWER(name),
                 brand_id,
                 category_id
        );