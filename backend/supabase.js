const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });
    console.log('⚡ Supabase Client initialized successfully connected to:', supabaseUrl);
  } catch (err) {
    console.warn('⚠️ Supabase init warning:', err.message);
    supabase = null;
  }
} else {
  console.log('ℹ️ Supabase credentials not set or incomplete in .env. Falling back seamlessly to local SQLite storage.');
}

module.exports = {
  supabase,
  isConfigured: () => Boolean(supabase)
};
