from flask import Blueprint, jsonify

from services.firestore_service import get_history
from services.analytics import build_analytics

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.route("/api/analytics", methods=["GET"])
def analytics():
    try:
        history = get_history()
        stats = build_analytics(history)
    except Exception as exc:  # pragma: no cover
        return jsonify({"error": f"Failed to compute analytics: {exc}"}), 500
    return jsonify(stats), 200
