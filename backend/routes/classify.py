from flask import Blueprint, request, jsonify

from services.groq_service import classify_waste_item, GroqServiceError
from services.firestore_service import save_history_entry

classify_bp = Blueprint("classify", __name__)


@classify_bp.route("/api/classify", methods=["POST"])
def classify():
    body = request.get_json(silent=True)
    if not body or not isinstance(body, dict):
        return jsonify({"error": "Request body must be valid JSON."}), 400

    item = (body.get("item") or "").strip()
    if not item:
        return jsonify({"error": "Field 'item' is required and cannot be empty."}), 400
    if len(item) > 120:
        return jsonify({"error": "Field 'item' is too long (max 120 characters)."}), 400

    try:
        result = classify_waste_item(item)
    except GroqServiceError as exc:
        return jsonify({"error": str(exc)}), 502
    except Exception as exc:  # pragma: no cover
        return jsonify({"error": f"Unexpected server error: {exc}"}), 500

    history_entry = {
        "item": result["item"],
        "category": result["category"],
        "recyclable": result["recyclable"],
        "hazardLevel": result["hazard_level"],
        "hazardWarning": result["hazard_warning"],
        "disposalSteps": result["disposal_steps"],
        "recyclingSteps": result["recycling_steps"],
        "ecoSuggestion": result["eco_suggestion"],
    }

    try:
        saved = save_history_entry(history_entry)
    except Exception as exc:  # pragma: no cover
        return jsonify({"error": f"Failed to save result: {exc}"}), 500

    return jsonify(saved), 200
