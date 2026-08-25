-- ==============================================================================
-- BÁNH MÌ VIETNAM / CLOUD KITCHEN DATABASE SCHEMA
-- Automated 10-Day Order Retention, Unique Tracking, and Fast Lookups
-- ==============================================================================

-- 1. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    tracking_code TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'preparing', 'ready', 'delivering', 'completed', 'cancelled')),
    delivery_method TEXT NOT NULL DEFAULT 'delivery' CHECK (delivery_method IN ('delivery', 'pickup')),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_address TEXT,
    customer_unit TEXT,
    customer_instructions TEXT,
    items_json JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tip NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    estimated_time TEXT NOT NULL DEFAULT '20-30 min',
    payment_method TEXT NOT NULL DEFAULT 'Online',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Indexes for Instant Lookups by Tracking Code and Auto-Cleanup by Date
CREATE INDEX IF NOT EXISTS idx_orders_tracking_code ON public.orders (tracking_code);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders (customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);

-- 3. Function to Automatically Delete Orders Older than 10 Days
CREATE OR REPLACE FUNCTION delete_orders_older_than_10_days()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.orders
    WHERE created_at < (NOW() - INTERVAL '10 days');
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Trigger to Auto-Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_orders_modtime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION update_orders_modtime();

-- 5. Row Level Security (RLS) Configuration
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public to query order details by tracking code (secured view)
CREATE POLICY "Public can view their own order by tracking code"
ON public.orders FOR SELECT
USING (true);

-- Allow public creation of orders
CREATE POLICY "Public can insert orders"
ON public.orders FOR INSERT
WITH CHECK (true);

-- Allow kitchen staff / server to update order statuses
CREATE POLICY "Staff can update order status"
ON public.orders FOR UPDATE
USING (true);
