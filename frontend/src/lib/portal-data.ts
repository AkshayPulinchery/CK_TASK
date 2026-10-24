/**
 * Static content for the CivicForce TN state portal.
 *
 * Everything here is presentation copy for the public portal — no personal
 * data and no claims of official endorsement. Leadership entries deliberately
 * carry designations only; portrait slots are marked as placeholders until the
 * Department of Information & Public Relations publishes official photographs.
 */

export type Department = {
  code: string;
  name: string;
  tamil: string;
  focus: string;
  /** Report categories routed to this department. */
  categories: string[];
};

export const DEPARTMENTS: Department[] = [
  {
    code: "MAWS",
    name: "Municipal Administration & Water Supply",
    tamil: "நகராட்சி நிர்வாகம் மற்றும் குடிநீர் வழங்கல் துறை",
    focus: "Street lighting, drinking water, storm-water drains and urban civic assets.",
    categories: ["Infrastructure", "Water", "Sanitation"],
  },
  {
    code: "HMP",
    name: "Highways & Minor Ports",
    tamil: "நெடுஞ்சாலைகள் மற்றும் சிறு துறைமுகங்கள் துறை",
    focus: "State highways, road surface quality, bridges and road safety furniture.",
    categories: ["Roads", "Safety"],
  },
  {
    code: "TANGEDCO",
    name: "Tamil Nadu Generation & Distribution Corporation",
    tamil: "தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம்",
    focus: "Power supply interruptions, transformer faults and public electrical hazards.",
    categories: ["Electricity", "Safety"],
  },
  {
    code: "RD&PR",
    name: "Rural Development & Panchayat Raj",
    tamil: "ஊரக வளர்ச்சி மற்றும் ஊராட்சித் துறை",
    focus: "Village roads, panchayat water systems and rural sanitation infrastructure.",
    categories: ["Roads", "Water", "Sanitation"],
  },
  {
    code: "H&FW",
    name: "Health & Family Welfare",
    tamil: "சுகாதாரம் மற்றும் குடும்ப நலத்துறை",
    focus: "Primary health centres, public health outbreaks and hospital services.",
    categories: ["Health", "Sanitation"],
  },
  {
    code: "SE",
    name: "School Education",
    tamil: "பள்ளிக் கல்வித் துறை",
    focus: "Government school infrastructure, safety and mid-day meal delivery.",
    categories: ["Education", "Safety"],
  },
  {
    code: "TNSTC",
    name: "Tamil Nadu State Transport Corporation",
    tamil: "தமிழ்நாடு அரசுப் போக்குவரத்துக் கழகம்",
    focus: "Bus services, depot facilities, passenger safety and route reliability.",
    categories: ["Transport", "Safety"],
  },
  {
    code: "ECC&F",
    name: "Environment, Climate Change & Forests",
    tamil: "சுற்றுச்சூழல், காலநிலை மாற்றம் மற்றும் வனத்துறை",
    focus: "Lake encroachment, tree protection, air quality and green cover.",
    categories: ["Environment", "Water"],
  },
  {
    code: "TNPCB",
    name: "Tamil Nadu Pollution Control Board",
    tamil: "தமிழ்நாடு மாசுக் கட்டுப்பாட்டு வாரியம்",
    focus: "Industrial effluent, air pollution and solid waste compliance.",
    categories: ["Environment", "Health"],
  },
  {
    code: "GCC",
    name: "Greater Chennai Corporation",
    tamil: "சென்னை மாநகராட்சி",
    focus: "Ward-level civic services, garbage collection and urban roads in Chennai.",
    categories: ["Sanitation", "Roads", "Infrastructure"],
  },
];

export type Leadership = {
  role: string;
  roleTa: string;
  office: string;
  portfolio: string;
  initials: string;
};

export const LEADERSHIP: Leadership[] = [
  {
    role: "Hon'ble Chief Minister",
    roleTa: "மாண்புமிகு முதலமைச்சர்",
    office: "Government of Tamil Nadu · Fort St. George",
    portfolio: "Chairperson, State Grievance Redressal Council",
    initials: "CM",
  },
  {
    role: "Hon'ble Minister for Municipal Administration",
    roleTa: "மாண்புமிகு நகராட்சி நிர்வாக அமைச்சர்",
    office: "Government of Tamil Nadu · Secretariat",
    portfolio: "Urban civic services and water supply delivery",
    initials: "MA",
  },
  {
    role: "Chief Secretary to Government",
    roleTa: "அரசு தலைமைச் செயலாளர்",
    office: "Government of Tamil Nadu · Secretariat",
    portfolio: "Administrative coordination across all departments",
    initials: "CS",
  },
  {
    role: "Secretary, Information Technology",
    roleTa: "தகவல் தொழில்நுட்பச் செயலாளர்",
    office: "Government of Tamil Nadu · IT & Digital Services",
    portfolio: "Digital governance and CivicForce TN platform oversight",
    initials: "IT",
  },
];

