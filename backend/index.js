const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const repo = require('./repository');
const { analyzeCivicIssue } = require('./ai_engine');
const { isConfigured: isSupabaseConfigured } = require('./supabase');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'civicforce_secret_jwt_key_tamil_nadu_2026';

app.use(cors());
app.use(express.json({ limit: '20mb' }));

// Helper: Serialize report to the standard CIVICFORCE contract
function serializeReport(r) {
  if (!r) return null;
  const publicId = r.public_id || `TNCR-${r.id}`;
  return {
    id: publicId,
    public_id: publicId,
    uuid: String(r.id),
    title: r.title,
    description: r.description,
    district: r.district,
    category: r.category,
    urgency: (r.urgency === 'Critical' || r.urgency === 'High') ? 'High' : 'Normal',
    raw_urgency: r.urgency || 'Normal',
    status: r.status,
    landmark: r.landmark || null,
    pincode: r.pincode || null,
    lat: r.lat !== undefined ? Number(r.lat) : 13.0827,
    lng: r.lng !== undefined ? Number(r.lng) : 80.2707,
    partner: r.partner || null,
    ai_summary: r.ai_summary || '',
    contact_name: r.contact_name || null,
    contact_phone: r.contact_phone || null,
    contact_email: r.contact_email || null,
    created_at: r.created_at || new Date().toISOString(),
    votes: r.upvotes || 0,
    photo_count: r.photo_count || 0,
    timeline: (r.timeline || []).map(t => ({
      status: t.status,
      date: t.date || t.created_at || new Date().toISOString().slice(0, 10),
      note: t.note || ''
    }))
  };
}

// Middleware: Authenticate Admin JWT
function verifyAdminToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Access denied. Administrative token required.' }
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      error: { code: 'FORBIDDEN', message: 'Session expired or invalid token. Please sign in again.' }
    });
  }
}

// -------------------------------------------------------------
// PUBLIC CITIZEN ENDPOINTS
// -------------------------------------------------------------

// 1. Health & Integration Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'CIVICFORCE - Tamil Nadu Societal Challenge Platform',
    version: '2.0.0-PROD',
    supabase_connected: isSupabaseConfigured(),
    ai_engine: process.env.GROQ_API_KEY ? 'Groq Llama-3.3-70b Cloud' : (process.env.GEMINI_API_KEY ? 'Google Gemini 1.5 Flash' : 'Civic Heuristic Neural Engine (Built-in)'),
    timestamp: new Date().toISOString()
  });
});

// 2. Platform Stats
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await repo.getStats();
    res.json(stats);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to compute platform stats' } });
  }
});

// 3. Get All Reports (with filters: district, category, status, urgency, pincode, search)
app.get('/api/reports', async (req, res) => {
  try {
    const { district, category, status, urgency, search, limit, offset, sort } = req.query;
    let reports = await repo.getAllReports({ district, category, status, urgency });

    if (search) {
      const q = search.toLowerCase();
      reports = reports.filter(r =>
        r.title?.toLowerCase().includes(q) ||
        r.public_id?.toLowerCase().includes(q) ||
        r.district?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)
      );
    }

    if (sort === 'votes') {
      reports.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    } else if (sort === 'oldest') {
      reports.sort((a, b) => a.id - b.id);
    }

    const total = reports.length;
    const l = parseInt(limit) || total;
    const o = parseInt(offset) || 0;
    const paginated = reports.slice(o, o + l).map(serializeReport);

    res.json({
      data: paginated,
      meta: {
        total,
        limit: l,
        offset: o,
        count: paginated.length
      }
    });
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch civic reports' } });
  }
});

// 4. Get Single Report by ID or Public ID (e.g. TNCR-101 or numeric id)
app.get('/api/reports/:id', async (req, res) => {
  try {
    const report = await repo.getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Societal challenge report not found' }
      });
    }
    res.json({ data: serializeReport(report) });
  } catch (err) {
    console.error('Error fetching report details:', err);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to retrieve report' } });
  }
});

// 5. Standalone AI Analysis Preview for Citizen Report Wizard
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const { title, description, district, landmark } = req.body;
    if (!description && !title) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Title or description required for AI analysis' } });
    }

    const aiResult = await analyzeCivicIssue(title, description, district, landmark);
    res.json(aiResult);
  } catch (err) {
    console.error('Error in AI analysis endpoint:', err);
    res.status(500).json({ error: { code: 'AI_ERROR', message: 'AI analysis failed' } });
  }
});

