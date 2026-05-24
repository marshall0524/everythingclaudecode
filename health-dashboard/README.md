# HealthOS — Personal Health Dashboard

Mobile-optimised PWA that syncs all your health data in one place.

## Features

**Dashboard**
- Weight & BMI (Asian BMI scale — overweight ≥23, obese ≥27.5)
- Body composition (body fat %, muscle mass, visceral fat) from RENPHO
- Sleep quality with deep/REM/light breakdown
- Exercise activity from Strava + Apple Health
- VO2 Max trend over time
- Stress & HRV monitoring
- Pathology document management

**AI Coach**
- Powered by Claude claude-opus-4-7
- Analyses your data across all sources
- Daily health assessment, action plan, nutrition targets, workout recommendation
- Personalised for 30M Asian male, Shanghai, 168cm profile
- Chat with your coach any time

**Data Sync**
- Apple Health via iOS Shortcuts / Health Auto Export app webhook
- Strava OAuth 2.0 integration (runs, rides, workouts)
- RENPHO via Apple Health sync (automatic)
- Automated daily sync at 6 AM
- Manual sync available any time

## Setup

```bash
cd health-dashboard
npm install
cp .env.local.example .env.local
# Fill in your keys in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```env
ANTHROPIC_API_KEY=sk-ant-...          # For AI Coach
STRAVA_CLIENT_ID=...                   # From strava.com/settings/api
STRAVA_CLIENT_SECRET=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Apple Health Integration

**Option 1: Health Auto Export app (recommended)**
- Install "Health Auto Export" from App Store
- Set webhook URL to `https://your-app/api/health`
- Schedule: daily at 6 AM

**Option 2: iOS Shortcuts**
- Create an automation that runs daily
- POST your health metrics to `/api/health`
- See the Sync page in-app for the full guide

## Deploy to Vercel

```bash
npx vercel
# Set environment variables in Vercel dashboard
```

## Tech Stack

- Next.js 15 (App Router) — React framework
- Tailwind CSS — Mobile-first styling
- Recharts — Health metric charts
- Anthropic SDK — AI coaching
- File-based JSON store — Zero-config data persistence