export type Circular = {
  id: string;
  number: string;
  date: string;
  kind: "Circular" | "Press Release" | "Notification" | "Order";
  title: string;
  department: string;
  summary: string;
};

export const CIRCULARS: Circular[] = [
  {
    id: "G.O.(Ms).No.42",
    number: "G.O.(Ms).No.42",
    date: "2026-10-12",
    kind: "Circular",
    title: "Revised citizen grievance redressal timelines for urban local bodies",
    department: "Municipal Administration & Water Supply",
    summary:
      "Prescribes a 24-hour acknowledgement and a 15-working-day outer limit for civic grievances routed through CivicForce TN, with escalation to the District Collector on day 16.",
  },
  {
    id: "G.O.(Ms).No.38",
    number: "G.O.(Ms).No.38",
    date: "2026-09-28",
    kind: "Notification",
    title: "Notification of district nodal officers for the Citizen Action Engine",
    department: "Information Technology & Digital Services",
    summary:
      "Notifies one nodal officer per district for grievance triage, data quality audits and monthly public disclosure of resolution performance.",
  },
  {
    id: "PR-2026-1042",
    number: "PR-2026-1042",
    date: "2026-09-19",
    kind: "Press Release",
    title: "State-wide monsoon preparedness review chaired by the Chief Secretary",
    department: "Revenue & Disaster Management",
    summary:
      "Departments directed to clear storm-water drain blockages, inspect relief shelters and publish ward-level contact details before the north-east monsoon.",
  },
  {
    id: "G.O.(Rt).No.117",
    number: "G.O.(Rt).No.117",
    date: "2026-08-30",
    kind: "Order",
    title: "Standard operating procedure for photo evidence in civic complaints",
    department: "Municipal Administration & Water Supply",
    summary:
      "Defines acceptable geotagged evidence, retention periods for citizen-uploaded photographs and the process for redacting personal information.",
  },
  {
    id: "G.O.(Ms).No.31",
    number: "G.O.(Ms).No.31",
    date: "2026-08-08",
    kind: "Circular",
    title: "Accessibility compliance for state government web portals",
    department: "Information Technology & Digital Services",
    summary:
      "All state portals must meet GIGW 3.0 and WCAG 2.1 Level AA, publish accessibility statements, and support text scaling and high-contrast display.",
  },
  {
    id: "PR-2026-0987",
    number: "PR-2026-0987",
    date: "2026-07-24",
    kind: "Press Release",
    title: "CivicForce TN crosses one lakh citizen-submitted civic reports",
    department: "Information Technology & Digital Services",
    summary:
      "The platform now routes reports to 10 departments and 38 district units, with an average first response time of 2.4 working days.",
  },
];

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "What is the service-level timeline for my grievance?",
    a: "Every report is acknowledged within 24 hours of submission. Departments must record a first response within 3 working days and close the grievance within 15 working days. If the timeline is crossed, the case is automatically escalated to the district nodal officer.",
  },
  {
    q: "How does pincode routing work?",
    a: "Entering a Tamil Nadu pincode resolves the district and the local body responsible for the location. The report is then queued with that unit's grievance desk, and the pincode is retained to help the department verify the jurisdiction.",
  },
  {
    q: "Can I submit a report without giving my name?",
    a: "Yes. Name, phone number and email are optional. Anonymous reports are tracked by reference ID and a device key so that the status page still works without an account. Contact details are only used to reach you for site verification.",
  },
  {
    q: "How do I track a report after submission?",
    a: "Every submission returns a reference ID beginning with TNCR. Open Browse Issues or the direct report link to see the current status, the assigned department, and the complete action timeline. You can copy the link or print a receipt from the report page.",
  },
  {
    q: "What evidence should I attach?",
    a: "Up to three photographs may be attached. Clear, recent photographs that show the location and the problem are most useful. Do not include photographs of people, identity documents or any personal information.",
  },
  {
    q: "What are my rights as a citizen?",
    a: "You are entitled to an acknowledgement, a reasoned status update, and a written closure note. You may seek review by the district nodal officer if the response is incomplete, and you may escalate to the State Grievance Redressal Council after 30 days.",
  },
  {
    q: "How is my data protected?",
    a: "Contact details are stored separately from the public report record and are visible only to authorised grievance staff. Photographs are retained for the period required for audit and are redacted on request where personal information appears.",
  },
  {
    q: "Are emergency complaints handled here?",
    a: "No. This portal is for non-emergency civic grievances. For emergencies dial 112. For the state emergency desk dial 1100, and for women's safety dial 1913. These lines are staffed around the clock.",
  },
];

export type NodalOfficer = {
  district: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  zone: "North" | "Central" | "South" | "West";
  openReports: number;
  resolutionRate: number;
};