// 6. Submit New Report (Citizen Submission with Automatic AI Triage)
app.post('/api/reports', async (req, res) => {
  try {
    const {
      title, description, district, landmark, pincode,
      lat, lng, contact_name, contact_phone, contact_email,
      category, urgency, partner, photos
    } = req.body;

    if (!title || !description || !district) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Title, description, and district are mandatory fields.' }
      });
    }

    console.log(`📡 Analyzing incoming report with AI engine: "${title}" [${district}]`);

    // Run AI Triage Engine
    const aiTriage = await analyzeCivicIssue(title, description, district, landmark);

    const reportData = {
      title,
      description,
      district,
      landmark: landmark || 'General Area',
      pincode: pincode || null,
      category: category || aiTriage.detected_category,
      urgency: urgency || aiTriage.urgency,
      partner: partner || aiTriage.recommended_partner,
      lat: lat ? parseFloat(lat) : 13.0827,
      lng: lng ? parseFloat(lng) : 80.2707,
      contact_name: contact_name || '',
      contact_phone: contact_phone || '',
      contact_email: contact_email || '',
      ai_summary: aiTriage.ai_summary,
      ai_category: aiTriage.detected_category,
      ai_urgency: aiTriage.urgency,
      ai_recommendation: aiTriage.recommended_action,
      ai_confidence: aiTriage.confidence_score || 0.95
    };

    const newReport = await repo.createReport(reportData);
    console.log(`✅ New report recorded: ${newReport.public_id} (${newReport.category} / ${newReport.urgency})`);
    res.status(201).json({ data: serializeReport(newReport) });
  } catch (err) {
    console.error('Error creating report:', err);
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Server error while recording report.' } });
  }
});

// 7. Upvote / Vote Endpoints
app.post('/api/reports/:id/vote', async (req, res) => {
  try {
    const updated = await repo.upvoteReport(req.params.id);
    const votes = updated ? (updated.upvotes || 1) : 1;
    res.json({ data: { votes } });
  } catch (err) {
    res.status(500).json({ error: { code: 'VOTE_ERROR', message: 'Failed to register vote' } });
  }
});

app.post('/api/reports/:id/upvote', async (req, res) => {
  try {
    const updated = await repo.upvoteReport(req.params.id);
    res.json({ data: serializeReport(updated) });
  } catch (err) {
    res.status(500).json({ error: { code: 'VOTE_ERROR', message: 'Failed to register upvote' } });
  }
});

// 8. Attach Photos
app.post('/api/reports/:id/photos', (req, res) => {
  const count = req.body?.photos?.length || 1;
  res.json({
    data: [],
    meta: { photo_count: count }
  });
});

// -------------------------------------------------------------
// SECURE ADMIN ENDPOINTS (Guarded by verifyAdminToken)
// -------------------------------------------------------------

// 9. Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Email and password required' } });
    }

    const admin = await repo.getAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid admin credentials' } });
    }

    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) {
      return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid admin credentials' } });
    }

    const adminUser = {
      id: String(admin.id),
      email: admin.email,
      name: admin.name,
      role: admin.role || 'admin',
      department: admin.department || 'Municipal Administration'
    };

    const token = jwt.sign(adminUser, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      role: adminUser.role,
      admin: adminUser
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: { code: 'AUTH_ERROR', message: 'Authentication failed' } });
  }
});

// 10. Verify / Validate Current Admin Session
app.get('/api/admin/me', verifyAdminToken, (req, res) => {
  res.json({
    data: {
      id: String(req.admin.id),
      email: req.admin.email,
      name: req.admin.name,
      role: req.admin.role || 'admin'
    }
  });
});

app.get('/api/admin/verify', verifyAdminToken, (req, res) => {
  res.json({
    valid: true,
    admin: req.admin
  });
});

// 11. Admin Statistics Counter
app.get('/api/admin/stats', verifyAdminToken, async (req, res) => {
  try {
    const allReports = await repo.getAllReports();
    const byStatus = {};
    const byDistrict = {};

    allReports.forEach(r => {
      byStatus[r.status] = (byStatus[r.status] || 0) + 1;
      byDistrict[r.district] = (byDistrict[r.district] || 0) + 1;
    });

    res.json({
      data: {
        total: allReports.length,
        byStatus,
        byDistrict
      }
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ error: { code: 'STATS_ERROR', message: 'Failed to fetch admin stats' } });
  }
});

// 12. Update Report Status & Timeline Note
app.patch('/api/reports/:id/status', verifyAdminToken, async (req, res) => {
  try {
    const { status, note } = req.body;
    const author = req.admin?.name || 'Authorized Admin';

    const id = req.params.id;
    const updated = await repo.updateReport(parseInt(id) || id, { status, note }, author);
    if (!updated) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Report not found' } });
    }
    res.json({ data: serializeReport(updated) });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: { code: 'UPDATE_ERROR', message: 'Failed to update report status' } });
  }
});

// 13. Full Report Update (Protected)
app.put('/api/reports/:id', verifyAdminToken, async (req, res) => {
  try {
    const author = req.admin?.name || 'Authorized Admin';
    const id = req.params.id;
    const updated = await repo.updateReport(parseInt(id) || id, req.body, author);
    if (!updated) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Report not found' } });
    }
    res.json({ data: serializeReport(updated) });
  } catch (err) {
    console.error('Error updating report:', err);
    res.status(500).json({ error: { code: 'UPDATE_ERROR', message: 'Failed to update report' } });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 CIVICFORCE Enterprise Backend Running on port ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`💾 Storage: ${isSupabaseConfigured() ? 'Supabase Cloud DB' : 'SQLite WAL Engine (Local)'}`);
  console.log(`🤖 AI Engine: ${process.env.GROQ_API_KEY ? 'Groq Llama-3.3-70b Cloud' : 'Civic Heuristic Neural Engine'}`);
  console.log(`=======================================================`);
});