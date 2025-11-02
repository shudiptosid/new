-- ========================================
-- ADMIN SYSTEM DATABASE SCHEMA
-- ========================================
-- Run this in Supabase SQL Editor
-- This creates the admin replies system and updates request statuses

-- ========================================
-- 1. CREATE ADMIN REPLIES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.admin_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Request tracking
  request_type text NOT NULL CHECK (request_type IN ('consulting', 'prototyping', 'firmware', 'ondemand')),
  request_id uuid NOT NULL,
  
  -- User info
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_email text NOT NULL,
  
  -- Admin info
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_name text,
  
  -- Reply content
  reply_message text NOT NULL,
  
  -- Status tracking
  previous_status text,
  new_status text NOT NULL CHECK (new_status IN ('pending', 'under_review', 'solved')),
  
  -- Read status
  is_read_by_user boolean DEFAULT false,
  read_at timestamptz
);

-- ========================================
-- 2. UPDATE EXISTING TABLES - ADD NEW STATUS
-- ========================================
-- Update consulting_requests status constraint
ALTER TABLE public.consulting_requests 
  DROP CONSTRAINT IF EXISTS consulting_requests_status_check;

ALTER TABLE public.consulting_requests
  ADD CONSTRAINT consulting_requests_status_check 
  CHECK (status IN ('pending', 'under_review', 'solved', 'cancelled'));

-- Update prototyping_requests status constraint
ALTER TABLE public.prototyping_requests 
  DROP CONSTRAINT IF EXISTS prototyping_requests_status_check;

ALTER TABLE public.prototyping_requests
  ADD CONSTRAINT prototyping_requests_status_check 
  CHECK (status IN ('pending', 'under_review', 'solved', 'cancelled'));

-- Update firmware_requests status constraint
ALTER TABLE public.firmware_requests 
  DROP CONSTRAINT IF EXISTS firmware_requests_status_check;

ALTER TABLE public.firmware_requests
  ADD CONSTRAINT firmware_requests_status_check 
  CHECK (status IN ('pending', 'under_review', 'solved', 'cancelled'));

-- Update ondemand_requests status constraint
ALTER TABLE public.ondemand_requests 
  DROP CONSTRAINT IF EXISTS ondemand_requests_status_check;

ALTER TABLE public.ondemand_requests
  ADD CONSTRAINT ondemand_requests_status_check 
  CHECK (status IN ('pending', 'under_review', 'solved', 'cancelled'));

-- ========================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX IF NOT EXISTS idx_admin_replies_request 
  ON public.admin_replies(request_type, request_id);

CREATE INDEX IF NOT EXISTS idx_admin_replies_user 
  ON public.admin_replies(user_id);

CREATE INDEX IF NOT EXISTS idx_admin_replies_created 
  ON public.admin_replies(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_consulting_status 
  ON public.consulting_requests(status);

CREATE INDEX IF NOT EXISTS idx_prototyping_status 
  ON public.prototyping_requests(status);

CREATE INDEX IF NOT EXISTS idx_firmware_status 
  ON public.firmware_requests(status);

CREATE INDEX IF NOT EXISTS idx_ondemand_status 
  ON public.ondemand_requests(status);

-- ========================================
-- 4. ROW LEVEL SECURITY POLICIES
-- ========================================

-- Enable RLS on admin_replies
ALTER TABLE public.admin_replies ENABLE ROW LEVEL SECURITY;

-- Users can view their own replies
CREATE POLICY "Users can view own replies"
  ON public.admin_replies FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all replies
CREATE POLICY "Admins can view all replies"
  ON public.admin_replies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Admins can insert replies
CREATE POLICY "Admins can insert replies"
  ON public.admin_replies FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Admins can update replies (mark as read, etc)
CREATE POLICY "Admins can update replies"
  ON public.admin_replies FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Users can mark their own replies as read
CREATE POLICY "Users can mark own replies as read"
  ON public.admin_replies FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ========================================
-- 5. CREATE TRIGGER FOR UPDATED_AT
-- ========================================
CREATE OR REPLACE FUNCTION update_admin_replies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_admin_replies_updated_at
  BEFORE UPDATE ON public.admin_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_replies_updated_at();

-- ========================================
-- 6. CREATE VIEW FOR ADMIN DASHBOARD
-- ========================================
-- This view combines all request types for easy admin access
CREATE OR REPLACE VIEW public.admin_all_requests AS
  SELECT 
    'consulting' as request_type,
    id,
    user_id,
    user_email,
    user_name,
    created_at,
    updated_at,
    status,
    problem_goal as summary,
    admin_notes
  FROM public.consulting_requests
  
  UNION ALL
  
  SELECT 
    'prototyping' as request_type,
    id,
    user_id,
    user_email,
    user_name,
    created_at,
    updated_at,
    status,
    circuit_design_status as summary,
    admin_notes
  FROM public.prototyping_requests
  
  UNION ALL
  
  SELECT 
    'firmware' as request_type,
    id,
    user_id,
    user_email,
    user_name,
    created_at,
    updated_at,
    status,
    microcontroller as summary,
    admin_notes
  FROM public.firmware_requests
  
  UNION ALL
  
  SELECT 
    'ondemand' as request_type,
    id,
    user_id,
    user_email,
    user_name,
    created_at,
    updated_at,
    status,
    project_description as summary,
    admin_notes
  FROM public.ondemand_requests;

-- Grant access to admin view
GRANT SELECT ON public.admin_all_requests TO authenticated;

-- ========================================
-- 7. CREATE FUNCTION TO COUNT UNREAD MESSAGES
-- ========================================
CREATE OR REPLACE FUNCTION get_unread_message_count(user_uuid uuid)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM public.admin_replies
    WHERE user_id = user_uuid
    AND is_read_by_user = false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_unread_message_count(uuid) TO authenticated;

-- ========================================
-- SETUP COMPLETE!
-- ========================================
-- Next steps:
-- 1. Make sure at least one user has role = 'admin' in user_profiles table
-- 2. Test the admin panel functionality
-- 3. Users can now receive replies from admins
