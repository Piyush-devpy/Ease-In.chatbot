
import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
from flask import Blueprint, jsonify

load_dotenv()

# Blueprint for database-related utility endpoints
db_bp = Blueprint("db", __name__)


def get_db_connection():
    """Create and return a MySQL database connection."""
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        ssl_disabled=False,
        connection_timeout=10,
    )


def ensure_feedback_table(connection=None):
    """
    Create the feedback table if it does not exist.
    Existing feedback tables and their records are preserved.
    """
    own_connection = connection is None
    conn = connection or get_db_connection()
    cursor = None

    try:
        cursor = conn.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS feedback (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        if own_connection:
            conn.commit()

    finally:
        if cursor is not None:
            cursor.close()

        if own_connection:
            conn.close()


def reset_feedback_table():
    """
    Delete all feedback records but preserve the table structure.
    Use only with test data.
    """
    connection = get_db_connection()
    cursor = None

    try:
        cursor = connection.cursor()
        cursor.execute("DELETE FROM feedback")
        connection.commit()

        return cursor.rowcount

    except Error:
        connection.rollback()
        raise

    finally:
        if cursor is not None:
            cursor.close()
        connection.close()


@db_bp.post("/api/testing/reset-feedback")
def reset_feedback_endpoint():
    """
    Testing-only endpoint. Disabled unless explicitly enabled
    in the environment configuration.
    """
    enabled = os.getenv("ENABLE_TEST_RESET", "false").lower() == "true"

    if not enabled:
        return jsonify({
            "error": "Testing reset is disabled."
        }), 403

    try:
        deleted_count = reset_feedback_table()

        return jsonify({
            "message": "Feedback test data cleared.",
            "deleted_records": deleted_count
        }), 200

    except Error:
        return jsonify({
            "error": "Database reset failed."
        }), 500
