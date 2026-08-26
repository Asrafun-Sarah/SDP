# ProjectForge

Engineering Project Sharing Platform — a university Software Development
Project. Built with plain HTML/CSS/JS (via EJS templates), Node.js,
Express, PostgreSQL (Supabase), and Cloudinary for file storage.

## Features

- Landing page, registration, login/logout (session-based, bcrypt-hashed passwords)
- Student dashboard with search bar and recent projects
- Browse/search projects (keyword + department + course filters)
- Project details page with files, technologies, and author
- Student profiles with demonstrated experience (calculated from real project data)
- Upload/edit/delete your own projects (with file uploads to Cloudinary)
- Request help from another student; accept/decline with status tracking

## Tech Stack

- **Frontend:** EJS templates (server-rendered HTML) + plain CSS
- **Backend:** Node.js + Express
- **Database:** PostgreSQL, hosted on Supabase
- **File storage:** Cloudinary
- **Auth:** express-session + bcrypt

## Project Structure

```
config/        Database and Cloudinary connection setup
controllers/   Route logic (one file per feature area)
middleware/    requireLogin.js — protects private routes
models/        All SQL queries, grouped by table
routes/        Express route definitions
views/         EJS templates
public/        CSS, client JS, (unused) local uploads folder
schema.sql     Run once in Supabase to create all tables
seed.sql       Optional sample data
```

## Local Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a free Supabase project at https://supabase.com
   - Go to Project Settings → Database → Connection string (use the
     "URI" format, pooled connection recommended)
   - In the Supabase SQL editor, run the contents of `schema.sql`
   - Optionally run `seed.sql` for sample data (note: its password
     hashes are placeholders — register real accounts instead if you
     want to actually log in)

3. Create a free Cloudinary account at https://cloudinary.com
   - Copy your Cloud Name, API Key, and API Secret from the dashboard

4. Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` — your Supabase connection string
   - `SESSION_SECRET` — any long random string
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

5. Run the server:
   ```
   node server.js
   ```
   Open http://localhost:3000

## Manual Testing Checklist

Once your `.env` is filled in with real credentials, test in this order:

1. Register a new account → should land on the dashboard
2. Log out, log back in with the same credentials
3. Go to "Upload Project", fill the form, attach a small PDF as the
   report → after submitting, you should land on the project's
   details page with the file linked
4. Go to "Browse Projects" → your project should appear; try
   searching by its title and by a technology name
5. Go to "My Projects" → edit the project (change the title), verify
   the change appears on the details page
6. Register a second account (in an incognito window) → view the
   first user's profile → click "Request Help" → send a message
7. Log back in as the first user → go to "Help Requests" → accept or
   decline the request → confirm the second user sees the updated status
8. Try deleting a project from "My Projects" → confirm it's gone from
   "Browse Projects"
9. Log out and try visiting `/dashboard` or `/my-projects` directly →
   should redirect to login

## Deployment (Render)

1. Push this project to a GitHub repository (the `.gitignore` already
   excludes `node_modules` and `.env`)

2. Go to https://render.com → New → Web Service → connect your GitHub repo

3. Configure the service:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free is fine for a university project

4. Under Environment, add the same variables from your `.env`:
   `DATABASE_URL`, `SESSION_SECRET`, `CLOUDINARY_CLOUD_NAME`,
   `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   (Do not set `PORT` — Render sets this automatically and our code
   already reads `process.env.PORT`.)

5. Deploy. Render gives you a public URL like
   `https://projectforge.onrender.com` — this works from any device,
   any network, for multiple users at once, satisfying the "must not
   be localhost-only" requirement.

6. Note: Render's free tier "spins down" after inactivity, so the
   first request after a while can take ~30 seconds to wake up. This
   is normal and worth mentioning if you demo it live.

## Notes on Design Decisions (for your viva)

- **Why EJS instead of React:** the project needed dynamic data (project
  lists, search results) shown as plain HTML, without introducing a
  build step or a new language (JSX) on top of what you're learning.
- **Why PostgreSQL instead of storing everything as documents:** the
  data has real relationships (a user has many projects, a project has
  many technologies, help requests link two users) — a relational
  database expresses foreign keys directly instead of duplicating data.
- **Why Cloudinary instead of saving files to the server's disk:** most
  free hosting platforms erase local files on every restart/redeploy,
  so files saved to disk would disappear. Cloudinary keeps them
  persistent and gives back a permanent URL to store in the database.
- **Why sessions instead of JWT:** sessions are simpler to reason about
  for a single server app like this — the server just checks
  `req.session.user` on each request; no token-signing/verification
  logic to explain.
