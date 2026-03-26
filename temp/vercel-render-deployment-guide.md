# Full Deployment Guide: Vercel (Frontend) + Render (Backend)

This guide deploys:
- `frontend` -> Vercel
- `backend` -> Render

It also covers CORS, wake-up behavior, and common production errors.

---

## 1) Prerequisites

- GitHub repo with both folders:
  - `frontend/`
  - `backend/`
- Accounts:
  - Vercel
  - Render
- Backend and frontend both build locally:
  - `cd backend && npm install && npm run build`
  - `cd frontend && npm install && npm run build`

---

## 2) Deploy Backend on Render

### 2.1 Create a Web Service

1. Open Render Dashboard -> **New** -> **Web Service**
2. Connect your GitHub repo
3. Configure:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

> Your backend already uses `dist/index.js` via `npm start`.

### 2.2 Set Backend Environment Variables

In Render service -> **Environment** add:

- `NODE_ENV=production`
- `PORT` (Render usually injects this automatically; keep code using `process.env.PORT`)
- `FRONTEND_URL=https://your-frontend.vercel.app`
  - If multiple origins, use comma-separated list
- Optional alternative:
  - `CORS_ORIGIN=https://your-frontend.vercel.app`
- Optional for Vercel preview deployments:
  - `ALLOW_VERCEL_PREVIEWS=true`
- Your API keys:
  - `GEMINI_API_KEY_BROLL1=...`
  - `GEMINI_API_KEY_BROLL2=...` (if used)
  - etc.

### 2.3 Deploy and Verify Backend

After deploy, test:

- Root:
  - `https://your-backend.onrender.com/`
  - should return: `Backend API is running...`
- Health:
  - `https://your-backend.onrender.com/api/health`
  - should return JSON with `status: "OK"`

---

## 3) Deploy Frontend on Vercel

### 3.1 Import Project

1. Open Vercel Dashboard -> **Add New Project**
2. Select your GitHub repo
3. Configure:
   - **Root Directory**: `frontend`
   - Framework should auto-detect as **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`

### 3.2 Set Frontend Environment Variable

In Vercel project -> **Settings** -> **Environment Variables**:

- `VITE_API_BASE_URL=https://your-backend.onrender.com`

or

- `VITE_API_BASE_URL=https://your-backend.onrender.com/api`

Both formats are supported by current frontend code.

### 3.3 Deploy and Verify Frontend

Open your Vercel URL and test:

1. Click **Wake Backend**
2. Wait up to ~60 seconds on cold start
3. Confirm it changes to awake state
4. Generate B-roll request

---

## 4) CORS Setup (Most Common Failure)

If backend logs show:

- `CORS blocked for origin: https://...vercel.app`

Fix by setting Render env variable exactly:

- `FRONTEND_URL=https://your-project.vercel.app`

If you use preview URLs and want all `*.vercel.app`:

- `ALLOW_VERCEL_PREVIEWS=true`

Then redeploy backend.

---

## 5) Wake Button / Cold Start Notes

Render free/low tiers may sleep after inactivity.

- First request can take 20-60+ seconds
- Frontend wake logic polls `/api/health`
- If wake fails:
  1. Confirm backend URL in `VITE_API_BASE_URL`
  2. Confirm backend `/api/health` responds
  3. Confirm CORS env vars on backend

---

## 6) Troubleshooting Matrix

### Error: `Cannot find type definition file for 'node'`
- Cause: build environment not installing type package
- Fix: ensure `@types/node` is installed in backend build environment (already handled in current setup)

### Error: `CORS blocked for origin ...`
- Cause: frontend domain not allowlisted
- Fix: set `FRONTEND_URL` or `CORS_ORIGIN` and redeploy backend

### Wake button says failed, backend root works
- Cause: wrong API base URL path (`/api` mismatch) or CORS block
- Fix:
  - set `VITE_API_BASE_URL` to backend URL
  - verify `/api/health`
  - verify backend CORS env vars

### `Cannot connect to backend right now`
- Cause: backend sleeping, DNS mismatch, or network/CORS issue
- Fix:
  - wait for cold start
  - verify backend URL and health endpoint
  - check Render logs for CORS/runtime errors

---

## 7) Production Hardening (Recommended)

- Keep backend `FRONTEND_URL` strict (exact domains) unless previews are needed
- Add rate limiting on backend API routes
- Add request timeout and retry handling for upstream AI calls
- Add monitoring/alerts (Render logs + uptime checks)
- Rotate API keys periodically

---

## 8) Final Go-Live Checklist

- [ ] Backend Render deploy is green
- [ ] Backend root endpoint works
- [ ] Backend `/api/health` returns `status: OK`
- [ ] Frontend Vercel deploy is green
- [ ] Frontend `VITE_API_BASE_URL` points to Render backend
- [ ] Render has correct `FRONTEND_URL`/`CORS_ORIGIN`
- [ ] Wake Backend button succeeds from Vercel domain
- [ ] B-roll generate endpoint works end-to-end

---

## 9) Useful URLs Template

- Backend (Render): `https://<backend-name>.onrender.com`
- Backend Health: `https://<backend-name>.onrender.com/api/health`
- Frontend (Vercel): `https://<frontend-name>.vercel.app`

