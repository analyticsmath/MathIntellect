# Production Deployment Checklist

## Railway (Backend)

- Root directory: `backend`
- Build command: `npm ci && npm run build`
- Start command: `npm run start:prod`
- Health URL: `https://mathintellect-production.up.railway.app/health`
- API base URL: `https://mathintellect-production.up.railway.app/api/v1`

### Required Environment Variables

```env
NODE_ENV=production
PORT=5000

DATABASE_URL=postgresql://neondb_owner:<password>@ep-muddy-darkness-a1nyxuqa-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=7d

FRONTEND_URL=https://math-intellect.vercel.app
CORS_ORIGIN=https://math-intellect.vercel.app

OPENAI_API_KEY=<optional>
REDIS_URL=<optional>

LOG_LEVEL=info
```

### Migration Command

Run once after deploy (or on every deploy if your SQL is idempotent):

```bash
cd backend
npm run db:migrate:foundation
npm run db:migrate:phase16
```

## Vercel (Frontend)

- Root directory: `frontend`
- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

### Required Environment Variables

```env
VITE_API_URL=https://mathintellect-production.up.railway.app/api/v1
VITE_WS_URL=wss://mathintellect-production.up.railway.app

VITE_APP_NAME=Math Intellect
VITE_ENV=production
```

## Routing Fix for SPA Refresh

`frontend/vercel.json` rewrites all routes to `/` so React Router handles deep links:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```
