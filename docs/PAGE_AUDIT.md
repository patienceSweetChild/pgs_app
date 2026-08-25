# PAGE AUDIT — live site vs this app

Compare **[purpleguide.study](https://purpleguide.study)** (original) with the local app (`http://localhost:3000`).

**Interactive form (preferred):** open [`../audit/page-audit.html`](../audit/page-audit.html) — syncs to a shared Google Sheet. Delete the whole `audit/` folder when the audit is done.

This markdown file is optional / offline only.

## How to mark

For each row, tick **one** verdict and write what is wrong (or leave notes blank if alright).

| Verdict | Meaning |
|---------|---------|
| **Alright** | Matches live closely enough — no change |
| **Fix** | Wrong / broken (layout, link, copy, missing block, auth state) — should be corrected |
| **Revision** | Directionally right but needs a design/copy pass (spacing, type, image crop, wording) |

Look at: layout, spacing, type, images, links, forms, mobile, Guest / Student / Premium states.

---

## Shell (any page)

### Header
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### Footer
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### Sidebar + Hello strip + #univMeet + search
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### Mobile drawer (hamburger)
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### Experience switcher (Guest / Student / Premium)
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

---

## Auth

### `/login`
Live: https://purpleguide.study/Login · Local: http://localhost:3000/login
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/singup`
Live: https://purpleguide.study/singup · Local: http://localhost:3000/singup
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/forgot_password`
Live: https://purpleguide.study/forgot_password · Local: http://localhost:3000/forgot_password
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/reset_password`
Live: https://purpleguide.study/reset_password · Local: http://localhost:3000/reset_password
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/change_password`
Live: https://purpleguide.study/change_password · Local: http://localhost:3000/change_password
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/userprofile`
Live: https://purpleguide.study/userprofile · Local: http://localhost:3000/userprofile
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

---

## Marketing

### `/` Home — Guest
Live: https://purpleguide.study/ · Local: http://localhost:3000/ (switcher: Guest)
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/` Home — Student
Live: signed-in student home · Local: http://localhost:3000/ (switcher: Student)
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/` Home — Premium
Live: premium home · Local: http://localhost:3000/ (switcher: Premium)
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/about`
Live: https://purpleguide.study/about · Local: http://localhost:3000/about
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/contact`
Live: https://purpleguide.study/contact · Local: http://localhost:3000/contact
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/unitieup`
Live: https://purpleguide.study/unitieup · Local: http://localhost:3000/unitieup
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/purplepremiumhome`
Live: https://purpleguide.study/purplepremiumhome · Local: http://localhost:3000/purplepremiumhome
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

---

## Pathways

### `/purpleusme`
Live: https://purpleguide.study/purpleusme · Local: http://localhost:3000/purpleusme
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/purpleamc`
Live: https://purpleguide.study/purpleamc · Local: http://localhost:3000/purpleamc
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/purpleplab`
Live: https://purpleguide.study/Purpleplab · Local: http://localhost:3000/purpleplab
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/purplenonmedical`
Live: https://purpleguide.study/Purplenonmedical · Local: http://localhost:3000/purplenonmedical
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/purpleboard`
Live: https://purpleguide.study/purpleboard · Local: http://localhost:3000/purpleboard
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/usmlerotation`
Live: https://purpleguide.study/Usmlerotation · Local: http://localhost:3000/usmlerotation
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

---

## Countries

### `/explorecountries`
Live: https://purpleguide.study/explorecountries · Local: http://localhost:3000/explorecountries
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/countries/usa`
Live: https://purpleguide.study/countriesusa · Local: http://localhost:3000/countries/usa
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/countries/uk`
Live: https://purpleguide.study/countriesuk · Local: http://localhost:3000/countries/uk
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/countries/aus`
Live: https://purpleguide.study/countriesaus · Local: http://localhost:3000/countries/aus
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/countries/germany`
Live: https://purpleguide.study/countriesgermany · Local: http://localhost:3000/countries/germany
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/countries/nz`
Live: https://purpleguide.study/countriesnz · Local: http://localhost:3000/countries/nz
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/countries/europe`
Live: https://purpleguide.study/countrieseurope · Local: http://localhost:3000/countries/europe
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/countries/france`
Live: https://purpleguide.study/countriesfrance · Local: http://localhost:3000/countries/france
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/countries/canada`
Live: https://purpleguide.study/countriescanada · Local: http://localhost:3000/countries/canada
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/countries/mauritius`
Live: https://purpleguide.study/countriesmauritius · Local: http://localhost:3000/countries/mauritius
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/countries/others`
Live: https://purpleguide.study/countriesothers · Local: http://localhost:3000/countries/others
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

---

## Catalog / hubs

### `/purpleevents`
Live: https://purpleguide.study/purpleevents · Local: http://localhost:3000/purpleevents
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/purpleevents/session/10`
Live: session detail on live site · Local: http://localhost:3000/purpleevents/session/10
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/cvreadyprogram`
Live: https://purpleguide.study/cvreadyprogram · Local: http://localhost:3000/cvreadyprogram
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/studentresources`
Live: https://purpleguide.study/studentresources · Local: http://localhost:3000/studentresources
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/finance`
Live: https://purpleguide.study/finance · Local: http://localhost:3000/finance
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/scholarship`
Live: https://purpleguide.study/scholarship · Local: http://localhost:3000/scholarship
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/saved`
Live: https://purpleguide.study/saved · Local: http://localhost:3000/saved
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

---

## Premium (use the experience switcher)

### `/dashboard` — Guest (locked)
Live: logged-out dashboard · Local: http://localhost:3000/dashboard (Guest)
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/dashboard` — Student (locked)
Local: http://localhost:3000/dashboard (Student)
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/dashboard` — Premium (unlocked)
Live: https://purpleguide.study/Home/defaultdashboard · Local: http://localhost:3000/dashboard (Premium)
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/feed_track_progress` — locked
Local: http://localhost:3000/feed_track_progress (Guest or Student)
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/feed_track_progress` — unlocked
Local: http://localhost:3000/feed_track_progress (Premium)
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/upload_your_doc` — locked
Local: http://localhost:3000/upload_your_doc (Guest or Student)
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### `/upload_your_doc` — unlocked
Local: http://localhost:3000/upload_your_doc (Premium)
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

---

## Other

### 404 / unknown route
Local: http://localhost:3000/this-page-does-not-exist
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:

### Notifications UI
- [ ] Alright    [ ] Fix    [ ] Revision
- Notes:
