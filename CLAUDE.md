# StageCall Website — Project Brief for Claude Code

This is the marketing/landing page for StageCall, built with Next.js and deployed on Vercel.

---

## What is this project?

A marketing site for StageCall — a mobile app for theater and live event productions.
The site's job is to explain the product, build trust, and capture early access sign-ups.

---

## Branches, Domains & Deploys

- **`main`** → Vercel Production → **`stagecall-app.nl`** (live). This is the pre-launch version: no pricing section and no sign-in button.
- **`preview`** → Vercel Preview → **`stagecallweb.vercel.app`** (behind Vercel login). The fuller site including pricing, kept for launch. It does **not** yet have the redesign, scroll behaviour or Dutch support that `main` has.
- **Never push to `main` without the user's explicit go-ahead for that push** — it deploys to the live domain within a minute. Build and show changes locally first.
- Don't merge the branches into each other before launch (`preview` → `main` brings pricing back; `main` → `preview` silently deletes it). Move individual changes with `git cherry-pick`.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Inline styles + CSS variables (globals.css). Tailwind is installed but use plain CSS classes in globals.css for anything responsive — Tailwind responsive prefixes (e.g. `sm:hidden`) are unreliable with v4 in this setup.
- **Animations:** Plain CSS transitions (`.reveal` classes in globals.css). Framer Motion is still a dependency but the site no longer uses it — don't reintroduce script-driven entrance animations; they jittered against the scripted scroll.
- **Email sign-ups:** Loops, via `app/api/subscribe/route.ts`
- **Deployment:** Vercel (see Branches above)
- **GitHub repo:** `berchris/stagecall-website`

---

## Design System

CSS variables are defined in `app/globals.css`:

```
--bg:         #0B0B16
--surface:    #13131E
--surface-r:  #1A1A28
--border:     #1C1C2E
--gold:       #F5B942   ← primary accent
--purple:     #A78BFA
--teal:       #00D4AA
--urgent:     #FF4757
--text:       #FFFFFF
--text-sec:   #8888AA
--text-muted: #4A4A6A
```

Font: **Inter** (loaded via `next/font/google` in `app/layout.tsx`)

---

## Project Structure

```
app/
  layout.tsx          ← Inter font, default metadata, <html lang="en"> (Nav corrects lang on the Dutch page)
  globals.css         ← CSS variables, base styles, nav classes, full-screen sections, card rows, entrance animations
  page.tsx            ← Dutch home page (`/`): metadata + <LandingPage lang="nl" />
  en/page.tsx         ← English home page (`/en`): metadata + <LandingPage lang="en" />
  api/subscribe/      ← Early access sign-up → Loops (stores the sign-up language as `language`)
  (emails/welcome/, scripts/push-emails.sh at the repo root: welcome email sources and push script)
  portal/, admin/     ← Authenticated portal (English only)

lib/
  i18n.ts             ← ALL landing page copy for both languages, plus locale helpers
  supabase/           ← Supabase clients for the portal

components/
  LandingPage.tsx     ← The whole landing page (Hero, How it works, Features, Roles, Early access + footer). Server component, takes `lang`.
  Nav.tsx             ← Fixed nav with scroll blur, hamburger menu on mobile, NL | EN switcher (landing page only). Also used by the portal login/verify pages.
  SectionScroller.tsx ← Section-by-section scrolling + the `.is-shown` flag that triggers entrances
  CardRow.tsx         ← Card grid on desktop; sideways swipeable row with dots on phones
  FadeIn.tsx          ← `FadeIn` / `StaggerItem`: wrappers that add the `.reveal` entrance classes
  EarlyAccessCta.tsx  ← The gold sign-up panel
  EarlyAccessForm.tsx ← Email form (loading, success, error states), posts to /api/subscribe
  PhoneMockup.tsx     ← Animated phone UI showing live countdown and call rows
  portal/             ← Portal and admin UI

middleware.ts         ← Home page language redirect + portal/admin auth
```

---

## Languages (Dutch + English)

- **Dutch is primary** at `/`; English is at `/en`. Only the home page is translated; the portal stays English.
- All copy lives in `lib/i18n.ts`. To change wording or add text, edit both the `en` and `nl` objects there — never hardcode visible text in components.
- Dutch copy is informal ("je") but professional. Theatre terms stay in English: "call", the call names ("Half hour", "Overture call", "Places"), "load-in", "crew", "early access".
- `middleware.ts` handles `/`: an explicit choice (cookie `lang`, set by the nav switcher) wins; otherwise a device that prefers any language other than Dutch is redirected to `/en`. Requests with no `Accept-Language` (crawlers) get Dutch.
- Dutch runs longer than English. After changing copy, check that every section still fits one phone screen in both languages.

---

## Welcome Email (Loops)

