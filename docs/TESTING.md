# Testing Guide

## Unit testing (backend)

Use `pytest`. Example structure:

```
backend/tests/
├── test_groq_service.py     # mock requests.post, assert JSON validation/normalization
├── test_analytics.py        # feed sample history lists, assert stats math
└── test_firestore_service.py  # local-store read/write/delete round trips
```

Run:
```bash
cd backend
pip install pytest --break-system-packages
pytest
```

## API testing

Use `curl` or Postman against a running backend:

```bash
curl http://localhost:5000/api/health
curl -X POST http://localhost:5000/api/classify -H "Content-Type: application/json" -d '{"item":"Battery"}'
curl http://localhost:5000/api/history
curl http://localhost:5000/api/analytics
curl http://localhost:5000/api/centers
curl -X DELETE http://localhost:5000/api/history/<id>
```

## Frontend testing

Recommended: React Testing Library + Vitest.
- `WasteScanner`: renders input, disables button while loading, shows error banner on failed fetch (mock `services/api.js`).
- `WasteCard`: renders all fields given a sample result object.
- `History` page: filtering/sorting/pagination logic against a fixed mock dataset.

## Integration testing

1. Start backend + frontend together.
2. Scan an item end-to-end and confirm it appears in History and updates Dashboard stats.
3. Delete a history entry and confirm Dashboard totals decrease.
4. Confirm Map renders seeded centers without a backend Firestore connection (local fallback).

## Edge cases covered

| Case | Where handled |
|---|---|
| Empty search / empty item | `classify` route returns 400; `WasteScanner` shows inline error before calling the API |
| No internet | Axios client detects missing `error.response`, surfaces "Cannot reach the server" |
| Groq timeout | `groq_service` catches `requests.exceptions.Timeout`, returns 502 with friendly message |
| Firestore failure | `firestore_service` catches init errors and falls back to local JSON automatically |
| Invalid JSON from AI | `json.loads` wrapped in try/except, returns 502 rather than crashing |
| Rate limit (429 from Groq) | Explicit check, returns 502 with a rate-limit specific message |
| Map load failure | Centers list still renders; map tile failures are a Leaflet/network concern surfaced visually by blank tiles, not a JS crash |
| Deleting a non-existent history id | Returns 404 |
