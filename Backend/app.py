
from flask import Flask
from pathlib import Path
from db import get_db_connection
from routes.feedback import feedback_bp
from chatbot import chatbot_bp
from assesment import assessment_bp
from db import db_bp


app = Flask(__name__)
app.register_blueprint(feedback_bp)
app.register_blueprint(assessment_bp)
app.register_blueprint(chatbot_bp)
app.register_blueprint(db_bp)


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = (
        "Content-Type"
    )
    response.headers["Access-Control-Allow-Methods"] = (
        "GET, POST, OPTIONS"
    )
    return response


def startup_check():
    print("\n" + "=" * 45)
    print("       EASE-IN BACKEND STARTUP")
    print("=" * 45)

    # Check expected backend files and folders
    backend_dir = Path(__file__).resolve().parent

    expected_paths = [
        "app.py",
        "db.py",
        "routes",
        "routes/__init__.py",
        "routes/chatbot.py",
        "routes/feedback.py",
        "services",
        "services/__init__.py",
        "services/assessment.py",
    ]

    print("\n[1/3] Checking backend files...")

    for item in expected_paths:
        path = backend_dir / item

        if path.exists():
            print(f"  [OK] {item} found")
        else:
            print(f"  [INFO] {item} not created yet")

    # Check database connection
    print("\n[2/3] Checking Aiven MySQL database...")

    connection = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        cursor.fetchone()
        cursor.close()

        print("  [OK] Database is active and connection works")

    except Exception as error:
        print("  [ERROR] Database connection failed")
        print(f"  Details: {error}")

    finally:
        if connection is not None and connection.is_connected():
            connection.close()

    print("\n[3/3] Startup checks completed.")
    print("=" * 45)
    print("Everything checked. Starting Flask server...")
    print("=" * 45 + "\n")


if __name__ == "__main__":
    startup_check()
    app.run(debug=True, port=5000)
