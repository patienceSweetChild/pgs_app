# PAGE CHECKLIST — Purple Guide student frontend

**Live vs this app:** open [`../audit/page-audit.html`](../audit/page-audit.html) (shared Google Sheet). Delete the whole `audit/` folder when done.

Definition of done per route:
- `app/<route>/page.tsx` exists (thin)
- Feature UI under `features/`
- Matches current site design (legacy CSS + same classes)
- Works with mock auth (Guest / Student / Premium switcher)

## Shell
- [x] Header / Footer / experience provider
- [x] Sidebar panel + Hello strip + #univMeet widget + search
- [x] Mobile drawer (header hamburger)

## Auth
- [x] `/login` — login + create-account toggle (`?signup=1&email=`), mock Google/email auth
- [x] `/singup` — pathway pick + profile completion (after create account)
- [x] `/forgot_password`
- [x] `/reset_password`
- [x] `/change_password`
- [x] `/userprofile`

## Marketing
- [x] `/` Home — React sections (no HTML injection); 3 variants via Guest/Student/Premium
- [x] `/about` — full sections incl. Phase 5, advisory, news, ecosystem, FAQ
- [x] `/contact`
- [x] `/unitieup`
- [x] `/purplepremiumhome`

## Pathways
- [x] `/purpleusme`
- [x] `/purpleamc`
- [x] `/purpleplab`
- [x] `/purplenonmedical`
- [x] `/purpleboard`
- [x] `/usmlerotation`

## Countries
- [x] `/explorecountries`
- [x] `/countries/[slug]` (usa, uk, aus, germany, nz, europe, france, canada, mauritius, others)

## Catalog / hubs
- [x] `/purpleevents`
- [x] `/purpleevents/session/[id]`
- [x] `/cvreadyprogram`
- [x] `/studentresources`
- [x] `/finance`
- [x] `/scholarship`
- [x] `/saved`

## Premium
- [x] `/dashboard` — feed dashboard (Guest locked / Student locked / Premium unlocked; no counsellor heading)
- [x] `/feed_track_progress` — locked / unlocked via Premium
- [x] `/upload_your_doc` — locked / unlocked via Premium
- [x] Soft-lock variants
- [ ] Notifications UI

## Deploy
- [ ] Vercel project root = this repo
