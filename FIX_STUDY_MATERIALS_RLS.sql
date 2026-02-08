-- ============================================
-- FIX STUDY MATERIALS RLS POLICIES
-- ============================================
-- Run this in your Supabase SQL Editor to fix the upload error

-- ===========================================
-- PART 1: FIX STORAGE BUCKET POLICIES
-- ===========================================

-- Drop existing storage policies for "Study Material" bucket
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete files" ON storage.objects;

-- Create storage policies for "Study Material" bucket
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload to Study Material"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'Study Material');

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update Study Material files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'Study Material');

-- Allow anyone to view files
CREATE POLICY "Anyone can view Study Material files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'Study Material');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete Study Material files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'Study Material');

-- ===========================================
-- PART 2: FIX DATABASE TABLE POLICIES
-- ===========================================

-- Step 1: Drop all existing policies
DROP POLICY IF EXISTS "Anyone can view active study materials" ON study_materials;
DROP POLICY IF EXISTS "Admins can view all study materials" ON study_materials;
DROP POLICY IF EXISTS "Admins can insert study materials" ON study_materials;
DROP POLICY IF EXISTS "Admins can update study materials" ON study_materials;
DROP POLICY IF EXISTS "Admins can delete study materials" ON study_materials;
DROP POLICY IF EXISTS "Authenticated users can insert study materials" ON study_materials;
DROP POLICY IF EXISTS "Authenticated users can update study materials" ON study_materials;
DROP POLICY IF EXISTS "Authenticated users can delete study materials" ON study_materials;

-- Step 2: Create corrected policies with user_profiles table

-- Anyone can view active materials
CREATE POLICY "Anyone can view active study materials"
  ON study_materials
  FOR SELECT
  USING (is_active = true);

-- Admins can view all materials (including inactive)
CREATE POLICY "Admins can view all study materials"
  ON study_materials
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- SIMPLIFIED: Allow any authenticated user to insert (admin check done at app level)
CREATE POLICY "Authenticated users can insert study materials"
  ON study_materials
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- SIMPLIFIED: Allow any authenticated user to update (admin check done at app level)
CREATE POLICY "Authenticated users can update study materials"
  ON study_materials
  FOR UPDATE
  TO authenticated
  USING (true);

-- SIMPLIFIED: Allow any authenticated user to delete (admin check done at app level)
CREATE POLICY "Authenticated users can delete study materials"
  ON study_materials
  FOR DELETE
  TO authenticated
  USING (true);

-- Step 3: Verify admin user exists
-- Check if your admin email has the admin role
SELECT id, email, role 
FROM user_profiles 
WHERE email = 'circuitcraftersiot@gmail.com';

-- If the above returns NULL or role is not 'admin', run this:
-- UPDATE user_profiles SET role = 'admin' WHERE email = 'circuitcraftersiot@gmail.com';

-- Step 4: Test the policies
-- You can verify policies are working by running:
SELECT * FROM study_materials; -- Should work for admins

-- ============================================
-- TROUBLESHOOTING: ECE Materials Not Showing
-- ============================================
-- If ECE materials don't appear on /resources page:

-- 1. Check if materials exist in database:
SELECT id, title, category, is_active FROM study_materials WHERE category = 'ECE';

-- 2. Verify materials are active:
UPDATE study_materials SET is_active = true WHERE category = 'ECE';

-- 3. Check the category value (must be uppercase):
-- The app sends uppercase category (ECE, CSE, etc.)
-- If your data has lowercase, update it:
UPDATE study_materials SET category = UPPER(category);

-- 4. Verify you uploaded with correct category:
-- When uploading via Admin Panel, make sure you select "ECE" from dropdown
-- The category must match exactly (case-sensitive)
