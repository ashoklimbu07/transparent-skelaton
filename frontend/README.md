# Frontend (Vercel)

## Environment Variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Set:

```bash
VITE_API_BASE_URL=https://your-render-service.onrender.com/api
```

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Vercel

1. Import the `frontend` folder as a Vercel project.
2. Framework preset: **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add env var `VITE_API_BASE_URL` pointing to your Render backend `/api`.
