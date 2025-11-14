-- Create admin profile for circuitcraftersiot@gmail.com
-- Run this in Supabase SQL Editor

-- First, check if the profile exists
SELECT * FROM user_profiles WHERE email = 'circuitcraftersiot@gmail.com';

-- If no rows returned above, insert the admin profile manually
-- Replace 'YOUR_USER_ID' with the actual user ID from auth.users table

-- Step 1: Find the user ID from auth.users
SELECT id, email, created_at FROM auth.users WHERE email = 'circuitcraftersiot@gmail.com';

-- Step 2: Insert the profile with the user ID found above
-- IMPORTANT: Replace '294b238a-2a78-410b-b979-285a9aaf5732' with the actual ID from Step 1
INSERT INTO user_profiles (
  id,
  email,
  full_name,
  role,
  email_verified,
  created_at,
  updated_at
) VALUES (
  '294b238a-2a78-410b-b979-285a9aaf5732', -- Replace with actual user ID from auth.users
  'circuitcraftersiot@gmail.com',
  'Circuit Crafters Admin',
  'admin', -- This is the important part!
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  updated_at = NOW();

-- Step 3: Verify the profile was created
SELECT 
  id,
  email,
  full_name,
  role,
  email_verified,
  created_at
FROM user_profiles 
WHERE email = 'circuitcraftersiot@gmail.com';

-- Expected result:
-- You should see one row with role = 'admin'
