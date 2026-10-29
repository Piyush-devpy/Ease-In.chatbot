
import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
from flask import Blueprint, jsonify

load_dotenv()

db_bp = Blueprint("db", __name__)


def get_db_connection():
    """Create a secure MySQL database connection."""
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
    """Create the feedback table if it does not exist."""
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


def save_feedback(name, email, message):
    """
    Remove an existing record with the same email and message,
    then insert the latest submission.

    Different feedback from the same email is allowed.
    """
    name = name.strip()
    email = email.strip()
    message = message.strip()

    if not name or not email or not message:
        raise ValueError("Name, email, and feedback are required.")

    connection = get_db_connection()
    cursor = None

    try:
        cursor = connection.cursor()
        connection.start_transaction()

        # Delete matching feedback for this email.
        cursor.execute(
            """
            DELETE FROM feedback
            WHERE LOWER(TRIM(email)) = LOWER(%s)
              AND BINARY TRIM(message) = BINARY %s
            """,
            (email, message),
        )

        # Insert the latest submission.
        cursor.execute(
            """
            INSERT INTO feedback (name, email, message)
            VALUES (%s, %s, %s)
            """,
            (name, email, message),
        )

        new_id = cursor.lastrowid
        connection.commit()

        return new_id

    except Exception:
        connection.rollback()
        raise

    finally:
        if cursor is not None:
            cursor.close()

        connection.close()


def reset_feedback_table():
    """Delete all feedback records. Use only for test data."""
    connection = get_db_connection()
    cursor = None

    try:
        cursor = connection.cursor()
        cursor.execute("DELETE FROM feedback")
        deleted_count = cursor.rowcount
        connection.commit()

        return deleted_count

    except Error:
        connection.rollback()
        raise

    finally:
        if cursor is not None:
            cursor.close()

        connection.close()


@db_bp.post("/api/testing/reset-feedback")
def reset_feedback_endpoint():
    """Testing-only endpoint, disabled unless explicitly enabled."""
    enabled = (
        os.getenv("ENABLE_TEST_RESET", "false").lower() == "true"
    )

    if not enabled:
        return jsonify({
            "error": "Testing reset is disabled."
        }), 403

    try:
        deleted_count = reset_feedback_table()

        return jsonify({
            "message": "Feedback test data cleared.",
            "deleted_records": deleted_count,
        }), 200

    except Error:
        return jsonify({
            "error": "Database reset failed."
        }), 500
