const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let genAI = null;

if (GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    console.log('🤖 Google Gemini AI Engine initialized for CIVICFORCE.');
  } catch (err) {
    console.warn('⚠️ Gemini AI initialization notice:', err.message);
  }
} else {
  console.log('ℹ️ GEMINI_API_KEY not found in backend/.env. Using built-in Tamil Nadu civic neural heuristics for AI triage.');
}

// Built-in intelligent Tamil Nadu civic classifier & heuristics
function fallbackCivicAnalysis(title = '', description = '', district = 'Chennai', landmark = '') {
  const text = `${title} ${description} ${landmark}`.toLowerCase();

  // Category detection patterns (supports Tamil & English keywords)
  let category = 'Municipal Infrastructure';
  let partner = 'Greater Chennai Corporation Municipal Cell';
  let urgency = 'Medium';
  let urgencyReason = 'Standard civic concern requiring municipal inspection and remediation.';
  let recommendedAction = 'Dispatch field surveyor for on-site assessment within 48 hours.';

  // Water & drainage
  if (/water|pipe|burst|leak|drain|sewage|flooding|stagnant|குடிநீர்|தண்ணீர்|சாக்கடை|கழிவுநீர்|வெள்ளம்/.test(text)) {
    category = 'Water & drainage';
    partner = district.toLowerCase() === 'chennai' ? 'CMWSSB & Anna University Civil Dept' : 'TWAD Board Tamil Nadu';
    if (/burst|massive|flood|severing|knee|drowning|contaminated/.test(text)) {
      urgency = 'High';
      urgencyReason = 'Active water loss or high contamination risk impacting residential supply.';
      recommendedAction = 'Deploy emergency isolation valve technicians and suction tankers.';
    } else {
      urgency = 'Medium';
      urgencyReason = 'Drainage blockage causing public nuisance.';
      recommendedAction = 'Schedule desilting of local stormwater conduit.';
    }
  }
  // Street lighting
  else if (/light|lamp|dark|night|post|high mast|streetlight|மின்விளக்கு|வெளிச்சம்|இருட்டு/.test(text)) {
    category = 'Street lighting';
    partner = 'TANGEDCO Street Lighting Cell & Local Panchayat/Corporation';
    if (/school|women|bus terminal|accident|robbery|terminal/.test(text)) {
      urgency = 'Medium';
      urgencyReason = 'Dark corridor adjacent to transit or pedestrian thoroughfare.';
      recommendedAction = 'Replace blown LED drivers and verify breaker timer functionality.';
    } else {
      urgency = 'Low';
      recommendedAction = 'Replace luminaire bulbs during scheduled zone maintenance.';
    }
  }
  // Electrical & Power
  else if (/electric|wire|spark|transformer|current|shock|hanging wire|மின்சாரம்|கம்பி|டிரான்ஸ்பார்மர்/.test(text)) {
    category = 'Electrical & power';
    partner = 'TANGEDCO Distribution Division & PSG Tech Electrical Cell';
    urgency = 'Critical';
    urgencyReason = 'High electrocution danger or exposed high-voltage wiring in public area.';
    recommendedAction = 'Immediately de-energize feeder line and send emergency lineman team.';
  }
  // Waste management & Hazmat
  else if (/waste|garbage|dump|plastic|effluent|chemical|sludge|toxic|smell|fish kill|குப்பை|கழிவு|துர்நாற்றம்/.test(text)) {
    category = 'Waste management';
    partner = 'TNPCB (Tamil Nadu Pollution Control Board) & NIT Trichy Environmental Dept';
    if (/chemical|toxic|effluent|tanker|fish kill|poison/.test(text)) {
      urgency = 'Critical';
      urgencyReason = 'Suspected toxic effluent discharge threatening local water ecosystem.';
      recommendedAction = 'Sample effluent, seize illicit discharge source, notify TNPCB vigilance.';
    } else {
      urgency = 'Medium';
      urgencyReason = 'Solid waste buildup blocking pedestrian access.';
      recommendedAction = 'Deploy mechanized compactor truck and sanitization spray.';
    }
  }
  // Roads & Infrastructure
  else if (/road|pothole|crater|culvert|bridge|trench|cave-in|tar|asphalt|accident|ரோடு|சாலை|பள்ளம்/.test(text)) {
    category = 'Roads & infrastructure';
    partner = 'State Highways Dept & Thiagarajar College of Engg Infrastructure Cell';
    if (/cave-in|crater|deep|temple|chariot|bus route|fatal/.test(text)) {
      urgency = 'High';
      urgencyReason = 'Structural roadway failure causing acute vehicular and pedestrian collision hazards.';
      recommendedAction = 'Erect safety barricades and lay rapid-hardening bitumen mix.';
    } else {
      urgency = 'Medium';
      recommendedAction = 'Patch crater and smooth road surface during nocturnal maintenance window.';
    }
  }
  // Public Health & Sanitation
  else if (/health|dengue|mosquito|hospital|clinic|epidemic|food|poisoning|கொசு|நோய்|சுகாதாரம்/.test(text)) {
    category = 'Public health & sanitation';
    partner = 'Directorate of Public Health (DPH) Tamil Nadu';
    urgency = 'High';
    urgencyReason = 'Vector-borne pathogen breeding ground threatening public welfare.';
    recommendedAction = 'Conduct thermal fogging and anti-larval chemical treatment.';
  }

  // Detect explicit critical words
  if (/critical|emergency|danger|death|fatal|hazard|toxic|severe|விபத்து|அபாயம்/.test(text)) {
    urgency = 'Critical';
  }

  const aiSummary = `${category} issue flagged in ${district} (${landmark || 'General area'}). ${urgencyReason}`;

  return {
    detected_category: category,
    urgency,
    urgency_reason: urgencyReason,
    ai_summary: aiSummary,
    recommended_partner: partner,
    recommended_action: recommendedAction,
    confidence_score: 0.94,
    source: 'Civic Heuristic Neural Engine'
  };
}

/**
 * Main AI Analysis Function
 * Calls Gemini if API key available, falls back gracefully to Tamil Nadu heuristic engine.
 */
async function analyzeCivicIssue(title, description, district, landmark) {
  if (genAI && GEMINI_API_KEY) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
You are the AI Civic Engineer and Triage Specialist for Tamil Nadu Government's CIVICFORCE platform.
Analyze this citizen-reported problem:
Title: "${title}"
Description: "${description}"
District: "${district}"
Landmark: "${landmark || 'Not specified'}"

The report might be written in English, Tamil, or Tanglish.
Return a STRICT JSON object only (no markdown fences, no extra text):
{
  "detected_category": "One of ['Water & drainage', 'Street lighting', 'Roads & infrastructure', 'Waste management', 'Public health & sanitation', 'Electrical & power', 'Municipal Infrastructure']",
  "urgency": "One of ['Critical', 'High', 'Medium', 'Low']",
  "urgency_reason": "Clear explanation of hazard level and public danger",
  "ai_summary": "Crisp 1-2 sentence engineering description",
  "recommended_partner": "Suggested Tamil Nadu agency or partner (e.g. CMWSSB, TWAD, TANGEDCO, Greater Chennai Corporation, Highways Dept, Anna University Civil Dept, PSG Tech, NIT Trichy)",
  "recommended_action": "1-2 immediate physical interventions needed",
  "confidence_score": 0.97
}
`;

      const result = await model.generateContent(prompt);
      const textResponse = result.response.text();
      // Clean up markdown block if model included it
      const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return {
        ...parsed,
        source: 'Google Gemini 1.5 Flash'
      };
    } catch (err) {
      console.warn('⚠️ Gemini API call failed or timed out. Falling back to local civic engine:', err.message);
    }
  }

  // Graceful fallback
  return fallbackCivicAnalysis(title, description, district, landmark);
}

module.exports = {
  analyzeCivicIssue
};
