
# SynqWorks v2 Starter

The standard foundation for all SynqWorks web + desktop products.

## Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (Postgres) — direct client, no ORM |
| Client state | Zustand |
| Server state | TanStack Query |
| Data viz | Recharts |
| Desktop | Tauri v2 (optional wrapper) |

## Setup

### 1. Clone and install

```bash
git clone <your-repo>
cd synqworks-v2-starter
npm install
```

### 2. Supabase project

Create a new project at supabase.com, then run the schema:

```bash
# In your Supabase SQL editor, paste and run:
supabase/schema.sql
```

### 3. Environment variables

```bash
cp .env.example .env.local
```

Fill in:

NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

### 4. Generate TypeScript types

```bash
npm run types:gen
```

This generates `src/types/supabase.ts` from your live schema.
Re-run any time you change the schema.

### 5. Run

```bash
npm run dev
```

## Project structure

src/
├── app/                  # Next.js App Router pages
│   ├── dashboard/        # Skill radar + recommended module
│   ├── diagnostic/       # 12-question assessment
│   ├── simulation/[id]/  # Simulation player
│   └── api/
│       ├── recommend/    # GET — hydrates full dashboard
│       └── results/      # POST — saves simulation results
├── components/
│   ├── charts/           # SkillRadar
│   ├── simulation/       # Player, Metrics, AARReport
│   ├── diagnostic/       # QuestionCard, ProgressBar
│   └── ui/               # shadcn components
├── lib/
│   ├── engine/           # Pure logic: getNextModule, scoreAssessment, buildRadarData
│   ├── supabase/         # client.ts + queries.ts (all DB calls)
│   └── store/            # Zustand: useSimStore, useUserStore
└── types/
    └── index.ts          # All app-wide TypeScript interfaces

## Adapting for a new SynqWorks product

1. Clone this repo
2. Delete `/app/diagnostic`, `/app/simulation`, and `/components/simulation` if not needed
3. Keep `/lib/supabase`, `/lib/store`, and `/types` — these are universal
4. Replace the schema tables specific to this app with your own
5. Re-run `npm run types:gen`

## Key patterns

- **No Prisma.** All queries go through `src/lib/supabase/queries.ts`
- **No React Context for state.** Use Zustand stores in `src/lib/store/`
- **One API call for the dashboard.** `/api/recommend` returns `DashboardData` in a single round trip
- **Engine is framework-free.** Everything in `src/lib/engine/` is plain TypeScript — portable to any future product
