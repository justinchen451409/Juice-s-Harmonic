# ICONIQ Scout

A deal sourcing dashboard for ICONIQ Growth. Track notable fundraises, identify portfolio synergies, and front-run deals before they come to market.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `VITE_ANTHROPIC_API_KEY` | Anthropic API key for AI query bar and deal memo generation. Get one at console.anthropic.com. |
| `VITE_SUPABASE_URL` | Your Supabase project URL (Settings → API). |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key (Settings → API). |

> **Note:** The app renders fully from seeded local state — Supabase is optional. Without Supabase keys, tracked/passed state is in-memory only. Without an Anthropic key, AI features show an error message.

### 3. Run locally

```bash
npm run dev
```

Opens at `http://localhost:3000`.

### 4. Deploy on Vercel

```bash
vercel deploy
```

Add all three environment variables in your Vercel project settings (Settings → Environment Variables).

---

## Supabase Schema

Run the following SQL in your Supabase SQL Editor to create the required tables:

```sql
-- deals table
create table deals (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  sector text,
  stage text,
  amount_m numeric,
  lead_investor text,
  lead_tier text check (lead_tier in ('Tier 1', 'Tier 2')),
  date date,
  founders jsonb default '[]',
  headcount integer,
  headcount_growth text,
  arr text,
  description text,
  signals text[] default '{}',
  iconiq_synergy text[] default '{}',
  competitors jsonb default '[]',
  tracked boolean default false,
  passed boolean default false,
  notes text default '',
  created_at timestamptz default now()
);

-- pipeline_log table
create table pipeline_log (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid references deals(id) on delete cascade,
  action text not null,
  note text default '',
  created_at timestamptz default now()
);

-- Enable Row Level Security (recommended for production)
alter table deals enable row level security;
alter table pipeline_log enable row level security;

-- Allow all operations for anon key (adjust for production auth)
create policy "allow all" on deals for all using (true) with check (true);
create policy "allow all" on pipeline_log for all using (true) with check (true);
```

---

## File Structure

```
src/
  components/
    Sidebar.jsx         — Left sidebar: saved searches, pipeline coverage metric
    ScoutBar.jsx        — AI query bar with Claude-powered natural language filtering
    DealTable.jsx       — Main data table with signal chips, stage pills, track button
    FilterPanel.jsx     — Slide-in filter panel: sector, stage, lead tier, signals
    CompanyDrawer.jsx   — Company detail drawer: metrics, founders, synergy, competitors
    MemoGenerator.jsx   — AI deal memo generation via Claude API
  lib/
    supabase.js         — Supabase client and helper functions
    ingest.js           — Data ingestion scaffolding (TechCrunch, Axios, VC blogs)
    portfolio.js        — ICONIQ portfolio constants and synergy matching
  data/
    seed.js             — 10 seeded deals matching the Supabase schema
  App.jsx               — Root component: state management, layout, routing
  main.jsx              — React entry point
```

---

## AI Features

### Natural Language Search (ScoutBar)
Type any query and hit Enter. Claude parses the query against all current deals and returns matching IDs. The table filters in real time. Click "Clear filter" to reset.

### Deal Memo Generation (CompanyDrawer)
Open any company drawer and click "Generate Investment Memo". Claude writes a 3-paragraph IC-ready memo covering: (1) what the company does and why now, (2) ICONIQ-specific synergies, (3) risks and open questions.

Both features call `claude-sonnet-4-20250514` directly from the browser using your `VITE_ANTHROPIC_API_KEY`.

---

## Data Ingestion (Scaffold)

`src/lib/ingest.js` contains placeholder functions for future data automation:

- `fetchTechCrunch()` — TechCrunch fundraising RSS feed
- `fetchAxiosProRata()` — Axios Pro Rata newsletter
- `fetchStrictlyVC()` — StrictlyVC daily roundup
- `fetchVCBlogs()` — a16z, Sequoia, Lightspeed, Bessemer, General Catalyst blogs
