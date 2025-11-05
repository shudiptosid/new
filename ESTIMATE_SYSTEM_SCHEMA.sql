-- ======================================================
-- ESTIMATE SYSTEM DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ======================================================

-- Create project_estimates table
CREATE TABLE IF NOT EXISTS project_estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID, -- Optional reference to service request (no FK constraint)
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  admin_id UUID REFERENCES auth.users(id),
  
  -- Estimate data stored as JSON
  estimate_data JSONB NOT NULL,
  /* JSON structure:
  {
    "components": [
      {
        "id": "MCU-01",
        "name": "Arduino Uno",
        "category": "MCU",
        "quantity": 1,
        "price": 450,
        "total": 450
      }
    ],
    "subtotal": 695,
    "tax": 0,
    "total": 695,
    "timeline": "7-10 working days",
    "notes": "Custom notes from admin"
  }
  */
  
  -- Status tracking
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'approved', 'rejected')),
  
  -- PDF and email tracking
  pdf_url TEXT,
  email_sent_at TIMESTAMPTZ,
  
  -- Validity period
  valid_until DATE DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_estimates_request_id ON project_estimates(request_id);
CREATE INDEX IF NOT EXISTS idx_estimates_customer_id ON project_estimates(customer_id);
CREATE INDEX IF NOT EXISTS idx_estimates_status ON project_estimates(status);
CREATE INDEX IF NOT EXISTS idx_estimates_created_at ON project_estimates(created_at DESC);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_estimate_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_estimate_timestamp ON project_estimates;
CREATE TRIGGER update_estimate_timestamp
  BEFORE UPDATE ON project_estimates
  FOR EACH ROW
  EXECUTE FUNCTION update_estimate_updated_at();

-- Enable Row Level Security
ALTER TABLE project_estimates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Admins can do everything
CREATE POLICY "Admins can manage all estimates"
  ON project_estimates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Customers can view their own estimates
CREATE POLICY "Customers can view own estimates"
  ON project_estimates
  FOR SELECT
  USING (customer_id = auth.uid());

-- ======================================================
-- VERIFICATION QUERY
-- Run this after import to verify table created
-- ======================================================
-- SELECT * FROM project_estimates LIMIT 5;

COMMENT ON TABLE project_estimates IS 'Stores cost estimates for customer service requests';
COMMENT ON COLUMN project_estimates.estimate_data IS 'JSON object containing component details, totals, and timeline';
COMMENT ON COLUMN project_estimates.status IS 'Estimate workflow status: draft, sent, viewed, approved, rejected';
COMMENT ON COLUMN project_estimates.valid_until IS 'Date until which the estimate prices are valid';
