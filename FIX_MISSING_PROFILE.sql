-- Quick fix to create missing profile for existing user
-- Run this in Supabase SQL Editor if your profile doesn't exist

-- Check if profile exists for your user ID
SELECT * FROM public.user_profiles WHERE id = '918530d2-a4c2-4b98-89b0-83f5686101ed';

-- If the above returns no rows, run this to create the profile:
INSERT INTO public.user_profiles (
  id,
  email,
  full_name,
  phone_number,
  location,
  age,
  role,
  email_verified
) VALUES (
  '918530d2-a4c2-4b98-89b0-83f5686101ed',
  'shudiptosid@gmail.com',
  'Shudipto Gain',
  '8389090990',
  'Jalandhar, Punjab',
  25,
  'customer',
  true
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  phone_number = EXCLUDED.phone_number,
  location = EXCLUDED.location,
  age = EXCLUDED.age,
  email_verified = EXCLUDED.email_verified,
  updated_at = NOW();

-- Verify the profile was created
SELECT * FROM public.user_profiles WHERE id = '918530d2-a4c2-4b98-89b0-83f5686101ed';
