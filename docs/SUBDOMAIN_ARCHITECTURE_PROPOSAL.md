# Subdomain architecture — Phase 1 complete

> **Status:** Phase 1 implemented — four apps in `apps/*`. See [PHASE1_IMPLEMENTATION.md](./PHASE1_IMPLEMENTATION.md).

Skill: [.cursor/skills/pgs-visual-approve/SKILL.md](../.cursor/skills/pgs-visual-approve/SKILL.md)

---

## Product split (your model)

| Layer | Host | Who | Vercel project | Monolith today |
|-------|------|-----|----------------|----------------|
| **Student frontend** | `purpleguide.study` | Students, guardians, public | `pgs-web` | `src/app/(public)`, `(auth)`, `portal` |
| **Staff backend — Ops** | `ops.purpleguide.study` | Scoreboard, students, team, targets | `pgs-ops` | `src/app/ops` |
| **Staff backend — Admin** | `admin.purpleguide.study` | Site CMS (countries, pathways, events…) | `pgs-admin` | `src/app/admin` |
| **Staff backend — CMS** | `cms.purpleguide.study` | Premium student dashboard CMS | `pgs-cms` | `src/app/dash` *(route name unchanged until Phase 1)* |

**Key rule:** Student login lives on **`purpleguide.study` only**. Staff log in on **ops / admin / cms** — not through the student frontend.

One Supabase project. **Independent session per surface** — different user per tab/site by default.

---

## Visual — frontend vs backend

```
                         Supabase (single project)
                    Auth · Postgres · RLS · Storage
                                    │
          ┌─────────────────────────┴─────────────────────────┐
          │                                                   │
          ▼                                                   ▼
┌─────────────────────┐              ┌──────────────────────────────────────┐
│  STUDENT FRONTEND   │              │         STAFF BACKEND (3 deploys)       │
│  purpleguide.study  │              │                                        │
│  Vercel: pgs-web    │              │  ops.*     admin.*     cms.*           │
│  :3000 local        │   publishes  │  CRM/ops   site CMS   dash CMS       │
│                     │◄─────────────│  :3001     :3002      :3003          │
│  · Public pages     │   content    │                                        │
│  · Student login    │              │  Separate staff sessions per subdomain │
│  · /userprofile     │              │  (or per localhost port after split)   │
│  · Guardian portal  │              └──────────────────────────────────────┘
└─────────────────────┘

packages/pgs-shared  ← per-surface auth cookies, surface URLs, login helpers
```

### Auth entry points

```
Student                          Staff
   │                                │
   ▼                                ▼
purpleguide.study/login      ops.purpleguide.study/login
                             admin.purpleguide.study/login
                             cms.purpleguide.study/login
   │                                │
   └──────── same Supabase ─────────┘
              different UX surfaces
```

Students never need ops/admin/cms URLs. Staff never use student login for daily work (Phase 2 will harden redirects).

---

## Route → subdomain map

| Monolith path | After split | Subdomain |
|---------------|-------------|-----------|
| `/`, `/countries/*`, `/pathways/*`, … | `apps/web` | `purpleguide.study` |
| `/login` (student) | `apps/web` | `purpleguide.study` |
| `/ops/*` | `apps/ops` | `ops.purpleguide.study` |
| `/admin/*` | `apps/admin` | `admin.purpleguide.study` |
| `/dash/*` | `apps/cms` | `cms.purpleguide.study` |

`www.purpleguide.study` → redirect to apex `purpleguide.study` (Vercel DNS).

---

## Wireframe — Ops shell (staff backend)

```
┌──────────┬──────────────────────────────────────────┐
│ #purple  │  Search    [Site CMS ↗] [Dash CMS ↗]     │
│ Ops      │  Ask PGS              super admin · Name  │
├──────────┼──────────────────────────────────────────┤
│Scoreboard│  Main content (students, team, matrix…)   │
│Students  │                                          │
│Targets   │  ↗ admin.* / cms.* (not /admin on ops)   │
│Team      │                                          │
│Notifs    │                                          │
│Activity   │                                          │
└──────────┴──────────────────────────────────────────┘
```

