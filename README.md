# The Scenic Shift

A full-stack photography portfolio website built with Next.js, featuring dynamic albums, an admin upload panel, and integrations with Cloudinary, Supabase, YouTube, and Instagram.

**Live site:** https://the-scenic-shift.vercel.app

---

## Features

- 📷 **Dynamic photo & video albums** — create, rename, and delete albums entirely through the admin panel, no code changes needed
- 🖼️ **Masonry gallery with lightbox** — orientation-aware grid, keyboard navigation, download & share buttons
- 🔐 **Password-protected admin panel** (`/admin`) — batch upload with drag-free file picker, live progress bar, automatic image compression, HEIC/format normalization
- ☁️ **Cloudinary** — media storage, delivery, and optimization
- 🗄️ **Supabase (Postgres)** — album & photo metadata, with Row Level Security (public read-only, admin-only writes via service role key)
- 🌗 **Light/dark theme toggle** — persists across visits
- ✨ **Scroll-triggered reveal animations** on album grids and galleries
- 📨 **Contact form** — validated, rate-limited, wired to email (Resend) or Google Sheets
- 🎬 **YouTube & Instagram sections** — embedded content with custom branded UI
- 🔍 **SEO-ready** — Open Graph tags, custom 404 page, loading skeletons

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS v4 |
| Media storage | Cloudinary |
| Database | Supabase (Postgres) |
| Hosting | Vercel |
| Image compression | `browser-image-compression` |
| Contact form backend | Resend (email) or Google Sheets API |

---

## Project Structure

```
app/
  page.js                    # Homepage — album grid
  about/                     # About page
  albums/[slug]/             # Dynamic album detail pages
  admin/                     # Password-protected upload panel
  contact/                   # Contact form
  youtube/                   # YouTube showcase page
  instagram/                 # Instagram showcase page
  api/
    photos/                  # CRUD for photos
    albums/                  # CRUD for albums
    sign-upload/              # Cloudinary signed upload endpoint
    admin-login/               # Admin auth
    contact/                  # Contact form handler

components/
  Header.js                  # Nav + mobile menu + theme toggle
  Gallery.js                 # Masonry grid + lightbox
  AlbumCard.js                # Homepage album tile
  ThemeToggle.js               # Light/dark switch
  Reveal.js                  # Scroll-reveal animation hook

lib/
  supabase.js                 # Public (anon key) client — read-only
  supabaseAdmin.js             # Server-only (service role key) client — full access
  cloudinary.js                # Cloudinary server config
  photos.js                   # Data-fetching helpers
  rateLimit.js                 # In-memory rate limiter for contact form
  useInView.js                 # Intersection Observer hook
```

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Create a `.env.local` file in the project root:

```env
# Cloudinary — cloudinary.com dashboard
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Supabase — Settings > API
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Admin panel password
ADMIN_PASSWORD=

# Contact form (choose one)
RESEND_API_KEY=
CONTACT_TO_EMAIL=
# — or —
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=
```

### 3. Set up the database
In Supabase's SQL Editor, run:

```sql
create table albums (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  description text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table photos (
  id uuid default gen_random_uuid() primary key,
  album text not null,
  src text not null,
  public_id text not null,
  resource_type text not null default 'image',
  caption text,
  created_at timestamp default now()
);

alter table albums enable row level security;
alter table photos enable row level security;

create policy "Public can view albums" on albums for select using (true);
create policy "Public can view photos" on photos for select using (true);
```

### 4. Run the dev server
```bash
npm run dev
```
Visit `http://localhost:3000`.

---

## Managing Content

All content management happens through **`/admin`**:
- Log in with `ADMIN_PASSWORD`
- Create, rename, or delete albums
- Upload photos/videos (batch upload supported, auto-compressed, auto-converted to universally compatible formats)
- Delete individual photos (removes from both Supabase and Cloudinary)

No code changes or redeploys are needed for routine content updates.

---

## Deployment

Deployed on **Vercel**.

```bash
vercel --prod
```

Ensure all environment variables from `.env.local` are also added in **Vercel → Project Settings → Environment Variables** before deploying.

---

## Notes

- The admin panel uses a **session-only** login (no persistent cookie) — the password is required on every visit.
- The lightbox and admin panel intentionally stay dark regardless of the site's light/dark toggle.
- Row Level Security restricts the public (`anon`) Supabase key to read-only access; all write operations go through the service role key on the server, gated behind the admin password.
