-- Migration: Create settings tables for admin control
-- Run this in Supabase SQL Editor

-- 1. Expand profiles table with public and private fields
ALTER TABLE IF EXISTS profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS job_title TEXT DEFAULT 'Full-Stack Developer & Trader',
ADD COLUMN IF NOT EXISTS headline TEXT DEFAULT 'Turn Your Ideas Into Revenue',
ADD COLUMN IF NOT EXISTS subheadline TEXT DEFAULT 'Full-Stack Developer & Trader helping businesses grow with battle-tested solutions.',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Create site_settings table for global configuration
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name TEXT DEFAULT 'Generas Legacy',
  site_description TEXT DEFAULT 'Generas Kagiraneza - Full-Stack Developer, Crypto & Forex Trader, Entrepreneur',
  maintenance_mode BOOLEAN DEFAULT FALSE,
  primary_color TEXT DEFAULT '#3b82f6',
  -- Social links (all public)
  social_github TEXT,
  social_linkedin TEXT,
  social_twitter TEXT,
  social_youtube TEXT,
  social_instagram TEXT,
  social_whatsapp TEXT DEFAULT '250794144738',
  -- API Keys (keep these secret!)
  api_resend TEXT, -- encrypted or use environment variables instead
  api_google_analytics TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Insert default site settings (only one row needed)
INSERT INTO site_settings (id, site_name)
VALUES ('00000000-0000-0000-0000-000000000001', 'Generas Legacy')
ON CONFLICT (id) DO NOTHING;

-- 4. Create storage bucket for avatars (run in Storage section of Supabase)
-- Note: You'll need to create 'avatars' bucket manually in Supabase Dashboard
-- with public access enabled

-- 5. Set up RLS policies for profiles
-- Public can view basic profile info
CREATE POLICY IF NOT EXISTS "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

-- Only authenticated user can update their own profile
CREATE POLICY IF NOT EXISTS "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- 6. Set up RLS policies for site_settings
-- Public can view site settings
CREATE POLICY IF NOT EXISTS "Site settings are viewable by everyone" 
ON site_settings FOR SELECT 
USING (true);

-- Only admin can update site settings
CREATE POLICY IF NOT EXISTS "Only admin can update site settings" 
ON site_settings FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

-- 7. Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Create triggers for auto-updating timestamps
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
