# API Documentation

Base URL (local): `http://localhost:5000`

All responses are JSON. Errors follow the shape `{ "error": "message" }`
with an appropriate HTTP status code.

---

## `GET /api/health`

Health check.

**Response `200`**
```json
{ "status": "ok", "service": "WasteGuide AI backend" }
```

---

## `POST /api/classify`

Classifies a waste item using the Groq AI model and saves the result to history.

**Request body**
```json
{ "item": "Battery" }
```

**Response `200`**
```json
{
  "id": "b3f1...",
  "item": "Battery",
  "category": "Hazardous",
  "recyclable": false,
  "hazardLevel": "High",
  "hazardWarning": "Contains toxic heavy metals.",
  "disposalSteps": ["...", "...", "...", "..."],
  "recyclingSteps": ["...", "...", "...", "..."],
  "ecoSuggestion": "Use rechargeable batteries.",
  "timestamp": "2026-07-18T09:15:00.000Z"
}
```

**Errors**
| Status | Cause |
|--------|-------|
| 400 | Missing/empty `item`, invalid JSON, or item too long (>120 chars) |
| 502 | Groq API failure, timeout, or invalid AI response |
| 500 | Unexpected server error, or failed to save to database |

---

## `GET /api/history`

Returns all saved scans, newest first.

**Response `200`** — array of history entries (same shape as `/api/classify` response).

---

## `DELETE /api/history/<id>`

Deletes a single history entry.

**Response `200`**
```json
{ "success": true, "id": "b3f1..." }
```

**Errors:** `400` invalid id, `404` not found.

---

## `GET /api/analytics`

Returns aggregate statistics computed from history.

**Response `200`**
```json
{
  "totalScans": 12,
  "recyclableCount": 7,
  "hazardousCount": 2,
  "recyclePercentage": 58.3,
  "hazardPercentage": 16.7,
  "mostCommonCategory": "Plastic",
  "categoryFrequency": { "Plastic": 4, "Battery": 2, "Organic": 3 },
  "dailyScans": [
    { "date": "2026-07-12", "count": 1 },
    { "date": "2026-07-13", "count": 0 }
  ]
}
```

---

## `GET /api/centers`

Returns all waste collection centers (seeded with sample data on first run).

**Response `200`**
```json
[
  {
    "id": "c1...",
    "name": "GreenCycle Recycling Hub",
    "address": "12 MG Road, Tirupati, Andhra Pradesh",
    "latitude": 13.6288,
    "longitude": 79.4192,
    "contact": "+91 98765 43210",
    "openingHours": "9:00 AM - 6:00 PM",
    "acceptedWaste": ["Plastic", "Paper", "Cardboard", "Metal", "Glass"],
    "category": "Recycling"
  }
]
```

---

## Rate limits & timeouts

- Groq requests time out client-side after 20s; the frontend axios client
  times out after 25s and surfaces a friendly error.
- If Groq returns `429`, the API responds with `502` and a rate-limit
  message rather than crashing.
