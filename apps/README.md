# PGS multi-app deployment

**1 student frontend + 3 staff backend apps** → **four Vercel projects**, one Supabase database.

## Student frontend

| Directory | Host (prod) | Vercel root | Port (local) |
|-----------|-------------|-------------|--------------|
| `apps/web` | **purpleguide.study** | `apps/web` | 3000 |

Public site, student login, guardian portal. **Not** staff ops/admin/cms.

## Staff backend

| Directory | Host (prod) | Monolith route | Port (local) |
|-----------|-------------|----------------|--------------|
| `apps/ops` | ops.purpleguide.study | `/ops` | 3001 |
| `apps/admin` | admin.purpleguide.study | `/admin` | 3002 |
| `apps/cms` | cms.purpleguide.study | `/dash` | 3003 |

Staff log in on backend subdomains. **Sessions are isolated per site** — do not set `PGS_COOKIE_DOMAIN` unless you want shared SSO.

## How routes work

- **Source of truth:** `src/app/*` (monolith routes + shared `src/features`, `src/lib`)
- **Per-app entry:** `apps/*/src/app/*` — auto-generated **route bridges** (`npm run scaffold:apps`)
- **Monolith dev:** `npm run dev` on `:3000` still runs all surfaces together

Implementation guide: [`docs/PHASE1_IMPLEMENTATION.md`](../docs/PHASE1_IMPLEMENTATION.md)

Shared code: [`packages/pgs-shared`](../packages/pgs-shared), [`packages/pgs-next-config`](../packages/pgs-next-config)

Architecture: [`docs/SUBDOMAIN_ARCHITECTURE_PROPOSAL.md`](../docs/SUBDOMAIN_ARCHITECTURE_PROPOSAL.md)

## Dev commands

```bash
npm run dev:web      # :3000
npm run dev:ops      # :3001
npm run dev:admin    # :3002
npm run dev:cms      # :3003
npm run scaffold:apps   # regenerate bridges after adding monolith routes
```

## Vercel setup (each project)

1. Same Git repo
2. Root Directory = `apps/web` | `apps/ops` | `apps/admin` | `apps/cms`
3. Env: see `apps/*/.env.example` + Supabase keys
4. Domain: assign host in Vercel DNS (`www` → redirect to apex for web)

## Cookie rule (recommended)

**Leave `PGS_COOKIE_DOMAIN` unset** on all four production projects.

Each deploy uses host-only cookies + a surface-specific cookie name (`…-pgs-web`, `…-pgs-ops`, etc.) so you can open frontend, cms, and ops in separate tabs as **different users**.

Details: [cookie isolation section](../docs/SUBDOMAIN_ARCHITECTURE_PROPOSAL.md#cookie-strategy--session-isolation-multi-tab-flexibility)
