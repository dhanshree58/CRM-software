-- =========================================================
-- CRM SYSTEM DATABASE
-- PostgreSQL / Neon
-- =========================================================

-- =========================================================
-- DROP TABLES
-- =========================================================

DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS deliveries CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;


-- =========================================================
-- CUSTOMERS
-- =========================================================

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,

    name VARCHAR(150) NOT NULL,

    phone VARCHAR(20) NOT NULL,

    email VARCHAR(150),

    address TEXT,

    city VARCHAR(100),

    state VARCHAR(100),

    pincode VARCHAR(10),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- PRODUCTS
-- =========================================================

CREATE TABLE products (
    id SERIAL PRIMARY KEY,

    name VARCHAR(200) NOT NULL,

    sku VARCHAR(100) UNIQUE,

    category VARCHAR(100) DEFAULT 'General',

    selling_price NUMERIC(12,2) NOT NULL
        CHECK (selling_price >= 0),

    purchase_price NUMERIC(12,2) DEFAULT 0
        CHECK (purchase_price >= 0),

    gst NUMERIC(5,2) DEFAULT 0
        CHECK (gst >= 0),

    stock INTEGER DEFAULT 0
        CHECK (stock >= 0),

    low_stock_limit INTEGER DEFAULT 5
        CHECK (low_stock_limit >= 0),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- ORDERS
-- =========================================================

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,

    order_number VARCHAR(50) UNIQUE NOT NULL,

    customer_id INTEGER NOT NULL,

    status VARCHAR(30) DEFAULT 'PENDING'
        CHECK (
            status IN (
                'PENDING',
                'PROCESSING',
                'SHIPPED',
                'DELIVERED',
                'CANCELLED'
            )
        ),

    subtotal NUMERIC(12,2) DEFAULT 0,

    discount NUMERIC(12,2) DEFAULT 0,

    tax NUMERIC(12,2) DEFAULT 0,

    total NUMERIC(12,2) DEFAULT 0,

    payment_status VARCHAR(30) DEFAULT 'PENDING'
        CHECK (
            payment_status IN (
                'PENDING',
                'PAID',
                'FAILED',
                'REFUNDED'
            )
        ),

    payment_method VARCHAR(50) DEFAULT 'COD',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE RESTRICT
);


-- =========================================================
-- ORDER ITEMS
-- =========================================================

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,

    order_id INTEGER NOT NULL,

    product_id INTEGER NOT NULL,

    quantity INTEGER NOT NULL
        CHECK (quantity > 0),

    price NUMERIC(12,2) NOT NULL
        CHECK (price >= 0),

    total NUMERIC(12,2) NOT NULL
        CHECK (total >= 0),

    CONSTRAINT fk_order_item_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_item_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT
);


-- =========================================================
-- PAYMENTS
-- =========================================================

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,

    order_id INTEGER NOT NULL,

    amount NUMERIC(12,2) NOT NULL
        CHECK (amount >= 0),

    method VARCHAR(50) NOT NULL,

    transaction_id VARCHAR(150),

    status VARCHAR(30) DEFAULT 'SUCCESS'
        CHECK (
            status IN (
                'SUCCESS',
                'PENDING',
                'FAILED',
                'REFUNDED'
            )
        ),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
);


-- =========================================================
-- DELIVERIES
-- =========================================================

CREATE TABLE deliveries (
    id SERIAL PRIMARY KEY,

    order_id INTEGER NOT NULL UNIQUE,

    delivery_person VARCHAR(150),

    phone VARCHAR(20),

    address TEXT,

    status VARCHAR(30) DEFAULT 'ASSIGNED'
        CHECK (
            status IN (
                'ASSIGNED',
                'OUT_FOR_DELIVERY',
                'DELIVERED',
                'CANCELLED'
            )
        ),

    delivered_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_delivery_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
);


-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX idx_customers_phone
ON customers(phone);

CREATE INDEX idx_products_category
ON products(category);

CREATE INDEX idx_products_stock
ON products(stock);

CREATE INDEX idx_orders_customer
ON orders(customer_id);

CREATE INDEX idx_orders_status
ON orders(status);

CREATE INDEX idx_orders_created_at
ON orders(created_at);

CREATE INDEX idx_order_items_order
ON order_items(order_id);

CREATE INDEX idx_order_items_product
ON order_items(product_id);

CREATE INDEX idx_deliveries_status
ON deliveries(status);


-- =========================================================
-- DEMO CUSTOMERS
-- =========================================================

