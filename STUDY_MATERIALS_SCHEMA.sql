-- ============================================
-- STUDY MATERIALS MANAGEMENT SYSTEM
-- ============================================
-- Run this in your Supabase SQL Editor

-- 1. Create study_materials table
CREATE TABLE IF NOT EXISTS study_materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- File Information
  title TEXT NOT NULL,
  author TEXT,
  description TEXT,
  year INTEGER,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT, -- in bytes
  
  -- Categorization
  category TEXT NOT NULL CHECK (category IN ('CSE', 'ECE', 'Mechatronics', 'MEC', 'General')),
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  
  -- Tracking
  uploaded_by UUID REFERENCES auth.users(id),
  
  -- Indexes for faster queries
  CONSTRAINT valid_year CHECK (year IS NULL OR (year >= 1900 AND year <= 2100))
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_study_materials_category ON study_materials(category);
CREATE INDEX IF NOT EXISTS idx_study_materials_is_active ON study_materials(is_active);
CREATE INDEX IF NOT EXISTS idx_study_materials_created_at ON study_materials(created_at DESC);

-- 3. Enable Row Level Security
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies

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

-- Only admins can insert materials
CREATE POLICY "Admins can insert study materials"
  ON study_materials
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Only admins can update materials
CREATE POLICY "Admins can update study materials"
  ON study_materials
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Only admins can delete materials
CREATE POLICY "Admins can delete study materials"
  ON study_materials
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- 5. Create function to update download count
CREATE OR REPLACE FUNCTION increment_download_count(material_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE study_materials
  SET download_count = download_count + 1
  WHERE id = material_id;
END;
$$;

-- 6. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger for updated_at
CREATE TRIGGER update_study_materials_updated_at
  BEFORE UPDATE ON study_materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 8. Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON study_materials TO anon;
GRANT ALL ON study_materials TO authenticated;

-- ============================================
-- STORAGE BUCKET SETUP (Run in Supabase Dashboard)
-- ============================================
-- Go to Storage > Create a new bucket
-- Bucket name: study-materials
-- Public bucket: Yes (for public downloads)
-- File size limit: 50MB (adjust as needed)
-- Allowed MIME types: application/pdf

-- After creating the bucket, run this for storage policies:

-- Policy 1: Anyone can download files
CREATE POLICY "Public can download study materials"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'study-materials');

-- Policy 2: Only admins can upload files
CREATE POLICY "Admins can upload study materials"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'study-materials' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy 3: Only admins can delete files
CREATE POLICY "Admins can delete study materials"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'study-materials' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
/*
INSERT INTO study_materials (
  title,
  author,
  description,
  year,
  category,
  file_url,
  file_name,
  file_size,
  is_active
) VALUES (
  'Introduction to IoT',
  'Sudip Misra',
  'Comprehensive guide to Internet of Things fundamentals',
  2016,
  'ECE',
  'https://your-supabase-url.com/storage/v1/object/public/study-materials/ece/intro-to-iot.pdf',
  'INTRODUCTION TO IOT by SUDIP MISRA.pdf',
  15728640,
  true
);
*/

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Check if table was created successfully
SELECT * FROM study_materials LIMIT 1;

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'study_materials';

-- Check if storage bucket exists
SELECT * FROM storage.buckets WHERE name = 'study-materials';
