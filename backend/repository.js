const { supabase, isConfigured } = require('./supabase');
const db = require('./db');

class CivicRepository {
  /**
   * Get all reports with optional filtering
   */
  async getAllReports(filters = {}) {
    if (isConfigured()) {
      try {
        let query = supabase.from('reports').select('*, timeline(*)').order('created_at', { ascending: false });
        if (filters.district) query = query.eq('district', filters.district);
        if (filters.category) query = query.eq('category', filters.category);
        if (filters.status) query = query.eq('status', filters.status);
        if (filters.urgency) query = query.eq('urgency', filters.urgency);

        const { data, error } = await query;
        if (!error && data) return data;
        console.warn('⚠️ Supabase select fallback:', error?.message);
      } catch (err) {
        console.warn('⚠️ Supabase query error, falling back to SQLite:', err.message);
      }
    }

    // Fallback: SQLite
    let sql = 'SELECT * FROM reports WHERE 1=1';
    const params = [];
    if (filters.district) { sql += ' AND district = ?'; params.push(filters.district); }
    if (filters.category) { sql += ' AND category = ?'; params.push(filters.category); }
    if (filters.status) { sql += ' AND status = ?'; params.push(filters.status); }
    if (filters.urgency) { sql += ' AND urgency = ?'; params.push(filters.urgency); }
    sql += ' ORDER BY id DESC';

    const reports = db.prepare(sql).all(...params);
    const getTimeline = db.prepare('SELECT status, note, author, created_at as date FROM timeline WHERE report_id = ? ORDER BY id DESC');

    return reports.map(r => ({
      ...r,
      timeline: getTimeline.all(r.id)
    }));
  }

  /**
   * Get a single report by ID or public_id
   */
  async getReportById(idOrPublicId) {
    if (isConfigured()) {
      try {
        const isNumeric = /^\d+$/.test(idOrPublicId);
        const query = supabase
          .from('reports')
          .select('*, timeline(*)')
          .eq(isNumeric ? 'id' : 'public_id', idOrPublicId)
          .single();

        const { data, error } = await query;
        if (!error && data) return data;
      } catch (err) {
        console.warn('⚠️ Supabase single report fetch fallback:', err.message);
      }
    }

    const isNumeric = /^\d+$/.test(idOrPublicId);
    const report = isNumeric
      ? db.prepare('SELECT * FROM reports WHERE id = ?').get(idOrPublicId)
      : db.prepare('SELECT * FROM reports WHERE public_id = ?').get(idOrPublicId);

    if (!report) return null;

    const timeline = db.prepare('SELECT status, note, author, created_at as date FROM timeline WHERE report_id = ? ORDER BY id DESC').all(report.id);
    return {
      ...report,
      timeline
    };
  }

