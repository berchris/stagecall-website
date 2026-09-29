# StageCall Website — Project Brief for Claude Code

This is the marketing/landing page for StageCall, built with Next.js and deployed on Vercel.

---

## What is this project?

A static marketing site for StageCall — a mobile app for theater and live event productions.
The site's job is to explain the product, build trust, and capture early access sign-ups.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Inline styles + CSS variables (globals.css). Tailwind is installed but use plain CSS classes in globals.css for anything responsive — Tailwind responsive prefixes (e.g. `sm:hidden`) are unreliable with v4 in this setup.
- **Animations:** Framer Motion (`FadeIn` component for scroll-triggered fade-ins)
- **Deployment:** Vercel (auto-deploys from `main` branch on GitHub)
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
  layout.tsx        ← Inter font, metadata
  globals.css       ← CSS variables, base styles, responsive nav classes
  page.tsx          ← Full landing page (Hero, How it works, Features, Roles, Pricing, Early Access, Footer)

components/
  Nav.tsx           ← Fixed nav with scroll blur. Uses .nav-desktop / .nav-mobile CSS classes for responsive behaviour. Hamburger menu on mobile.
  PhoneMockup.tsx   ← Animated phone UI showing live countdown and call rows
  FadeIn.tsx        ← Framer Motion whileInView wrapper
  EarlyAccessForm.tsx ← Email signup form (loading + success states). Backend not yet wired up.
```

---

## Responsive Nav

The nav uses `.nav-desktop` and `.nav-mobile` CSS classes defined in `globals.css`:
- Below 640px: `.nav-desktop` is hidden, `.nav-mobile` is shown (hamburger + dropdown)
- Above 640px: `.nav-desktop` is shown, `.nav-mobile` is hidden

Do NOT use Tailwind responsive prefixes for nav visibility — they don't work reliably here.

---

## Local Development

```bash
npm run dev        # starts at http://localhost:3000
                   # also available on local network at http://192.168.2.6:3000
```

The `next.config.ts` has `allowedDevOrigins: ['192.168.2.6']` to allow phone testing on the same Wi-Fi.

### Portal (customer `/portal` + staff `/admin`)

The site now also has an authenticated portal (Supabase email-OTP auth, see `middleware.ts` and `lib/supabase/`) that reads/writes the **same Supabase project the StageCall mobile app uses** — `organisations` and `profiles` tables, plus a portal-only `is_staff` flag on `profiles`.

- **`.env.local`** (gitignored, per-machine) points local dev at the **local OrbStack/Docker Supabase stack** that lives in the separate `~/Dev/StageCall` (mobile app) repo — run `supabase start` there first (`supabase status` prints the URL/keys if you need to regenerate this file). This mirrors the local/remote split documented in that repo; see its `Local & Remote Environments` note for the full picture.
- **`.env.remote`** keeps the production Supabase creds as a reference — not auto-loaded by Next.js, only for manually swapping `.env.local` back to prod if you need to check something against real data.
- **Vercel** (production) is configured with its own env vars in the Vercel dashboard, pointing at the production Supabase project — it does not read any local `.env*` file.
- The local test login is `orgadmin@local.events` (org_admin role, `is_staff = true` on the local DB so both the customer portal and the staff `/admin` portal can be tested with it). OTP codes arrive in Mailpit (`http://127.0.0.1:54344`), not a real inbox.
- Schema changes to `organisations`/`profiles` for the portal should be added as a migration in `~/Dev/StageCall/supabase/migrations/` (not just run ad hoc against production) so the local stack and production stay in sync. `supabase/migration_portal.sql` in this repo is a historical record of what was already hand-applied to production; new portal schema changes shouldn't go there.

---

## What's Built

- Full landing page: Hero, How it Works (3 steps), Features (6 cards), Roles (Manager/Crew), Pricing (Free/Pro/Company), Early Access CTA, Footer
- Responsive nav with mobile hamburger menu
- Animated phone mockup with live countdown timer
- Scroll-triggered fade-in animations throughout
- Early access email form (UI only — backend not wired up yet)

## What's Not Built Yet

- Wire up early access form to a real backend (Loops, Resend, or Supabase)
- Privacy policy / terms pages
- Any app download links (app not yet in stores)
