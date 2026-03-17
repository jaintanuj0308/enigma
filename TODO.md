# Dashboard Issue Resolution Plan & Progress

**Original Issue:** Dashboard shows 'Failed to load ideas. Is backend running on port 3001?' error due to backend not started/missing deps.

## Steps:
- [x] Update main TODO.md (mark phases complete)
- [⏳ RUNNING] cd backend && npm install --legacy-peer-deps
- [⏳ RUNNING] cd dashboard && npm install --legacy-peer-deps  
- [ ] cd backend && npm run dev  (port 3001)
- [ ] (New terminal) cd dashboard && npm run dev (port 5173, proxy /api)
- [ ] Verify: Open http://localhost:5173 (no error, ideas load)
- [ ] Test: Add idea, upvote, filter
- [ ] [COMPLETE]

Monitor running terminals for install completion, then proceed to server starts.

