from flask import Blueprint, jsonify

from services.firestore_service import get_centers

centers_bp = Blueprint("centers", __name__)


@centers_bp.route("/api/centers", methods=["GET"])
def centers():
    try:
        items = get_centers()
    except Exception as exc:  # pragma: no cover
        return jsonify({"error": f"Failed to load centers: {exc}"}), 500
    return jsonify(items), 200
