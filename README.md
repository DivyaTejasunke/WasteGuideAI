# WasteGuide AI

A full-stack, AI-powered waste management assistant. Type in any item and
WasteGuide AI classifies it, warns you about hazards, and walks you through
disposal and recycling steps — then tracks your personal stats and helps you
find nearby collection centers.

Built as a smart-city / civic-tech final-year project demonstrating AI
integration, full-stack engineering, and sustainability-focused UX.

---

## ✨ Features

- **AI waste scanner** — enter an item, get an instant AI classification (category, recyclability, hazard level, disposal & recycling steps, eco tip)
- **Dashboard** — total scans, recyclable/hazardous counts, recycle rate, and 4 charts (doughnut, bar, line, pie)
- **History** — searchable, filterable, sortable, paginated log of every scan, with delete
- **Map** — Leaflet + OpenStreetMap view of nearby waste collection centers, color-coded by type
- **Dark mode**, fully responsive, skeleton loaders, and graceful error handling throughout

## 🧱 Tech stack

| Layer     | Tech |
|-----------|------|
| Frontend  | React, Vite, React Router, Axios, Tailwind CSS, Chart.js, Leaflet.js / React Leaflet |
| Backend   | Python, Flask, Flask-CORS, Requests |
| Database  | Firebase Firestore *(falls back to a local JSON file automatically if no Firebase credentials are configured — see below)* |
| AI        | Groq API, model `llama-3.3-70b-versatile` |
| Maps      | OpenStreetMap tiles via Leaflet |

## 📁 Project structure

```
WasteGuideAI/
├── frontend/           React + Vite app
│   └── src/
│       ├── components/ Reusable UI (Navbar, WasteCard, Charts, MapView, ...)
│       ├── pages/       Home, Dashboard, History, Map, About
│       ├── services/    api.js (Axios client)
│       ├── hooks/        useHistory, useDebounce
│       ├── context/      ThemeContext (dark mode)
│       └── styles/       Tailwind entrypoint
├── backend/             Flask API
│   ├── app.py
│   ├── routes/           classify, history, analytics, centers
│   └── services/         groq_service, firestore_service, analytics
├── firebase/             (place Firestore security rules / indexes here)
└── docs/                 Additional documentation
```

See `docs/ARCHITECTURE.md`, `docs/API.md`, `docs/DATABASE_SCHEMA.md`,
`docs/SETUP.md`, `docs/DEPLOYMENT.md`, and `docs/TESTING.md` for details.

## 🚀 Quick start

### 1. Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# edit .env and add your GROQ_API_KEY (required for AI classification)
python app.py
```

The API runs on `http://localhost:5000`.

> **No Firebase account yet?** No problem. If `FIREBASE_PROJECT_ID`,
> `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` aren't set (or are
> invalid), the backend automatically stores history and centers in
> `backend/data/local_store.json` instead, so the whole app still works
> end-to-end with zero cloud setup.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # defaults to http://localhost:5000
npm run dev
```

Visit `http://localhost:5173`.

### 3. Get a Groq API key

Classification requires a Groq API key (free tier available):
1. Create an account at https://console.groq.com
2. Generate an API key
3. Paste it into `backend/.env` as `GROQ_API_KEY`

## 🔐 Environment variables

**Backend (`backend/.env`)**
```
GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
PORT=5000
```

**Frontend (`frontend/.env`)**
```
VITE_API_URL=http://localhost:5000
```

Never commit real `.env` files — only the `.env.example` templates are
checked in.

## 🧪 Testing

See `docs/TESTING.md` for the unit, API, frontend, and integration test
guide, plus the edge cases covered (empty input, network failure, AI
timeout, invalid JSON, rate limiting, map load failure).

## 📦 Deployment

See `docs/DEPLOYMENT.md` for deploying the frontend to Vercel/Netlify, the
backend to Render, and configuring Firebase.

## 📄 License

Built for educational purposes as a final-year engineering project.
