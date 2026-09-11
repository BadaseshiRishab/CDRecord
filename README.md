# CDRecord
# Call Analytics Dashboard

Software Development Internship — Week 2, Assignment 2 (London Success Academy)

A professional, SaaS-style analytics dashboard that consumes a Call Data Record (CDR)
API and visualizes call activity, cost, duration, and geography for a telecom/VoIP
platform.

## Project Description

Telecom and VoIP companies generate a Call Data Record (CDR) for every call placed
through their system, capturing caller details, duration, cost, status, and
timestamps. This dashboard fetches those records and turns them into an
at-a-glance operations view: KPI summary cards, duration and cost analytics,
a call activity timeline, a breakdown of calls by city, and a searchable,
paginated log of recent calls.

## Technology Stack

- **React 18** + **Vite** — UI and build tooling
- **TailwindCSS** — styling
- **shadcn/ui-style components** (Card, Table, Badge, Skeleton) — hand-rolled,
  dependency-light versions of the shadcn primitives, styled to match
  shadcn's design tokens
- **Recharts** — bar, line, and pie charts
- **lucide-react** — icons

## Features

- **KPI Summary Cards** — Total Calls, Total Call Cost, Average Call Duration,
  Total Successful Calls, Total Failed Calls
- **Call Duration Analytics** — longest / shortest / average call duration (bar chart)
- **Call Cost Analytics** — total cost by city (bar chart) and average cost per call
- **Call Activity Timeline** — call volume by day or by hour of day, toggleable (line chart)
- **Calls by City** — distribution of call volume across cities (pie chart)
- **Recent Call Logs** — searchable, paginated table of all call records with
  status badges (Caller Name, Caller Number, Receiver Number, City, Duration,
  Cost, Start Time, Status)
- Loading skeletons and an inline error banner if the API call fails
- Manual refresh button with a "last updated" timestamp

## Data Source

Data is fetched client-side from the mock CDR API provided in the assignment:

```
https://69b30b45e224ec066bdb55a0.mockapi.io/api/v1/cdr
```

The endpoint can be overridden via the `VITE_CDR_API_URL` environment variable
(see `.env.example`) without touching any code.

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. (Optional) configure the API URL
cp .env.example .env

# 3. Run the dev server
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`) in your browser.

### Build for production

```bash
npm run build   # outputs to dist/
npm run preview # locally preview the production build
```

## Deployment (Vercel)

1. Push this project to a GitHub repository.
2. In Vercel, click **New Project** and import the repository.
3. Vercel auto-detects the **Vite** framework preset:
   - Build command: `npm run build`
   - Output directory: `dist`
4. (Optional) add `VITE_CDR_API_URL` under **Environment Variables** if you
   want to point at a different endpoint than the default.
5. Click **Deploy**. Vercel gives you a live URL once the build finishes.

## Project Structure

```
cdr-dashboard/
├── src/
│   ├── components/
│   │   ├── ui/                  # Card, Table, Badge, Skeleton primitives
│   │   ├── DashboardHeader.jsx
│   │   ├── KpiCards.jsx
│   │   ├── CallDurationChart.jsx
│   │   ├── CallCostChart.jsx
│   │   ├── CallActivityTimeline.jsx
│   │   ├── CallsByCityChart.jsx
│   │   └── CallLogsTable.jsx
│   ├── hooks/
│   │   └── useCallRecords.js    # fetch + refresh state for CDR data
│   ├── lib/
│   │   ├── api.js               # fetch + normalize CDR records
│   │   ├── analytics.js         # pure aggregation functions
│   │   ├── format.js            # number/currency/date formatting
│   │   └── utils.js             # Tailwind class merging helper
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── bonus/
│   └── solutions.js             # Section 9 bonus coding problems
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## Bonus Coding Problems

Solutions for the five bonus problems (Two Sum, Valid Parentheses, Longest
Substring Without Repeating Characters, Find the Missing Number, Reverse a
Linked List) are in `bonus/solutions.js`, each with its time/space complexity
noted and a quick self-check against the assignment's example input. Run them
with:

```bash
node bonus/solutions.js
```

## Screenshots

_Add 1–2 screenshots of the running dashboard here after `npm run dev` (e.g.
drag them into this README on GitHub, or reference an `assets/` folder) —
this is one of the required README sections for submission._

## What This Demonstrates

- Consuming a third-party REST API and normalizing its response shape
- Transforming raw records into meaningful analytics (KPIs, aggregates,
  time-bucketed series)
- Building a componentized dashboard with a modern UI library and charting
  library
- Loading/error states and basic client-side search + pagination
