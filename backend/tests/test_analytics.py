import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from services.analytics import build_analytics


def _entry(item, category, recyclable, hazard_level, timestamp):
    return {
        "item": item,
        "category": category,
        "recyclable": recyclable,
        "hazardLevel": hazard_level,
        "timestamp": timestamp,
    }


def test_build_analytics_empty():
    stats = build_analytics([])
    assert stats["totalScans"] == 0
    assert stats["recyclePercentage"] == 0.0
    assert stats["mostCommonCategory"] is None


def test_build_analytics_counts():
    history = [
        _entry("Battery", "Battery", False, "High", "2026-07-18T10:00:00+00:00"),
        _entry("Bottle", "Plastic", True, "Low", "2026-07-18T11:00:00+00:00"),
        _entry("Box", "Cardboard", True, "Low", "2026-07-17T09:00:00+00:00"),
    ]
    stats = build_analytics(history)
    assert stats["totalScans"] == 3
    assert stats["recyclableCount"] == 2
    assert stats["hazardousCount"] == 1
    assert round(stats["recyclePercentage"], 1) == round(2 / 3 * 100, 1)
    assert len(stats["dailyScans"]) == 7
