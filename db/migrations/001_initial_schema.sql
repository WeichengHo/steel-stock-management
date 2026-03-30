-- Migration: Create initial schema for steel-stock-management
-- Track: inventory-core
-- Features: FIFO support, Batch tracking

-- 1. Items Table
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    item_code VARCHAR(50) UNIQUE NOT NULL,
    item_name VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    contact_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Inventory Batches Table (FIFO Core)
CREATE TABLE IF NOT EXISTS inventory_batches (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES items(id) NOT NULL,
    supplier_id INTEGER REFERENCES suppliers(id) NOT NULL,
    received_date DATE NOT NULL DEFAULT CURRENT_DATE,
    original_qty INTEGER NOT NULL CHECK (original_qty > 0),
    remaining_qty INTEGER NOT NULL CHECK (remaining_qty >= 0),
    unit_cost DECIMAL(12, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Shipments Table
CREATE TABLE IF NOT EXISTS shipments (
    id SERIAL PRIMARY KEY,
    shipment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    customer_info TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Shipment Items Table (FIFO Deductions)
CREATE TABLE IF NOT EXISTS shipment_items (
    id SERIAL PRIMARY KEY,
    shipment_id INTEGER REFERENCES shipments(id) NOT NULL,
    batch_id INTEGER REFERENCES inventory_batches(id) NOT NULL,
    qty_deducted INTEGER NOT NULL CHECK (qty_deducted > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_batches_fifo ON inventory_batches (item_id, remaining_qty, received_date ASC);
CREATE INDEX IF NOT EXISTS idx_items_code ON items (item_code);
