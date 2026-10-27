# Japanese N5 / NAT-TEST 5Q Study Tracker

A self-contained static website for a beginner study plan from 27 October 2026 to 7 January 2027.

## Features
- Daily 120-minute task checklist and date picker
- Progress bars and calendar
- Phase-by-phase roadmap
- Minna no Nihongo Lessons 1–25 completion tracker
- Starter vocabulary flashcards
- Day 1 quiz and Lesson 1 grammar sheet
- Mistake log with review dates
- Practice/mock score log
- JSON export/import backup

# Japanese N5 Study Tracker — Timer version

Daily tasks have Start, Pause/Resume and Reset controls. The countdown runs for the required task duration. After the full duration elapses, the task shows a green “✓ Completed” ticket. Timer state is saved in this browser and remains accurate when the tab is backgrounded or refreshed.

Open index.html locally, or deploy the folder as a static website on Vercel. Progress remains local to the browser; export a backup before switching devices.

## Run locally
Open `index.html` in a modern browser.

## Host on Vercel
1. Upload this folder to a GitHub repository.
2. In Vercel, import the repository.
3. Framework preset: Other. Build command: leave blank. Output directory: `.` (or the project root).
4. Deploy.

# Japanese N5 Study Tracker — Supabase cloud sync

## What's included
- Mark any task done at any time; timer is optional.
- Local browser storage plus optional Supabase cloud sync.
- Email/password sign-up and sign-in.
- Sync of study tasks, notes, lessons, flashcard status, quiz results, mistakes, and mock scores.
- Local JSON backup/import remains available.

## 1. Create a Supabase project
1. Open https://supabase.com and create a project.
2. In Project Settings → API (or Connect), copy the **Project URL** and the **publishable key** (or legacy `anon` public key).
3. Do **not** use or paste the `service_role` / secret key into this website.

## 2. Create the table and security policy
In Supabase → SQL Editor, run this SQL:

```sql
create table if not exists public.tracker_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.tracker_data enable row level security;

create policy "Users can read their own tracker"
on public.tracker_data for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own tracker"
on public.tracker_data for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own tracker"
on public.tracker_data for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

If you already created policies with the same names, do not run the `create policy` statements twice. Either remove the old policies in the dashboard or use a fresh project.

## 3. Enable email/password sign-in
In Supabase → Authentication → Providers, make sure Email is enabled. For easier first testing, you can turn off email confirmation in Authentication settings; for a real deployment, leave confirmation enabled and verify your email. If confirmation is enabled, sign-up may ask you to check your email before signing in.

## 4. Configure the website
1. Deploy `index.html` to Vercel (HTTPS is recommended).
2. Open the deployed website and select **Backup**.
3. Enter the Supabase Project URL and publishable/anon key, then click **Save cloud settings**.
4. Create an account or sign in.
5. On another device/browser, enter the same Project URL and public key and sign in with the same account.

The site saves a local copy and uploads changes to the cloud when online and signed in. The status text in the Backup section tells you whether sync is up to date. The first sign-in merges local and cloud records so existing browser progress is not intentionally discarded.

## Security notes
- The publishable/anon key is designed for use in a browser; security depends on Authentication and Row Level Security (RLS).
- Never expose a Supabase `service_role` or secret key in `index.html`, a public repository, or Vercel client-side environment variables.
- Anyone can create their own account, but RLS should prevent them from reading or modifying another user's row.
- Use a strong unique password and keep exporting occasional JSON backups.
- Cloud sync requires internet access. If offline or signed out, local saving still works.

## Important implementation note
This is a static HTML app with client-side sync, not a server-side merge engine. Avoid editing the same item simultaneously on multiple devices while offline. After first sign-in, the tracker merges records and uploads the combined data; subsequent updates are synced to the same account row.


## Vercel environment variables (automatic configuration)

This package includes `api/config.js`. Deploy the entire folder so Vercel creates the `/api/config` serverless endpoint. In Vercel → Project → Settings → Environment Variables, add:

- `SUPABASE_URL` = your Supabase Project URL
- `SUPABASE_PUBLISHABLE_KEY` = your Supabase publishable key (or use `SUPABASE_ANON_KEY` for the legacy anon key)

Choose Production (and Preview too if you want preview deployments to work), save, then redeploy. The website calls `/api/config` and fills in the Supabase settings automatically. These are public client credentials; do not configure or expose a service-role/secret key.

**Important:** The serverless endpoint returns only the publishable/anon key, which is meant to be public in a browser. Database security must still be enforced with Supabase Auth and the row-level security policies above.

# Japanese N5 Tracker — Demt shared profile (Vercel + Supabase)

This build removes email/password sign-in and adds a dedicated N5-level kanji flashcard section. It includes a daily plan with visible study tasks and separate kanji known/review progress. All devices use one shared profile named **Demt**. A shared access code is requested once per browser and saved locally so you do not need to sign in on every visit.

## Important privacy note
This is a shared profile, not per-user private storage. Anyone who has both the website URL and the shared access code can view or overwrite the shared tracker data. Choose a strong, non-obvious access code and share it only with people you trust. Do not put the Supabase service-role key in browser code or public GitHub files.

## 1. Supabase table
In Supabase SQL Editor, run:

```sql
create table if not exists public.tracker_shared_data (
  profile text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.tracker_shared_data enable row level security;
```

The Vercel API uses the service-role key server-side, so it can access this table despite RLS. Do not add a policy that exposes this table to `anon` or `authenticated`. If an earlier user-based `tracker_data` table exists with `user_id` as its primary key, back it up first and migrate/create a separate table with `profile` as the primary key.

## 2. Vercel environment variables
In Vercel → Project → Settings → Environment Variables, add these for **Production** (and Preview if you test previews):
- `SUPABASE_URL` = Supabase Project URL
- `SUPABASE_SERVICE_ROLE_KEY` = Supabase service-role/secret key (server-side only)
- `DEMT_ACCESS_CODE` = a strong shared access code you choose

Save and redeploy. The service-role key is used only by `/api/tracker.js`; it is never sent to the browser. Never name it with a `NEXT_PUBLIC_` or `VITE_` prefix.

## 3. Deploy
Deploy the entire project folder, including:
- `index.html`
- `api/tracker.js`

Do not deploy only `index.html`, because the API endpoint is required for cloud storage.

## 4. First visit
1. Open the deployed site and go to Backup.
2. The site checks the cloud automatically.
3. When prompted, enter the same `DEMT_ACCESS_CODE` you configured in Vercel. It is remembered in that browser.
4. On other devices, enter the same access code once.
5. Look for **Connected — Demt profile is backed up to Supabase**. Use **Test connection** or **Sync now** if needed.

## Troubleshooting
- `503`: one or more Vercel environment variables are missing, or the deployment has not been redeployed.
- `401`: access code does not match `DEMT_ACCESS_CODE`. Clear the saved `demtTrackerAccessCode` value in browser local storage to re-enter it.
- `Supabase read/write failed`: check that the `tracker_shared_data` table has `profile`, `data`, and `updated_at` columns and that the service-role key belongs to this project.
- Local storage continues to save when cloud backup is unavailable. Export a JSON backup periodically.

## Data sync note
The app merges local progress with the shared profile when it first loads and then uploads changes. Kanji known/review progress is stored in the shared tracker data as well. Since this is one shared profile, avoid editing the same task or score on two devices simultaneously while offline.
