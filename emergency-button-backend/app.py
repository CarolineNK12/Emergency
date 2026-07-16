import os
from flask import Flask, jsonify
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

app = Flask(__name__)

DB_PATH = os.path.join(os.path.dirname(__file__), "local_dev.db")
engine = create_engine(f"sqlite:///{DB_PATH}", future=True)


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response


def get_connection():
    return engine.connect()


def init_db():
    try:
        with get_connection() as conn:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS Users (
                    id INTEGER PRIMARY KEY,
                    username TEXT NOT NULL,
                    phone_number INTEGER
                )
            """))
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS Alerts (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    area TEXT,
                    severity TEXT
                )
            """))
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS Questions (
                    id INTEGER PRIMARY KEY,
                    question TEXT NOT NULL,
                    answer1 TEXT,
                    answer2 TEXT,
                    answer3 TEXT,
                    answer4 TEXT,
                    realanswer TEXT,
                    successmessage TEXT
                )
            """))

            conn.execute(text("SELECT COUNT(*) FROM Users")).fetchone()
            user_count = conn.execute(text("SELECT COUNT(*) FROM Users")).fetchone()[0]
            if user_count == 0:
                conn.execute(text("INSERT INTO Users (id, username, phone_number) VALUES (:id, :username, :phone_number)"), {
                    "id": 1,
                    "username": "Joe",
                    "phone_number": 123456789,
                })

            alert_count = conn.execute(text("SELECT COUNT(*) FROM Alerts")).fetchone()[0]
            if alert_count == 0:
                conn.execute(text("INSERT INTO Alerts (id, name, area, severity) VALUES (:id, :name, :area, :severity)"), {
                    "id": 1,
                    "name": "Earthquake",
                    "area": "Bogor",
                    "severity": "Magnitude 4",
                })

            question_count = conn.execute(text("SELECT COUNT(*) FROM Questions")).fetchone()[0]
            if question_count == 0:
                conn.execute(text("""
                    INSERT INTO Questions (
                        id,
                        question,
                        answer1,
                        answer2,
                        answer3,
                        answer4,
                        realanswer,
                        successmessage
                    ) VALUES (
                        :id,
                        :question,
                        :answer1,
                        :answer2,
                        :answer3,
                        :answer4,
                        :realanswer,
                        :successmessage
                    )
                """), {
                    "id": 1,
                    "question": "Oh no! You witness a car accident on the street. What is the universal emergency number to call in Indonesia?",
                    "answer1": "911",
                    "answer2": "112",
                    "answer3": "999",
                    "answer4": "000",
                    "realanswer": "112",
                    "successmessage": "Spot on! 112 is Indonesia's universal SOS number. Leave 911 for the movies!",
                })

            conn.commit()
        return True
    except SQLAlchemyError as exc:
        print(f"Database connection failed during initialization: {exc}")
        return False


init_db()


@app.route("/")
def home():
    return jsonify({
        "message": "Emergency backend is running",
        "database": "sqlite",
        "endpoints": [
            "/api/users",
            "/api/alerts",
            "/api/questions",
            "/api/all"
        ]
    })


def handle_db_error(message):
    return jsonify({"error": message}), 500


@app.route("/api/users")
def get_users():
    try:
        with get_connection() as conn:
            rows = conn.execute(text("SELECT id, username, phone_number FROM Users ORDER BY id")).fetchall()
        return jsonify({"users": [dict(zip(row._fields, row)) for row in rows]})
    except SQLAlchemyError as exc:
        return handle_db_error(str(exc))


@app.route("/api/alerts")
def get_alerts():
    try:
        with get_connection() as conn:
            rows = conn.execute(text("SELECT id, name, area, severity FROM Alerts ORDER BY id")).fetchall()
        return jsonify({"alerts": [dict(zip(row._fields, row)) for row in rows]})
    except SQLAlchemyError as exc:
        return handle_db_error(str(exc))


@app.route("/api/questions")
def get_questions():
    try:
        with get_connection() as conn:
            rows = conn.execute(text(
                "SELECT id, question, answer1, answer2, answer3, answer4, realanswer, successmessage FROM Questions ORDER BY id"
            )).fetchall()
        return jsonify({"questions": [dict(zip(row._fields, row)) for row in rows]})
    except SQLAlchemyError as exc:
        return handle_db_error(str(exc))


@app.route("/api/all")
def get_all_data():
    try:
        with get_connection() as conn:
            users = [dict(zip(row._fields, row)) for row in conn.execute(text("SELECT id, username, phone_number FROM Users ORDER BY id")).fetchall()]
            alerts = [dict(zip(row._fields, row)) for row in conn.execute(text("SELECT id, name, area, severity FROM Alerts ORDER BY id")).fetchall()]
            questions = [dict(zip(row._fields, row)) for row in conn.execute(text(
                "SELECT id, question, answer1, answer2, answer3, answer4, realanswer, successmessage FROM Questions ORDER BY id"
            )).fetchall()]
        return jsonify({"users": users, "alerts": alerts, "questions": questions})
    except SQLAlchemyError as exc:
        return handle_db_error(str(exc))


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")