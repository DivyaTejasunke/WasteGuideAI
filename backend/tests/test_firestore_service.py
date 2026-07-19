import sys
import os
import tempfile
import importlib

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))


def _fresh_service(tmp_path):
    """Reload firestore_service with a temp local store so tests don't
    touch the real backend/data/local_store.json file."""
    import services.firestore_service as fs
    fs._LOCAL_STORE_PATH = os.path.join(tmp_path, "local_store.json")
    fs._USE_FIRESTORE = False
    return fs


def test_save_and_get_history(tmp_path):
    fs = _fresh_service(str(tmp_path))
    saved = fs.save_history_entry({"item": "Battery", "category": "Battery", "recyclable": False, "hazardLevel": "High"})
    assert "id" in saved
    assert "timestamp" in saved

    history = fs.get_history()
    assert len(history) == 1
    assert history[0]["item"] == "Battery"


def test_delete_history_entry(tmp_path):
    fs = _fresh_service(str(tmp_path))
    saved = fs.save_history_entry({"item": "Bottle", "category": "Plastic", "recyclable": True, "hazardLevel": "Low"})
    assert fs.delete_history_entry(saved["id"]) is True
    assert fs.get_history() == []
    assert fs.delete_history_entry("nonexistent-id") is False


def test_centers_seed_on_first_call(tmp_path):
    fs = _fresh_service(str(tmp_path))
    centers = fs.get_centers()
    assert len(centers) >= 5
    assert all("name" in c and "latitude" in c for c in centers)
