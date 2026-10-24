const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcrypt');

const db = new Database(path.join(__dirname, 'data.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables with rich attributes
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    department TEXT DEFAULT 'Municipal Administration',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    public_id TEXT UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    district TEXT NOT NULL,
    landmark TEXT,
    category TEXT NOT NULL DEFAULT 'Municipal Infrastructure',
    urgency TEXT NOT NULL DEFAULT 'Medium',
    status TEXT NOT NULL DEFAULT 'New',
    lat REAL DEFAULT 13.0827,
    lng REAL DEFAULT 80.2707,
    partner TEXT DEFAULT 'Greater Chennai Corporation',
    ai_summary TEXT,
    ai_category TEXT,
    ai_urgency TEXT,
    ai_recommendation TEXT,
    ai_confidence REAL DEFAULT 0.95,
    upvotes INTEGER DEFAULT 0,
    contact_name TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    photo_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS timeline (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    note TEXT,
    author TEXT DEFAULT 'System',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
  CREATE INDEX IF NOT EXISTS idx_reports_district ON reports(district);
  CREATE INDEX IF NOT EXISTS idx_timeline_report ON timeline(report_id);
`);

// Add missing columns if upgrading existing database
try { db.exec('ALTER TABLE reports ADD COLUMN ai_category TEXT'); } catch(e){}
try { db.exec('ALTER TABLE reports ADD COLUMN ai_urgency TEXT'); } catch(e){}
try { db.exec('ALTER TABLE reports ADD COLUMN ai_recommendation TEXT'); } catch(e){}
try { db.exec('ALTER TABLE reports ADD COLUMN ai_confidence REAL DEFAULT 0.95'); } catch(e){}
try { db.exec('ALTER TABLE reports ADD COLUMN upvotes INTEGER DEFAULT 0'); } catch(e){}

// Seed admin user
const adminCheck = db.prepare('SELECT id FROM admins WHERE email = ?').get('admin@tn.gov.in');
if (!adminCheck) {
  const hash = bcrypt.hashSync('Admin@1234', 10);
  db.prepare(`
    INSERT INTO admins (name, email, password_hash, role, department)
    VALUES (?, ?, ?, ?, ?)
  `).run('Tamil Nadu Nodal Administrator', 'admin@tn.gov.in', hash, 'superadmin', 'TNeGA & Municipal Administration');
  console.log('🛡️ Seeded default admin: admin@tn.gov.in');
}

// Seed initial reports if empty
const reportCount = db.prepare('SELECT COUNT(*) as count FROM reports').get().count;
if (reportCount === 0) {
  const insertReport = db.prepare(`
    INSERT INTO reports (
      public_id, title, description, district, landmark, category, urgency, status,
      lat, lng, partner, ai_summary, ai_category, ai_urgency, ai_recommendation,
      contact_name, contact_phone, contact_email, upvotes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertTimeline = db.prepare(`
    INSERT INTO timeline (report_id, status, note, author)
    VALUES (?, ?, ?, ?)
  `);

  const r1 = insertReport.run(
    'TNCR-101',
    'Major water pipeline burst flooding school road junction',
    'A massive municipal potable water transmission main has burst near the primary school intersection, creating knee-deep waterlogging, soil erosion, and severing tap supply to 300+ households.',
    'Chennai', 'Anna Salai, Teynampet Metro Gate 3', 'Water & drainage', 'High', 'In progress',
    13.0418, 80.2481, 'Anna University Civil Dept & CMWSSB',
    'High-pressure main rupture leading to severe water waste and traffic disruption.', 'Water & drainage', 'High',
    'Deploy CMWSSB emergency isolation valve crew and Anna Univ soil stabilization team.',
    'S. Ramachandran', '+91 98401 23456', 'ramachandran.s@example.com', 24
  );
  insertTimeline.run(r1.lastInsertRowid, 'New', 'Report filed by citizen via CIVICFORCE.', 'Citizen');
  insertTimeline.run(r1.lastInsertRowid, 'Under review', 'AI triage classified as High Urgency Water & Drainage hazard.', 'AI Engine');
  insertTimeline.run(r1.lastInsertRowid, 'Assigned', 'Assigned to CMWSSB Central Division & Anna University Civil Dept.', 'TN Admin');
  insertTimeline.run(r1.lastInsertRowid, 'In progress', 'Excavation team deployed on site to replace 600mm ductile iron sleeve.', 'Field Engineer');

  const r2 = insertReport.run(
    'TNCR-102',
    'Non-functional high mast streetlights near bus terminal',
    'Four consecutive LED streetlights and the central junction high mast have been inactive for 9 days, causing serious night commuting safety risks for women and factory workers.',
    'Coimbatore', 'Ukkadam Bus Terminal West Exit', 'Street lighting', 'Medium', 'Assigned',
    10.9931, 76.9612, 'PSG College of Technology & TANGEDCO',
    'Feeder pillar breaker tripping causing 400m dark corridor at major transit hub.', 'Street lighting', 'Medium',
    'Replace junction control timer and replace blown driver circuits.',
    'M. Kavitha', '+91 97890 54321', 'kavitha.cbe@example.com', 18
  );
  insertTimeline.run(r2.lastInsertRowid, 'New', 'Report filed by commuter.', 'Citizen');
  insertTimeline.run(r2.lastInsertRowid, 'Under review', 'Automated spatial clustering confirmed streetlight outage.', 'AI Engine');
  insertTimeline.run(r2.lastInsertRowid, 'Assigned', 'Dispatched to PSG Tech Smart Energy Cell and TANGEDCO.', 'TN Admin');

  const r3 = insertReport.run(
    'TNCR-103',
    'Illegal hazardous industrial chemical dumping in irrigation canal',
    'Untreated effluent tanker discharged pungent chemical sludge into the irrigation canal bed during early morning hours. Fish kill observed in downstream ponds.',
    'Tiruchirappalli', 'Kaveri Basin, Near Thiruverumbur', 'Waste management', 'Critical', 'Under review',
    10.7905, 78.7047, 'NIT Trichy Environmental Engineering & TNPCB',
    'Critical environmental contamination event threatening local groundwater and farming canals.', 'Waste management', 'Critical',
    'Immediately deploy TNPCB hazmat containment, collect water samples, notify local police.',
    'K. Anandhan', '+91 94432 11009', 'anandhan.trichy@example.com', 42
  );
  insertTimeline.run(r3.lastInsertRowid, 'New', 'Urgent environmental report filed.', 'Citizen');
  insertTimeline.run(r3.lastInsertRowid, 'Under review', 'AI Neural Engine flagged CRITICAL hazard level due to toxic runoff threat.', 'AI Engine');

  const r4 = insertReport.run(
    'TNCR-104',
    'Deep roadway crater and cave-in near Meenakshi Temple north gate',
    'Heavy monsoon showers collapsed the culvert trench cover, leaving an unbarricaded 4-foot deep pit right on the pedestrian festival chariot route.',
    'Madurai', 'Chithirai Street, North Gopuram', 'Roads & infrastructure', 'High', 'New',
    9.9252, 78.1198, 'Thiagarajar College of Engg & Madurai Corp',
    'Structural culvert collapse creating immediate pedestrian and light vehicular hazard.', 'Roads & infrastructure', 'High',
    'Erect barricades immediately; execute quick-curing cementitious gravel fill.',
    'V. Meenakshi Sundaram', '+91 98421 88776', 'sundaram.madurai@example.com', 31
  );
  insertTimeline.run(r4.lastInsertRowid, 'New', 'Report submitted with geo-coordinates.', 'Citizen');

  console.log('🌱 Seeded rich initial Tamil Nadu societal challenges into SQLite.');
}

module.exports = db;