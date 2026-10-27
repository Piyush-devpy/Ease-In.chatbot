
from flask import Blueprint, request, jsonify
from db import get_db_connection

feedback_bp = Blueprint("feedback", __name__)


def ensure_feedback_table(cursor):
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS easein_feedback (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            name VARCHAR(100) NOT NULL,
            feedback TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)


@feedback_bp.route("/api/feedback", methods=["GET", "POST"])
def feedback_api():
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        ensure_feedback_table(cursor)

        if request.method == "POST":
            data = request.get_json(silent=True) or {}

            email = str(data.get("email", "")).strip()
            name = str(data.get("name", "")).strip()
            feedback_text = str(data.get("text", "")).strip()

            if not email or not name or not feedback_text:
                return jsonify({
                    "success": False,
                    "message": "All fields are required."
                }), 400

            if len(email) > 255 or len(name) > 100:
                return jsonify({
                    "success": False,
                    "message": "Email or name is too long."
                }), 400

            cursor.execute("""
                INSERT INTO easein_feedback (email, name, feedback)
                VALUES (%s, %s, %s)
            """, (email, name, feedback_text))

            connection.commit()

            return jsonify({
                "success": True,
                "message": "Feedback submitted successfully.",
                "feedback": {
                    "id": cursor.lastrowid,
                    "email": email,
                    "name": name,
                    "text": feedback_text
                }
            }), 201

        cursor.execute("""
            SELECT id, name, feedback AS text, created_at
            FROM easein_feedback
            ORDER BY created_at DESC, id DESC
        """)

        feedbacks = cursor.fetchall()

        for item in feedbacks:
            if item.get("created_at"):
                item["created_at"] = item["created_at"].isoformat()

        return jsonify({
            "success": True,
            "feedbacks": feedbacks
        }), 200

    except Exception:
        if connection and connection.is_connected():
            connection.rollback()

        return jsonify({
            "success": False,
            "message": "Unable to process feedback right now."
        }), 500

    finally:
        if cursor:
            cursor.close()

        if connection and connection.is_connected():
            connection.close()
