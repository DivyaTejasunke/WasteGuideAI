# Database Schema

Firestore is schemaless, but WasteGuide AI uses two consistent collections.
When Firebase credentials aren't configured, the same shapes are stored in
`backend/data/local_store.json` under matching keys.

## ER diagram

```
┌───────────────────────────┐        ┌───────────────────────────┐
│         history             │        │          centers             │
├───────────────────────────┤        ├───────────────────────────┤
│ id            string (PK)   │        │ id            string (PK)   │
│ item          string         │        │ name          string         │
│ category      string         │        │ address       string         │
│ recyclable    boolean         │        │ latitude      number         │
│ hazardLevel   string          │        │ longitude     number         │
│ hazardWarning string          │        │ contact       string         │
│ disposalSteps string[]        │        │ openingHours  string         │
│ recyclingSteps string[]       │        │ acceptedWaste string[]       │
│ ecoSuggestion string          │        │ category      string         │
│ timestamp     ISO datetime     │        └───────────────────────────┘
└───────────────────────────┘
```

The two collections are independent (no foreign keys) — `history` is
per-scan AI output, `centers` is reference/lookup data for the map.

## `history` collection

| Field | Type | Notes |
|---|---|---|
| `id` | string | Firestore doc id / UUID |
| `item` | string | Item name as scanned |
| `category` | string | One of the 15 supported waste categories |
| `recyclable` | boolean | |
| `hazardLevel` | string | `Low` \| `Medium` \| `High` |
| `hazardWarning` | string | Short caution, `"None"` if not hazardous |
| `disposalSteps` | string[] | 3–5 steps |
| `recyclingSteps` | string[] | 3–5 steps |
| `ecoSuggestion` | string | One actionable tip |
| `timestamp` | ISO 8601 string | Set server-side on save |

## `centers` collection

| Field | Type | Notes |
|---|---|---|
| `id` | string | Firestore doc id / UUID |
| `name` | string | |
| `address` | string | |
| `latitude` / `longitude` | number | Used by Leaflet markers |
| `contact` | string | Phone number |
| `openingHours` | string | |
| `acceptedWaste` | string[] | Subset of the 15 waste categories |
| `category` | string | Drives marker color: Recycling=green, Organic=blue, Hazardous=red, Electronic=purple |

## Seeding

On first read, if the `centers` collection is empty, the backend seeds 5
sample centers around Tirupati, Andhra Pradesh so the Map page is populated
without any manual setup. Replace these with real data before production
use — see `firebase/` for Firestore security rules and index suggestions.
