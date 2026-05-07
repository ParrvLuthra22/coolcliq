# Deployment guide

This walks you through deploying CoolCliq to free/cheap services. End state:

- **Frontend** on Netlify (free)
- **Backend** on Railway or Render (free tiers, ~$5/mo if exceeded)
- **Database** on Supabase Postgres (free tier, 500MB)

If you only need the **frontend deployed for the assignment submission**, jump to [Step 2 — Frontend on Netlify](#step-2--frontend-on-netlify) and skip the rest. The frontend works as a self-contained showcase even without a live backend.

---

## Step 1 — Push to GitHub

```bash
cd coolcliq
git init
git add .
git commit -m "Initial commit — CoolCliq submission"
git branch -M main
```

Create a new repository on GitHub (e.g. `coolcliq-newton-submission`), then:

```bash
git remote add origin https://github.com/<your-username>/coolcliq-newton-submission.git
git push -u origin main
```

---

## Step 2 — Frontend on Netlify

### Option A — Drag-and-drop (fastest, ~30 seconds)

1. Build locally:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `frontend/dist` folder onto the page.
4. Netlify gives you a URL like `https://gleeful-otter-123.netlify.app`. Done.

> Note: drag-and-drop deploys are static and won't auto-update when you push to GitHub. Use Option B for that.

### Option B — Connect GitHub (auto-deploy on push)

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project → GitHub**.
2. Authorize Netlify, pick your `coolcliq` repo.
3. Configure:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
4. Click **Deploy site**. Wait ~1 minute.

The `frontend/netlify.toml` in this repo already handles the SPA redirect rule, so React Router routes (`/onboarding`, `/admin`, etc.) won't 404 on refresh.

### Optional — Custom domain
**Site settings → Domain management → Add custom domain.** Free `*.netlify.app` subdomain is fine for the submission.

---

## Step 3 — Database on Supabase

1. Sign up at [supabase.com](https://supabase.com) (use GitHub login).
2. **New project** → name it `coolcliq` → pick a strong DB password → choose a region close to you (`ap-south-1` for India).
3. Wait ~2 minutes for provisioning.
4. **Project settings → Database → Connection string → URI** — copy this. It looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with the actual password.

---

## Step 4 — Backend on Railway

1. Sign up at [railway.app](https://railway.app) (GitHub login).
2. **New project → Deploy from GitHub repo** → pick your repo.
3. Railway will detect Node. Configure the service:
   - **Root directory:** `server`
   - **Start command:** `npm run start`
4. **Variables tab** — add:
   ```
   DATABASE_URL=postgresql://...   (from Step 3)
   JWT_SECRET=<paste 64 random hex chars>
   CLIENT_ORIGIN=https://your-netlify-site.netlify.app
   NODE_ENV=production
   PORT=4000
   ```
   Generate a JWT secret quickly:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
5. **Settings → Networking → Generate Domain** — gives you `https://coolcliq-server-production.up.railway.app`.
6. **Deploy logs** should show `🚀 CoolCliq API running on :4000`.
7. Now run the migration. In Railway's deploy settings, set the build command to:
   ```
   npm install && npx prisma generate && npx prisma migrate deploy && npm run seed
   ```
   (The `seed` step is one-time — remove it from the build command after the first successful deploy or it'll keep trying to upsert.)

### Alternative — Render
1. [render.com](https://render.com) → **New → Web service → Connect your repo**.
2. **Root directory:** `server`. **Build command:** `npm install && npx prisma generate && npx prisma migrate deploy`. **Start command:** `npm start`.
3. Add the same env vars as above.

### Alternative — Fly.io
Use `flyctl launch` from the `server` directory, then `flyctl secrets set DATABASE_URL=... JWT_SECRET=...`.

---

## Step 5 — Wire frontend to live backend

If you want the deployed frontend to actually talk to the deployed backend:

1. In Netlify → **Site settings → Environment variables**, add:
   ```
   VITE_API_URL=https://coolcliq-server-production.up.railway.app
   VITE_SOCKET_URL=https://coolcliq-server-production.up.railway.app
   ```
2. Trigger a redeploy.
3. In your fetch calls, use `import.meta.env.VITE_API_URL` (the screens currently use mock data — see `server/README.md` for the API surface to wire up).

> For the Newton assignment submission, the frontend can stay on mock data — the showcase is what reviewers will look at. Wiring up the live backend is a "phase 2" polish item.

---

## Step 6 — Verify

- Visit your Netlify URL — landing page loads.
- Scroll through all 8 screens.
- `/admin` route loads the dashboard.
- Backend health check: `curl https://your-backend-url/api/health` returns `{ "ok": true, ... }`.

---

## Troubleshooting

**Netlify build fails with "command not found: vite"** — make sure base directory is `frontend` and Node version ≥ 18. Add a `.nvmrc` containing `20` if needed.

**React Router gives 404 on refresh** — confirm `frontend/netlify.toml` is committed and contains the `[[redirects]]` block.

**Prisma migrate fails on Railway** — Railway needs the `DATABASE_URL` env var set *before* the build runs. Set it under Variables before triggering deploy.

**Supabase connection times out** — make sure you haven't capped your free-tier connections. Use the **connection pooler URL** (port 6543) instead of the direct one (port 5432) if you're on serverless.

**CORS errors in browser** — the server's `CLIENT_ORIGIN` env var must exactly match your Netlify URL (including https://, no trailing slash).
