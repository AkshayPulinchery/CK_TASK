// Shared domain types & option lists for the CIVICFORCE app.
//
// The `Report` type is the API contract: the backend serialises every row
// into exactly this shape (see the backend's server/src/lib/serialize.js).
// Live data comes from the CIVICFORCE API via src/lib/api.ts.

export type Urgency = "Normal" | "High";

export type TimelineEntry = {
  status: string;
  date: string;
  note: string;
};

export type Report = {
  /** Public human-facing id, e.g. "TNCR-2048". */
  id: string;
  /** Database UUID — also accepted anywhere the public id is. */
  uuid?: string;
  title: string;
  description: string;
  district: string;
  category: string;
  urgency: Urgency;
  status: string;
  landmark: string | null;
  /** Optional 6-digit postal pincode captured on the report form. */
  pincode?: string | null;
  lat: number | null;
  lng: number | null;
  partner: string | null;
  ai_summary: string;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  created_at: string;
  /** Anonymous upvote tally. */
  votes?: number;
  /** Number of photos attached to the report. */
  photo_count?: number;
  timeline: TimelineEntry[];
};

export type District = { name: string; lat: number; lng: number };
export type Locality = { name: string; lat: number; lng: number; district: string };

// ================= SEED MIRROR =================

// The backend seeds the database with this exact data (server/prisma/seed-data.js).
// The list is kept here as the prerendered shell: the static HTML renders with
// these rows so the first paint is never empty, and the live API response
// replaces them as soon as the client mounts.
export const INITIAL_REPORTS: Report[] = [
  {
    id: "TNCR-2048",
    title: "Streetlights out on Anna Salai near Teynampet junction",
    description:
      "Two high-mast streetlights near Teynampet metro intersection on Anna Salai have been completely dead for 4 evenings. Crossing is pitch black after sunset.",
    district: "Chennai",
    category: "Street lighting",
    urgency: "Normal",
    status: "Under review",
    landmark: "Teynampet Metro Gate 3",
    lat: 13.0418,
    lng: 80.2481,
    partner: "TANGEDCO Electricity Board",
    ai_summary:
      "High-mast lights failed at Teynampet intersection creating pedestrian safety hazard.",
    contact_name: "S. Ramachandran",
    contact_phone: "+91 98401 23456",
    contact_email: "ramachandran.s@example.com",
    created_at: "2026-10-12T10:20:00Z",
    timeline: [
      {
        status: "Received",
        date: "Oct 12, 2026, 10:20 AM",
        note: "Report logged via citizen portal. AI triage completed.",
      },
      {
        status: "Under review",
        date: "Oct 13, 2026, 08:45 AM",
        note: "Admin assigned TANGEDCO Central Division for cable fault inspection.",
      },
    ],
  },
  {
    id: "TNCR-2047",
    title: "Water stagnation and clogged storm drain near Ukkadam market",
    description:
      "Rainwater and sewage pooling across 40-meter stretch beside Ukkadam market entrance. Heavy silt and plastic choke the main drain.",
    district: "Coimbatore",
    category: "Water & drainage",
    urgency: "High",
    status: "In progress",
    landmark: "Ukkadam Market Western Gate",
    lat: 10.9931,
    lng: 76.9612,
    partner: "TWAD Board",
    ai_summary:
      "Severe sewage stagnation blocking market access. Emergency desilting required.",
    contact_name: "M. Kavitha",
    contact_phone: "+91 97890 54321",
    contact_email: "kavitha.cbe@example.com",
    created_at: "2026-10-10T07:30:00Z",
    timeline: [
      {
        status: "Received",
        date: "Oct 10, 2026, 07:30 AM",
        note: "High urgency flagged due to public market footfall.",
      },
      {
        status: "Under review",
        date: "Oct 11, 2026, 09:00 AM",
        note: "Sanitation team verified drain blockage.",
      },
      {
        status: "In progress",
        date: "Oct 12, 2026, 12:15 PM",
        note: "Excavator and suction tanker deployed on site.",
      },
    ],
  },
  {
    id: "TNCR-2046",
    title: "Overflowing community waste bins near Periyar bus stand",
    description:
      "Community bins beside Periyar bus stand are overflowing. Stray cattle and dogs are scattering waste across the roadway.",
    district: "Madurai",
    category: "Waste & sanitation",
    urgency: "Normal",
    status: "New",
    landmark: "Periyar Bus Stand West Exit",
    lat: 9.9195,
    lng: 78.1193,
    partner: null,
    ai_summary:
      "Community waste bins overflowing near transit depot. Compactor dispatch recommended.",
    contact_name: "P. Muthuvel",
    contact_phone: "+91 94432 11223",
    contact_email: "muthuvel.mdu@example.com",
    created_at: "2026-10-16T14:00:00Z",
    timeline: [
      {
        status: "Received",
        date: "Oct 16, 2026, 02:00 PM",
        note: "Problem submitted. AI triage categorized as Waste & sanitation.",
      },
    ],
  },
  {
    id: "TNCR-2045",
    title: "Dangerous trench and collapsed footpath by Hasthampatti Girls School",
    description:
      "15-foot paving collapse right in front of the school gate left jagged concrete exposed. Multiple students tripped during morning rush.",
    district: "Salem",
    category: "Roads & footpaths",
    urgency: "High",
    status: "Resolved",
    landmark: "Hasthampatti Roundabout School Gate",
    lat: 11.6742,
    lng: 78.1468,
    partner: "Highways Department TN",
    ai_summary:
      "Dangerous walkway collapse outside school gate presenting active hazard to children.",
    contact_name: "V. Sundaram",
    contact_phone: "+91 99940 77889",
    contact_email: "sundaram.salem@example.com",
    created_at: "2026-10-04T06:15:00Z",
    timeline: [
      {
        status: "Received",
        date: "Oct 04, 2026, 06:15 AM",
        note: "Logged with High Urgency flag.",
      },
      {
        status: "In progress",
        date: "Oct 06, 2026, 11:00 AM",
        note: "Salem Municipal Road Wing replaced paver tiles.",
      },
      {
        status: "Resolved",
        date: "Oct 09, 2026, 05:00 PM",
        note: "Walkway reconstruction inspected and verified safe for public access.",
      },
    ],
  },
  {
    id: "TNCR-2044",
    title: "Fluoride water filtration pilot innovation needed for tribal school",
    description:
      "Borewells in Thally middle school contain fluoride concentrations of 2.8 mg/L affecting dental health of tribal children. We request research partnership with universities.",
    district: "Krishnagiri",
    category: "Water & drainage",
    urgency: "High",
    status: "Assigned",
    landmark: "Thally Panchayat School",
    lat: 12.5855,
    lng: 77.6534,
    partner: "NIT Trichy Lab",
    ai_summary:
      "High fluoride water contamination. Academic research partner matched for low-cost filtration.",
    contact_name: "Dr. Anand Kumar",
    contact_phone: "+91 94422 66778",
    contact_email: "anand.thally@example.com",
    created_at: "2026-10-11T11:00:00Z",
    timeline: [
      {
        status: "Received",
        date: "Oct 11, 2026, 11:00 AM",
        note: "Societal innovation challenge registered.",
      },
      {
        status: "Assigned",
        date: "Oct 15, 2026, 03:20 PM",
        note: "Assigned to NIT Trichy Environmental Lab for pilot deployment.",
      },
    ],
  },
  {
    id: "TNCR-2043",
    title: "Broken safety railings along Cauvery river bridge promenade",
    description:
      "Wrought iron pedestrian safety railings on Cauvery river bridge near Srirangam rusted through and collapsed over 12 meters with 20-foot drop risk.",
    district: "Tiruchirappalli",
    category: "Public spaces",
    urgency: "High",
    status: "Under review",
    landmark: "Srirangam Approach Bridge",
    lat: 10.856,
    lng: 78.6948,
    partner: "L&T Urban Infrastructure",
    ai_summary:
      "Promenade guard railings broken along river bridge with direct fall hazard.",
    contact_name: "R. Srinivasan",
    contact_phone: "+91 98421 99001",
    contact_email: "srinivasan.trichy@example.com",
    created_at: "2026-10-15T09:40:00Z",
    timeline: [
      {
        status: "Received",
        date: "Oct 15, 2026, 09:40 AM",
        note: "High urgency societal challenge registered.",
      },
      {
        status: "Under review",
        date: "Oct 16, 2026, 04:10 PM",
        note: "Temporary warning cones placed. Partner contacted for railing fabrication.",
      },
    ],
  },
  {
    id: "TNCR-2042",
    title: "Massive pothole cluster on Tirunelveli bypass junction",
    description:
      "Four deep potholes stretching across 25 meters on main bypass causing heavy vehicle tipping and daily accidents.",
    district: "Tirunelveli",
    category: "Roads & footpaths",
    urgency: "High",
    status: "New",
    landmark: "Vannarpettai Flyover Junction",
    lat: 8.73,
    lng: 77.7,
    partner: null,
    ai_summary:
      "Dangerous pothole cluster on heavy bypass route presenting active accident risk.",
    contact_name: "Murugan K.",
    contact_phone: "+91 94444 55667",
    contact_email: "murugan@example.com",
    created_at: "2026-10-18T10:00:00Z",
    timeline: [
      {
        status: "Received",
        date: "Oct 18, 2026, 10:00 AM",
        note: "Problem logged by citizen. AI flagged High Urgency.",
      },
    ],
  },
];

