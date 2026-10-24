-- ========================================================
-- CIVICFORCE: Tamil Nadu Societal Challenge Platform
-- Supabase Database Schema & Initial Migration
-- ========================================================

-- 1. Create Admins Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'department_officer')),
  department TEXT DEFAULT 'Municipal Administration',
  district TEXT DEFAULT 'Chennai',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id BIGSERIAL PRIMARY KEY,
  public_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  district TEXT NOT NULL,
  landmark TEXT,
  category TEXT NOT NULL DEFAULT 'Municipal Infrastructure',
  urgency TEXT NOT NULL DEFAULT 'Medium' CHECK (urgency IN ('Critical', 'High', 'Medium', 'Low')),
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Under review', 'Assigned', 'In progress', 'Resolved', 'Rejected')),
  lat DOUBLE PRECISION DEFAULT 13.0827,
  lng DOUBLE PRECISION DEFAULT 80.2707,
  partner TEXT DEFAULT 'Greater Chennai Corporation',
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  photo_url TEXT,
  
  -- AI Model Triage Fields
  ai_summary TEXT,
  ai_category TEXT,
  ai_urgency TEXT,
  ai_confidence REAL DEFAULT 0.95,
  ai_recommendation TEXT,
  upvotes INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Timeline Events Table
CREATE TABLE IF NOT EXISTS timeline (
  id BIGSERIAL PRIMARY KEY,
  report_id BIGINT REFERENCES reports(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT NOT NULL,
  author TEXT DEFAULT 'System Automated',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Indices for Performance
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_district ON reports(district);
CREATE INDEX IF NOT EXISTS idx_reports_category ON reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_urgency ON reports(urgency);
CREATE INDEX IF NOT EXISTS idx_reports_created ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_timeline_report_id ON timeline(report_id);

-- 5. Row Level Security (RLS)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow public read access to civic reports
CREATE POLICY "Public reports viewable by everyone" 
  ON reports FOR SELECT USING (true);

-- Allow citizens to submit new reports
CREATE POLICY "Citizens can insert reports" 
  ON reports FOR INSERT WITH CHECK (true);

-- Allow public read access to report timeline
CREATE POLICY "Public timeline viewable by everyone" 
  ON timeline FOR SELECT USING (true);

-- Allow public timeline insert
CREATE POLICY "Public timeline insert" 
  ON timeline FOR INSERT WITH CHECK (true);

-- Allow updates (for admin operations via Service Role or Authenticated users)
CREATE POLICY "Full access with service role" 
  ON reports FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Timeline full access" 
  ON timeline FOR ALL USING (true) WITH CHECK (true);

-- 6. Seed Sample Civic Challenges for Tamil Nadu
INSERT INTO reports (
  public_id, title, description, district, landmark, category, urgency, status, 
  lat, lng, partner, contact_name, contact_phone, ai_summary, ai_urgency, ai_recommendation
) VALUES 
(
  'TNCR-101', 
  'Major water pipeline burst flooding school road junction',
  'A massive municipal potable water transmission main has burst near the primary school intersection, creating knee-deep waterlogging, soil erosion, and severing tap supply to 300+ households.',
  'Chennai', 'Anna Salai, Teynampet Metro Gate 3', 'Water & drainage', 'High', 'In progress',
  13.0418, 80.2481, 'Anna University Civil Dept & CMWSSB', 'S. Ramachandran', '+91 98401 23456',
  'High-pressure main rupture leading to severe water waste and traffic disruption.', 'High',
  'Deploy TWAD/CMWSSB emergency isolation valve crew and Anna Univ soil stabilization team.'
),
(
  'TNCR-102', 
  'Non-functional high mast streetlights near bus terminal',
  'Four consecutive LED streetlights and the central junction high mast have been inactive for 9 days, causing serious night commuting safety risks for women and factory workers.',
  'Coimbatore', 'Ukkadam Bus Terminal West Exit', 'Street lighting', 'Medium', 'Assigned',
  10.9931, 76.9612, 'PSG College of Technology & TANGEDCO', 'M. Kavitha', '+91 97890 54321',
  'Feeder pillar breaker tripping causing 400m dark corridor at major transit hub.', 'Medium',
  'Replace junction control timer and replace blown driver circuits.'
),
(
  'TNCR-103', 
  'Illegal hazardous industrial chemical dumping in stream basin',
  'Untreated effluent tanker discharged pungent chemical sludge into the irrigation canal bed during early morning hours. Fish kill observed in downstream ponds.',
  'Tiruchirappalli', 'Kaveri Basin, Near Thiruverumbur', 'Waste management', 'Critical', 'Under review',
  10.7905, 78.7047, 'NIT Trichy Environmental Engineering & TNPCB', 'K. Anandhan', '+91 94432 11009',
  'Critical environmental contamination event threatening local groundwater and farming canals.', 'Critical',
  'Immediately deploy TNPCB hazmat containment, collect water samples, notify local police.'
),
(
  'TNCR-104', 
  'Deep roadway crater and cave-in near Meenakshi Temple north gate',
  'Heavy monsoon showers collapsed the culvert trench cover, leaving an unbarricaded 4-foot deep pit right on the pedestrian festival chariot route.',
  'Madurai', 'Chithirai Street, North Gopuram', 'Roads & infrastructure', 'High', 'New',
  9.9252, 78.1198, 'Thiagarajar College of Engg & Madurai Corp', 'V. Meenakshi Sundaram', '+91 98421 88776',
  'Structural culvert collapse creating immediate pedestrian and light vehicular hazard.', 'High',
  'Erect barricades immediately; execute quick-curing cementitious gravel fill.'
)
ON CONFLICT (public_id) DO NOTHING;
