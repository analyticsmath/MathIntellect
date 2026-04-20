# Math Intel Dashboard

A full-stack platform for mathematical simulations, coding analytics, and 3D data visualizations.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, TailwindCSS, Three.js, Plotly.js |
| Backend | NestJS, TypeORM |
| Database | PostgreSQL 16 |
| Container | Docker, Docker Compose |

## Project Structure

```
math-intel-dashboard/
├─ backend/          NestJS REST API + simulation engine
├─ frontend/         React + Tailwind 3D dashboard
├─ database/         SQL schema and seed files
├─ shared/           Common TypeScript types and constants
├─ docs/             Documentation
└─ docker/           Dockerfiles and docker-compose.yml
```

## Quick Start (Docker)

```bash
cd docker
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432

## Local Development

### Backend
```bash
cd backend
npm install
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Copy `backend/.env` and update values:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/math_intel_dashboard
JWT_SECRET=yourSuperSecureJWTSecret
```
