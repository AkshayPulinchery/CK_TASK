// Basic English / Tamil / Hindi UI translation layer.
//
// Scope note: only *interface chrome* is translated — navigation, headings,
// labels, buttons, table headers, filter options and status/category badges.
// Stored report content (titles, descriptions, AI summaries, timelines),
// legal prose, district names, partner organisation names and alert() messages
// intentionally stay in English: the data layer is single-language.

export type Lang = "en" | "ta" | "hi";

export type LanguageOption = { code: Lang; label: string; short: string };

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "ta", label: "தமிழ்", short: "TA" },
  { code: "hi", label: "हिंदी", short: "HI" },
];

export const DEFAULT_LANG: Lang = "en";

export function isLang(value: unknown): value is Lang {
  return value === "en" || value === "ta" || value === "hi";
}

// Flat key → string dictionaries. English doubles as the fallback.
export const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  en: {
    // ---- top ribbon / platform bar ----
    "bar.network": "CIVICFORCE · Smart India Hackathon (SIH-26043) Societal Action Network",
    "bar.emergency": "Emergency Civic Desk:",
    "bar.adminMode": "Administrator Mode",
    "bar.citizenMode": "Public Citizen Mode",

    // ---- header ----
    "header.tagline": "Tamil Nadu Societal Problem & Resolution Engine",
    "nav.home": "Home",
    "nav.challenges": "Browse Challenges",
    "nav.map": "Live District Map",
    "nav.admin": "Admin Queue",
    "header.report": "Report Problem",
    "header.signIn": "Admin Sign-in",
    "header.signOut": "Sign Out",
    "header.themeToDark": "Switch to night mode",
    "header.themeToLight": "Switch to day mode",
    "header.language": "Language",

    // ---- footer ----
    "footer.network": "· Tamil Nadu Societal Action Network (SIH-26043)",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.register": "Public Register",
    "footer.rights": "© 2026 CIVICFORCE Platform",

    // ---- home ----
    "home.heroBadge": "Action-Driven Civic Tech Platform",
    "home.h1a": "Mobilizing Solutions for",
    "home.h1b": "Societal Challenges",
    "home.hero.p1":
      "CIVICFORCE connects citizen-reported societal issues directly with leading universities, corporate industry R&D, and municipal departments. Type your location to automatically point the live map and track verifiable resolution.",
    "home.ctaReport": "Report an Issue",
    "home.ctaBrowse": "Browse Challenge Register",
    "home.ctaMap": "Live District Map",
    "home.pipeline.h2": "How Societal Problems Travel to Resolution",
    "home.pipeline.p":
      "4 transparent stages connecting citizens, AI classification, and expert partner institutions.",
    "home.step1.title": "Citizen Submits",
    "home.step1.body":
      "Type your location — map automatically points to it. No category choice needed.",
    "home.step2.title": "Automated AI Triage",
    "home.step2.body":
      "AI tags category, calculates urgency & matches university or industry partner.",
    "home.step3.title": "Admin Assignment",
    "home.step3.body":
      "Official reviewer confirms classification and assigns to expert partner.",
    "home.step4.title": "Public Live Timeline",
    "home.step4.body":
      "Citizens track real-time resolution with private contact shielding.",
    "home.stat.total": "Total Challenges in DB",
    "home.stat.resolved": "Problems Resolved",
    "home.stat.districts": "Active Districts",
    "home.stat.rate": "Triage Resolution Rate",
    "home.recent.h2": "Latest Citizen Reports",
    "home.recent.p": "Live citizen reports from across Tamil Nadu",
    "home.recent.eyebrow": "Public register",
    "home.recent.empty": "No reports in the register yet",
    "home.recent.emptyHint":
      "Be the first citizen to report a civic issue in your area.",
    "home.recent.viewAll": "View All Reports →",

    // ---- report page / form ----
    "report.h1": "Report a Civic Issue",
    "report.intro.a": "Describe the problem, pin the exact location and attach evidence.",
    "report.intro.strong": "Your report is routed automatically",
    "report.intro.b": "to the department responsible for that district.",
    "report.f.title": "Problem Title",
    "report.f.titlePh":
      "e.g. Major water pipeline burst flooding school road junction",
    "report.f.description": "Detailed Description",
    "report.f.descriptionPh":
      "Describe the size of damage, how long it has persisted, and the direct danger to safety, traffic, or water supply...",
    "report.f.district": "District (Tamil Nadu)",
    "report.f.districtPh": "-- Choose District (Map will auto-center) --",
    "report.f.pincode": "Pincode (6-digit)",
    "report.f.pincodePh": "e.g. 600018",
    "report.f.pinLookup": "Looking up district...",
    "report.f.pinFound": "District set to {district}",
    "report.f.pinNotFound": "No district found for this pincode. Please choose it manually.",
    "report.f.pinOutOfState": "This pincode is in {state}, outside Tamil Nadu. Please choose a Tamil Nadu district.",
    "report.f.pinError": "Couldn't reach the pincode service. Please choose the district manually.",
    "report.f.aiPreviewLabel": "AI preview:",
    "report.f.aiPreviewHint": "Attach a photo to see the instant triage tag.",
    "report.f.draftRestored": "Draft restored from your last session.",
    "report.f.draftClear": "Clear draft",
    "report.f.locality": "Enter Location of Issue (Map Auto-points Here)",
    "report.f.localityPh":
      "Type area or street name (e.g. Anna Salai, Ukkadam, Srirangam, Gandhipuram, Periyar Bus Stand)...",
    "report.f.tryClicking": "Try clicking:",
    "report.f.pinned": "Automatically Pinned to:",
    "report.f.map": "Live Interactive Map",
    "report.f.mapHelp":
      "The map automatically glides to the location as you type. You can also drag the pin to adjust.",
    "report.f.photos": "Attach Photographs (Up to 3, max 5MB)",
    "report.f.photosCta": "Click to attach photo evidence",
    "report.f.photo": "Photo",
    "report.f.photoCount": "{n} of 3 photos added",
    "report.f.aiNotice": "Automated AI Triage:",
    "report.f.aiNoticeBody":
      "Category selection is not required. Our AI engine automatically classifies the problem category, urgency level, and suggested partner type upon submission.",
    "report.f.contact": "Optional Citizen Contact",
    "report.f.confidential": "Strictly Confidential",
    "report.f.name": "Full Name (optional)",
    "report.f.phone": "Phone Number (optional)",
    "report.f.email": "Email Address (optional)",
    "report.f.contactNote":
      "Your contact details are never shown on public reports. Only authorized reviewers can view them.",
    "report.f.submit": "Submit Report & Run AI Triage",
    "report.f.cancel": "Cancel",

    // ---- challenges register ----
    "ch.h1": "Public Challenge Register",
    "ch.p": "Browse and search societal challenges submitted across Tamil Nadu",
    "ch.searchPh": "Search title, description, or landmark...",
    "ch.allDistricts": "All Districts",
    "ch.allCategories": "All Categories",
    "ch.allStatuses": "All Statuses",
    "ch.reset": "Reset Filters",
    "ch.showing": "Showing {n} of {total} reports",
    "ch.searchAria": "Search grievances by title, description or landmark",
    "ch.live": "Live register",

    // ---- page headings ----
    "page.report.eyebrow": "Citizen grievance",
    "page.challenges.eyebrow": "Public register",
    "page.map.eyebrow": "Geography",
    "page.login.eyebrow": "Restricted access",
    "page.privacy.eyebrow": "Legal",
    "page.terms.eyebrow": "Legal",
    "page.admin.eyebrow": "Official use",
    "page.analytics.eyebrow": "Performance",
    "page.analytics.title": "District performance analytics",
    "page.officers.eyebrow": "Directory",
    "page.officers.title": "District nodal officers",
    "page.circulars.eyebrow": "Archive",
    "page.circulars.title": "Circulars & press releases",
    "page.accessibility.eyebrow": "Inclusion",
    "page.accessibility.title": "Accessibility statement",
    "ch.empty": "No reports match your filters",

    // ---- challenge detail ----
    "detail.back": "← Back to All Reports",
    "detail.notFound": "No challenge found for tracking ID",
    "detail.notFoundP": "The report may have been removed, or the tracking link is incorrect.",
    "detail.copy": "Copy Tracking Link",
    "detail.description": "Problem Description",
    "detail.district": "District:",
    "detail.location": "Location:",
    "detail.coords": "Pinned Coordinates:",
    "detail.pincode": "Pincode:",
    "detail.submitted": "Submitted:",
    "detail.noneSpecified": "None specified",
    "detail.ai": "AI Triage Assessment",
    "detail.aiSuggested": "AI Suggested",
    "detail.partner": "Assigned Resolution Partner",
    "detail.timeline": "Status Timeline",
    "detail.print": "Print record",
    "detail.reference": "Reference ID",
    "detail.status": "Current status",
    "detail.department": "Responsible department",
    "detail.mapLink": "View on the district map",
    "detail.timelineNote": "Every departmental action is recorded in this public timeline.",
    "detail.loading": "Loading grievance record",
    "detail.share": "Share",

    // ---- live map ----
    "map.h1": "Live Interactive Tamil Nadu Map",
    "map.p":
      "Fully operational live OpenStreetMap rendering active incident pins and district clusters. Click any pin to inspect the report.",
    "map.pins": "Pins:",
    "map.normalPin": "Normal Incident",
    "map.urgentPin": "High Urgency Incident",
    "map.clusterPin": "District Cluster",
    "map.attribution": "Map data ©",
    "map.attributionAfter": "contributors",
    "map.centers": "Quick District Centers (Click to Smooth Zoom)",
    "map.reportCount": "{n} reports",
    "map.reportCountOne": "{n} report",
    "map.viewChallenge": "View Full Challenge →",

    // ---- login ----
    "login.h1": "Administrator Sign-in",
    "login.p": "Authorised officers of the Government of Tamil Nadu.",
    "login.error": "Access denied. The official email or password is incorrect.",
    "login.email": "Official email address",
    "login.password": "Password",
    "login.creds": "Demonstration environment — sign-in credentials",
    "login.emailLabel": "Email",
    "login.passwordLabel": "Password",
    "login.submit": "Sign in securely",
    "login.back": "Back to the citizen portal",
    "login.secure":
      "Credentials are verified by the departmental authentication service and are never stored in this browser.",

    // ---- admin queue ----
    "admin.badge": "Verified Official Admin Session",
    "admin.h1": "Admin Review Queue",
    "admin.loggedInAs": "Logged in as",
    "admin.coordinator": "State Coordinator (Admin)",
    "admin.signOut": "Sign Out",
    "admin.allQueue": "All Queue",
    "admin.thId": "ID",
    "admin.thTitle": "Problem Title",
    "admin.thDistrict": "District",
    "admin.thCategory": "AI Category",
    "admin.thUrgency": "Urgency",
    "admin.thStatus": "Status",
    "admin.thContact": "Citizen Contact (Confidential)",
    "admin.thAction": "Action",
    "admin.anonymous": "Anonymous",
    "admin.review": "Review →",

    // ---- admin review ----
    "review.back": "← Back to Admin Queue",
    "review.notFound": "Report not found",
    "review.confidential": "Confidential Citizen Contact (Admin Eyes Only)",
    "review.protected": "Protected",
    "review.citizen": "Citizen:",
    "review.phone": "Phone:",
    "review.email": "Email:",
    "review.notGiven": "Not given",
    "review.h2": "AI Triage Correction & Partner Assignment",
    "review.category": "Category",
    "review.urgencyPriority": "Urgency Priority",
    "review.summary": "AI Summary (Editable)",
    "review.partner": "Assign Resolution Partner",
    "review.noPartner": "-- No partner assigned yet --",
    "review.status": "Status",
    "review.timelineUpdate": "Public Timeline Update",
    "review.timelinePh": "e.g. Field inspection completed. Repair scheduled within 48 hours.",
    "review.save": "Save Changes & Update Timeline",
    "review.cancel": "Cancel",
    "review.grpGov": "Government Offices",
    "review.grpUni": "Universities & Research Institutes",
    "review.grpCsr": "Industry & Corporate CSR",

    // ---- legal pages ----
    "privacy.h1": "Privacy Policy",
    "privacy.updated":
      "Last updated: October 2026 · CIVICFORCE Tamil Nadu Societal Action Network",
    "terms.h1": "Terms of Service",
    "terms.updated":
      "Last updated: October 2026 · CIVICFORCE Tamil Nadu Societal Action Network",
    "common.returnHome": "← Return Home",

    // ---- urgency ----
    "urg.high": "High Urgency",
    "urg.normal": "Normal",
    "urg.normalPriority": "Normal Priority",
    "urg.highPriority": "High Urgency",
    "urg.highShort": "High",

    // ---- categories ----
    "cat.roads": "Roads & footpaths",
    "cat.water": "Water & drainage",
    "cat.lighting": "Street lighting",
    "cat.waste": "Waste & sanitation",
    "cat.spaces": "Public spaces",
    "cat.other": "Other",

    // ---- statuses ----
    "status.new": "New",
    "status.underReview": "Under review",
    "status.assigned": "Assigned",
    "status.inProgress": "In progress",
    "status.resolved": "Resolved",
    "status.rejected": "Rejected",

    // ---- government portal chrome ----
    "gov.utility.govOfTn": "Government of Tamil Nadu",
    "gov.utility.textSize": "Text size",
    "gov.utility.textSmaller": "Decrease text size",
    "gov.utility.textNormal": "Normal text size",
    "gov.utility.textLarger": "Increase text size",
    "gov.utility.contrastOn": "Enable high contrast",
    "gov.utility.contrastOff": "Disable high contrast",
    "gov.utility.theme": "Colour theme",
    "gov.utility.themeLight": "Light theme",
    "gov.utility.themeDark": "Dark theme",
    "gov.utility.themeSystem": "System theme",
    "gov.utility.lang": "Language",
    "gov.a11y.contrast": "Contrast",
    "gov.brandHome": "CivicForce Tamil Nadu — Home",
    "gov.tagline": "Citizen Action Engine",
    "gov.nav.home": "Home",
    "gov.nav.issues": "Browse Issues",
    "gov.nav.map": "District Map",
    "gov.nav.analytics": "Analytics",
    "gov.nav.officers": "Nodal Officers",
    "gov.nav.circulars": "Circulars & Releases",
    "gov.search": "Search",
    "gov.searchPlaceholder": "Search the portal",
    "gov.report": "Report an Issue",
    "gov.openMenu": "Open menu",
    "gov.closeMenu": "Close menu",
    "gov.menu": "Navigation menu",
    "gov.admin": "Admin Sign-in",
    "gov.signOut": "Sign Out",

    // ---- home hero ----
    "home.badge": "Government of Tamil Nadu · Citizen Action Engine",
    "home.heroTitle1": "Civic grievances,",
    "home.heroTitle2": "resolved with accountability.",
    "home.heroBody":
      "CivicForce TN connects citizens directly with the departments responsible for their neighbourhoods. Report a civic issue, attach evidence, and follow every action until the case is closed.",
    "home.ctaTrack": "Track a Grievance",
    "home.ctaHow": "How it works",
    "home.trust.depts": "State departments",
    "home.trust.districts": "Districts covered",
    "home.trust.sla": "Day service standard",
    "home.trust.note":
      "No account, Aadhaar or fee required. A reference ID is issued instantly.",
    "home.emergency": "Emergency Desk",
    "home.emergencyNote":
      "This portal handles non-emergency civic grievances only. For emergencies dial",
    "home.bandEyebrow": "Citizen participation",
    "home.bandTitle": "Spotted a civic issue in your neighbourhood?",
    "home.bandBody":
      "A pincode, a short description and an optional photograph are enough to start the process. Every report receives a reference ID and a public action timeline.",
    "home.bandPoint1": "Takes about two minutes",
    "home.bandPoint2": "Anonymous submissions accepted",
    "home.bandPoint3": "Downloadable acknowledgement receipt",

    // ---- live statistics ----
    "stats.region": "Live grievance statistics",
    "stats.total": "Total Reports",
    "stats.totalSub": "in the public register",
    "stats.resolved": "Resolved",
    "stats.rate": "closure rate",
    "stats.inProgress": "In Progress",
    "stats.inProgressSub": "assigned or under review",
    "stats.departments": "Active Departments",
    "stats.departmentsSub": "responding to live cases",
    "stats.live": "Live register",
    "stats.awaiting": "awaiting first report",
    "stats.viewAll": "View register",

    // ---- leadership ----
    "lead.eyebrow": "Constitutional leadership",
    "lead.title": "Guided by the people's mandate",
    "lead.note":
      "The portal operates under the administrative oversight of the State Grievance Redressal Council.",
    "lead.official": "Government of Tamil Nadu",
    "lead.placeholder": "Portrait placeholder",
    "lead.disclaimer":
      "Official photographs are published by the Department of Information and Public Relations. Designations are shown for orientation only.",

    // ---- departments ----
    "dept.eyebrow": "Service network",
    "dept.title": "Key Government Departments Joined",
    "dept.viewPerformance": "Departmental performance",

    // ---- district index ----
    "district.eyebrow": "Performance",
    "district.title": "District-wise Resolution Index",
    "district.month": "Current register",
    "district.live": "Live",
    "district.colDistrict": "District",
    "district.colReports": "Reports",
    "district.colIndex": "Resolution index",
    "district.stateIndex": "State resolution index",
    "district.resolved": "resolved",
    "district.districtsActive": "districts active",
    "district.fullReport": "Full analytics",

    // ---- grievance flow ----
    "flow.eyebrow": "Process",
    "flow.title": "Grievance Flowchart",
    "flow.s1": "Submit the grievance",
    "flow.s1Body":
      "Describe the issue, pin the location or enter a pincode, and attach up to three photographs.",
    "flow.s1Sla": "Instant reference ID",
    "flow.s2": "Verification and routing",
    "flow.s2Body":
      "The pincode is validated, duplicate reports are detected, and the case is routed to the responsible department.",
    "flow.s2Sla": "Within 24 hours",
    "flow.s3": "Departmental action",
    "flow.s3Body":
      "The nodal officer assigns a field team and records every action in the public timeline.",
    "flow.s3Sla": "First response in 3 days",
    "flow.s4": "Citizen verification",
    "flow.s4Body":
      "You are notified to confirm whether the issue has actually been resolved at the site.",
    "flow.s4Sla": "Citizen sign-off",
    "flow.s5": "Closure and audit",
    "flow.s5Body":
      "The case closes with a written closure note and enters the monthly departmental audit sample.",
    "flow.s5Sla": "Within 15 working days",
    "flow.escalation":
      "Cases breaching the timeline are escalated automatically to the District Nodal Officer and then to the State Grievance Redressal Council.",

    // ---- circulars ----
    "circ.eyebrow": "Official communications",
    "circ.title": "Latest Circulars & Press Releases",
    "circ.viewAll": "All circulars",
    "circ.note": "Demonstration copies generated by the portal.",
    "circ.archive": "Open the archive",

    // ---- FAQ ----
    "faq.eyebrow": "Citizen help",
    "faq.title": "Frequently Asked Questions",
    "faq.helpTitle": "Still need assistance?",
    "faq.helpBody": "Reach your district nodal officer for case-specific help.",
    "faq.helpCta": "Find your officer",

    // ---- report form ----
    "report.f.section1": "Describe the issue",
    "report.f.section2": "Pin the location",
    "report.f.section3": "Add evidence",
    "report.f.section4": "Contact details",
    "report.f.optional": "Optional",
    "report.f.draftNote": "Draft saved automatically on this device.",
    "report.f.errorTitle": "Please correct the highlighted fields",
    "report.f.errorCount": "{n} field(s) need attention.",
    "report.f.errTitle": "Enter a short, specific title (at least 6 characters).",
    "report.f.errDescription": "Describe the issue in at least 20 characters.",
    "report.f.minHint": "min. 20 characters",
    "report.f.errDistrict": "Select the district where the issue is located.",
    "report.f.errPincode": "Enter a valid 6-digit Tamil Nadu pincode.",
    "report.f.errLocation": "Add a street or landmark so the field team can find the site.",
    "report.f.errEmail": "Enter a valid email address, or leave the field blank.",
    "report.f.errPhone": "Enter a valid 10-digit Indian mobile number, or leave it blank.",
    "report.f.photoLimit": "You can attach up to 3 photographs.",
    "report.f.photoReadError": "That image could not be read. Please try another file.",
    "report.f.photoRemoveTitle": "Remove this photograph?",
    "report.f.photoRemoveBody":
      "The photograph will be removed from this draft and will not be submitted with the report.",
    "report.f.remove": "Remove photograph",
    "report.f.keep": "Keep photograph",
    "report.f.pinPreview": "AI triage preview",
    "report.f.pinPreviewHint": "Attach a photograph to reveal the instant triage tag.",
    "report.f.sidebarTitle": "Before you submit",
    "report.f.sidebarPoint1": "One civic issue per report — separate problems get separate reference IDs.",
    "report.f.sidebarPoint2": "Do not upload photographs of people, identity documents or number plates.",
    "report.f.sidebarPoint3": "Emergencies must be reported on 112, not through this portal.",
    "report.f.sla": "Service standard",
    "report.f.slaBody":
      "Acknowledgement within 24 hours; first response within 3 working days; closure within 15 working days.",
    "report.f.secure": "Your contact details are kept confidential and are never published.",
    "report.f.campaign": "Campaign source",
    "report.f.successTitle": "Grievance submitted successfully",
    "report.f.successBody":
      "Your report has been registered and queued for verification. Keep this reference ID to track departmental action.",
    "report.f.reference": "Reference ID",
    "report.f.track": "Track this grievance",
    "report.f.downloadReceipt": "Download acknowledgement",
    "report.f.another": "File another report",
    "report.f.receiptNote": "A plain-text acknowledgement receipt is generated on this device.",
  },

  ta: {
    "bar.network": "CIVICFORCE · ஸ்மார்ட் இந்தியா ஹேக்கத்தான் (SIH-26043) சமூகச் செயல் வலையமைப்பு",
    "bar.emergency": "அவசர குடிமை உதவி மையம்:",
    "bar.adminMode": "நிர்வாகி பயன்முறை",
    "bar.citizenMode": "பொதுக் குடிமகன் பயன்முறை",

    "header.tagline": "தமிழ்நாடு சமூகப் பிரச்சினை மற்றும் தீர்வு இயந்திரம்",
    "nav.home": "முகப்பு",
    "nav.challenges": "சவால்களை உலாவு",
    "nav.map": "நேரடி மாவட்ட வரைபடம்",
    "nav.admin": "நிர்வாக வரிசை",
    "header.report": "பிரச்சினையைப் புகாரளி",
    "header.signIn": "நிர்வாகி உள்நுழைவு",
    "header.signOut": "வெளியேறு",
    "header.themeToDark": "இரவுப் பயன்முறைக்கு மாறு",
    "header.themeToLight": "பகற்பயன்முறைக்கு மாறு",
    "header.language": "மொழி",

    "footer.network": "· தமிழ்நாடு சமூகச் செயல் வலையமைப்பு (SIH-26043)",
    "footer.privacy": "தனியுரிமைக் கொள்கை",
    "footer.terms": "சேவை விதிமுறைகள்",
    "footer.register": "பொதுப் பதிவேடு",
    "footer.rights": "© 2026 CIVICFORCE தளம்",

    "home.heroBadge": "செயலை நோக்கிய குடிமைத் தொழில்நுட்பத் தளம்",
    "home.h1a": "தமிழ்நாட்டின் சமூகச் சவால்களுக்கு",
    "home.h1b": "தீர்வுகளை ஒருங்கிணைத்தல்",
    "home.hero.p1":
      "CIVICFORCE, குடிமக்கள் புகாரளிக்கும் சமூகப் பிரச்சினைகளை முன்னணி பல்கலைக்கழகங்கள், நிறுவன ஆராய்ச்சி மையங்கள் மற்றும் நகராட்சித் துறைகளுடன் நேரடியாக இணைக்கிறது. நேரடி வரைபடம் தானாகச் சுட்டும் வகையில் உங்கள் இடத்தின் பெயரை உள்ளிடுங்கள்.",
    "home.ctaReport": "பிரச்சினையைப் பதிவு செய்",
    "home.ctaBrowse": "சவால் பதிவேட்டை உலாவு",
    "home.ctaMap": "நேரடி மாவட்ட வரைபடம்",
    "home.pipeline.h2": "சமூகப் பிரச்சினைகள் தீர்வை நோக்கி எவ்வாறு நகர்கின்றன",
    "home.pipeline.p":
      "குடிமக்கள், AI வகைப்பாடு மற்றும் நிபுணர் கூட்டாளர் நிறுவனங்களை இணைக்கும் 4 வெளிப்படையான நிலைகள்.",
    "home.step1.title": "குடிமகன் சமர்ப்பிக்கிறார்",
    "home.step1.body":
      "உங்கள் இடத்தை உள்ளிடுங்கள் — வரைபடம் தானாகச் சுட்டும். வகையைத் தேர்ந்தெடுக்கத் தேவையில்லை.",
    "home.step2.title": "தானியங்கி AI வகைப்பாடு",
    "home.step2.body":
      "AI வகையைக் குறியிட்டு, அவசர அளவைக் கணக்கிட்டு, பல்கலைக்கழகம் அல்லது தொழில் கூட்டாளரைப் பொருத்துகிறது.",
    "home.step3.title": "நிர்வாக ஒதுக்கீடு",
    "home.step3.body":
      "அதிகாரப்பூர்வ மதிப்பாய்வாளர் வகைப்பாட்டை உறுதிப்படுத்தி நிபுணர் கூட்டாளருக்கு ஒதுக்குகிறார்.",
    "home.step4.title": "பொது நேரடி காலவரிசை",
    "home.step4.body":
      "குடிமக்கள் தனிப்பட்ட தொடர்புத் தகவல் பாதுகாப்புடன் நேரடித் தீர்வை கண்காணிக்கின்றனர்.",
    "home.stat.total": "பதிவேட்டில் உள்ள மொத்த சவால்கள்",
    "home.stat.resolved": "தீர்க்கப்பட்ட பிரச்சினைகள்",
    "home.stat.districts": "செயலில் உள்ள மாவட்டங்கள்",
    "home.stat.rate": "வகைப்பாட்டுத் தீர்வு விகிதம்",
    "home.recent.h2": "சமீபத்திய குடிமக்கள் புகார்கள்",
    "home.recent.p": "தமிழ்நாடு முழுவதிலுமிருந்து நேரடிக் குடிமகன் புகார்கள்",
    "home.recent.eyebrow": "பொது பதிவேடு",
    "home.recent.empty": "பதிவேட்டில் இன்னும் புகார்கள் இல்லை",
    "home.recent.emptyHint":
      "உங்கள் பகுதியில் குடிமைப் பிரச்சினையைப் பதிவு செய்யும் முதல் குடிமகனாகுங்கள்.",
    "home.recent.viewAll": "அனைத்து புகார்களையும் பார்க்க →",

    "report.h1": "சமூகச் சவாலைப் புகாரளி",
    "report.intro.a": "பிரச்சினை எங்குள்ளது என்பதை உள்ளிடுங்கள். நேரடி வரைபடம்",
    "report.intro.strong": "உங்கள் இடத்தைத் தானாகச் சுட்டும்",
    "report.intro.b": "நீங்கள் தேடவோ கைமுறையாகக் கிளிக் செய்யவோ தேவை இல்லை.",
    "report.f.title": "பிரச்சினைத் தலைப்பு",
    "report.f.titlePh":
      "எ.கா. பள்ளிச் சாலை சந்திப்பில் பெரிய குடிநீர் குழாய் வெடித்து வெள்ளம்",
    "report.f.description": "விரிவான விவரம்",
    "report.f.descriptionPh":
      "சேதத்தின் அளவு, எவ்வளவு காலமாக நீடிக்கிறது, பாதுகாப்பு, போக்குவரத்து அல்லது குடிநீர் விநியோகத்திற்கு உள்ள நேரடி ஆபத்து ஆகியவற்றை விவரிக்கவும்...",
    "report.f.district": "மாவட்டம் (தமிழ்நாடு)",
    "report.f.districtPh": "-- மாவட்டத்தைத் தேர்ந்தெடுக்கவும் (வரைபடம் தானாக மையப்படுத்தும்) --",
    "report.f.pincode": "அஞ்சல் குறியீடு (6 இலக்கம்)",
    "report.f.pincodePh": "எ.கா. 600018",
    "report.f.pinLookup": "மாவட்டம் தேடப்படுகிறது...",
    "report.f.pinFound": "மாவட்டம் {district} என அமைக்கப்பட்டது",
    "report.f.pinNotFound": "இந்த அஞ்சல் குறியீட்டிற்கு மாவட்டம் கிடைக்கவில்லை. கைமுறையாகத் தேர்ந்தெடுக்கவும்.",
    "report.f.pinOutOfState": "இந்த அஞ்சல் குறியீடு தமிழ்நாட்டிற்கு வெளியே {state} மாநிலத்தில் உள்ளது. தமிழ்நாட்டு மாவட்டத்தைத் தேர்ந்தெடுக்கவும்.",
    "report.f.pinError": "அஞ்சல் குறியீடு சேவையை அணுக முடியவில்லை. மாவட்டத்தை கைமுறையாகத் தேர்ந்தெடுக்கவும்.",
    "report.f.aiPreviewLabel": "AI முன்னோட்டம்:",
    "report.f.aiPreviewHint": "உடனடி வகைப்பாட்டுக் குறியைப் பார்க்க புகைப்படத்தை இணைக்கவும்.",
    "report.f.draftRestored": "கடைசி அமர்விலிருந்து வரைவு மீட்டெடுக்கப்பட்டது.",
    "report.f.draftClear": "வரைவை அழி",
    "report.f.locality": "பிரச்சினை உள்ள இடத்தை உள்ளிடுங்கள் (வரைபடம் தானாகச் சுட்டும்)",
    "report.f.localityPh":
      "பகுதி அல்லது தெரு பெயரை உள்ளிடுங்கள் (எ.கா. Anna Salai, Ukkadam, Srirangam, Gandhipuram, Periyar Bus Stand)...",
    "report.f.tryClicking": "முயற்சித்துப் பாருங்கள்:",
    "report.f.pinned": "தானாகப் பொருத்தப்பட்ட இடம்:",
    "report.f.map": "நேரடி ஊடாடும் வரைபடம்",
    "report.f.mapHelp":
      "நீங்கள் தட்டச்சு செய்யும்போது வரைபடம் தானாக அந்த இடத்திற்குச் செல்லும். பின்னை இழுத்தும் சரிசெய்யலாம்.",
    "report.f.photos": "புகைப்படங்களை இணைக்கவும் (அதிகபட்சம் 3, 5MB வரை)",
    "report.f.photosCta": "புகைப்படச் சான்றை இணைக்க கிளிக் செய்யவும்",
    "report.f.photo": "புகைப்படம்",
    "report.f.photoCount": "{n} / 3 புகைப்படங்கள் சேர்க்கப்பட்டன",
    "report.f.aiNotice": "தானியங்கி AI வகைப்பாடு:",
    "report.f.aiNoticeBody":
      "வகையைத் தேர்ந்தெடுக்கத் தேவையில்லை. சமர்ப்பிக்கும்போது எங்கள் AI இயந்திரம் பிரச்சினை வகை, அவசர அளவு மற்றும் பரிந்துரைக்கப்பட்ட கூட்டாளர் வகையைத் தானாக வகைப்படுத்தும்.",
    "report.f.contact": "விருப்பப்பட்ட குடிமகன் தொடர்பு",
    "report.f.confidential": "முற்றிலும் ரகசியம்",
    "report.f.name": "முழுப் பெயர் (விருப்பம்)",
    "report.f.phone": "தொலைபேசி எண் (விருப்பம்)",
    "report.f.email": "மின்னஞ்சல் முகவரி (விருப்பம்)",
    "report.f.contactNote":
      "உங்கள் தொடர்புத் தகவல்கள் பொதுப் புகார்களில் ஒருபோதும் காட்டப்படாது. அதிகாரம் பெற்ற மதிப்பாய்வாளர்கள் மட்டுமே அவற்றைப் பார்க்க முடியும்.",
    "report.f.submit": "புகாரைச் சமர்ப்பித்து AI வகைப்பாட்டை இயக்கு",
    "report.f.cancel": "ரத்து செய்",

    "ch.h1": "பொதுச் சவால் பதிவேடு",
    "ch.p": "தமிழ்நாடு முழுவதும் சமர்ப்பிக்கப்பட்ட சமூகச் சவால்களை உலாவி தேடுங்கள்",
    "ch.searchPh": "தலைப்பு, விவரம் அல்லது அடையாளத்தைத் தேடுங்கள்...",
    "ch.allDistricts": "அனைத்து மாவட்டங்கள்",
    "ch.allCategories": "அனைத்து வகைகள்",
    "ch.allStatuses": "அனைத்து நிலைகள்",
    "ch.reset": "வடிகட்டிகளை மீட்டமை",
    "ch.showing": "{total} புகார்களில் {n} காட்டப்படுகிறது",
    "ch.searchAria": "தலைப்பு, விவரம் அல்லது அடையாளத்தின் மூலம் புகார்களைத் தேடு",
    "ch.live": "நேரடிப் பதிவேடு",

    // ---- page headings ----
    "page.report.eyebrow": "குடிமகன் குறை",
    "page.challenges.eyebrow": "பொது பதிவேடு",
    "page.map.eyebrow": "புவியியல்",
    "page.login.eyebrow": "கட்டுப்படுத்தப்பட்ட அணுகல்",
    "page.privacy.eyebrow": "சட்டம்",
    "page.terms.eyebrow": "சட்டம்",
    "page.admin.eyebrow": "அதிகாரப்பூர்வப் பயன்பாடு",
    "page.analytics.eyebrow": "செயல்திறன்",
    "page.analytics.title": "மாவட்ட செயல்திறன் புள்ளிவிவரம்",
    "page.officers.eyebrow": "அடைவு",
    "page.officers.title": "மாவட்ட முனை அதிகாரிகள்",
    "page.circulars.eyebrow": "காப்பகம்",
    "page.circulars.title": "சுற்றறிக்கைகள் & செய்திக் குறிப்புகள்",
    "page.accessibility.eyebrow": "உள்ளடக்கம்",
    "page.accessibility.title": "அணுகல் அறிக்கை",
    "ch.empty": "உங்கள் வடிகட்டிகளுக்குப் பொருந்தும் புகார்கள் இல்லை",

    "detail.back": "← அனைத்து புகார்களுக்கும் திரும்பு",
    "detail.notFound": "கண்காணிப்பு ID-க்கு சவால் எதுவும் கிடைக்கவில்லை",
    "detail.notFoundP": "புகார் நீக்கப்பட்டிருக்கலாம் அல்லது கண்காணிப்பு இணைப்பு தவறாக இருக்கலாம்.",
    "detail.copy": "கண்காணிப்பு இணைப்பை நகலெடு",
    "detail.description": "பிரச்சினை விவரம்",
    "detail.district": "மாவட்டம்:",
    "detail.location": "இடம்:",
    "detail.coords": "பொருத்தப்பட்ட ஆயத்தொலைவுகள்:",
    "detail.pincode": "அஞ்சல் குறியீடு:",
    "detail.submitted": "சமர்ப்பிக்கப்பட்டது:",
    "detail.noneSpecified": "குறிப்பிடப்படவில்லை",
    "detail.ai": "AI வகைப்பாட்டு மதிப்பீடு",
    "detail.aiSuggested": "AI பரிந்துரை",
    "detail.partner": "ஒதுக்கப்பட்ட தீர்வுக் கூட்டாளர்",
    "detail.timeline": "நிலைக் காலவரிசை",
    "detail.print": "பதிவை அச்சிடு",
    "detail.reference": "குறிப்பு எண்",
    "detail.status": "தற்போதைய நிலை",
    "detail.department": "பொறுப்பான துறை",
    "detail.mapLink": "மாவட்ட வரைபடத்தில் பார்",
    "detail.timelineNote": "ஒவ்வொரு துறைசார் நடவடிக்கையும் இந்தப் பொது காலவரிசையில் பதிவு செய்யப்படுகிறது.",
    "detail.loading": "குறைப் பதிவு ஏற்றப்படுகிறது",
    "detail.share": "பகிர்",

    "map.h1": "நேரடி ஊடாடும் தமிழ்நாடு வரைபடம்",
    "map.p":
      "செயலில் உள்ள சம்பவப் பின்கள் மற்றும் மாவட்டக் குழுக்களைக் காட்டும் முழுமையாக இயங்கும் நேரடி OpenStreetMap. புகாரைப் பார்க்க எந்தப் பின்னையும் கிளிக் செய்யவும்.",
    "map.pins": "பின்கள்:",
    "map.normalPin": "சாதாரண சம்பவம்",
    "map.urgentPin": "அதி அவசர சம்பவம்",
    "map.clusterPin": "மாவட்டக் குழு",
    "map.attribution": "வரைபடத் தரவு ©",
    "map.attributionAfter": "பங்களிப்பாளர்கள்",
    "map.centers": "விரைவு மாவட்ட மையங்கள் (மென்மையாக ஜூம் செய்ய கிளிக் செய்யவும்)",
    "map.reportCount": "{n} புகார்கள்",
    "map.reportCountOne": "{n} புகார்",
    "map.viewChallenge": "முழுச் சவாலைப் பார்க்க →",

    "login.h1": "அதிகாரப்பூர்வ நிர்வாகி உள்நுழைவு",
    "login.p": "CIVICFORCE மதிப்பாய்வாளர் கட்டளை வரிசை",
    "login.error": "அணுகல் மறுக்கப்பட்டது: அதிகாரப்பூர்வ மின்னஞ்சல் அல்லது கடவுச்சொல் தவறு.",
    "login.email": "நிர்வாகி அதிகாரப்பூர்வ மின்னஞ்சல்",
    "login.password": "கடவுச்சொல்",
    "login.creds": "நிர்வாகி சான்றுகள்:",
    "login.emailLabel": "மின்னஞ்சல்:",
    "login.passwordLabel": "கடவுச்சொல்:",
    "login.submit": "பாதுகாப்பாக உள்நுழைக",
    "login.back": "குடிமக்கள் இணையதளத்திற்குத் திரும்பு",
    "login.secure":
      "சான்றுகள் துறைசார் அங்கீகாரச் சேவையால் சரிபார்க்கப்படும்; இந்த உலாவியில் சேமிக்கப்படாது.",

    "admin.badge": "சரிபார்க்கப்பட்ட அதிகாரப்பூர்வ நிர்வாக அமர்வு",
    "admin.h1": "நிர்வாக மதிப்பாய்வு வரிசை",
    "admin.loggedInAs": "உள்நுழைந்தவர்",
    "admin.coordinator": "மாநில ஒருங்கிணைப்பாளர் (நிர்வாகி)",
    "admin.signOut": "வெளியேறு",
    "admin.allQueue": "முழு வரிசை",
    "admin.thId": "ID",
    "admin.thTitle": "பிரச்சினைத் தலைப்பு",
    "admin.thDistrict": "மாவட்டம்",
    "admin.thCategory": "AI வகை",
    "admin.thUrgency": "அவசரம்",
    "admin.thStatus": "நிலை",
    "admin.thContact": "குடிமகன் தொடர்பு (ரகசியம்)",
    "admin.thAction": "செயல்",
    "admin.anonymous": "அநாமதேயம்",
    "admin.review": "மதிப்பாய்வு →",

    "review.back": "← நிர்வாக வரிசைக்குத் திரும்பு",
    "review.notFound": "புகார் கிடைக்கவில்லை",
    "review.confidential": "ரகசிய குடிமகன் தொடர்பு (நிர்வாகிகளுக்கு மட்டும்)",
    "review.protected": "பாதுகாக்கப்பட்டது",
    "review.citizen": "குடிமகன்:",
    "review.phone": "தொலைபேசி:",
    "review.email": "மின்னஞ்சல்:",
    "review.notGiven": "வழங்கப்படவில்லை",
    "review.h2": "AI வகைப்பாட்டுத் திருத்தம் & கூட்டாளர் ஒதுக்கீடு",
    "review.category": "வகை",
    "review.urgencyPriority": "அவசர முன்னுரிமை",
    "review.summary": "AI சுருக்கம் (திருத்தக்கூடியது)",
    "review.partner": "தீர்வுக் கூட்டாளரை ஒதுக்கு",
    "review.noPartner": "-- இன்னும் கூட்டாளர் ஒதுக்கப்படவில்லை --",
    "review.status": "நிலை",
    "review.timelineUpdate": "பொது காலவரிசைப் புதுப்பிப்பு",
    "review.timelinePh": "எ.கா. கள ஆய்வு முடிந்தது. 48 மணி நேரத்தில் பழுது நீக்கம் திட்டமிடப்பட்டுள்ளது.",
    "review.save": "மாற்றங்களைச் சேமித்து காலவரிசையைப் புதுப்பி",
    "review.cancel": "ரத்து செய்",
    "review.grpGov": "அரசு அலுவலகங்கள்",
    "review.grpUni": "பல்கலைக்கழகங்கள் & ஆராய்ச்சி நிறுவனங்கள்",
    "review.grpCsr": "தொழில் & நிறுவன CSR",

    "privacy.h1": "தனியுரிமைக் கொள்கை",
    "privacy.updated":
      "கடைசி புதுப்பிப்பு: அக்டோபர் 2026 · CIVICFORCE தமிழ்நாடு சமூகச் செயல் வலையமைப்பு",
    "terms.h1": "சேவை விதிமுறைகள்",
    "terms.updated":
      "கடைசி புதுப்பிப்பு: அக்டோபர் 2026 · CIVICFORCE தமிழ்நாடு சமூகச் செயல் வலையமைப்பு",
    "common.returnHome": "← முகப்பிற்குத் திரும்பு",

    "urg.high": "அதி அவசரம்",
    "urg.normal": "சாதாரணம்",
    "urg.normalPriority": "சாதாரண முன்னுரிமை",
    "urg.highPriority": "அதி அவசரம்",
    "urg.highShort": "அதிகம்",

    "cat.roads": "சாலைகள் & நடைபாதைகள்",
    "cat.water": "நீர் & வடிகால்",
    "cat.lighting": "தெரு விளக்குகள்",
    "cat.waste": "கழிவு & சுகாதாரம்",
    "cat.spaces": "பொது இடங்கள்",
    "cat.other": "மற்றவை",

    "status.new": "புதியது",
    "status.underReview": "மதிப்பாய்வில்",
    "status.assigned": "ஒதுக்கப்பட்டது",
    "status.inProgress": "நடைபெறுகிறது",
    "status.resolved": "தீர்க்கப்பட்டது",
    "status.rejected": "நிராகரிக்கப்பட்டது",

    // ---- government portal chrome ----
    "gov.utility.govOfTn": "தமிழ்நாடு அரசு",
    "gov.utility.textSize": "எழுத்து அளவு",
    "gov.utility.textSmaller": "எழுத்து அளவைக் குறை",
    "gov.utility.textNormal": "இயல்பான எழுத்து அளவு",
    "gov.utility.textLarger": "எழுத்து அளவை அதிகரி",
    "gov.utility.contrastOn": "அதிக மாறுபாட்டை இயக்கு",
    "gov.utility.contrastOff": "அதிக மாறுபாட்டை நிறுத்து",
    "gov.utility.theme": "வண்ணத் தீம்",
    "gov.utility.themeLight": "ஒளி தீம்",
    "gov.utility.themeDark": "இருண்ட தீம்",
    "gov.utility.themeSystem": "கணினி தீம்",
    "gov.utility.lang": "மொழி",
    "gov.a11y.contrast": "மாறுபாடு",
    "gov.brandHome": "சிவிக்ஃபோர்ஸ் தமிழ்நாடு — முகப்பு",
    "gov.tagline": "குடிமக்கள் செயல் இயந்திரம்",
    "gov.nav.home": "முகப்பு",
    "gov.nav.issues": "புகார்களை உலாவு",
    "gov.nav.map": "மாவட்ட வரைபடம்",
    "gov.nav.analytics": "புள்ளிவிவரம்",
    "gov.nav.officers": "முனை அதிகாரிகள்",
    "gov.nav.circulars": "சுற்றறிக்கைகள்",
    "gov.search": "தேடு",
    "gov.searchPlaceholder": "இணையதளத்தில் தேடு",
    "gov.report": "பிரச்சினையைப் பதிவு செய்",
    "gov.openMenu": "பட்டியைத் திற",
    "gov.closeMenu": "பட்டியை மூடு",
    "gov.menu": "வழிசெலுத்தல் பட்டி",
    "gov.admin": "நிர்வாகி உள்நுழைவு",
    "gov.signOut": "வெளியேறு",

    // ---- home hero ----
    "home.badge": "தமிழ்நாடு அரசு · குடிமக்கள் செயல் இயந்திரம்",
    "home.heroTitle1": "குடிமக்கள் குறைகள்,",
    "home.heroTitle2": "பொறுப்புடன் தீர்க்கப்படும்.",
    "home.heroBody":
      "சிவிக்ஃபோர்ஸ் தமிழ்நாடு, குடிமக்களை அவர்களது பகுதிக்குப் பொறுப்பான துறைகளுடன் நேரடியாக இணைக்கிறது. பிரச்சினையைப் பதிவு செய்து, ஆதாரங்களை இணைத்து, முடிவடையும் வரை ஒவ்வொரு நடவடிக்கையையும் கண்காணியுங்கள்.",
    "home.ctaTrack": "குறையைக் கண்காணி",
    "home.ctaHow": "இது எப்படி செயல்படுகிறது",
    "home.trust.depts": "அரசுத் துறைகள்",
    "home.trust.districts": "மாவட்டங்கள்",
    "home.trust.sla": "நாள் சேவைத் தரம்",
    "home.trust.note":
      "கணக்கு, ஆதார் அல்லது கட்டணம் தேவையில்லை. குறிப்பு எண் உடனடியாக வழங்கப்படும்.",
    "home.emergency": "அவசர உதவி மையம்",
    "home.emergencyNote":
      "இந்த இணையதளம் அவசரமற்ற குடிமைக் குறைகளுக்கு மட்டுமே. அவசரநிலைக்கு அழைக்கவும்",
    "home.bandEyebrow": "குடிமக்கள் பங்கேற்பு",
    "home.bandTitle": "உங்கள் பகுதியில் குடிமைப் பிரச்சினை கண்டீர்களா?",
    "home.bandBody":
      "அஞ்சல் குறியீடு, சிறு விவரம் மற்றும் விருப்பமான புகைப்படம் போதும். ஒவ்வொரு புகாருக்கும் குறிப்பு எண் மற்றும் பொது நடவடிக்கை பட்டியல் வழங்கப்படும்.",
    "home.bandPoint1": "சுமார் இரண்டு நிமிடங்கள்",
    "home.bandPoint2": "பெயர் தெரிவிக்காமல் சமர்ப்பிக்கலாம்",
    "home.bandPoint3": "பதிவிறக்கக்கூடிய ஒப்புகை சீட்டு",

    // ---- live statistics ----
    "stats.region": "நேரடி குறை புள்ளிவிவரங்கள்",
    "stats.total": "மொத்தப் புகார்கள்",
    "stats.totalSub": "பொது பதிவேட்டில்",
    "stats.resolved": "தீர்க்கப்பட்டவை",
    "stats.rate": "தீர்வு விகிதம்",
    "stats.inProgress": "நடைபெறுகிறது",
    "stats.inProgressSub": "ஒதுக்கப்பட்டது அல்லது மதிப்பாய்வில்",
    "stats.departments": "செயலில் உள்ள துறைகள்",
    "stats.departmentsSub": "நடப்பு வழக்குகளில் ஈடுபட்டுள்ளன",
    "stats.live": "நேரடிப் பதிவேடு",
    "stats.awaiting": "முதல் புகாருக்காக காத்திருக்கிறது",
    "stats.viewAll": "பதிவேட்டைப் பார்",

    // ---- leadership ----
    "lead.eyebrow": "அரசியலமைப்புத் தலைமை",
    "lead.title": "மக்கள் ஆணையால் வழிநடத்தப்படுகிறது",
    "lead.note":
      "இந்த இணையதளம் மாநில குறைதீர் ஆலோசனைக் குழுவின் நிர்வாக மேற்பார்வையில் செயல்படுகிறது.",
    "lead.official": "தமிழ்நாடு அரசு",
    "lead.placeholder": "உருவப்பட முன்னோட்டம்",
    "lead.disclaimer":
      "அதிகாரப்பூர்வ புகைப்படங்கள் தகவல் மற்றும் மக்கள் தொடர்புத் துறையால் வெளியிடப்படுகின்றன. பதவிகள் தகவலுக்காக மட்டுமே காட்டப்படுகின்றன.",

    // ---- departments ----
    "dept.eyebrow": "சேவை வலையமைப்பு",
    "dept.title": "இணைந்த முக்கிய அரசுத் துறைகள்",
    "dept.viewPerformance": "துறைசார் செயல்திறன்",

    // ---- district index ----
    "district.eyebrow": "செயல்திறன்",
    "district.title": "மாவட்ட வாரியான தீர்வுக் குறியீடு",
    "district.month": "தற்போதைய பதிவேடு",
    "district.live": "நேரடி",
    "district.colDistrict": "மாவட்டம்",
    "district.colReports": "புகார்கள்",
    "district.colIndex": "தீர்வுக் குறியீடு",
    "district.stateIndex": "மாநில தீர்வுக் குறியீடு",
    "district.resolved": "தீர்க்கப்பட்டது",
    "district.districtsActive": "மாவட்டங்கள் செயலில்",
    "district.fullReport": "முழு புள்ளிவிவரம்",

    // ---- grievance flow ----
    "flow.eyebrow": "செயல்முறை",
    "flow.title": "குறை தீர்வு வரைபடம்",
    "flow.s1": "குறையைச் சமர்ப்பி",
    "flow.s1Body":
      "பிரச்சினையை விவரித்து, இருப்பிடத்தைக் குறி அல்லது அஞ்சல் குறியீட்டை உள்ளிட்டு, மூன்று புகைப்படங்கள் வரை இணைக்கவும்.",
    "flow.s1Sla": "உடனடி குறிப்பு எண்",
    "flow.s2": "சரிபார்ப்பு மற்றும் வழிமாற்றம்",
    "flow.s2Body":
      "அஞ்சல் குறியீடு சரிபார்க்கப்பட்டு, நகல் புகார்கள் கண்டறியப்பட்டு, வழக்கு பொறுப்பான துறைக்கு அனுப்பப்படும்.",
    "flow.s2Sla": "24 மணி நேரத்தில்",
    "flow.s3": "துறைசார் நடவடிக்கை",
    "flow.s3Body":
      "முனை அதிகாரி களப் பணிக்குழுவை நியமித்து, ஒவ்வொரு நடவடிக்கையையும் பொது பட்டியலில் பதிவு செய்வார்.",
    "flow.s3Sla": "3 நாட்களில் முதல் பதில்",
    "flow.s4": "குடிமகன் சரிபார்ப்பு",
    "flow.s4Body":
      "பிரச்சினை உண்மையில் தளத்தில் தீர்க்கப்பட்டதா என்பதை உறுதிப்படுத்த உங்களுக்கு அறிவிக்கப்படும்.",
    "flow.s4Sla": "குடிமகன் ஒப்புதல்",
    "flow.s5": "நிறைவு மற்றும் தணிக்கை",
    "flow.s5Body":
      "எழுத்துப்பூர்வ நிறைவுக் குறிப்புடன் வழக்கு மூடப்பட்டு, மாதாந்திர துறைசார் தணிக்கை மாதிரியில் சேர்க்கப்படும்.",
    "flow.s5Sla": "15 வேலை நாட்களில்",
    "flow.escalation":
      "காலக்கெடுவை மீறும் வழக்குகள் தானாகவே மாவட்ட முனை அதிகாரிக்கும், பின்னர் மாநில குறைதீர் ஆலோசனைக் குழுவிற்கும் மேல்நிலைக்கு அனுப்பப்படும்.",

    // ---- circulars ----
    "circ.eyebrow": "அதிகாரப்பூர்வ தகவல்கள்",
    "circ.title": "சமீபத்திய சுற்றறிக்கைகள் & செய்திக் குறிப்புகள்",
    "circ.viewAll": "அனைத்து சுற்றறிக்கைகள்",
    "circ.note": "இணையதளத்தால் உருவாக்கப்பட்ட மாதிரி நகல்கள்.",
    "circ.archive": "காப்பகத்தைத் திற",

    // ---- FAQ ----
    "faq.eyebrow": "குடிமகன் உதவி",
    "faq.title": "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    "faq.helpTitle": "இன்னும் உதவி தேவையா?",
    "faq.helpBody": "வழக்கு சார்ந்த உதவிக்கு உங்கள் மாவட்ட முனை அதிகாரியை அணுகவும்.",
    "faq.helpCta": "உங்கள் அதிகாரியைக் கண்டறியுங்கள்",

    // ---- report form ----
    "report.f.section1": "பிரச்சினையை விவரி",
    "report.f.section2": "இருப்பிடத்தைக் குறி",
    "report.f.section3": "ஆதாரங்களைச் சேர்",
    "report.f.section4": "தொடர்பு விவரங்கள்",
    "report.f.optional": "விருப்பம்",
    "report.f.draftNote": "வரைவு இந்தச் சாதனத்தில் தானாகச் சேமிக்கப்படுகிறது.",
    "report.f.errorTitle": "குறிப்பிட்ட புலங்களைச் சரிசெய்யவும்",
    "report.f.errorCount": "{n} புலங்களுக்கு கவனம் தேவை.",
    "report.f.errTitle": "சுருக்கமான தலைப்பை உள்ளிடவும் (குறைந்தது 6 எழுத்துகள்).",
    "report.f.errDescription": "பிரச்சினையை குறைந்தது 20 எழுத்துகளில் விவரிக்கவும்.",
    "report.f.minHint": "குறைந்தது 20 எழுத்துகள்",
    "report.f.errDistrict": "பிரச்சினை உள்ள மாவட்டத்தைத் தேர்ந்தெடுக்கவும்.",
    "report.f.errPincode": "சரியான 6 இலக்க தமிழ்நாடு அஞ்சல் குறியீட்டை உள்ளிடவும்.",
    "report.f.errLocation": "களப் பணிக்குழு கண்டறிய தெரு அல்லது அடையாளத்தைச் சேர்க்கவும்.",
    "report.f.errEmail": "சரியான மின்னஞ்சலை உள்ளிடவும் அல்லது காலியாக விடவும்.",
    "report.f.errPhone": "சரியான 10 இலக்க கைபேசி எண்ணை உள்ளிடவும் அல்லது காலியாக விடவும்.",
    "report.f.photoLimit": "அதிகபட்சம் 3 புகைப்படங்கள் மட்டுமே இணைக்கலாம்.",
    "report.f.photoReadError": "அந்தப் படத்தைப் படிக்க முடியவில்லை. வேறு கோப்பை முயற்சிக்கவும்.",
    "report.f.photoRemoveTitle": "இந்தப் புகைப்படத்தை நீக்கவா?",
    "report.f.photoRemoveBody":
      "இந்தப் புகைப்படம் வரைவிலிருந்து நீக்கப்படும்; புகாருடன் சமர்ப்பிக்கப்படாது.",
    "report.f.remove": "புகைப்படத்தை நீக்கு",
    "report.f.keep": "புகைப்படத்தை வைத்திரு",
    "report.f.pinPreview": "AI வகைப்பாட்டு முன்னோட்டம்",
    "report.f.pinPreviewHint": "உடனடி வகைப்பாட்டைக் காண ஒரு புகைப்படத்தை இணைக்கவும்.",
    "report.f.sidebarTitle": "சமர்ப்பிக்கும் முன்",
    "report.f.sidebarPoint1": "ஒரு புகாருக்கு ஒரு பிரச்சினை — தனித் தனி குறிப்பு எண்கள் வழங்கப்படும்.",
    "report.f.sidebarPoint2": "மக்கள், அடையாள ஆவணங்கள் அல்லது வாகன எண்களின் புகைப்படங்களைப் பதிவேற்ற வேண்டாம்.",
    "report.f.sidebarPoint3": "அவசரநிலைகளுக்கு 112 ஐ அழைக்கவும், இந்த இணையதளம் அல்ல.",
    "report.f.sla": "சேவைத் தரம்",
    "report.f.slaBody":
      "24 மணி நேரத்தில் ஒப்புகை; 3 வேலை நாட்களில் முதல் பதில்; 15 வேலை நாட்களில் தீர்வு.",
    "report.f.secure": "உங்கள் தொடர்பு விவரங்கள் ரகசியமாக வைக்கப்படும்; வெளியிடப்படாது.",
    "report.f.campaign": "பிரச்சார மூலம்",
    "report.f.successTitle": "குறை வெற்றிகரமாகச் சமர்ப்பிக்கப்பட்டது",
    "report.f.successBody":
      "உங்கள் புகார் பதிவு செய்யப்பட்டு சரிபார்ப்புக்கு வரிசைப்படுத்தப்பட்டுள்ளது. துறைசார் நடவடிக்கையைக் கண்காண இந்தக் குறிப்பு எண்ணை வைத்திருங்கள்.",
    "report.f.reference": "குறிப்பு எண்",
    "report.f.track": "இந்தக் குறையைக் கண்காணி",
    "report.f.downloadReceipt": "ஒப்புகையைப் பதிவிறக்கு",
    "report.f.another": "மற்றொரு புகாரைப் பதிவு செய்",
    "report.f.receiptNote": "எளிய உரை ஒப்புகை இந்தச் சாதனத்தில் உருவாக்கப்படும்.",
  },

  hi: {
    "bar.network": "CIVICFORCE · स्मार्ट इंडिया हैकाथॉन (SIH-26043) सामाजिक कार्य नेटवर्क",
    "bar.emergency": "आपातकालीन नागरिक डेस्क:",
    "bar.adminMode": "व्यवस्थापक मोड",
    "bar.citizenMode": "सार्वजनिक नागरिक मोड",

    "header.tagline": "तमिलनाडु सामाजिक समस्या और समाधान इंजन",
    "nav.home": "होम",
    "nav.challenges": "चुनौतियाँ देखें",
    "nav.map": "लाइव जिला मानचित्र",
    "nav.admin": "प्रशासनिक कतार",
    "header.report": "समस्या की रिपोर्ट करें",
    "header.signIn": "एडमिन साइन-इन",
    "header.signOut": "साइन आउट",
    "header.themeToDark": "रात मोड पर स्विच करें",
    "header.themeToLight": "दिन मोड पर स्विच करें",
    "header.language": "भाषा",

    "footer.network": "· तमिलनाडु सामाजिक कार्य नेटवर्क (SIH-26043)",
    "footer.privacy": "गोपनीयता नीति",
    "footer.terms": "सेवा की शर्तें",
    "footer.register": "सार्वजनिक रजिस्टर",
    "footer.rights": "© 2026 CIVICFORCE प्लेटफ़ॉर्म",

    "home.heroBadge": "कार्रवाई-आधारित सिविक टेक प्लेटफ़ॉर्म",
    "home.h1a": "तमिलनाडु की सामाजिक चुनौतियों के लिए",
    "home.h1b": "समाधान जुटाना",
    "home.hero.p1":
      "CIVICFORCE नागरिकों द्वारा दर्ज सामाजिक समस्याओं को सीधे प्रमुख विश्वविद्यालयों, कॉर्पोरेट उद्योग अनुसंधान और नगरपालिका विभागों से जोड़ता है। लाइव मानचित्र को स्वतः इंगित करने के लिए अपना स्थान टाइप करें।",
    "home.ctaReport": "समस्या की रिपोर्ट करें (स्वतः-इंगित मानचित्र)",
    "home.ctaBrowse": "चुनौती रजिस्टर देखें",
    "home.ctaMap": "लाइव जिला मानचित्र",
    "home.pipeline.h2": "सामाजिक समस्याएँ समाधान तक कैसे पहुँचती हैं",
    "home.pipeline.p":
      "नागरिकों, AI वर्गीकरण और विशेषज्ञ साझेदार संस्थानों को जोड़ने वाले 4 पारदर्शी चरण।",
    "home.step1.title": "नागरिक जमा करता है",
    "home.step1.body":
      "अपना स्थान टाइप करें — मानचित्र स्वतः उस पर इंगित करेगा। श्रेणी चुनने की आवश्यकता नहीं।",
    "home.step2.title": "स्वचालित AI ट्राइज",
    "home.step2.body":
      "AI श्रेणी टैग करता है, तात्कालिकता आँकता है और विश्वविद्यालय या उद्योग साझेदार मिलाता है।",
    "home.step3.title": "प्रशासनिक असाइनमेंट",
    "home.step3.body":
      "आधिकारिक समीक्षक वर्गीकरण की पुष्टि करता है और विशेषज्ञ साझेदार को सौंपता है।",
    "home.step4.title": "सार्वजनिक लाइव टाइमलाइन",
    "home.step4.body":
      "नागरिक निजी संपर्क सुरक्षा के साथ वास्तविक समय में समाधान ट्रैक करते हैं।",
    "home.stat.total": "डेटाबेस में कुल चुनौतियाँ",
    "home.stat.resolved": "हल की गई समस्याएँ",
    "home.stat.districts": "सक्रिय जिले",
    "home.stat.rate": "ट्राइज समाधान दर",
    "home.recent.h2": "हाल की सामाजिक चुनौतियाँ",
    "home.recent.p": "तमिलनाडु भर से लाइव नागरिक रिपोर्टें",
    "home.recent.viewAll": "सभी रिपोर्टें देखें →",

    "report.h1": "सामाजिक चुनौती की रिपोर्ट करें",
    "report.intro.a": "बताएँ कि समस्या कहाँ है। लाइव मानचित्र",
    "report.intro.strong": "स्वतः सीधे आपके स्थान पर इंगित करेगा",
    "report.intro.b": "आपको खोजने या मैन्युअल रूप से क्लिक करने की आवश्यकता नहीं है।",
    "report.f.title": "समस्या शीर्षक",
    "report.f.titlePh":
      "जैसे स्कूल रोड चौराहे पर बड़ी पानी पाइप फटने से बाढ़",
    "report.f.description": "विस्तृत विवरण",
    "report.f.descriptionPh":
      "क्षति का आकार, समस्या कितने समय से है, और सुरक्षा, यातायात या जलापूर्ति को सीधा खतरा — वर्णन करें...",
    "report.f.district": "जिला (तमिलनाडु)",
    "report.f.districtPh": "-- जिला चुनें (मानचित्र स्वतः केंद्रित होगा) --",
    "report.f.pincode": "पिनकोड (6 अंक)",
    "report.f.pincodePh": "जैसे 600018",
    "report.f.pinLookup": "जिला खोजा जा रहा है...",
    "report.f.pinFound": "जिला {district} पर सेट किया गया",
    "report.f.pinNotFound": "इस पिनकोड के लिए कोई जिला नहीं मिला। कृपया इसे मैन्युअल रूप से चुनें।",
    "report.f.pinOutOfState": "यह पिनकोड तमिलनाडु के बाहर {state} में है। कृपया तमिलनाडु का जिला चुनें।",
    "report.f.pinError": "पिनकोड सेवा से संपर्क नहीं हो सका। कृपया जिला मैन्युअल रूप से चुनें।",
    "report.f.aiPreviewLabel": "AI पूर्वावलोकन:",
    "report.f.aiPreviewHint": "तत्काल वर्गीकरण टैग देखने के लिए फ़ोटो संलग्न करें।",
    "report.f.draftRestored": "आपके पिछले सत्र से ड्राफ़्ट पुनर्स्थापित किया गया।",
    "report.f.draftClear": "ड्राफ़्ट साफ़ करें",
    "report.f.locality": "समस्या का स्थान दर्ज करें (मानचित्र स्वतः इंगित करेगा)",
    "report.f.localityPh":
      "क्षेत्र या सड़क का नाम टाइप करें (जैसे Anna Salai, Ukkadam, Srirangam, Gandhipuram, Periyar Bus Stand)...",
    "report.f.tryClicking": "आज़माकर देखें:",
    "report.f.pinned": "स्वतः पिन किया गया:",
    "report.f.map": "लाइव इंटरैक्टिव मानचित्र",
    "report.f.mapHelp":
      "टाइप करते ही मानचित्र स्वतः उस स्थान पर चला जाता है। आप पिन को खींचकर भी समायोजित कर सकते हैं।",
    "report.f.photos": "फ़ोटो संलग्न करें (अधिकतम 3, 5MB तक)",
    "report.f.photosCta": "फ़ोटो प्रमाण संलग्न करने के लिए क्लिक करें",
    "report.f.photo": "फ़ोटो",
    "report.f.photoCount": "{n} / 3 फ़ोटो जोड़े गए",
    "report.f.aiNotice": "स्वचालित AI ट्राइज:",
    "report.f.aiNoticeBody":
      "श्रेणी चुनने की आवश्यकता नहीं है। जमा करने पर हमारा AI इंजन समस्या की श्रेणी, तात्कालिकता स्तर और सुझाए गए साझेदार प्रकार को स्वतः वर्गीकृत करता है।",
    "report.f.contact": "वैकल्पिक नागरिक संपर्क",
    "report.f.confidential": "पूर्णतः गोपनीय",
    "report.f.name": "पूरा नाम (वैकल्पिक)",
    "report.f.phone": "फ़ोन नंबर (वैकल्पिक)",
    "report.f.email": "ईमेल पता (वैकल्पिक)",
    "report.f.contactNote":
      "आपके संपर्क विवरण सार्वजनिक रिपोर्ट में कभी नहीं दिखाए जाते। केवल अधिकृत समीक्षक ही उन्हें देख सकते हैं।",
    "report.f.submit": "रिपोर्ट जमा करें और AI ट्राइज चलाएँ",
    "report.f.cancel": "रद्द करें",

    "ch.h1": "सार्वजनिक चुनौती रजिस्टर",
    "ch.p": "तमिलनाडु भर में दर्ज सामाजिक चुनौतियाँ देखें और खोजें",
    "ch.searchPh": "शीर्षक, विवरण या लैंडमार्क खोजें...",
    "ch.allDistricts": "सभी जिले",
    "ch.allCategories": "सभी श्रेणियाँ",
    "ch.allStatuses": "सभी स्थितियाँ",
    "ch.reset": "फ़िल्टर रीसेट करें",
    "ch.empty": "आपके फ़िल्टर से मेल खाती कोई रिपोर्ट नहीं",

    "detail.back": "← सभी रिपोर्टों पर वापस जाएँ",
    "detail.notFound": "ट्रैकिंग ID के लिए कोई चुनौती नहीं मिली",
    "detail.notFoundP": "रिपोर्ट हटाई गई हो सकती है, या ट्रैकिंग लिंक गलत है।",
    "detail.copy": "ट्रैकिंग लिंक कॉपी करें",
    "detail.description": "समस्या विवरण",
    "detail.district": "जिला:",
    "detail.location": "स्थान:",
    "detail.coords": "पिन किए गए निर्देशांक:",
    "detail.pincode": "पिनकोड:",
    "detail.submitted": "जमा किया गया:",
    "detail.noneSpecified": "उल्लेख नहीं",
    "detail.ai": "AI ट्राइज मूल्यांकन",
    "detail.aiSuggested": "AI सुझाव",
    "detail.partner": "असाइन किया गया समाधान साझेदार",
    "detail.timeline": "स्थिति टाइमलाइन",

    "map.h1": "लाइव इंटरैक्टिव तमिलनाडु मानचित्र",
    "map.p":
      "सक्रिय घटना पिन और जिला क्लस्टर दिखाने वाला पूर्णतः कार्यशील लाइव OpenStreetMap। रिपोर्ट देखने के लिए कोई भी पिन क्लिक करें।",
    "map.pins": "पिन:",
    "map.normalPin": "सामान्य घटना",
    "map.urgentPin": "उच्च तात्कालिकता घटना",
    "map.clusterPin": "जिला क्लस्टर",
    "map.attribution": "मानचित्र डेटा ©",
    "map.attributionAfter": "योगदानकर्ता",
    "map.centers": "त्वरित जिला केंद्र (स्मूथ ज़ूम के लिए क्लिक करें)",
    "map.reportCount": "{n} रिपोर्टें",
    "map.reportCountOne": "{n} रिपोर्ट",
    "map.viewChallenge": "पूरी चुनौती देखें →",

    "login.h1": "आधिकारिक एडमिन साइन-इन",
    "login.p": "CIVICFORCE समीक्षक कमांड कतार",
    "login.error": "पहुँच अस्वीकृत: आधिकारिक ईमेल या पासवर्ड गलत।",
    "login.email": "व्यवस्थापक आधिकारिक ईमेल",
    "login.password": "पासवर्ड",
    "login.creds": "एडमिन क्रेडेंशियल:",
    "login.emailLabel": "ईमेल:",
    "login.passwordLabel": "पासवर्ड:",
    "login.submit": "पासवर्ड सत्यापित करें और कतार अनलॉक करें →",

    "admin.badge": "सत्यापित आधिकारिक व्यवस्थापक सत्र",
    "admin.h1": "प्रशासनिक समीक्षा कतार",
    "admin.loggedInAs": "इस रूप में लॉगिन",
    "admin.coordinator": "राज्य समन्वयक (एडमिन)",
    "admin.signOut": "साइन आउट",
    "admin.allQueue": "पूरी कतार",
    "admin.thId": "ID",
    "admin.thTitle": "समस्या शीर्षक",
    "admin.thDistrict": "जिला",
    "admin.thCategory": "AI श्रेणी",
    "admin.thUrgency": "तात्कालिकता",
    "admin.thStatus": "स्थिति",
    "admin.thContact": "नागरिक संपर्क (गोपनीय)",
    "admin.thAction": "क्रिया",
    "admin.anonymous": "अनाम",
    "admin.review": "समीक्षा →",

    "review.back": "← प्रशासनिक कतार पर वापस जाएँ",
    "review.notFound": "रिपोर्ट नहीं मिली",
    "review.confidential": "गोपनीय नागरिक संपर्क (केवल एडमिन के लिए)",
    "review.protected": "संरक्षित",
    "review.citizen": "नागरिक:",
    "review.phone": "फ़ोन:",
    "review.email": "ईमेल:",
    "review.notGiven": "नहीं दिया गया",
    "review.h2": "AI ट्राइज सुधार और साझेदार असाइनमेंट",
    "review.category": "श्रेणी",
    "review.urgencyPriority": "तात्कालिकता प्राथमिकता",
    "review.summary": "AI सारांश (संपादन योग्य)",
    "review.partner": "समाधान साझेदार असाइन करें",
    "review.noPartner": "-- अभी कोई साझेदार असाइन नहीं --",
    "review.status": "स्थिति",
    "review.timelineUpdate": "सार्वजनिक टाइमलाइन अपडेट",
    "review.timelinePh": "जैसे फ़ील्ड निरीक्षण पूरा हुआ। मरम्मत 48 घंटों में निर्धारित।",
    "review.save": "परिवर्तन सहेजें और टाइमलाइन अपडेट करें",
    "review.cancel": "रद्द करें",
    "review.grpGov": "सरकारी कार्यालय",
    "review.grpUni": "विश्वविद्यालय और अनुसंधान संस्थान",
    "review.grpCsr": "उद्योग और कॉर्पोरेट CSR",

    "privacy.h1": "गोपनीयता नीति",
    "privacy.updated":
      "अंतिम अपडेट: अक्टूबर 2026 · CIVICFORCE तमिलनाडु सामाजिक कार्य नेटवर्क",
    "terms.h1": "सेवा की शर्तें",
    "terms.updated":
      "अंतिम अपडेट: अक्टूबर 2026 · CIVICFORCE तमिलनाडु सामाजिक कार्य नेटवर्क",
    "common.returnHome": "← मुखपृष्ठ पर वापस जाएँ",

    "urg.high": "उच्च तात्कालिकता",
    "urg.normal": "सामान्य",
    "urg.normalPriority": "सामान्य प्राथमिकता",
    "urg.highPriority": "उच्च तात्कालिकता",
    "urg.highShort": "उच्च",

    "cat.roads": "सड़कें और फुटपाथ",
    "cat.water": "जल और जलनिकास",
    "cat.lighting": "स्ट्रीट लाइटिंग",
    "cat.waste": "कचरा और स्वच्छता",
    "cat.spaces": "सार्वजनिक स्थान",
    "cat.other": "अन्य",

    "status.new": "नया",
    "status.underReview": "समीक्षा में",
    "status.assigned": "असाइन किया गया",
    "status.inProgress": "प्रगति में",
    "status.resolved": "हल किया गया",
    "status.rejected": "अस्वीकृत",
  },
};

// Look a key up, falling back to English and finally to the raw key.
export function translate(lang: Lang, key: string): string {
  if (!key) return "";
  return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
}

// Interpolate the {n} placeholder used by count labels.
export function fill(template: string, n: number | string): string {
  return template.replace("{n}", String(n));
}

const STATUS_KEYS: Record<string, string> = {
  New: "status.new",
  "Under review": "status.underReview",
  Assigned: "status.assigned",
  "In progress": "status.inProgress",
  Resolved: "status.resolved",
  Rejected: "status.rejected",
};

const CATEGORY_KEYS: Record<string, string> = {
  "Roads & footpaths": "cat.roads",
  "Water & drainage": "cat.water",
  "Street lighting": "cat.lighting",
  "Waste & sanitation": "cat.waste",
  "Public spaces": "cat.spaces",
  Other: "cat.other",
};

// Stored data stays in English; these map it to display keys so the UI can
// translate statuses and categories without touching the data layer.
export function statusKey(status: string): string {
  return STATUS_KEYS[status] ?? "";
}

export function categoryKey(category: string): string {
  return CATEGORY_KEYS[category] ?? "";
}

export const PARTNER_GROUP_KEYS = ["review.grpGov", "review.grpUni", "review.grpCsr"];
