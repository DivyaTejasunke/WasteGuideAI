# Architecture

## System overview

```
┌─────────────────┐        HTTPS/JSON        ┌───────────────────┐
│   React + Vite   │ ───────────────────────▶ │   Flask REST API   │
│   (frontend/)     │ ◀─────────────────────── │   (backend/)        │
└─────────────────┘                           └─────────┬──────────┘
                                                          │
                                     ┌────────────────────┼────────────────────┐
                                     ▼                                         ▼
                          ┌────────────────────┐                  ┌────────────────────┐
                          │   Groq API           │                  │  Firebase Firestore  │
                          │  llama-3.3-70b-       │                  │  (or local JSON       │
                          │  versatile             │                  │   fallback store)      │
                          └────────────────────┘                  └────────────────────┘
```

The frontend never talks to Groq or Firestore directly — every request goes
through the Flask API, which keeps API keys server-side and lets the backend
validate, normalize, and persist AI responses consistently.

## Component diagram (frontend)

```
App
├── Navbar (theme toggle, route links)
├── Routes
│   ├── Home
│   │   ├── WasteScanner ── WasteCard
│   │   ├── Dashboard (QuickStats widget)
│   │   └── History (HistoryRow list, condensed)
│   ├── Dashboard (page)
│   │   ├── StatisticsCards
│   │   └── Charts (Doughnut, Bar, Line, Pie)
│   ├── History (page)
│   │   ├── SearchBar
│   │   ├── History (HistoryRow table + pagination)
│   │   └── WasteCard (modal detail view)
│   ├── Map (page)
│   │   ├── CenterCard list
│   │   └── MapView (Leaflet)
│   └── About
└── Footer
```

## Sequence diagram — scanning an item

```
User          Frontend (React)        Backend (Flask)        Groq API        Firestore
 │  types item      │                        │                    │               │
 │ ───────────────▶ │                        │                    │               │
 │  clicks Scan      │                        │                    │               │
 │ ───────────────▶ │  POST /api/classify     │                    │               │
 │                   │ ─────────────────────▶ │                    │               │
 │                   │                        │  chat/completions   │               │
 │                   │                        │ ──────────────────▶│               │
 │                   │                        │ ◀────────────────── │  JSON result   │
 │                   │                        │  validate + save     │               │
 │                   │                        │ ─────────────────────────────────────▶│
 │                   │                        │ ◀───────────────────────────────────── │
 │                   │ ◀───────────────────── │  saved entry (200)   │               │
 │ ◀ WasteCard shown │                        │                    │               │
```

## Data flow summary

1. User submits an item name from `WasteScanner`.
2. `POST /api/classify` validates the input, calls `groq_service.classify_waste_item`.
3. Groq returns strict JSON; `groq_service` normalizes/validates it against the schema.
4. The result is persisted via `firestore_service.save_history_entry` (Firestore or local JSON fallback).
5. The saved entry (with `id` and `timestamp`) is returned to the frontend and rendered in `WasteCard`.
6. `Dashboard` and `History` pages independently fetch `/api/analytics` and `/api/history` to reflect the latest state.
