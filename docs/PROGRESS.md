# PROGRESS — Portfolio CMS / Admin / Auth / SEO

Gate-checked, milestone-driven. Drive with `m1`, `m2`, … On each milestone command I read the matching `docs/prd/M*.md`, state the **entry gate**, implement, run the **acceptance tests**, then mark the gate. Overrides are recorded here.

| Milestone | Title | Entry gate | Status |
|-----------|-------|-----------|--------|
| M1 | Foundation: Supabase + Prisma + env + docs | none (start) | ✅ done — migrated + seeded (3 projects, 7 posts, 12 links, 6 places), build green |
| M2 | Auth + protected `/admin` | M1 build passes; DB migrated & seeded | ✅ done — login/guard/lockout/sign-out all verified, build green |
| M3 | Dashboard + analytics | M2 login works; `/admin` guarded | ✅ done — pageview tracking + dashboard (stats/chart/top-pages) verified; DNT+bot excluded; PSI fallback clean |
| M4 | Blog CMS (+ media upload) & public blog pages | M3 dashboard renders | ✅ done — CRUD + media upload + `/blog/[slug]` (generateMetadata + BlogPosting JSON-LD) + drawer all verified |
| M5 | Project CMS + editable links/fields | M4 blog CRUD + `/blog/[slug]` live | ✅ done — project CRUD + `/projects/[slug]` (CreativeWork JSON-LD), `/admin/links` edits reflect live, all project/pill/social reads now DB-driven |
| M6 | SEO/GEO hardening + ship to Vercel | M5 project CRUD + links live | ✅ done — env-driven SITE_URL, dynamic sitemap (14 urls), robots, /llms.txt, generated OG images, breadcrumb/Blog JSON-LD all verified; DEPLOY.md written |

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
- **PageSpeed scores need a public URL** — PSI can't reach `localhost`, and returns **400** for `https://rahulbhati.dev` (not yet serving). Live gauges populate only once `NEXT_PUBLIC_SITE_URL` points at a deployed, reachable site (M6). Key is set in `.env.local`.
- **Dashboard PSI is streamed via `<Suspense>`** (not awaited inline) — previously `force-dynamic` + inline `await getPageSpeed()` blocked the dashboard 15–27s every load. Removed `force-dynamic` (route is already dynamic via `cookies()` so the PSI fetch cache works) and moved PSI into a streamed `SeoScoreSection`. Stats now paint instantly.
- `innerText` reflects CSS `text-transform` (uppercased labels) — use `textContent`/screenshots when asserting label text.
- **M4 read migration:** public POSTS now come from DB (`src/lib/posts.ts`); `/blog`, home recent-thoughts, and the drawer read DB. PROJECTS still come from `content.ts` until M5. Drawer takes `posts` prop from the `(site)` layout (server) + `projects` from content.ts.
- **Supabase Storage:** `media` bucket (public, 50MB cap — free-tier global limit; bucket >50MB → 413). Create via `npm run setup-storage`. Uploads via `uploadMedia` server action; URLs stored in coverImageUrl / inline markdown. Media rows NOT tracked in M4 (Media table reserved); deleting a post does not yet delete its storage objects.
- **Markdown:** `src/components/markdown.tsx` (react-markdown + remark-gfm + rehype-sanitize, allows `<video>`); `.prose-portfolio` styles in globals.css.
- Preview file-input testing: inject via `DataTransfer` (`input.files = dt.files; dispatch change`) — preview_fill can't set file inputs.
- **M5: full read-layer is now DB-driven.** `src/lib/projects.ts` (DTO matches static `Project` shape; enum ACTIVE/IN_PROGRESS/SHIPPED ↔ display), `src/lib/links.ts` (pills/socials/footer). Migrated: hero (pills + iconFor + tone), navbar (socials prop from `(site)` layout), footer (github href), selected-work, `/projects` listing, drawer (projects prop). `content.ts` now only supplies TYPES + `places`; its data arrays are unused.
- **`/admin/links`** edits call `revalidatePath("/", "layout")` → reflect live across navbar/footer/hero. Verified: edited GitHub href appeared on home immediately.
- **Preview client-navigation is flaky** (first `location.href` to a deep path often lands on `/`, and evals error "navigated") — verify pages with server-side `fetch()` of the URL + inspect HTML instead of relying on client nav.
- **M6: SITE_URL resolver** in `src/lib/seo.ts` — `NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → localhost. Centralized (layout, (site) layout, sitemap, robots all import it). On Vercel **leave `NEXT_PUBLIC_SITE_URL` unset until a custom domain is connected** (auto-uses *.vercel.app).
- **OG images** = generated cards via `opengraph-image.tsx` file convention (blog/[slug], projects/[slug], (site) default) using `renderOgImage` in `src/lib/og.tsx`. The metadata builders no longer set `openGraph.images` (avoids duplicate tags). og:image URL shows `localhost` in dev (Next uses request origin); canonical/og:url use the resolver correctly.
- `/llms.txt` route (`app/llms.txt/route.ts`) for GEO; dynamic sitemap + robots disallow /admin,/api. Deploy steps in `docs/DEPLOY.md`. **Nothing is deployed yet** — user will push + import to Vercel themselves.

## Notes
- Hosting: **Vercel** (GitHub Pages can't run server features). Repo name unchanged.
- Auth: custom single-admin session (bcrypt hash in env + jose cookie + middleware).
- Analytics: self-hosted pageviews (Postgres) + Google PageSpeed Insights for SEO score.
- Detail views: real `/blog/[slug]` & `/projects/[slug]` + keep the existing drawer.
