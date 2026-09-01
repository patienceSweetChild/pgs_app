# Phase 1 — Four-app split (IMPLEMENTED)

> Reference: pgs-v3 (`E:\pgs2\pgs-v3`) route/auth patterns + Turborepo-style shared packages.  
> Approval: user confirmed **"yup implement those now"** (Sep 1, 2026).

## What shipped

| App | Package | Port | Host (prod) |
|-----|---------|------|-------------|
| Student frontend | `@pgs/app-web` | 3000 | `purpleguide.study` |
| Ops backend | `@pgs/app-ops` | 3001 | `ops.purpleguide.study` |
| Admin CMS | `@pgs/app-admin` | 3002 | `admin.purpleguide.study` |
| Dash CMS | `@pgs/app-cms` | 3003 | `cms.purpleguide.study` |

Shared code stays in repo root `src/` (features, lib, components). Each app uses **route bridges** under `apps/*/src/app` that re-export monolith routes.

## Steal-like-an-artist map

| Pattern | Source | PGS implementation |
|---------|--------|-------------------|
| Staff login `?surface=` | pgs-v3 `proxy.ts`, `login/page.tsx` | `@pgs/shared` `loginPathForSurface`, per-app middleware |
| Staff permission gate | pgs-v3 `staff-auth.ts`, `admin/layout.tsx` | Unchanged in `src/lib/auth`, layouts |
| Ops public URL vs admin routes | pgs-v3 `next.config` rewrites | **Split deploy** — ops routes at `/` on ops subdomain |
| Isolated sessions per tab | pgs_app proposal (not v3) | `sb-*-auth-token-pgs-{surface}` cookies |
| Monorepo shared config | Turborepo / Cal.com | `@pgs/next-config` `createPgsNextConfig()` |
| Multi-app workspaces | npm workspaces | `packages/*` + `apps/*` |

## Commands

```bash
# Install + regenerate bridges (after adding monolith routes)
npm install
npm run scaffold:apps

# Dev (copy .env.local to each app or use root .env.local)
npm run dev:web      # :3000 student frontend
npm run dev:ops      # :3001
npm run dev:admin    # :3002
npm run dev:cms      # :3003

# Monolith still works
npm run dev          # :3000 all surfaces

# Build
npm run build:ops    # verified ✓
npm run build:web
npm run build:admin
npm run build:cms

npm run test:shared  # 24 tests
```

## Vercel (each project)

1. Same Git repo
2. **Root Directory:** `apps/web` | `apps/ops` | `apps/admin` | `apps/cms`
3. Env: see `apps/*/.env.example` + Supabase keys from root `.env.local`
4. **Do not set** `PGS_COOKIE_DOMAIN` (isolated sessions per site)
5. Domains: assign per proposal

## Visual verification (you)

| Tab | URL | Screenshot target |
|-----|-----|-------------------|
| Student | http://localhost:3000/ | Home + login |
| Ops | http://localhost:3001/ | Scoreboard shell |
| Admin | http://localhost:3002/ | Countries CMS |
| CMS | http://localhost:3003/ | Dash editor |
| Multi-user | Two tabs, different logins | Student + staff both signed in |

## Testing protocol

| Step | Command | Pass |
|------|---------|------|
| Shared libs | `npm run test:shared` | 24/24 |
| Ops build | `npm run build:ops` | ✓ |
| Web build | `npm run build:web` | run locally |
| Cookie isolation | Login student :3000 + staff :3001 | different users |
| Cross-link | Ops → "CMS Admin ↗" | opens :3002 |

## Files to know

- `scripts/scaffold-app-routes.mjs` — regenerates bridges after route changes
- `packages/pgs-shared/` — surfaces, cookies, routes, middleware factory
- `packages/pgs-next-config/` — shared Next config
- `apps/*/middleware.ts` — per-surface auth (pgs-v3 proxy pattern)

## Phase 2 (next, needs your approval)

- Playwright role matrix (SA, Admin, Mentor, Viewer)
- Harden staff vs student redirect (Twenty CRM style API enforcement)
- Optional: extract `src/lib` → `@pgs/core` package
