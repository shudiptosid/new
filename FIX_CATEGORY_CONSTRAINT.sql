-- ============================================================
-- FIX: Remove Category Check Constraint
-- Run this in Supabase SQL Editor to fix the category error
-- ============================================================

-- Drop the problematic check constraint
ALTER TABLE component_prices 
DROP CONSTRAINT IF EXISTS component_prices_category_check;

-- Optional: Add a new constraint that matches the frontend categories
-- Uncomment the lines below if you want to enforce specific categories
/*
ALTER TABLE component_prices
ADD CONSTRAINT component_prices_category_check 
CHECK (category IN ('Sensor', 'MCU', 'Display', 'Power', 'Actuator', 'Component', 'Cable', 'Audio'));
*/

-- Verify the constraint is removed
SELECT con.conname AS constraint_name
FROM pg_constraint con
INNER JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'component_prices' AND con.contype = 'c';

-- Success message
SELECT 'Category constraint fixed! You can now add products with any category.' AS status;
