-- =========================================================
-- USERS
-- =========================================================

INSERT INTO app_users
(
    full_name,
    email,
    password_hash,
    role
)
VALUES
    (
        'ShelfRadar Administrator',
        'admin@shelfradar.local',
        crypt('Admin123!', gen_salt('bf', 12)),
        'ADMIN'
    ),
    (
        'Marko Petrov',
        'marko@shelfradar.local',
        crypt('Store123!', gen_salt('bf', 12)),
        'STORE_OWNER'
    ),
    (
        'Elena Nikolova',
        'elena@shelfradar.local',
        crypt('Store123!', gen_salt('bf', 12)),
        'STORE_OWNER'
    ),
    (
        'Stefan Trajkov',
        'stefan@shelfradar.local',
        crypt('Store123!', gen_salt('bf', 12)),
        'STORE_OWNER'
    );


-- =========================================================
-- BRANDS
-- =========================================================

INSERT INTO brands (name)
VALUES
    ('Coca-Cola'),
    ('Pepsi'),
    ('Bimilk'),
    ('Milka'),
    ('Lay''s');


-- =========================================================
-- CATEGORIES
-- =========================================================

INSERT INTO categories (name)
VALUES
    ('Beverages'),
    ('Dairy'),
    ('Snacks'),
    ('Chocolate');


-- =========================================================
-- PRODUCTS
-- =========================================================

INSERT INTO products
(
    name,
    description,
    image_url,
    brand_id,
    category_id
)
VALUES
    (
        'Coca-Cola Original 1L',
        'Coca-Cola Original Taste, 1 litre bottle.',
        NULL,
        (SELECT id FROM brands WHERE name = 'Coca-Cola'),
        (SELECT id FROM categories WHERE name = 'Beverages')
    ),
    (
        'Coca-Cola Zero 1.5L',
        'Coca-Cola Zero Sugar, 1.5 litre bottle.',
        NULL,
        (SELECT id FROM brands WHERE name = 'Coca-Cola'),
        (SELECT id FROM categories WHERE name = 'Beverages')
    ),
    (
        'Pepsi 1.5L',
        'Pepsi carbonated soft drink, 1.5 litre bottle.',
        NULL,
        (SELECT id FROM brands WHERE name = 'Pepsi'),
        (SELECT id FROM categories WHERE name = 'Beverages')
    ),
    (
        'Bimilk Milk 1L',
        'Fresh milk, 1 litre.',
        NULL,
        (SELECT id FROM brands WHERE name = 'Bimilk'),
        (SELECT id FROM categories WHERE name = 'Dairy')
    ),
    (
        'Milka Alpine Milk 100g',
        'Milk chocolate bar.',
        NULL,
        (SELECT id FROM brands WHERE name = 'Milka'),
        (SELECT id FROM categories WHERE name = 'Chocolate')
    ),
    (
        'Lay''s Classic 140g',
        'Classic salted potato chips.',
        NULL,
        (SELECT id FROM brands WHERE name = 'Lay''s'),
        (SELECT id FROM categories WHERE name = 'Snacks')
    );


-- =========================================================
-- STORES
-- =========================================================

INSERT INTO stores
(
    name,
    address,
    city,
    latitude,
    longitude,
    phone,
    working_hours,
    status,
    owner_id
)
VALUES
    (
        'Market Center',
        'Macedonia Square 1',
        'Skopje',
        41.998100,
        21.425400,
        '+389 2 555 1001',
        'Mon-Sun 08:00-22:00',
        'ACTIVE',
        (
            SELECT id
            FROM app_users
            WHERE email = 'marko@shelfradar.local'
        )
    ),
    (
        'Fresh Market Aerodrom',
        'Jane Sandanski 50',
        'Skopje',
        41.988000,
        21.452000,
        '+389 2 555 1002',
        'Mon-Sun 07:30-22:30',
        'ACTIVE',
        (
            SELECT id
            FROM app_users
            WHERE email = 'elena@shelfradar.local'
        )
    ),
    (
        'City Market Karposh',
        'Partizanski Odredi 80',
        'Skopje',
        42.004800,
        21.397600,
        '+389 2 555 1003',
        'Mon-Sat 08:00-22:00; Sun 09:00-20:00',
        'ACTIVE',
        (
            SELECT id
            FROM app_users
            WHERE email = 'stefan@shelfradar.local'
        )
    );


-- =========================================================
-- INVENTORY
-- =========================================================

INSERT INTO inventory
(
    store_id,
    product_id,
    price,
    quantity,
    status
)
VALUES

-- Market Center
(
    (SELECT id FROM stores WHERE name = 'Market Center'),
    (SELECT id FROM products WHERE name = 'Coca-Cola Original 1L'),
    72.00,
    25,
    'IN_STOCK'
),
(
    (SELECT id FROM stores WHERE name = 'Market Center'),
    (SELECT id FROM products WHERE name = 'Coca-Cola Zero 1.5L'),
    89.00,
    7,
    'LOW_STOCK'
),
(
    (SELECT id FROM stores WHERE name = 'Market Center'),
    (SELECT id FROM products WHERE name = 'Pepsi 1.5L'),
    82.00,
    18,
    'IN_STOCK'
),
(
    (SELECT id FROM stores WHERE name = 'Market Center'),
    (SELECT id FROM products WHERE name = 'Bimilk Milk 1L'),
    75.00,
    0,
    'OUT_OF_STOCK'
),

-- Fresh Market Aerodrom
(
    (SELECT id FROM stores WHERE name = 'Fresh Market Aerodrom'),
    (SELECT id FROM products WHERE name = 'Coca-Cola Original 1L'),
    75.00,
    8,
    'LOW_STOCK'
),
(
    (SELECT id FROM stores WHERE name = 'Fresh Market Aerodrom'),
    (SELECT id FROM products WHERE name = 'Pepsi 1.5L'),
    79.00,
    30,
    'IN_STOCK'
),
(
    (SELECT id FROM stores WHERE name = 'Fresh Market Aerodrom'),
    (SELECT id FROM products WHERE name = 'Milka Alpine Milk 100g'),
    69.00,
    21,
    'IN_STOCK'
),
(
    (SELECT id FROM stores WHERE name = 'Fresh Market Aerodrom'),
    (SELECT id FROM products WHERE name = 'Lay''s Classic 140g'),
    95.00,
    12,
    'IN_STOCK'
),

-- City Market Karposh
(
    (SELECT id FROM stores WHERE name = 'City Market Karposh'),
    (SELECT id FROM products WHERE name = 'Coca-Cola Original 1L'),
    70.00,
    0,
    'OUT_OF_STOCK'
),
(
    (SELECT id FROM stores WHERE name = 'City Market Karposh'),
    (SELECT id FROM products WHERE name = 'Coca-Cola Zero 1.5L'),
    87.00,
    17,
    'IN_STOCK'
),
(
    (SELECT id FROM stores WHERE name = 'City Market Karposh'),
    (SELECT id FROM products WHERE name = 'Bimilk Milk 1L'),
    73.00,
    25,
    'IN_STOCK'
),
(
    (SELECT id FROM stores WHERE name = 'City Market Karposh'),
    (SELECT id FROM products WHERE name = 'Lay''s Classic 140g'),
    92.00,
    4,
    'LOW_STOCK'
);