INSERT INTO customers
(name, phone, email, address, city, state, pincode)
VALUES
(
    'Rahul Sharma',
    '9876543210',
    'rahul@example.com',
    'MG Road',
    'Pune',
    'Maharashtra',
    '411001'
),
(
    'Priya Patil',
    '9876543211',
    'priya@example.com',
    'Kothrud',
    'Pune',
    'Maharashtra',
    '411038'
),
(
    'Amit Joshi',
    '9876543212',
    'amit@example.com',
    'Baner Road',
    'Pune',
    'Maharashtra',
    '411045'
),
(
    'Sneha Kulkarni',
    '9876543213',
    'sneha@example.com',
    'Viman Nagar',
    'Pune',
    'Maharashtra',
    '411014'
),
(
    'Vikas Deshmukh',
    '9876543214',
    'vikas@example.com',
    'Hadapsar',
    'Pune',
    'Maharashtra',
    '411028'
);


-- =========================================================
-- DEMO PRODUCTS
-- =========================================================

INSERT INTO products
(
    name,
    sku,
    category,
    selling_price,
    purchase_price,
    gst,
    stock,
    low_stock_limit
)
VALUES
(
    'Premium Cement',
    'CEM-001',
    'Construction',
    420.00,
    350.00,
    18,
    120,
    20
),
(
    'Steel Rod 10mm',
    'STL-010',
    'Steel',
    650.00,
    550.00,
    18,
    75,
    15
),
(
    'Wall Paint 20L',
    'PNT-020',
    'Paint',
    3200.00,
    2700.00,
    18,
    18,
    5
),
(
    'PVC Pipe 1 inch',
    'PVC-001',
    'Plumbing',
    280.00,
    210.00,
    18,
    45,
    10
),
(
    'Electrical Wire 90m',
    'ELC-090',
    'Electrical',
    1850.00,
    1500.00,
    18,
    12,
    5
),
(
    'Drill Machine',
    'DRL-001',
    'Tools',
    4500.00,
    3700.00,
    18,
    7,
    3
);


-- =========================================================
-- DEMO ORDERS
-- =========================================================

INSERT INTO orders
(
    order_number,
    customer_id,
    status,
    subtotal,
    discount,
    tax,
    total,
    payment_status,
    payment_method
)
VALUES
(
    'ORD-1001',
    1,
    'DELIVERED',
    4200.00,
    200.00,
    720.00,
    4720.00,
    'PAID',
    'UPI'
),
(
    'ORD-1002',
    2,
    'PROCESSING',
    6400.00,
    300.00,
    1098.00,
    7198.00,
    'PAID',
    'CARD'
),
(
    'ORD-1003',
    3,
    'SHIPPED',
    1850.00,
    0.00,
    333.00,
    2183.00,
    'PAID',
    'UPI'
),
(
    'ORD-1004',
    4,
    'PENDING',
    3200.00,
    100.00,
    558.00,
    3658.00,
    'PENDING',
    'COD'
),
(
    'ORD-1005',
    5,
    'DELIVERED',
    4500.00,
    500.00,
    720.00,
    4720.00,
    'PAID',
    'CASH'
);


-- =========================================================
-- DEMO ORDER ITEMS
-- =========================================================

INSERT INTO order_items
(
    order_id,
    product_id,
    quantity,
    price,
    total
)
VALUES
-- Order 1001
(1, 1, 10, 420.00, 4200.00),

-- Order 1002
(2, 3, 2, 3200.00, 6400.00),

-- Order 1003
(3, 5, 1, 1850.00, 1850.00),

-- Order 1004
(4, 3, 1, 3200.00, 3200.00),

-- Order 1005
(5, 6, 1, 4500.00, 4500.00);


-- =========================================================
-- DEMO PAYMENTS
-- =========================================================

INSERT INTO payments
(
    order_id,
    amount,
    method,
    transaction_id,
    status
)
VALUES
(
    1,
    4720.00,
    'UPI',
    'TXN-UPI-1001',
    'SUCCESS'
),
(
    2,
    7198.00,
    'CARD',
    'TXN-CARD-1002',
    'SUCCESS'
),
(
    3,
    2183.00,
    'UPI',
    'TXN-UPI-1003',
    'SUCCESS'
),
(
    5,
    4720.00,
    'CASH',
    NULL,
    'SUCCESS'
);


-- =========================================================
-- DEMO DELIVERIES
-- =========================================================

INSERT INTO deliveries
(
    order_id,
    delivery_person,
    phone,
    address,
    status,
    delivered_at
)
VALUES
(
    1,
    'Suresh Kumar',
    '9000000001',
    'MG Road, Pune, Maharashtra',
    'DELIVERED',
    CURRENT_TIMESTAMP
),
(
    3,
    'Rohit Jadhav',
    '9000000002',
    'Baner Road, Pune, Maharashtra',
    'OUT_FOR_DELIVERY',
    NULL
),
(
    5,
    'Akash More',
    '9000000003',
    'Hadapsar, Pune, Maharashtra',
    'DELIVERED',
    CURRENT_TIMESTAMP
);


-- =========================================================
-- FINISHED
-- =========================================================

SELECT 'CRM database created successfully!' AS message;