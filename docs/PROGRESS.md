# PROGRESS — Portfolio CMS / Admin / Auth / SEO

Gate-checked, milestone-driven. Drive with `m1`, `m2`, … On each milestone command I read the matching `docs/prd/M*.md`, state the **entry gate**, implement, run the **acceptance tests**, then mark the gate. Overrides are recorded here.

| Milestone | Title | Entry gate | Status |
|-----------|-------|-----------|--------|
| M1 | Foundation: Supabase + Prisma + env + docs | none (start) | ✅ done — migrated + seeded (3 projects, 7 posts, 12 links, 6 places), build green |
| M2 | Auth + protected `/admin` | M1 build passes; DB migrated & seeded | ✅ done — login/guard/lockout/sign-out all verified, build green |
| M3 | Dashboard + analytics | M2 login works; `/admin` guarded | ✅ done — pageview tracking + dashboard (stats/chart/top-pages) verified; DNT+bot excluded; PSI fallback clean |
| M4 | Blog CMS (+ media upload) & public blog pages | M3 dashboard renders | ▶️ ready |
| M5 | Project CMS + editable links/fields | M4 blog CRUD + `/blog/[slug]` live | ⬜ blocked on M4 |
| M6 | SEO/GEO hardening + ship to Vercel | M5 project CRUD + links live | ⬜ blocked on M5 |

Legend: ⬜ not started · ⏳ in progress · ✅ done · ⚠️ done-with-override

## Override log
_(none yet)_

## Decisions
- **Prisma pinned to v6.19.3** (not v7): v7 drops schema datasources + needs a driver adapter; v6 is the stable documented path. Revisit at M6.
- DB scripts load `.env.local` via `dotenv-cli` (Prisma CLI reads `.env` by default; Next uses `.env.local`).
- Migration `20260613053734_init` applied to Supabase.
- **Next 16: Middleware → Proxy.** Guard lives in **`src/proxy.ts`** — MUST be a sibling of `src/app` (a root `proxy.ts` is silently ignored when the app is under `src/`). Edge, optimistic JWT check; authoritative check in `getSession()` (Server Components/Actions). After moving special files, clear `.next` or you get `adapterFn is not a function`.
- **Session lifetime: 1 day** (cookie maxAge + JWT exp). Stateless JWT survives dev server restarts.
- **Public routes moved into `src/app/(site)/`** (own layout w/ navbar/footer/drawer); root layout now only `<html>`/theme/fonts; `/admin` has its own chrome.
- **bcrypt hash in `.env.local` must escape `$` as `\$`** — Next loads env via dotenv-expand. `hash-password` script prints the escaped line.
- Dev preview runs as `portfolio-auth` on port 3030 (port 3000 is the old portfolio).
- Analytics capture in `src/app/api/track/route.ts` (Node runtime); beacon in `(site)` layout; aggregation in `src/lib/analytics.ts` (raw SQL for time-series/totals, Prisma groupBy for top lists). `userAgent()` from `next/server` gives device + isBot.
- **PageSpeed scores need a public URL** — PSI can't reach `localhost`. Live SEO gauges appear only against the deployed/production URL (M6), and only when `PAGESPEED_API_KEY` is set. Until then the dashboard shows the fallback note.
- `innerText` reflects CSS `text-transform` (uppercased labels) — use `textContent`/screenshots when asserting label text.

## Notes
- Hosting: **Vercel** (GitHub Pages can't run server features). Repo name unchanged.
- Auth: custom single-admin session (bcrypt hash in env + jose cookie + middleware).
- Analytics: self-hosted pageviews (Postgres) + Google PageSpeed Insights for SEO score.
- Detail views: real `/blog/[slug]` & `/projects/[slug]` + keep the existing drawer.