// ================= TAMIL NADU GEOGRAPHY =================

// District HQ centers — used by the auto-pointing map (TN_DISTRICTS in the prototype).
export const TN_DISTRICTS: District[] = [
  { name: "Ariyalur", lat: 11.136, lng: 79.0736 },
  { name: "Chengalpattu", lat: 12.686, lng: 79.977 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Coimbatore", lat: 11.0168, lng: 76.9558 },
  { name: "Cuddalore", lat: 11.7447, lng: 79.758 },
  { name: "Dharmapuri", lat: 12.366, lng: 78.163 },
  { name: "Dindigul", lat: 10.362, lng: 77.98 },
  { name: "Erode", lat: 11.341, lng: 77.7172 },
  { name: "Kallakurichi", lat: 11.74, lng: 78.96 },
  { name: "Kancheepuram", lat: 12.834, lng: 79.7036 },
  { name: "Kanniyakumari", lat: 8.088, lng: 77.538 },
  { name: "Karur", lat: 10.956, lng: 78.076 },
  { name: "Krishnagiri", lat: 12.52, lng: 77.62 },
  { name: "Madurai", lat: 9.9252, lng: 78.1198 },
  { name: "Mayiladuthurai", lat: 11.1, lng: 79.65 },
  { name: "Nagapattinam", lat: 10.767, lng: 79.842 },
  { name: "Namakkal", lat: 11.221, lng: 78.17 },
  { name: "The Nilgiris", lat: 11.41, lng: 76.69 },
  { name: "Perambalur", lat: 11.24, lng: 78.88 },
  { name: "Pudukkottai", lat: 10.38, lng: 78.8 },
  { name: "Ramanathapuram", lat: 9.37, lng: 78.83 },
  { name: "Ranipet", lat: 12.93, lng: 79.33 },
  { name: "Salem", lat: 11.6643, lng: 78.146 },
  { name: "Sivaganga", lat: 9.845, lng: 78.46 },
  { name: "Tenkasi", lat: 8.96, lng: 77.32 },
  { name: "Thanjavur", lat: 10.79, lng: 79.14 },
  { name: "Theni", lat: 9.96, lng: 77.55 },
  { name: "Thoothukudi", lat: 8.8, lng: 78.13 },
  { name: "Tiruchirappalli", lat: 10.7905, lng: 78.7047 },
  { name: "Tirunelveli", lat: 8.7139, lng: 77.7567 },
  { name: "Tirupathur", lat: 12.97, lng: 78.62 },
  { name: "Tiruppur", lat: 11.1085, lng: 77.3411 },
  { name: "Tiruvallur", lat: 13.145, lng: 79.906 },
  { name: "Tiruvarur", lat: 10.777, lng: 79.63 },
  { name: "Tiruvannamalai", lat: 12.22, lng: 79.07 },
  { name: "Vellore", lat: 12.9165, lng: 79.1325 },
  { name: "Viluppuram", lat: 11.94, lng: 79.49 },
  { name: "Virudhunagar", lat: 9.575, lng: 77.96 },
];

// Well-known localities — typing these in the report form auto-points the map.
export const TN_LOCALITIES: Locality[] = [
  { name: "Anna Salai", lat: 13.0418, lng: 80.2481, district: "Chennai" },
  { name: "Teynampet", lat: 13.0434, lng: 80.252, district: "Chennai" },
  { name: "Ukkadam", lat: 10.9931, lng: 76.9612, district: "Coimbatore" },
  { name: "Gandhipuram", lat: 11.007, lng: 76.975, district: "Coimbatore" },
  { name: "Periyar Bus Stand", lat: 9.9195, lng: 78.1193, district: "Madurai" },
  { name: "Hasthampatti", lat: 11.6742, lng: 78.1468, district: "Salem" },
  { name: "Srirangam", lat: 10.856, lng: 78.6948, district: "Tiruchirappalli" },
  { name: "Thally", lat: 12.5855, lng: 77.6534, district: "Krishnagiri" },
  { name: "Vannarpettai", lat: 8.73, lng: 77.7, district: "Tirunelveli" },
];

// ================= FILTER / FORM OPTION LISTS =================

export const DISTRICT_FILTER_OPTIONS = [
  "All",
  "Chennai",
  "Coimbatore",
  "Madurai",
  "Salem",
  "Tiruchirappalli",
  "Krishnagiri",
  "Tirunelveli",
];

export const CATEGORY_FILTER_OPTIONS = [
  "All",
  "Roads & footpaths",
  "Water & drainage",
  "Street lighting",
  "Waste & sanitation",
  "Public spaces",
];

export const CATEGORY_OPTIONS = [
  "Roads & footpaths",
  "Water & drainage",
  "Street lighting",
  "Waste & sanitation",
  "Public spaces",
  "Other",
];

export const STATUS_FILTER_OPTIONS = [
  "All",
  "New",
  "Under review",
  "Assigned",
  "In progress",
  "Resolved",
];

export const STATUS_OPTIONS = [
  "New",
  "Under review",
  "Assigned",
  "In progress",
  "Resolved",
  "Rejected",
];

export const QUEUE_TABS = ["All", "New", "Under review", "Assigned", "In progress", "Resolved"];

export type PartnerGroup = {
  label: string;
  options: { value: string; label: string }[];
};

export const PARTNER_GROUPS: PartnerGroup[] = [
  {
    label: "Government Offices",
    options: [
      { value: "Greater Chennai Corporation (GCC)", label: "Greater Chennai Corporation (GCC)" },
      { value: "TWAD Board", label: "Tamil Nadu Water Supply & Drainage (TWAD)" },
      { value: "TANGEDCO Electricity Board", label: "TANGEDCO (Electricity Board)" },
      { value: "Highways Department TN", label: "Highways Department Tamil Nadu" },
    ],
  },
  {
    label: "Universities & Research Institutes",
    options: [
      { value: "Anna University - Civil Dept", label: "Anna University - Dept. of Civil Engineering" },
      { value: "IIT Madras Urban Center", label: "IIT Madras - Centre for Urbanization" },
      { value: "NIT Trichy Lab", label: "National Institute of Technology (NIT) Trichy" },
    ],
  },
  {
    label: "Industry & Corporate CSR",
    options: [
      { value: "L&T Urban Infrastructure", label: "Larsen & Toubro (L&T) Urban Infra" },
      { value: "TCS Foundation", label: "TCS Foundation Chennai" },
      { value: "TVS Motor CSR", label: "TVS Motor Community CSR" },
    ],
  },
];

// ================= ADMIN CREDENTIAL HINTS =================
//
// Display only — these are the credentials the backend seeds
// (server/prisma/seed.js). Authentication itself is performed by
// POST /api/admin/login; the browser never compares a password locally.
export const ADMIN_EMAIL = "admin@tn.gov.in";
export const ADMIN_PASSWORD = "Admin@1234";

// ================= SHARED STYLES / HELPERS =================

export const STATUS_BADGE_CLASSES: Record<string, string> = {
  New: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  "Under review": "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  Assigned: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  "In progress": "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  Resolved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
};

// Automated AI triage — same keyword rules as the prototype.
export function runAiTriage(
  title: string,
  description: string
): { category: string; urgency: Urgency } {
  const text = title + description;

  let category = "Other";
  if (/road|pothole|footpath|bridge|asphalt|traffic/.test(text)) category = "Roads & footpaths";
  else if (/water|leak|drain|flood|pipe|sewage/.test(text)) category = "Water & drainage";
  else if (/light|lamp|dark|bulb|electric|power/.test(text)) category = "Street lighting";
  else if (/waste|garbage|dump|trash|bin/.test(text)) category = "Waste & sanitation";
  else if (/park|market|public|bus stand/.test(text)) category = "Public spaces";

  const urgency: Urgency = /danger|hazard|accident|risk|hospital|school|collapse|fire|electroc|emergency/.test(
    text
  )
    ? "High"
    : "Normal";

  return { category, urgency };
}

// Same human-readable date format as the backend's serialiser
// (server/src/lib/serialize.js).
//
// The timezone is pinned to UTC so a timestamp renders identically whether it
// was formatted by the API server or by the browser, regardless of where
// either one runs.
export function formatDateTime(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}
