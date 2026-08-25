# Purple Guide Study — React frontend (`pgs_app`)

Standalone Next.js App Router frontend for [purpleguide.study](https://purpleguide.study).  
**Design:** existing ThemeZaa CSS/assets (pixel-matched).  
**Structure:** `app/<route>/page.tsx` + `features/` (not PHP-style view dumps).  
**Backend:** Supabase (Auth, Postgres, RLS) — see below.

## Home (3 variants)

Open `/` — experience comes from Supabase session + premium entitlement when configured.  
Without env keys, local mock Guest/Student/Premium switcher still works in development.

| Experience | Composition |
|------------|-------------|
| **Guest** | Signup hero + all shared sections |
| **Student** | Identity card + Explore #PGS + shared sections |
| **Premium** | Identity card (#PURPLEPREMIUM) + welcome + shared sections |

## Folder map

```
src/app/                 # routes (public + /admin + /portal)
src/components/layout/   # Header, Footer, SiteShell
src/features/            # page UI modules
src/lib/supabase/        # browser / server / admin clients
src/lib/auth/            # session experience + actor context
src/lib/catalog/         # public catalog readers
supabase/migrations/     # schema + RLS (you push)
public/assets/           # CSS + images
```

## Supabase setup (you run)

1. Copy env file and fill keys from the Supabase dashboard:

```bash
cp .env.local.example .env.local
```

2. Link and push migrations (CLI already installed):

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

3. Create your first Auth user in the dashboard (or sign up via `/login`), then promote to super admin in SQL Editor:

```sql
insert into public.staff_profiles (user_id, role_key, display_name, status)
values ('YOUR_AUTH_USER_UUID', 'super_admin', 'Super Admin', 'active');
```

4. Restart `npm run dev`. Open `/admin` as that user.

### Surfaces

| Path | Who |
|------|-----|
| `/` … public site | Guests / students / premium |
| `/admin` | Active staff (`staff_profiles`) |
| `/portal` | Guardians (invite + RPC) |

### Security notes

- Cookie SSR sessions via `@supabase/ssr` + middleware refresh
- Catalog public read: `published = true` AND `lifecycle_phase = 'live'`
- Guardian data: security-definer RPCs only
- Service role key: server-only (`src/lib/supabase/admin.ts`)

### Schema size

Migrations are split into numbered files under `supabase/migrations/` (core → catalog → premium → guardians → geo/tags → CMS modules → workspace → ops → RLS).  
Table coverage aligns with the pgs-v3 / `WARNING` reference (~70 public tables): identity, staff RBAC, catalog + phases, CMS content, premium workspace/docs/kanban, leads, notifications, CRM tags, guardians, audit.  
pgs-v3’s ~50 migration *files* include many incremental patches; here the same surface is consolidated into fewer ordered migrations you push once with `supabase db push`.

## References (read-only)

- PHP product: `E:\pgs\purpleguide`
- Ops/guardian patterns: `E:\pgs2\pgs-v3`
- Schema refs in-repo: `mysql.json`, `-- WARNING_ Thi.txt`, `Table -cms_e.txt`
