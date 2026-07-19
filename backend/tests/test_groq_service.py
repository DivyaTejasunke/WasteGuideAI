import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from services.groq_service import _validate_and_normalize


def test_normalize_fills_defaults_for_missing_fields():
    result = _validate_and_normalize({}, "Mystery item")
    assert result["item"] == "Mystery item"
    assert result["category"] == "Mixed"
    assert result["recyclable"] is False
    assert result["hazard_level"] == "Low"
    assert result["hazard_warning"] == "None"
    assert result["disposal_steps"] == []
    assert "Reduce" in result["eco_suggestion"]


def test_normalize_rejects_invalid_category():
    parsed = {"item": "Battery", "category": "NotARealCategory", "recyclable": False, "hazard_level": "High"}
    result = _validate_and_normalize(parsed, "Battery")
    assert result["category"] == "Mixed"


def test_normalize_accepts_valid_payload():
    parsed = {
        "item": "Battery",
        "category": "Battery",
        "recyclable": False,
        "hazard_level": "High",
        "hazard_warning": "Contains toxic metals.",
        "disposal_steps": ["Do not throw in trash", "Take to e-waste center"],
        "recycling_steps": ["Drop at battery recycling point"],
        "eco_suggestion": "Use rechargeable batteries.",
    }
    result = _validate_and_normalize(parsed, "Battery")
    assert result["category"] == "Battery"
    assert result["hazard_level"] == "High"
    assert len(result["disposal_steps"]) == 2
