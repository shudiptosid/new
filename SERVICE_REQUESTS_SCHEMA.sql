-- ========================================
-- SERVICE REQUESTS DATABASE SCHEMA
-- ========================================
-- Creates 4 separate tables for each service category
-- Run this in Supabase SQL Editor after AUTH_DATABASE_SETUP.sql

-- ========================================
-- 1. CONSULTING REQUESTS
-- ========================================
CREATE TABLE IF NOT EXISTS public.consulting_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  
  -- User Info (for easy reference)
  user_email text NOT NULL,
  user_name text,
  
  -- Question Responses
  problem_goal text,
  hardware_status text,
  system_type text,
  help_needed text,
  timeline text,
  platform_preference text,
  budget text,
  documentation_needed text,
  
  -- Consultation
  wants_consultation boolean DEFAULT false,
  consultation_scheduled_at timestamptz,
  consultation_notes text,
  
  -- Admin notes
  admin_notes text,
  assigned_to uuid REFERENCES auth.users(id)
);

-- ========================================
-- 2. PROTOTYPING REQUESTS
-- ========================================
CREATE TABLE IF NOT EXISTS public.prototyping_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  
  -- User Info
  user_email text NOT NULL,
  user_name text,
  
  -- Question Responses
  circuit_design_status text,
  components_list text,
  key_function text,
  prototype_type text,
  pcb_support_needed text,
  enclosure_design_needed text,
  project_purpose text,
  deadline text,
  
  -- Consultation
  wants_consultation boolean DEFAULT false,
  consultation_scheduled_at timestamptz,
  consultation_notes text,
  
  -- Admin notes
  admin_notes text,
  assigned_to uuid REFERENCES auth.users(id)
);

-- ========================================
-- 3. FIRMWARE DEVELOPMENT REQUESTS
-- ========================================
CREATE TABLE IF NOT EXISTS public.firmware_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  
  -- User Info
  user_email text NOT NULL,
  user_name text,
  
  -- Question Responses
  microcontroller text,
  hardware_ready text,
  inputs_outputs text,
  iot_platform text,
  data_logging text,
  control_algorithms text,
  communication_protocol text,
  optimization_focus text,
  
  -- Consultation
  wants_consultation boolean DEFAULT false,
  consultation_scheduled_at timestamptz,
  consultation_notes text,
  
  -- Admin notes
  admin_notes text,
  assigned_to uuid REFERENCES auth.users(id)
);

-- ========================================
-- 4. ON DEMAND PROJECT REQUESTS
-- ========================================
CREATE TABLE IF NOT EXISTS public.ondemand_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  
  -- User Info
  user_email text NOT NULL,
  user_name text,
  
  -- Question Responses
  project_description text,
  problem_solving text,
  scope_of_work text,
  iot_integration text,
  hardware_components text,
  expected_output text,
  documentation_needed text,
  delivery_and_budget text,
  
  -- Consultation
  wants_consultation boolean DEFAULT false,
  consultation_scheduled_at timestamptz,
  consultation_notes text,
  
  -- Admin notes
  admin_notes text,
  assigned_to uuid REFERENCES auth.users(id)
);

-- ========================================
-- ENABLE ROW LEVEL SECURITY
-- ========================================
ALTER TABLE public.consulting_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prototyping_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.firmware_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ondemand_requests ENABLE ROW LEVEL SECURITY;

-- ========================================
-- RLS POLICIES - CONSULTING REQUESTS
-- ========================================
-- Users can view their own requests
CREATE POLICY "Users can view own consulting requests"
ON public.consulting_requests
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own requests
CREATE POLICY "Users can insert own consulting requests"
ON public.consulting_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending requests
CREATE POLICY "Users can update own pending consulting requests"
ON public.consulting_requests
FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending');

-- Admins can view all requests
CREATE POLICY "Admins can view all consulting requests"
ON public.consulting_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admins can update any request
CREATE POLICY "Admins can update all consulting requests"
ON public.consulting_requests
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ========================================
-- RLS POLICIES - PROTOTYPING REQUESTS
-- ========================================
CREATE POLICY "Users can view own prototyping requests"
ON public.prototyping_requests
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prototyping requests"
ON public.prototyping_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending prototyping requests"
ON public.prototyping_requests
FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can view all prototyping requests"
ON public.prototyping_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update all prototyping requests"
ON public.prototyping_requests
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ========================================
-- RLS POLICIES - FIRMWARE REQUESTS
-- ========================================
CREATE POLICY "Users can view own firmware requests"
ON public.firmware_requests
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own firmware requests"
ON public.firmware_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending firmware requests"
ON public.firmware_requests
FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can view all firmware requests"
ON public.firmware_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update all firmware requests"
ON public.firmware_requests
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ========================================
-- RLS POLICIES - ON DEMAND REQUESTS
-- ========================================
CREATE POLICY "Users can view own ondemand requests"
ON public.ondemand_requests
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ondemand requests"
ON public.ondemand_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending ondemand requests"
ON public.ondemand_requests
FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can view all ondemand requests"
ON public.ondemand_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update all ondemand requests"
ON public.ondemand_requests
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ========================================
-- AUTO-UPDATE TIMESTAMP TRIGGERS
-- ========================================
CREATE TRIGGER update_consulting_requests_updated_at
  BEFORE UPDATE ON public.consulting_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_prototyping_requests_updated_at
  BEFORE UPDATE ON public.prototyping_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_firmware_requests_updated_at
  BEFORE UPDATE ON public.firmware_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_ondemand_requests_updated_at
  BEFORE UPDATE ON public.ondemand_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX IF NOT EXISTS consulting_requests_user_id_idx ON public.consulting_requests(user_id);
CREATE INDEX IF NOT EXISTS consulting_requests_status_idx ON public.consulting_requests(status);
CREATE INDEX IF NOT EXISTS consulting_requests_created_at_idx ON public.consulting_requests(created_at);

CREATE INDEX IF NOT EXISTS prototyping_requests_user_id_idx ON public.prototyping_requests(user_id);
CREATE INDEX IF NOT EXISTS prototyping_requests_status_idx ON public.prototyping_requests(status);
CREATE INDEX IF NOT EXISTS prototyping_requests_created_at_idx ON public.prototyping_requests(created_at);

CREATE INDEX IF NOT EXISTS firmware_requests_user_id_idx ON public.firmware_requests(user_id);
CREATE INDEX IF NOT EXISTS firmware_requests_status_idx ON public.firmware_requests(status);
CREATE INDEX IF NOT EXISTS firmware_requests_created_at_idx ON public.firmware_requests(created_at);

CREATE INDEX IF NOT EXISTS ondemand_requests_user_id_idx ON public.ondemand_requests(user_id);
CREATE INDEX IF NOT EXISTS ondemand_requests_status_idx ON public.ondemand_requests(status);
CREATE INDEX IF NOT EXISTS ondemand_requests_created_at_idx ON public.ondemand_requests(created_at);

-- ========================================
-- SETUP COMPLETE!
-- ========================================
-- Service request tables are ready!
-- 
-- Tables created:
-- - consulting_requests (8 question fields)
-- - prototyping_requests (8 question fields)
-- - firmware_requests (8 question fields)
-- - ondemand_requests (8 question fields)
--
-- Each table has:
-- ✅ User tracking (user_id, email, name)
-- ✅ Status management (pending, in_progress, completed, cancelled)
-- ✅ All 8 category-specific question fields
-- ✅ Consultation preference and scheduling
-- ✅ Admin notes and assignment
-- ✅ Timestamps (created_at, updated_at)
-- ✅ RLS policies (users see own, admins see all)
-- ========================================
