"""
analytics.py
------------
Pure functions that turn a list of history entries into the aggregate
statistics shown on the Dashboard page.
"""

from datetime import datetime, timedelta, timezone
from collections import Counter, defaultdict


def build_analytics(history: list) -> dict:
    total_scans = len(history)
    recyclable_count = sum(1 for h in history if h.get("recyclable"))
    hazardous_count = sum(1 for h in history if h.get("hazardLevel") == "High")

    recycle_percentage = round((recyclable_count / total_scans) * 100, 1) if total_scans else 0.0
    hazard_percentage = round((hazardous_count / total_scans) * 100, 1) if total_scans else 0.0

    category_counter = Counter(h.get("category", "Mixed") for h in history)
    most_common_category = category_counter.most_common(1)[0][0] if category_counter else None

    daily_counts = _last_7_days_counts(history)

    return {
        "totalScans": total_scans,
        "recyclableCount": recyclable_count,
        "hazardousCount": hazardous_count,
        "recyclePercentage": recycle_percentage,
        "hazardPercentage": hazard_percentage,
        "mostCommonCategory": most_common_category,
        "categoryFrequency": dict(category_counter),
        "dailyScans": daily_counts,
    }


def _last_7_days_counts(history: list) -> list:
    today = datetime.now(timezone.utc).date()
    days = [today - timedelta(days=i) for i in range(6, -1, -1)]
    counts = defaultdict(int)

    for h in history:
        ts = h.get("timestamp")
        if not ts:
            continue
        try:
            entry_date = datetime.fromisoformat(ts.replace("Z", "+00:00")).date()
        except ValueError:
            continue
        counts[entry_date] += 1

    return [
        {"date": d.isoformat(), "count": counts.get(d, 0)}
        for d in days
    ]
