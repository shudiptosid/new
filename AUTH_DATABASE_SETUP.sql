-- ========================================
-- AUTHENTICATION DATABASE - USER PROFILES ONLY
-- ========================================
-- Run this in Supabase SQL Editor: https://app.supabase.com

-- ========================================
-- USER PROFILES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  phone_number text,
  role text DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  company text,
  bio text,
  location text,
  age integer,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  email_verified boolean DEFAULT false,
  last_login timestamptz
);

-- ========================================
-- ENABLE ROW LEVEL SECURITY
-- ========================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- ========================================
-- RLS POLICIES - USER PROFILES
-- ========================================

-- Drop existing policies if they exist (keeps SQL idempotent)
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for service role" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users and triggers" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile  
CREATE POLICY "Users can update own profile"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = id);

-- Allow inserts for triggers (SECURITY DEFINER functions bypass RLS automatically)
-- Also allow authenticated users to insert their own profile as fallback
CREATE POLICY "Enable insert for authenticated users and triggers"
ON public.user_profiles
FOR INSERT
WITH CHECK (true);

-- ========================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- ========================================

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_age INTEGER;
BEGIN
  -- Parse age safely
  BEGIN
    IF NEW.raw_user_meta_data IS NOT NULL
       AND NEW.raw_user_meta_data->>'age' IS NOT NULL
       AND NEW.raw_user_meta_data->>'age' <> '' THEN
      user_age := (NEW.raw_user_meta_data->>'age')::integer;
    ELSE
      user_age := NULL;
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      user_age := NULL;
  END;

  -- Insert profile; if the profile already exists, do nothing.
  INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    phone_number,
    location,
    age,
    role,
    email_verified
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    COALESCE(NEW.raw_user_meta_data->>'location', NULL),
    user_age,
    'customer',
    (NEW.email_confirmed_at IS NOT NULL)
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't prevent auth.user creation
    RAISE WARNING 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when user is created in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- AUTO-UPDATE TIMESTAMP TRIGGER
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at := timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_profiles updated_at
DROP TRIGGER IF EXISTS on_user_profile_updated ON public.user_profiles;
CREATE TRIGGER on_user_profile_updated
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ========================================
-- PERFORMANCE INDEXES
-- ========================================
-- UNIQUE on email already creates an index; keeping explicit index is optional
-- CREATE INDEX IF NOT EXISTS user_profiles_role_idx ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS user_profiles_role_idx ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS user_profiles_status_idx ON public.user_profiles(status);

-- ========================================
-- SETUP COMPLETE
-- ========================================
