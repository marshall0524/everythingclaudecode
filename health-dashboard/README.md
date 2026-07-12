# HealthOS — Personal Health Dashboard

Mobile-optimised PWA that syncs all your health data in one place and coaches you on it.

## Features

**Dashboard**
- Weight & BMI (Asian BMI scale — overweight ≥23, obese ≥27.5)
- Body composition (body fat %, muscle mass, visceral fat) from RENPHO
- Sleep quality with deep/REM/light breakdown
- Exercise activity from Strava + Apple Health
- VO2 Max trend over time
- Stress & HRV monitoring
- Pathology / bloodwork document management

**AI Coach**
- Powered by Claude claude-opus-4-7
- Grounded in a fixed evidence library (`data/evidence-library.json`) — cites real studies/guidelines, never invents one
- Reads your actual synced data — if something isn't synced yet, it says so instead of making it up
- Remembers what you've told it (`coachNotes` in `data/health-data.json`) so advice stays consistent over time
- Daily health assessment, action plan, nutrition targets, workout recommendation
- Personalised to your real profile (edit `lib/sample-data.ts` / `data/health-data.json` if your goals change)
- Chat with your coach any time, or generate a full weekly program
- A matching Claude Code skill lives at `skills/health-coach/SKILL.md` in the repo root, for coaching directly in a coding session using the same data files

**Nutrition — Photo Logging** (`/nutrition`)
- Snap a photo of a meal, Claude vision breaks it down into individual food items with estimated quantity, calories, protein, carbs, fat, fibre, and added sugar
- Server sums the macro totals from the itemised breakdown (not a model-provided total) to avoid arithmetic drift
- Protein target: 1.8g/kg bodyweight (Morton et al., 2018). Calorie target: ~20% below estimated maintenance via the Mifflin-St Jeor equation (Mifflin et al., 1990; Helms et al., 2014) — both shown with their formula inline, not just a number
- Shows protein/calories remaining for the day, updated live as you log meals
- Each meal gets a short, specific tip (e.g. what to swap, what to keep doing), grounded in the same evidence library — flagged "rough estimate" when the photo doesn't give a clear read on portions
- Fully wired into the AI Coach and daily WhatsApp summary — ask "how much protein do I have left today" in chat and it reads your actual logged totals, not a guess

**Daily WhatsApp Summary**
- Every morning, a short evidence-based summary + today's protein/calorie targets + one action item is sent to your WhatsApp via [CallMeBot](https://www.callmebot.com/blog/free-api-whatsapp-messages/) (free, no business account needed)
- See "WhatsApp Setup" below, or the in-app guide on the Sync page

**Data Sync**
- Apple Health via iOS Shortcuts / Health Auto Export app webhook
- Strava OAuth 2.0 integration (runs, rides, workouts)
- RENPHO via Apple Health sync (automatic)
- Manual sync available any time from the Sync page
- The Sync page honestly reflects connection status — it won't claim something is connected/active until it actually is

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
ANTHROPIC_API_KEY=sk-ant-...          # For AI Coach + daily WhatsApp summary
STRAVA_CLIENT_ID=...                   # From strava.com/settings/api
STRAVA_CLIENT_SECRET=...
NEXT_PUBLIC_APP_URL=http://localhost:3000

CALLMEBOT_PHONE=61469616917            # WhatsApp recipient
CALLMEBOT_APIKEY=...                   # From the CallMeBot opt-in flow, see below
CRON_SECRET=...                        # Any random string, protects the cron endpoint
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

## WhatsApp Setup

Daily summaries are sent via [CallMeBot](https://www.callmebot.com/blog/free-api-whatsapp-messages/) — free for personal use, no business account required.

1. Add **+34 644 51 95 23** to your phone contacts.
2. WhatsApp that contact: `I allow callmebot to send me messages`
3. CallMeBot replies with an API key within a minute or two.
4. Set `CALLMEBOT_PHONE` (your number, country code no `+` or leading `0`) and `CALLMEBOT_APIKEY` in `.env.local` / your deployment's env vars.

**How the daily send actually fires** (pick one):
- **Vercel Cron (recommended, works once deployed)** — `vercel.json` schedules `GET /api/cron/daily-summary` at `06:00 UTC` daily (7am during British Summer Time). Set `ANTHROPIC_API_KEY`, `CALLMEBOT_PHONE`, `CALLMEBOT_APIKEY`, and `CRON_SECRET` in your Vercel project's env vars — Vercel Cron sends `CRON_SECRET` automatically as a Bearer token. Note: this is a fixed UTC cron, so it drifts to 8am London time when the UK switches to GMT in late October — update the schedule in `vercel.json` twice a year, or swap in a timezone-aware scheduler if that matters to you.
- **Manual / standalone script** — `node --env-file=.env.local scripts/daily-whatsapp-summary.mjs` runs the same logic without Next.js or a deployment. Useful for testing, or for wiring into your own cron (e.g. a home server, GitHub Actions on a schedule, etc).

## Deploy to Vercel

```bash
npx vercel
# Set environment variables in Vercel dashboard, including the WhatsApp ones above
```

## Tech Stack

- Next.js 16 (App Router) — React framework
- Tailwind CSS — Mobile-first styling
- Recharts — Health metric charts
- Anthropic SDK — AI coaching
- File-based JSON store — Zero-config data persistence
- CallMeBot — Free WhatsApp delivery, no business account

## A note on data honesty

This app is built to never present invented numbers as if they were real. `data/health-data.json` starts with an `isSampleData: true` flag and empty history arrays — the UI shows a clear banner until Apple Health/Strava actually sync in. The AI coach reads the same file and is instructed to say "not synced" rather than fill in plausible-looking numbers, and to cite only from `data/evidence-library.json` rather than invent studies.

`data/health-data.json` is tracked in git (not `.gitignore`'d) so state persists across sessions/deployments — bear that in mind if this repo is ever made public, since it will contain your real synced health data and any bloodwork you upload gets saved to `public/uploads/` (that folder is gitignored).
