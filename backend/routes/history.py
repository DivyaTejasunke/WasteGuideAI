from flask import Blueprint, jsonify

from services.firestore_service import get_history, delete_history_entry

history_bp = Blueprint("history", __name__)


@history_bp.route("/api/history", methods=["GET"])
def history():
    try:
        items = get_history()
    except Exception as exc:  # pragma: no cover
        return jsonify({"error": f"Failed to load history: {exc}"}), 500
    return jsonify(items), 200


@history_bp.route("/api/history/<entry_id>", methods=["DELETE"])
def delete_history(entry_id):
    if not entry_id:
        return jsonify({"error": "Invalid history id."}), 400
    try:
        deleted = delete_history_entry(entry_id)
    except Exception as exc:  # pragma: no cover
        return jsonify({"error": f"Failed to delete entry: {exc}"}), 500

    if not deleted:
        return jsonify({"error": "History entry not found."}), 404

    return jsonify({"success": True, "id": entry_id}), 200
