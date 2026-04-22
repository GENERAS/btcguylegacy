-- Safe migration: Create site_settings table only
-- Run this in Supabase SQL Editor

-- Create site_settings table (idempotent)
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
INSERT INTO site_settings (id, site_name)
SELECT '00000000-0000-0000-0000-000000000001', 'Generas Legacy'
WHERE NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1);

-- Enable RLS (safe to run multiple times)
DO $$
BEGIN
    -- Enable RLS
    ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies to avoid conflicts
    DROP POLICY IF EXISTS "Site settings are viewable by everyone" ON site_settings;
    DROP POLICY IF EXISTS "Only admin can update site settings" ON site_settings;
    
    -- Create policies
    CREATE POLICY "Site settings are viewable by everyone" 
    ON site_settings FOR SELECT USING (true);
    
    CREATE POLICY "Only admin can update site settings" 
    ON site_settings FOR UPDATE USING (
      EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error setting up RLS: %', SQLERRM;
END $$;

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for site_settings
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
