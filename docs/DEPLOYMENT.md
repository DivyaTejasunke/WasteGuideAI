# Deployment Guide

## Frontend → Vercel or Netlify

### Vercel
1. Push the repo to GitHub.
2. Import the project in Vercel, set **Root Directory** to `frontend`.
3. Build command: `npm run build` · Output directory: `dist`.
4. Add environment variable `VITE_API_URL` = your deployed backend URL.
5. Deploy.

### Netlify
1. New site from Git → set **Base directory** to `frontend`.
2. Build command: `npm run build` · Publish directory: `frontend/dist`.
3. Add `VITE_API_URL` under Site settings → Environment variables.
4. Deploy.

## Backend → Render

1. New Web Service → connect the repo, set **Root Directory** to `backend`.
2. Build command: `pip install -r requirements.txt`
3. Start command: `gunicorn app:app`
4. Add environment variables:
   - `GROQ_API_KEY`
   - `GROQ_MODEL` (optional, defaults to `llama-3.3-70b-versatile`)
   - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (optional — omit to use the local JSON fallback, though note Render's filesystem is ephemeral, so Firestore is recommended for production)
5. Deploy, then copy the resulting URL into the frontend's `VITE_API_URL`.

## Database → Firebase

1. Create a Firestore database in production mode.
2. Add security rules (see `firebase/firestore.rules` — restrict writes to
   the backend service account; the current setup expects the API to be
   the only writer).
3. Suggested composite index: `history` collection, `timestamp` DESC (for
   the `/api/history` ordered query).

## Post-deploy checklist

- [ ] `GET /api/health` returns `200` on the deployed backend URL
- [ ] CORS allows the deployed frontend origin (currently `*` for
      simplicity — tighten `CORS(app, resources={r"/api/*": {"origins": "..."}})` in `app.py` for production)
- [ ] `VITE_API_URL` on the frontend points to the live backend, not `localhost`
- [ ] Groq key is valid and has quota
- [ ] Firestore rules deployed and tested
