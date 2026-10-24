# SIH-26043 Societal Challenge Platform

A full-stack civic reporting platform (CIVICFORCE) for Tamil Nadu societal challenges.

## Project Structure

```
SIH-26043-societal-challenge-platform/
├── backend/                        # Node.js + Express REST API
│   ├── index.js                    # Main server (port 5000)
│   ├── db.js                       # Database helpers
│   ├── package.json
│   └── .gitignore
└── frontend/                       # Next.js 16 App Router frontend
    └── src/
        ├── app/
        │   ├── layout.js           # Root layout (Header + Footer + ThemeProvider)
        │   ├── globals.css         # Global styles (CSS custom properties)
        │   ├── page.js             # Home page
        │   ├── report/page.js      # Report a problem (with Leaflet map)
        │   ├── challenges/
        │   │   ├── page.js         # Challenge register (search + filter)
        │   │   └── [id]/page.js    # Report detail + timeline
        │   ├── map/page.js         # Live district map (Leaflet)
        │   ├── login/page.js       # Admin login
        │   ├── admin/page.js       # Admin queue (protected, edit modal)
        │   └── privacy/page.js     # Privacy & Terms
        ├── components/
        │   ├── Header.js           # Sticky nav with active-route highlighting
        │   ├── Footer.js
        │   └── ReportCard.js       # Reusable report card
        ├── context/
        │   └── ThemeContext.js     # Light/dark mode context + localStorage
        └── lib/
            └── api.js              # All fetch calls to backend
```

## Getting Started

### 1. Backend

```bash
cd backend
npm install
node index.js
# → http://localhost:5000
```

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

## Pages / Routes

| Route | Description |
|-------|-------------|
| `/` | Home – hero, live stats, recent challenges |
| `/report` | Submit a new issue (with pin-on-map) |
| `/challenges` | Filterable/searchable challenge register |
| `/challenges/[id]` | Report detail + resolution timeline |
| `/map` | Live Leaflet district map |
| `/login` | Admin sign-in |
| `/admin` | Admin resolution queue (protected) |
| `/privacy` | Privacy & Terms |

## API Endpoints (Backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports` | Get all reports |
| GET | `/api/reports/:id` | Get single report |
| POST | `/api/reports` | Submit new report |
| PATCH | `/api/reports/:id/status` | Update status |
| PUT | `/api/reports/:id` | Full report update |
| POST | `/api/admin/login` | Admin login |