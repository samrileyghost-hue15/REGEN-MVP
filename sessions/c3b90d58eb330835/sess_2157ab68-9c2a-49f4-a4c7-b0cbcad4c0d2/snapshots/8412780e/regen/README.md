# REGEN — Railway Infrastructure Intelligence

**MVP Prototype · Simulated Data Only · Not Safety-Certified**

---

## Overview

REGEN is a railway infrastructure monitoring and maintenance decision-support platform designed for South African railway operations. It combines track circuit operational status with FBG (Fiber Bragg Grating) structural strain monitoring to give engineers and maintenance teams a unified picture of infrastructure health.

**This is a READ-ONLY decision-support MVP. REGEN does not control real railway signals, track circuits or trains.**

---

## Running the App

```bash
cd regen
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

The app runs in **mock data mode** by default (`VITE_USE_MOCK_DATA=true`). All data is simulated.

---

## Connecting to Supabase

1. Create a Supabase project at https://supabase.com
2. Run the SQL migrations in order:
   - `supabase/migrations/001_schema.sql`
   - `supabase/migrations/002_seed.sql`
   - `supabase/migrations/003_fbg_readings.sql`
3. Copy `.env.example` to `.env.local` and fill in your Supabase URL and anon key
4. Set `VITE_USE_MOCK_DATA=false` in `.env.local`

---

## Demo Scenario (TC-021)

Follow the complete REGEN workflow:

1. **Dashboard** → See TC-021 fault and FBG-00021 warning in active alerts
2. **Track Circuits** → Open TC-021 → View event timeline (NORMAL → OCCUPIED → FAULT)
3. **Assets** → Open COMPOSITE-SLEEPER-021 → See combined intelligence view
4. **FBG Monitoring** → Open FBG-00021 → View increasing strain chart (+144.8%)
5. **Alerts** → Open ALT-2024-001 → Combined alert with evidence from both sources
6. **Inspections** → Open INS-2024-001 → Inspector field findings in progress
7. **Maintenance** → Open MNT-2024-001 → Repair task in progress

---

## Key Concepts

| Concept | Explanation |
|---------|-------------|
| Track Circuits | READ-ONLY operational status. REGEN receives, not controls. |
| FBG Sensors | Secondary structural condition layer. Does not replace TC data. |
| Combined Alert | TC fault + FBG anomaly = two independent evidence sources, not one conclusion |
| REQUIRES VERIFICATION | Highest workflow priority — needs physical inspection |
| SIMULATED DATA | All readings, trends, and risk labels are for MVP demonstration only |

---

## Technology

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 3
- **Charts**: Recharts
- **Backend**: Supabase (PostgreSQL + Auth)
- **Icons**: Lucide React

---

## Disclaimer

REGEN is an MVP/prototype demonstrating the concept of combining track circuit monitoring with FBG structural monitoring. It is **not** a safety-certified railway signalling system. It does not and cannot:

- Control real railway signals
- Control real track circuits  
- Issue commands to trains
- Diagnose structural failure
- Replace engineering assessment

All data is fictional and does not represent real PRASA or Transnet infrastructure.
