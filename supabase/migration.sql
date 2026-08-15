-- Run this in Supabase SQL Editor (Project → SQL Editor → New query)

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  title text not null,
  description text not null,
  image text not null default '',
  tags text[] not null default '{}',
  link text not null default '#',
  github text not null default '#',
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

-- Anyone can read (the public portfolio page)
create policy "Public can read projects"
  on public.projects for select
  using (true);

-- Only you, logged in via /login, can add/edit/delete
create policy "Authenticated can insert projects"
  on public.projects for insert
  to authenticated
  with check (true);

create policy "Authenticated can update projects"
  on public.projects for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete projects"
  on public.projects for delete
  to authenticated
  using (true);

-- Seed with your current two projects
insert into public.projects (sort_order, title, description, image, tags, link, github) values
(1, 'Attendify',
  'A multi-tenant school attendance SaaS with an ML-based absence-risk model — flags at-risk students early instead of after the fact, plus an AI chatbot for plain-language questions about the data.',
  '/projects/project1.png',
  array['Next.js 14', 'Supabase', 'Python / FastAPI', 'Random Forest'],
  '#', '#'
),
(2, 'Data Analysis Assistant',
  'A CSV-to-dashboard tool: upload any messy CSV and get automated Pandas analysis plus an interactive Chart.js dashboard — no manual setup per dataset.',
  '/projects/project2.png',
  array['React / Vite', 'FastAPI', 'Supabase', 'Chart.js', 'Pandas'],
  '#', '#'
);

-- ── Creating your admin login ──────────────────────────────────────────────
-- Supabase dashboard → Authentication → Users → Add user
-- Enter your email + a password, and check "Auto Confirm User".
-- Then log in at yoursite.com/login with those same credentials.
-- Do NOT use public sign-up — create this account manually so there's
-- exactly one admin account.
