"""
firestore_service.py
---------------------
Data-access layer for WasteGuide AI.

Talks to Firebase Firestore when valid service-account credentials are
present in the environment. If credentials are missing (e.g. running the
project locally for the first time, or in CI), it transparently falls back
to a local JSON file store so every route keeps working without any cloud
setup. The rest of the app never needs to know which backend is active.
"""

import os
import json
import uuid
import threading
from datetime import datetime, timezone

FIREBASE_PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID")
FIREBASE_CLIENT_EMAIL = os.getenv("FIREBASE_CLIENT_EMAIL")
FIREBASE_PRIVATE_KEY = os.getenv("FIREBASE_PRIVATE_KEY")

_USE_FIRESTORE = bool(FIREBASE_PROJECT_ID and FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY)

_LOCAL_STORE_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "local_store.json")
_lock = threading.Lock()

_db = None

if _USE_FIRESTORE:
    try:
        import firebase_admin
        from firebase_admin import credentials, firestore

        cred_dict = {
            "type": "service_account",
            "project_id": FIREBASE_PROJECT_ID,
            "client_email": FIREBASE_CLIENT_EMAIL,
            "private_key": FIREBASE_PRIVATE_KEY.replace("\\n", "\n"),
            "token_uri": "https://oauth2.googleapis.com/token",
        }
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
        _db = firestore.client()
    except Exception as exc:  # pragma: no cover - falls back gracefully
        print(f"[firestore_service] Falling back to local store: {exc}")
        _USE_FIRESTORE = False


def _ensure_local_store():
    os.makedirs(os.path.dirname(_LOCAL_STORE_PATH), exist_ok=True)
    if not os.path.exists(_LOCAL_STORE_PATH):
        with open(_LOCAL_STORE_PATH, "w") as f:
            json.dump({"history": {}, "centers": {}}, f, indent=2)


def _read_local_store():
    _ensure_local_store()
    with open(_LOCAL_STORE_PATH, "r") as f:
        return json.load(f)


def _write_local_store(data):
    _ensure_local_store()
    with open(_LOCAL_STORE_PATH, "w") as f:
        json.dump(data, f, indent=2, default=str)


# ---------------------------------------------------------------------------
# History collection
# ---------------------------------------------------------------------------

def save_history_entry(entry: dict) -> dict:
    entry = dict(entry)
    entry["timestamp"] = datetime.now(timezone.utc).isoformat()

    if _USE_FIRESTORE:
        doc_ref = _db.collection("history").document()
        doc_ref.set(entry)
        entry["id"] = doc_ref.id
        return entry

    with _lock:
        data = _read_local_store()
        new_id = str(uuid.uuid4())
        entry["id"] = new_id
        data["history"][new_id] = entry
        _write_local_store(data)
        return entry


def get_history() -> list:
    if _USE_FIRESTORE:
        docs = _db.collection("history").order_by(
            "timestamp", direction="DESCENDING"
        ).stream()
        return [{**doc.to_dict(), "id": doc.id} for doc in docs]

    with _lock:
        data = _read_local_store()
        items = list(data["history"].values())
        items.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        return items


def delete_history_entry(entry_id: str) -> bool:
    if _USE_FIRESTORE:
        _db.collection("history").document(entry_id).delete()
        return True

    with _lock:
        data = _read_local_store()
        if entry_id in data["history"]:
            del data["history"][entry_id]
            _write_local_store(data)
            return True
        return False


# ---------------------------------------------------------------------------
# Centers collection
# ---------------------------------------------------------------------------

def get_centers() -> list:
    if _USE_FIRESTORE:
        docs = _db.collection("centers").stream()
        centers = [{**doc.to_dict(), "id": doc.id} for doc in docs]
        if centers:
            return centers
        # fall through to seed data if collection is empty

    with _lock:
        data = _read_local_store()
        if not data["centers"]:
            data["centers"] = _seed_centers()
            _write_local_store(data)
        return list(data["centers"].values())


def _seed_centers() -> dict:
    """Dummy waste collection centers used when no real data exists yet."""
    seed = [
        {
            "name": "GreenCycle Recycling Hub",
            "address": "12 MG Road, Tirupati, Andhra Pradesh",
            "latitude": 13.6288,
            "longitude": 79.4192,
            "contact": "+91 98765 43210",
            "openingHours": "9:00 AM - 6:00 PM",
            "acceptedWaste": ["Plastic", "Paper", "Cardboard", "Metal", "Glass"],
            "category": "Recycling",
        },
        {
            "name": "Tirupati Organic Compost Center",
            "address": "45 Renigunta Road, Tirupati, Andhra Pradesh",
            "latitude": 13.6350,
            "longitude": 79.4295,
            "contact": "+91 91234 56789",
            "openingHours": "8:00 AM - 5:00 PM",
            "acceptedWaste": ["Organic"],
            "category": "Organic",
        },
        {
            "name": "SafeDispose Hazardous Waste Facility",
            "address": "78 Industrial Estate, Tirupati, Andhra Pradesh",
            "latitude": 13.6180,
            "longitude": 79.4100,
            "contact": "+91 99887 66554",
            "openingHours": "10:00 AM - 4:00 PM",
            "acceptedWaste": ["Hazardous", "Chemicals", "Medical", "Battery"],
            "category": "Hazardous",
        },
        {
            "name": "E-Waste Collection Point - City Center",
            "address": "23 Tilak Road, Tirupati, Andhra Pradesh",
            "latitude": 13.6402,
            "longitude": 79.4160,
            "contact": "+91 90000 11223",
            "openingHours": "9:30 AM - 6:30 PM",
            "acceptedWaste": ["Electronic", "Battery"],
            "category": "Electronic",
        },
        {
            "name": "Municipal General Waste Depot",
            "address": "5 Bypass Road, Tirupati, Andhra Pradesh",
            "latitude": 13.6255,
            "longitude": 79.4330,
            "contact": "+91 98111 22334",
            "openingHours": "24 hours",
            "acceptedWaste": ["Mixed", "Construction", "Textile", "Rubber"],
            "category": "Recycling",
        },
    ]
    return {str(uuid.uuid4()): c for c in seed}
