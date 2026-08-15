# Med — Data Portfolio (v2)

Personal portfolio built with React + Vite + Tailwind CSS v4, a "glass" dark
UI with a teal glow accent. Sections: Hero, About, Projects, Experience, How
I Work, Contact — plus a private `/dashboard` to manage your projects.

## Run locally
```bash
npm install
npm run dev
```
Open the local URL it prints (usually http://localhost:5173).

## Setup

### 1. Create your Supabase project & table
- Go to your Supabase project → SQL Editor → New query
- Paste and run the contents of `supabase/migration.sql`
- This creates the `projects` table, sets public read / authenticated
  write access, and seeds it with your Attendify + Data Analysis Assistant
  content

### 2. Add your Supabase credentials
- Copy `.env.example` to `.env`
- Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (Supabase →
  Project Settings → API) — the anon key is safe to expose publicly, it only
  allows what the RLS policies in the migration permit

### 3. Create your admin login
- Supabase → Authentication → Users → **Add user**
- Enter your email + a password, check **"Auto Confirm User"**
- Do **not** use public sign-up — this is the only way to create the account,
  so there's exactly one admin login

### 4. Log in and manage your projects
- Go to `/login`, sign in with that email + password
- You'll land on `/dashboard` — add, edit, or delete projects there
- Changes save straight to Supabase and appear on the homepage right away
  (no redeploy needed)

### 5. Contact form (Formspree)
1. Sign up free at [formspree.io](https://formspree.io), create a new form
2. Copy your form endpoint (looks like `https://formspree.io/f/abcd1234`)
3. Open `src/sections/Contact.jsx` and replace:
   ```js
   const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";
   ```
   with your real endpoint
4. Update the email shown in the same file (`contactInfo` array)

## Before you launch — replace these placeholders
- `public/hero-bg.jpg`, `public/profile-photo.jpg` — your own images
- `href="#"` links in `src/sections/Hero.jsx` and `src/layout/Footer.jsx` — your real GitHub/LinkedIn
- "Download CV" button in `src/sections/Hero.jsx` — add a PDF to `public/` and link it

## Deploy (free)
1. Push this folder to a GitHub repo
2. Vercel or Netlify → New Project → import the repo
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add your env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the deploy settings
4. This repo includes `vercel.json` and `public/_redirects` so `/login` and
   `/dashboard` work correctly on both Vercel and Netlify (without these, a
   direct visit or refresh on those routes would 404 — SPA routing needs the
   host to always serve `index.html`)

## Structure
- `src/pages/` — HomePage, LoginPage, DashboardPage
- `src/sections/` — Hero, About, Projects (Supabase-backed), Experience, Testimonials ("How I Work"), Contact
- `src/layout/` — Navbar, Footer
- `src/lib/` — `supabase.js` (client), `content.js` (data fetching), `useSession.js` (auth hook)
- `src/store/dashboardStore.js` — Zustand store for the dashboard's UI state
- `supabase/migration.sql` — table + policies + seed data
