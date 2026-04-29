-- ==============================================================
-- Portfolio Full Setup Script
-- Combining Schema, RLS, Storage, and Initial Data
-- ==============================================================

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tables Definition
-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT,
  tagline TEXT,
  bio TEXT,
  profile_image_url TEXT,
  cv_url TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  socials JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  image_url TEXT,
  color TEXT,
  level TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Experience
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  logo_url TEXT,
  type TEXT,
  work_model TEXT DEFAULT 'On-site',
  period TEXT,
  status TEXT,
  status_color TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Education
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  degree TEXT NOT NULL,
  school TEXT NOT NULL,
  period TEXT,
  location TEXT,
  description TEXT,
  icon_type TEXT,
  logo_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT,
  link TEXT,
  tech_stack TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Project Images
CREATE TABLE IF NOT EXISTS project_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_main BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Certifications
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  issuer TEXT,
  issue_date TEXT,
  expiry_date TEXT,
  credential_url TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Detailed Traffic Stats (Per Page & Browser/Device)
CREATE TABLE IF NOT EXISTS traffic_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT UNIQUE NOT NULL,
  view_count INTEGER DEFAULT 0,
  desktop_count INTEGER DEFAULT 0,
  mobile_count INTEGER DEFAULT 0,
  tablet_count INTEGER DEFAULT 0,
  chrome_count INTEGER DEFAULT 0,
  safari_count INTEGER DEFAULT 0,
  firefox_count INTEGER DEFAULT 0,
  edge_count INTEGER DEFAULT 0,
  others_count INTEGER DEFAULT 0,
  last_viewed TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Daily Traffic (For Charts)
CREATE TABLE IF NOT EXISTS daily_traffic (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  view_count INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Legacy Site Stats (Monthly)
CREATE TABLE IF NOT EXISTS site_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month_year TEXT UNIQUE NOT NULL, -- Format: YYYY-MM
  view_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  login_bg_url TEXT,
  light_bg_color TEXT,
  light_text_color TEXT,
  light_primary_color TEXT,
  dark_bg_color TEXT,
  dark_text_color TEXT,
  dark_primary_color TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. RLS Policies
-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles read access" ON profiles FOR SELECT USING (true);
CREATE POLICY "Admin profiles full access" ON profiles FOR ALL USING (auth.role() = 'authenticated');

-- Skills
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public skills read access" ON skills FOR SELECT USING (true);
CREATE POLICY "Admin skills full access" ON skills FOR ALL USING (auth.role() = 'authenticated');

-- Experience
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public experience read access" ON experience FOR SELECT USING (true);
CREATE POLICY "Admin experience full access" ON experience FOR ALL USING (auth.role() = 'authenticated');

-- Education
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public education read access" ON education FOR SELECT USING (true);
CREATE POLICY "Admin education full access" ON education FOR ALL USING (auth.role() = 'authenticated');

-- Projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public projects read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Admin projects full access" ON projects FOR ALL USING (auth.role() = 'authenticated');

-- Project Images
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public project_images read access" ON project_images FOR SELECT USING (true);
CREATE POLICY "Admin project_images full access" ON project_images FOR ALL USING (auth.role() = 'authenticated');

-- Certifications
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public certifications read access" ON certifications FOR SELECT USING (true);
CREATE POLICY "Admin certifications full access" ON certifications FOR ALL USING (auth.role() = 'authenticated');

-- Traffic Stats
ALTER TABLE traffic_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can increment traffic_stats" ON traffic_stats FOR ALL USING (true) WITH CHECK (true);

-- Daily Traffic
ALTER TABLE daily_traffic ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can increment daily_traffic" ON daily_traffic FOR ALL USING (true) WITH CHECK (true);

-- Site Stats
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can increment views" ON site_stats FOR ALL USING (true) WITH CHECK (true);

-- Messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin messages full access" ON messages FOR ALL USING (auth.role() = 'authenticated');

-- Site Settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public site_settings read access" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin site_settings full access" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- 3. Storage Setup
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'portfolio-assets' );
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated' );
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING ( bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated' );
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING ( bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated' );

-- 4. Initial Data
-- Initial Stats
INSERT INTO site_stats (month_year, view_count) 
VALUES (to_char(now(), 'YYYY-MM'), 0)
ON CONFLICT (month_year) DO NOTHING;

INSERT INTO daily_traffic (date, view_count, unique_users) 
VALUES (CURRENT_DATE, 0, 0)
ON CONFLICT (date) DO NOTHING;
