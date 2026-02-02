-- ============================================================
-- COMPONENT PRICES TABLE SCHEMA
-- Run this in Supabase SQL Editor if table doesn't exist
-- ============================================================

-- Create component_prices table
CREATE TABLE IF NOT EXISTS component_prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL UNIQUE,
  serial_no INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Sensor', 'MCU', 'Display', 'Power', 'Actuator', 'Component', 'Cable', 'Audio')),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create price_history table for tracking price changes
CREATE TABLE IF NOT EXISTS price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  old_price DECIMAL(10,2),
  new_price DECIMAL(10,2) NOT NULL,
  change_note TEXT,
  changed_by UUID,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_component_prices_product_id ON component_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_component_prices_category ON component_prices(category);
CREATE INDEX IF NOT EXISTS idx_component_prices_is_active ON component_prices(is_active);
CREATE INDEX IF NOT EXISTS idx_price_history_product_id ON price_history(product_id);

-- Enable Row Level Security (RLS)
ALTER TABLE component_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES FOR component_prices
-- ============================================================

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can view active products" ON component_prices;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON component_prices;
DROP POLICY IF EXISTS "Authenticated users can update products" ON component_prices;
DROP POLICY IF EXISTS "Authenticated users can view all products" ON component_prices;

-- Policy 1: Anyone (including anonymous) can view active products
CREATE POLICY "Anyone can view active products" 
ON component_prices 
FOR SELECT 
TO anon, authenticated
USING (is_active = true);

-- Policy 2: Authenticated users can view all products (including deleted)
CREATE POLICY "Authenticated users can view all products"
ON component_prices
FOR SELECT
TO authenticated
USING (true);

-- Policy 3: Authenticated users can insert new products
CREATE POLICY "Authenticated users can insert products"
ON component_prices
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 4: Authenticated users can update products
CREATE POLICY "Authenticated users can update products"
ON component_prices
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================================
-- RLS POLICIES FOR price_history
-- ============================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can view price history" ON price_history;
DROP POLICY IF EXISTS "Authenticated users can insert price history" ON price_history;

-- Policy 1: Authenticated users can view price history
CREATE POLICY "Authenticated users can view price history"
ON price_history
FOR SELECT
TO authenticated
USING (true);

-- Policy 2: Authenticated users can insert price history
CREATE POLICY "Authenticated users can insert price history"
ON price_history
FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Check if tables exist
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('component_prices', 'price_history');

-- Check RLS policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual FROM pg_policies WHERE tablename IN ('component_prices', 'price_history');

-- Count products
-- SELECT COUNT(*) as total_products FROM component_prices WHERE is_active = true;
