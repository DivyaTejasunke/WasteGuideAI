# Setup & Installation Guide

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- A Groq API key (free at https://console.groq.com)
- (Optional) A Firebase project with Firestore enabled

## 1. Clone / unzip the project

```bash
cd WasteGuideAI
```

## 2. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `backend/.env`:
```
GROQ_API_KEY=your_key_here
```

Run it:
```bash
python app.py
```

Verify: open `http://localhost:5000/api/health` — you should see
`{"status": "ok", ...}`.

## 3. Frontend setup

In a new terminal:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`.

## 4. (Optional) Connect Firebase Firestore

If you skip this step, the backend automatically uses a local JSON file
(`backend/data/local_store.json`) so the app works fully offline.

To use real Firestore:
1. Create a Firebase project → enable **Firestore Database**.
2. Project Settings → Service Accounts → **Generate new private key** (downloads a JSON file).
3. From that JSON file, copy into `backend/.env`:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the `\n` characters, wrap in quotes)
4. Restart the backend.

## 5. Sanity check

1. Go to the Home page, type "Battery", click Scan.
2. You should see a classified result card with disposal & recycling steps.
3. Visit Dashboard — stats and charts should update.
4. Visit History — your scan should appear, searchable/sortable/deletable.
5. Visit Map — you should see 5 seeded collection centers.

## Troubleshooting

| Problem | Fix |
|---|---|
| "GROQ_API_KEY is not configured" | Add a valid key to `backend/.env` and restart `python app.py` |
| CORS errors in browser console | Confirm backend is running on the port referenced by `VITE_API_URL` |
| Map tiles don't load | Check internet connectivity — tiles load from `openstreetmap.org` |
| Firestore errors on startup | Fine to ignore — the app falls back to the local JSON store automatically |
