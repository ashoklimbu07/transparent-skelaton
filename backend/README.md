# Backend API (Render)

## Environment Setup

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Required variables:

```bash
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app
GEMINI_API_KEY_BROLL1=your_gemini_api_key
```

You can add more keys as `GEMINI_API_KEY_BROLL2...GEMINI_API_KEY_BROLL10` for rotation.

## Local Development

```bash
npm install
npm run dev
```

## Build + Run

```bash
npm run build
npm start
```

## Deploy to Render

1. Create a **Web Service** from the `backend` folder.
2. Build command: `npm install && npm run build`
3. Start command: `npm start`
4. Add env vars from above in Render dashboard.
5. Use Render service URL in frontend `VITE_API_BASE_URL` with `/api` suffix.

## API Endpoints

- `GET /api/health` - health and readiness check (used by wake button)
- `POST /api/broll/generate` - generate B-roll prompts from script