  /**
   * Create a new civic report with AI triage and timeline seed
   */
  async createReport(reportData) {
    const publicId = `TNCR-${Math.floor(1000 + Math.random() * 9000)}`;

    if (isConfigured()) {
      try {
        const { data: newReport, error } = await supabase
          .from('reports')
          .insert([{
            public_id: publicId,
            title: reportData.title,
            description: reportData.description,
            district: reportData.district,
            landmark: reportData.landmark || 'General Area',
            category: reportData.category,
            urgency: reportData.urgency || 'Medium',
            status: 'New',
            lat: reportData.lat || 13.0827,
            lng: reportData.lng || 80.2707,
            partner: reportData.partner || 'Tamil Nadu Municipal R&D Board',
            contact_name: reportData.contact_name,
            contact_phone: reportData.contact_phone,
            contact_email: reportData.contact_email,
            ai_summary: reportData.ai_summary,
            ai_category: reportData.ai_category,
            ai_urgency: reportData.ai_urgency,
            ai_recommendation: reportData.ai_recommendation,
            ai_confidence: reportData.ai_confidence || 0.95
          }])
          .select()
          .single();

        if (!error && newReport) {
          await supabase.from('timeline').insert([{
            report_id: newReport.id,
            status: 'New',
            note: 'Report submitted by citizen via CIVICFORCE platform.',
            author: 'Citizen'
          }]);
          if (reportData.ai_summary) {
            await supabase.from('timeline').insert([{
              report_id: newReport.id,
              status: 'Under review',
              note: `AI Triage: ${reportData.ai_summary}`,
              author: 'AI Engine'
            }]);
          }
          return newReport;
        }
      } catch (err) {
        console.warn('⚠️ Supabase createReport fallback:', err.message);
      }
    }

    // Fallback: SQLite
    const insert = db.prepare(`
      INSERT INTO reports (
        public_id, title, description, district, landmark, category, urgency, status,
        lat, lng, partner, contact_name, contact_phone, contact_email,
        ai_summary, ai_category, ai_urgency, ai_recommendation, ai_confidence
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      publicId,
      reportData.title,
      reportData.description,
      reportData.district,
      reportData.landmark || 'General Area',
      reportData.category || 'Municipal Infrastructure',
      reportData.urgency || 'Medium',
      'New',
      reportData.lat || 13.0827,
      reportData.lng || 80.2707,
      reportData.partner || 'Tamil Nadu Municipal Administration',
      reportData.contact_name || '',
      reportData.contact_phone || '',
      reportData.contact_email || '',
      reportData.ai_summary || '',
      reportData.ai_category || '',
      reportData.ai_urgency || '',
      reportData.ai_recommendation || '',
      reportData.ai_confidence || 0.95
    );

    const reportId = result.lastInsertRowid;
    const addTimeline = db.prepare('INSERT INTO timeline (report_id, status, note, author) VALUES (?, ?, ?, ?)');
    addTimeline.run(reportId, 'New', 'Report submitted by citizen via CIVICFORCE platform.', 'Citizen');

    if (reportData.ai_summary) {
      addTimeline.run(reportId, 'Under review', `AI Triage: ${reportData.ai_summary}`, 'AI Engine');
    }

    return this.getReportById(reportId);
  }

  /**
   * Update report fields and append timeline event
   */
  async updateReport(id, updates, author = 'Admin') {
    if (isConfigured()) {
      try {
        const { data, error } = await supabase
          .from('reports')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          if (updates.note || updates.status) {
            await supabase.from('timeline').insert([{
              report_id: id,
              status: updates.status || data.status,
              note: updates.note || `Status updated to ${updates.status || data.status}`,
              author
            }]);
          }
          return data;
        }
      } catch (err) {
        console.warn('⚠️ Supabase update fallback:', err.message);
      }
    }

    // Fallback: SQLite
    const existing = db.prepare('SELECT * FROM reports WHERE id = ?').get(id);
    if (!existing) return null;

    const fields = [];
    const values = [];

    const allowed = ['title', 'district', 'landmark', 'description', 'category', 'urgency', 'status', 'partner', 'ai_summary'];
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    }

    if (fields.length > 0) {
      values.push(id);
      db.prepare(`UPDATE reports SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values);
    }

    if (updates.note || (updates.status && updates.status !== existing.status)) {
      db.prepare('INSERT INTO timeline (report_id, status, note, author) VALUES (?, ?, ?, ?)').run(
        id,
        updates.status || existing.status,
        updates.note || `Status updated to ${updates.status || existing.status} by ${author}`,
        author
      );
    }

    return this.getReportById(id);
  }

  /**
   * Upvote a report (Neighbor endorsement)
   */
  async upvoteReport(id) {
    if (isConfigured()) {
      try {
        const { data } = await supabase.rpc('increment_upvotes', { report_row_id: id });
        if (data) return data;
      } catch (e) {}
    }
    db.prepare('UPDATE reports SET upvotes = upvotes + 1 WHERE id = ?').run(id);
    return this.getReportById(id);
  }

  /**
   * Get executive stats for dashboard
   */
  async getStats() {
    const reports = await this.getAllReports();
    const total = reports.length;
    const resolved = reports.filter(r => r.status === 'Resolved').length;
    const inProgress = reports.filter(r => r.status === 'In progress').length;
    const underReview = reports.filter(r => r.status === 'Under review').length;
    const critical = reports.filter(r => r.urgency === 'Critical' || r.urgency === 'High').length;
    const uniqueDistricts = new Set(reports.map(r => r.district)).size;

    return {
      total,
      resolved,
      inProgress,
      underReview,
      critical,
      activeDistricts: uniqueDistricts,
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
      avgResolutionDays: '3.4 days'
    };
  }

  /**
   * Find admin user by email
   */
  async getAdminByEmail(email) {
    if (isConfigured()) {
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', email)
          .single();
        if (!error && data) return data;
      } catch (e) {}
    }

    return db.prepare('SELECT * FROM admins WHERE email = ?').get(email);
  }
}

module.exports = new CivicRepository();
