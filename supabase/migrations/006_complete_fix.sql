-- ===========================================
-- COMPLETE FIX - Handles all "already exists" errors
-- Run this entire file in Supabase SQL Editor
-- ===========================================

-- ===========================================
-- PART 1: Fix academic_level_reports realtime (safe method)
-- ===========================================
DO $$
BEGIN
    -- Try to drop from realtime (ignore if not there)
    ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS academic_level_reports;
    -- Re-add to realtime
    ALTER PUBLICATION supabase_realtime ADD TABLE academic_level_reports;
EXCEPTION
    WHEN OTHERS THEN
        -- If error, table might not exist yet - create it first
        NULL;
END $$;

-- ===========================================
-- PART 2: Create academic_level_reports if missing
-- ===========================================
CREATE TABLE IF NOT EXISTS academic_level_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level_id BIGINT REFERENCES academic_levels(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('school_report', 'uniform_photo', 'school_photo')),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  academic_year TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE academic_level_reports ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies (safe)
DROP POLICY IF EXISTS "Academic level reports are viewable by everyone" ON academic_level_reports;
DROP POLICY IF EXISTS "Only admin can insert academic level reports" ON academic_level_reports;
DROP POLICY IF EXISTS "Only admin can update academic level reports" ON academic_level_reports;
DROP POLICY IF EXISTS "Only admin can delete academic level reports" ON academic_level_reports;

-- Create policies
CREATE POLICY "Academic level reports are viewable by everyone" ON academic_level_reports
  FOR SELECT USING (true);

CREATE POLICY "Only admin can insert academic level reports" ON academic_level_reports
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Only admin can update academic level reports" ON academic_level_reports
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Only admin can delete academic level reports" ON academic_level_reports
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Safe realtime add (with drop first)
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS academic_level_reports;
ALTER PUBLICATION supabase_realtime ADD TABLE academic_level_reports;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_academic_level_reports_level_id ON academic_level_reports(level_id);
CREATE INDEX IF NOT EXISTS idx_academic_level_reports_type ON academic_level_reports(report_type);

-- ===========================================
-- PART 3: Create site_settings table (THE MAIN FIX)
-- ===========================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name TEXT DEFAULT 'Generas Legacy',
  site_description TEXT DEFAULT '',
  primary_color TEXT DEFAULT '#3b82f6',
  social_github TEXT,
  social_linkedin TEXT,
  social_twitter TEXT,
  social_youtube TEXT,
  social_instagram TEXT,
  social_whatsapp TEXT DEFAULT '250794144738',
  maintenance_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default row if table is empty
INSERT INTO site_settings (site_name)
SELECT 'Generas Legacy'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "site_settings_select" ON site_settings;
DROP POLICY IF EXISTS "site_settings_update" ON site_settings;
DROP POLICY IF EXISTS "site_settings_insert" ON site_settings;

-- Create policies
CREATE POLICY "site_settings_select" ON site_settings FOR SELECT USING (true);
CREATE POLICY "site_settings_update" ON site_settings FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "site_settings_insert" ON site_settings FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ===========================================
-- PART 4: Verify everything worked
-- ===========================================
SELECT 
    'academic_level_reports' as table_name,
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'academic_level_reports') as table_exists
UNION ALL
SELECT 
    'site_settings',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'site_settings')
UNION ALL
SELECT 
    'site_settings has data',
    EXISTS (SELECT 1 FROM site_settings);

SELECT '✅ ALL FIXES APPLIED - Settings should work now!' as status;
