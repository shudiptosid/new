-- Set circuitcraftersiot@gmail.com as admin
-- Run this in Supabase SQL Editor

-- Update the role to admin for the specific email
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'circuitcraftersiot@gmail.com';

-- Verify the update
SELECT 
  id,
  email,
  full_name,
  role,
  created_at
FROM user_profiles
WHERE email = 'circuitcraftersiot@gmail.com';

-- Check if the user exists (if above returns no rows, the user hasn't signed up yet)
-- If no rows returned, the user needs to sign up first at /signup