export const NODAL_OFFICERS: NodalOfficer[] = [
  { district: "Chennai", designation: "District Nodal Officer (Grievances)", department: "Greater Chennai Corporation", email: "chennai.grievance@tn.gov.in", phone: "044-2530 0000", zone: "North", openReports: 42, resolutionRate: 92 },
  { district: "Coimbatore", designation: "District Nodal Officer (Grievances)", department: "District Collectorate", email: "coimbatore.grievance@tn.gov.in", phone: "0422-230 1000", zone: "West", openReports: 27, resolutionRate: 88 },
  { district: "Madurai", designation: "District Nodal Officer (Grievances)", department: "District Collectorate", email: "madurai.grievance@tn.gov.in", phone: "0452-253 0000", zone: "South", openReports: 21, resolutionRate: 86 },
  { district: "Tiruchirappalli", designation: "District Nodal Officer (Grievances)", department: "District Collectorate", email: "trichy.grievance@tn.gov.in", phone: "0431-241 0000", zone: "Central", openReports: 18, resolutionRate: 84 },
  { district: "Salem", designation: "District Nodal Officer (Grievances)", department: "District Collectorate", email: "salem.grievance@tn.gov.in", phone: "0427-233 0000", zone: "West", openReports: 16, resolutionRate: 83 },
  { district: "Tirunelveli", designation: "District Nodal Officer (Grievances)", department: "District Collectorate", email: "tirunelveli.grievance@tn.gov.in", phone: "0462-233 0000", zone: "South", openReports: 14, resolutionRate: 81 },
  { district: "Vellore", designation: "District Nodal Officer (Grievances)", department: "District Collectorate", email: "vellore.grievance@tn.gov.in", phone: "0416-225 0000", zone: "North", openReports: 12, resolutionRate: 80 },
  { district: "Thanjavur", designation: "District Nodal Officer (Grievances)", department: "District Collectorate", email: "thanjavur.grievance@tn.gov.in", phone: "04362-230 000", zone: "Central", openReports: 11, resolutionRate: 78 },
];

export const ANNOUNCEMENTS: { text: string; href: string }[] = [
  {
    text: "New: Grievance timelines revised to 15 working days for urban local bodies — G.O.(Ms).No.42 dated 12 Oct 2026",
    href: "/circulars",
  },
  {
    text: "District nodal officers notified for all 38 districts — public contact directory now available",
    href: "/officers",
  },
  {
    text: "North-east monsoon preparedness: report storm-water drain blockages on priority",
    href: "/report",
  },
  {
    text: "Accessibility statement published in line with GIGW 3.0 and WCAG 2.1 AA",
    href: "/privacy",
  },
];

export type SearchEntry = {
  title: string;
  description: string;
  href: string;
  group: "Pages" | "Services" | "Information";
  keywords: string;
};

export const PORTAL_PAGES: SearchEntry[] = [
  { title: "Home", description: "CivicForce TN citizen action engine", href: "/", group: "Pages", keywords: "home start portal government tamil nadu" },
  { title: "Browse Issues", description: "Search the public grievance register", href: "/challenges", group: "Services", keywords: "browse issues reports register complaints grievance" },
  { title: "District Map", description: "Live incident map across Tamil Nadu", href: "/map", group: "Services", keywords: "map district live location chennai coimbatore madurai" },
  { title: "Analytics", description: "Resolution performance and departmental statistics", href: "/analytics", group: "Information", keywords: "analytics statistics charts performance resolution data" },
  { title: "Nodal Officers", description: "District grievance officer directory", href: "/officers", group: "Information", keywords: "officers nodal contact directory district escalation" },
  { title: "Circulars & Press Releases", description: "Government orders and departmental circulars", href: "/circulars", group: "Information", keywords: "circulars orders notifications press release go" },
  { title: "Report an Issue", description: "File a new civic grievance with photo evidence", href: "/report", group: "Services", keywords: "report file complaint issue new grievance photo" },
  { title: "Track a Grievance", description: "Look up a report by reference ID", href: "/challenges", group: "Services", keywords: "track status reference id tncr" },
  { title: "Admin Sign-in", description: "Departmental grievance queue access", href: "/login", group: "Pages", keywords: "admin login sign in officer queue" },
  { title: "Privacy Policy", description: "How citizen data is collected and protected", href: "/privacy", group: "Information", keywords: "privacy data protection policy" },
  { title: "Terms of Service", description: "Conditions for using the portal", href: "/terms", group: "Information", keywords: "terms conditions service usage" },
];

export const EMERGENCY_NUMBERS = [
  { label: "State Emergency Desk", number: "1100", note: "24×7 · Tamil Nadu" },
  { label: "Women's Helpline", number: "1913", note: "24×7 · State-wide" },
  { label: "Police / Fire / Ambulance", number: "112", note: "National emergency" },
];

/** Formats an ISO date as "12 Oct 2026" without relying on the runtime locale. */
export function formatGovDate(iso: string): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return `${String(d.getUTCDate()).padStart(2, "0")} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
