# Enigma Startup Ideas Dashboard

## Features
- Browse/vote/filter startup ideas
- Add new ideas via form
- Backend persistence (SQLite), server-side filtering/pagination
- Real-time optimistic UI updates

## Quick Start (Windows CMD/PowerShell)
```
# Terminal 1: Backend
cd backend
npm install
npm run dev
# Visit http://localhost:3001/health

# Terminal 2: Frontend  
cd dashboard
npm install
npm run dev
# Visit http://localhost:5173
```

## One-command dev (from root)
```
npm install -g concurrently wait-on
npm run dev-all
```

## Architecture
- **Frontend**: React 19 + Vite + Tailwind (dashboard/)
- **Backend**: Node/Express + SQLite (backend/) on port 3001
- **API**: /api/ideas (GET list w/filters, POST create, PATCH /:id/vote)
- **DB**: backend/ideas.db (auto-seeded)

## Scripts
- `npm run dev-all`: Concurrent frontend+backend
- Backend auto-seeds 5 default ideas on first run

Enjoy building! 🚀
