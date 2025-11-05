-- ======================================================
-- CREATE TEST SERVICE REQUEST
-- Run this in Supabase SQL Editor to test Estimate System
-- ======================================================

-- First, create the service_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  summary TEXT,
  admin_notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'solved')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid duplicate errors)
DROP POLICY IF EXISTS "Admins can manage all requests" ON service_requests;
DROP POLICY IF EXISTS "Users can view own requests" ON service_requests;

-- RLS Policies
CREATE POLICY "Admins can manage all requests"
  ON service_requests
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can view own requests"
  ON service_requests
  FOR SELECT
  USING (user_id = auth.uid());

-- Insert a test service request
-- Note: Replace 'your-user-id-here' with your actual user ID from auth.users
INSERT INTO service_requests (
  request_type,
  user_id,
  user_email,
  user_name,
  summary,
  status
) VALUES (
  'project_inquiry',
  (SELECT id FROM auth.users LIMIT 1), -- Uses first user from auth
  'test@example.com',
  'Test Customer',
  'I need help with an IoT project using Arduino and sensors',
  'pending'
);

-- Verify the request was created
SELECT 
  id, 
  user_name, 
  user_email, 
  status, 
  summary, 
  created_at 
FROM service_requests 
ORDER BY created_at DESC 
LIMIT 5;