- Signing up adds the contact to the Loops list "In the loop" with `language` = `nl` or `en` (`app/api/subscribe/route.ts`).
- The Loops workflow "Welcome email (NL + EN)" (`cmuphfnbq1lvw0j1rtbcv10ag`) fires when a contact is added to that list and branches on `language`: `nl` gets the Dutch email, anything else gets English.
- Email sources live in `emails/welcome/welcome.{nl,en}.lmx`, in the same dark style as the app's invite and sign-in emails (those live in `~/Dev/StageCall/emails/`). Push changes with `scripts/push-emails.sh`; the workflow must be paused in the Loops dashboard while pushing.
- The Loops CLI cannot start, pause or resume a workflow; that is done in the dashboard.
- A contact that already exists gets no welcome email (Loops answers 409 and nothing is added to the list). Test with a fresh address or a `+alias`.
- Local dev has no `LOOPS_API_KEY`, so the form fails locally by design; test sign-ups on the live site.

---

## Full-screen Sections & Scrolling

Every section is a `.snap-section` that fills the screen, and `SectionScroller.tsx` turns one gesture (wheel, trackpad swipe, arrow key, touch swipe) into one eased glide to the next screen.

- **Desktop:** a section taller than the window scrolls normally until its edge, then glides.
- **Touch:** the page does not pan natively (`touch-action: pan-x`); a vertical swipe triggers the glide, sideways swipes scroll the card rows. On phones the hero is two stops (headline, then the app mockup).
- **Entrances:** content wrapped in `FadeIn` / `StaggerItem` (class `.reveal`) is hidden until its section gets `.is-shown`, then eases in with a per-item delay. Bolder variants apply on phones.
- **Reduced motion:** the takeover is off and all content is shown immediately.
- Things that caused bugs and must stay as they are:
  - Never transform an element that is a scroll-snap item or changes a scroller's size (cards animate an inner wrapper, not the slide).
  - Sections use `overflow: clip` so entrance transforms can't grow the page's scroll height.
  - The glide only writes whole-pixel scroll positions, and CSS `scroll-behavior: smooth` is off while it is active.
- New page content must live inside a `.snap-section`, and any new section must fit one screen on a phone.

---

## Responsive Nav

The nav uses `.nav-desktop` and `.nav-mobile` CSS classes defined in `globals.css`:
- Below 640px: `.nav-desktop` is hidden, `.nav-mobile` is shown (hamburger + dropdown)
- Above 640px: `.nav-desktop` is shown, `.nav-mobile` is hidden

Do NOT use Tailwind responsive prefixes for nav visibility — they don't work reliably here.

---

## Local Development

```bash
npm run dev        # starts at http://localhost:3000 (Dutch) and /en (English)
```

- **Phone testing:** open `http://<laptop-ip>:3000` on the same Wi-Fi. The laptop's address must be listed in `allowedDevOrigins` in `next.config.ts` (currently `192.168.2.6` and `192.168.2.8`), otherwise the dev server refuses to serve the scripts and the page shows empty sections. The address changes; check it with `ipconfig getifaddr en0`.
- **Don't run `next build`, a second dev server, or `git stash` in this folder while the dev server is running.** The dev server then keeps serving a stale `globals.css`. To check a production build, copy the project elsewhere and build there. If styles look stale, restart `npm run dev`.
- A "Load failed" overlay on portal pages means the local Supabase stack isn't running (see below).

### Portal (customer `/portal` + staff `/admin`)

The site now also has an authenticated portal (Supabase email-OTP auth, see `middleware.ts` and `lib/supabase/`) that reads/writes the **same Supabase project the StageCall mobile app uses** — `organisations` and `profiles` tables, plus a portal-only `is_staff` flag on `profiles`.

- **`.env.local`** (gitignored, per-machine) points local dev at the **local OrbStack/Docker Supabase stack** that lives in the separate `~/Dev/StageCall` (mobile app) repo — run `supabase start` there first (`supabase status` prints the URL/keys if you need to regenerate this file). This mirrors the local/remote split documented in that repo; see its `Local & Remote Environments` note for the full picture.
- **`.env.remote`** keeps the production Supabase creds as a reference — not auto-loaded by Next.js, only for manually swapping `.env.local` back to prod if you need to check something against real data.
- **Vercel** (production) is configured with its own env vars in the Vercel dashboard, pointing at the production Supabase project — it does not read any local `.env*` file.
- The local test login is `orgadmin@local.events` (org_admin role, `is_staff = true` on the local DB so both the customer portal and the staff `/admin` portal can be tested with it). OTP codes arrive in Mailpit (`http://127.0.0.1:54344`), not a real inbox.
- Schema changes to `organisations`/`profiles` for the portal should be added as a migration in `~/Dev/StageCall/supabase/migrations/` (not just run ad hoc against production) so the local stack and production stay in sync. `supabase/migration_portal.sql` in this repo is a historical record of what was already hand-applied to production; new portal schema changes shouldn't go there.

---

## What's Built

- Landing page in Dutch and English: Hero, How it Works (3 steps), Features (6 cards), Roles (Manager/Crew), Early Access sign-up with footer
- Full-screen sections with section-by-section scrolling on desktop and phones
- Responsive nav with mobile hamburger menu and language switcher
- Animated phone mockup with live countdown timer
- Early access email form wired to Loops
- Customer portal and staff admin (Supabase auth)

## What's Not Built Yet

- Pricing on the live site (exists on the `preview` branch, held back until launch)
- Sign-in link on the live site (removed for pre-launch; the portal is reachable at `/portal/login`)
- Fallback so content stays visible if the page's script fails to load
- Privacy policy / terms pages
- Any app download links (app not yet in stores)