Cross-origin links use `crossSurfaceLink()` from `@pgs/shared`.

---

## Cookie strategy — session isolation (multi-tab flexibility)

### What you asked for

Open **purpleguide.study** in one tab (student), **cms.*** in another (staff editor), **ops.*** in a third — **no interference**. Each site can be a **different Supabase user** at the same time.

### How we achieve it

| Mechanism | Default | Effect |
|-----------|---------|--------|
| **Host-only cookies** | Yes (no `PGS_COOKIE_DOMAIN`) | Each subdomain has its own session jar |
| **Per-surface cookie name** | `sb-{ref}-auth-token-pgs-{surface}` | Even on localhost (same host, different ports) tabs stay isolated |
| **Shared SSO** | Opt-in only | Set `PGS_COOKIE_DOMAIN=.purpleguide.study` if you ever want one login everywhere |

```
Tab 1  purpleguide.study     → cookie …-pgs-web   → Student A
Tab 2  cms.purpleguide.study → cookie …-pgs-cms   → Staff B
Tab 3  ops.purpleguide.study → cookie …-pgs-ops   → Staff C
       (three different users, same browser — no clash)
```

Monolith today (`localhost:3000`): paths `/`, `/ops`, `/admin`, `/dash` each use a **different cookie name**, so you can already test multi-user tabs on one port.

### Do NOT set in production (unless you want shared SSO)

```
# Leave unset for isolated sessions (recommended)
PGS_COOKIE_DOMAIN=
```

### Optional — shared staff SSO (not recommended for PGS)

Only if you want logging into ops to auto-login admin/cms:

```
PGS_COOKIE_DOMAIN=.purpleguide.study
```

Implemented in [`packages/pgs-shared/src/auth/cookie-options.ts`](../packages/pgs-shared/src/auth/cookie-options.ts), wired in:

- [`src/lib/supabase/middleware.ts`](../src/lib/supabase/middleware.ts)
- [`src/lib/supabase/server.ts`](../src/lib/supabase/server.ts)
- [`src/lib/supabase/client.ts`](../src/lib/supabase/client.ts)

### Supabase dashboard checklist

Redirect URLs:

- `https://purpleguide.study/auth/callback` *(student frontend)*
- `https://ops.purpleguide.study/auth/callback`
- `https://admin.purpleguide.study/auth/callback`
- `https://cms.purpleguide.study/auth/callback`

Site URL: `https://purpleguide.study`

### Twenty CRM comparison (auth pattern)

| Twenty CRM | PGS plan |
|------------|----------|
| Workspace subdomain per org | Fixed staff subdomains (ops/admin/cms) |
| JWT + workspace membership | Supabase session + DB permission grants |
| API enforces workspace scope | RLS + `staff_has_permission` + TS guards |
| App shell separate from marketing site | **Student frontend vs staff backend** split |
| SSO across internal tools | **Off by default** — isolated sessions per surface |

---

## Reference comparison

| Topic | pgs_app (keep) | pgs-v3 | Twenty / NextBase |
|-------|----------------|--------|-------------------|
| Student vs staff URLs | Apex + staff subdomains | Single host `/ops` rewrite | Marketing vs app subdomain |
| Permission matrix UI | Yes | No | Workspace roles |
| CMS visual editor | Country/Pathway preview | Module grid | N/A |
| Shared package | `@pgs/shared` | N/A | NextBase monorepo |
| Tests | Vitest shared (11 cases) | 50+ tests | Playwright + Vitest |

---

## Repo layout (phased)

### Phase 0 — DONE

```
packages/pgs-shared/     ← cookie + surface config + Vitest
apps/README.md           ← Vercel project map
docs/SUBDOMAIN_ARCHITECTURE_PROPOSAL.md
.cursor/skills/pgs-visual-approve/
```

Root monolith unchanged — `npm run dev` on :3000.

### Phase 1 — after approval

```
apps/
  web/     ← (public) + student auth
  ops/     ← src/app/ops + features/operations
  admin/   ← src/app/admin + site CMS
  cms/     ← src/app/dash + features/dash-cms  (deploy: cms.purpleguide.study)
packages/
  pgs-shared/
```

Each app: own `package.json`, `vercel.json`, `NEXT_PUBLIC_PGS_SURFACE`.

### Phase 2 — login + permissions hardening

- Staff blocked from student-only routes; students blocked from staff subdomains
- Revisit flow vs Twenty + pgs-v3 `staff-auth.ts`
- Playwright: SA / Admin / Mentor / Viewer + cross-subdomain staff session

---

## Env vars per Vercel project

### Shared (all projects)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
# Do NOT set PGS_COOKIE_DOMAIN — keep sessions isolated per site
```

### Student frontend (`pgs-web`)

```
NEXT_PUBLIC_PGS_SURFACE=web
NEXT_PUBLIC_SITE_URL=https://purpleguide.study
NEXT_PUBLIC_OPS_SITE_URL=https://ops.purpleguide.study
NEXT_PUBLIC_ADMIN_SITE_URL=https://admin.purpleguide.study
NEXT_PUBLIC_CMS_SITE_URL=https://cms.purpleguide.study
```

### Staff ops (`pgs-ops`)

```
NEXT_PUBLIC_PGS_SURFACE=ops
NEXT_PUBLIC_SITE_URL=https://ops.purpleguide.study
NEXT_PUBLIC_WEB_SITE_URL=https://purpleguide.study
...
```

*(admin / cms — same pattern with respective `NEXT_PUBLIC_*_SITE_URL`)*

Legacy: `NEXT_PUBLIC_PGS_SURFACE=dash` still maps to `cms` in `@pgs/shared`.

Local multi-app dev:

```
npm run dev --prefix apps/web    # :3000  student frontend
npm run dev --prefix apps/ops    # :3001
npm run dev --prefix apps/admin  # :3002
npm run dev --prefix apps/cms    # :3003
```

---

## Testing protocol

### Automated — Phase 0 (now)

```bash
npm install
npm run test:shared
```

### Manual visual checklist

1. **Isolation:** Login as student on `/` → login as staff on `/admin` in another tab → both stay logged in as different users.
2. **Ops Super Admin:** Full nav + `/team/roles` matrix.
3. **Mentor:** No Team/Activity; assigned students only.
4. **Viewer:** Students + Notifications; `admin.*` redirects away.
5. **CMS publish:** Edit country on `admin.*` → view `/countries/{slug}` on apex.

### Playwright (Phase 2)

- `student-login-frontend.spec.ts` — login only on apex
- `staff-cross-subdomain-session.spec.ts`
- `role-nav-mentor.spec.ts` / `role-nav-viewer.spec.ts`
- `cms-publish-country.spec.ts`

---

## What we implement after you approve

| Step | Work | Visual proof |
|------|------|--------------|
| 1 | Scaffold `apps/web`, `apps/ops`, `apps/admin`, `apps/cms` | Each shell loads |
| 2 | Move routes + features | Same screens as today |
| 3 | OpsShell links → `crossSurfaceLink("admin"|"cms")` | Click → correct subdomain |
| 4 | Student login only on web; staff login on backend hosts | Screenshot both flows |
| 5 | Playwright + role fixtures | CI green |

---

## Pre-approval checklist (you)

- [ ] Confirm: **frontend** = `purpleguide.study`, **backend** = ops + admin + cms
- [ ] Confirm `/dash` deploys to `cms.purpleguide.study` (name in browser bar)
- [ ] Confirm Viewer = workspace-scoped (pgs_app, not v3 read_only_staff)
- [ ] Run `npm run test:shared`
- [ ] Reply **approve Phase 1** to start moving routes into `apps/*`

---

## Local URLs today (monolith)

| Surface | URL | Role |
|---------|-----|------|
| Student frontend | http://localhost:3000/ | Public + student |
| Ops | http://localhost:3000/ops | Staff |
| Admin (site CMS) | http://localhost:3000/admin | Staff |
| CMS (dash) | http://localhost:3000/dash | Staff |
