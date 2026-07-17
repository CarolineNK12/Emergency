import os
from flask import Flask, jsonify, request
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

app = Flask(__name__)

DB_PATH = os.path.join(os.path.dirname(__file__), "local_dev.db")
engine = create_engine(f"sqlite:///{DB_PATH}", future=True)


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response


def get_connection():
    return engine.connect()


def init_db():
    try:
        with get_connection() as conn:
            # Drop tables first so we can completely reset the schema and data on restart
            conn.execute(text("DROP TABLE IF EXISTS Users"))
            conn.execute(text("DROP TABLE IF EXISTS Alerts"))
            conn.execute(text("DROP TABLE IF EXISTS Questions"))

            # 1. Recreate clean tables
            conn.execute(text("""
                CREATE TABLE Users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL,
                    email TEXT UNIQUE,
                    password TEXT,
                    emergency_relation TEXT,
                    emergency_phone TEXT
                )
            """))
            conn.execute(text("""
                CREATE TABLE Alerts (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    area TEXT,
                    severity TEXT
                )
            """))
            conn.execute(text("""
                CREATE TABLE Questions (
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

            # 2. Seed a clean demo user matching the schema columns
            conn.execute(text("""
                INSERT INTO Users (id, username, email, password, emergency_relation, emergency_phone) 
                VALUES (:id, :username, :email, :password, :emergency_relation, :emergency_phone)
            """), {
                "id": 1,
                "username": "Joe",
                "email": "joe@gmail.com",
                "password": "secret123",
                "emergency_relation": "Brother",
                "emergency_phone": "08123456789"
            })

            # 3. Seed Alerts
            alerts_to_seed = [
                (1, 'Earthquake', 'Bogor, Sentul', 'Magnitude 4'),
                (2, 'Flooding', 'Jakarta, Cilandak', 'Severe'),
                (3, 'Tsunami', 'Bali, Denpasar', 'High'),
                (4, 'Wild Fire', 'Tangerang Selatan, Alam Sutera', 'Severe'),
                (5, 'Landslide', 'Bandung, Lembang', 'Moderate'),
                (6, 'Volcanic Activity', 'Yogyakarta, Merapi', 'Warning Level 3')
            ]
            for alert in alerts_to_seed:
                conn.execute(text("""
                    INSERT INTO Alerts (id, name, area, severity) 
                    VALUES (:id, :name, :area, :severity)
                """), {"id": alert[0], "name": alert[1], "area": alert[2], "severity": alert[3]})

            # 4. Seed Questions
            seed_questions = [
                {
                    "id": 1,
                    "question": "Oh no! You witness a car accident on the street. What is the universal emergency number to call in Indonesia?",
                    "answer1": "911",
                    "answer2": "112",
                    "answer3": "999",
                    "answer4": "000",
                    "realanswer": "112",
                    "successmessage": "Spot on! 112 is Indonesia's universal SOS number. Leave 911 for the movies!",
                },
                {
                    "id": 2,
                    "question": "What is the correct ratio of chest compressions to rescue breaths for high-quality adult CPR?",
                    "answer1": "15 compressions to 2 breaths",
                    "answer2": "30 compressions to 5 breaths",
                    "answer3": "30 compressions to 2 breaths",
                    "answer4": "5 compressions to 1 breath",
                    "realanswer": "30 compressions to 2 breaths",
                    "successmessage": "Correct! The gold standard ratio is 30 compressions followed by 2 breaths.",
                },
                {
                    "id": 3,
                    "question": "What depth should you aim for when performing chest compressions on an adult?",
                    "answer1": "At least 2 inches (5 cm)",
                    "answer2": "No more than 1 inch (2.5 cm)",
                    "answer3": "Exactly 3 inches (7.5 cm)",
                    "answer4": "Around 1.5 inches (4 cm)",
                    "realanswer": "At least 2 inches (5 cm)",
                    "successmessage": "Spot on! Compressions must be at least 2 inches deep to effectively pump blood.",
                },
                {
                    "id": 4,
                    "question": "A conscious adult is choking and cannot speak. Where should you position your hands for abdominal thrusts?",
                    "answer1": "Directly on the breastbone",
                    "answer2": "Slightly above the navel and below the breastbone",
                    "answer3": "On the lower ribcage",
                    "answer4": "Directly over the belly button",
                    "realanswer": "Slightly above the navel and below the breastbone",
                    "successmessage": "Great job! Placing your hands just above the navel forces the diaphragm upward to expel the object.",
                },
                {
                    "id": 5,
                    "question": "A victim has a deep laceration on their forearm that is spurting bright red blood. What is your immediate priority?",
                    "answer1": "Apply a loose bandage over the wound",
                    "answer2": "Elevate the limb above the heart without touching it",
                    "answer3": "Apply firm, direct pressure with a clean cloth",
                    "answer4": "Wash the wound out with running water",
                    "realanswer": "Apply firm, direct pressure with a clean cloth",
                    "successmessage": "Correct! Direct pressure is the fastest and most efficient way to control severe bleeding.",
                },
                {
                    "id": 6,
                    "question": "If blood soaks completely through the initial dressing you applied to a severe wound, what should you do?",
                    "answer1": "Remove the soaked dressing and start over",
                    "answer2": "Place additional dressings right on top and keep applying pressure",
                    "answer3": "Clean the wound with antiseptic",
                    "answer4": "Apply a tourniquet immediately below the wound",
                    "realanswer": "Place additional dressings right on top and keep applying pressure",
                    "successmessage": "Exactly! Never remove the original dressing, as doing so tears away starting blood clots.",
                },
                {
                    "id": 7,
                    "question": "A trauma victim is pale, cold, clammy, and breathing rapidly (shock). How should you position them?",
                    "answer1": "Sit them upright in a chair",
                    "answer2": "Lay them flat on their back and elevate legs slightly if safe",
                    "answer3": "Place them face down",
                    "answer4": "Keep them standing and walking around",
                    "realanswer": "Lay them flat on their back and elevate legs slightly if safe",
                    "successmessage": "Correct! Laying them flat and elevating their feet helps direct blood flow back to vital core organs.",
                },
                {
                    "id": 8,
                    "question": "A coworker tells you they feel dizzy and think they are going to faint. What should you advise them to do?",
                    "answer1": "Sit or lay down immediately on the ground",
                    "answer2": "Drink a hot beverage rapidly",
                    "answer3": "Stand up straight and take deep breaths",
                    "answer4": "Walk outside into the fresh air",
                    "realanswer": "Sit or lay down immediately on the ground",
                    "successmessage": "Perfect! Getting them low to the ground early prevents sudden injuries from a fall.",
                },
                {
                    "id": 9,
                    "question": "What is the medical term used to describe a temporary loss of consciousness caused by a fall in blood pressure?",
                    "answer1": "Vertigo",
                    "answer2": "Syncope",
                    "answer3": "Stroke",
                    "answer4": "Hypothermia",
                    "realanswer": "Syncope",
                    "successmessage": "Brilliant! Syncope is the official clinical term for fainting.",
                },
                {
                    "id": 10,
                    "question": "A kitchen worker spills boiling water on their arm. The skin is red and blisters are forming. What burn grade is this?",
                    "answer1": "First-degree burn",
                    "answer2": "Second-degree burn",
                    "answer3": "Third-degree burn",
                    "answer4": "Full-thickness burn",
                    "realanswer": "Second-degree burn",
                    "successmessage": "Correct! Blistering indicates a second-degree burn.",
                },
                {
                    "id": 11,
                    "question": "When applying a splint to a suspected broken bone in the forearm, how should the splint be secured?",
                    "answer1": "Tie it directly over the break point tightly",
                    "answer2": "Secure it loose enough to let the bone move freely",
                    "answer3": "Immobilize the joints both above and below the fracture site",
                    "answer4": "Wrap it entirely in ice packs before tying",
                    "realanswer": "Immobilize the joints both above and below the fracture site",
                    "successmessage": "Spot on! Immobilizing the joints above and below prevents the broken bone segments from shifting.",
                },
                {
                    "id": 12,
                    "question": "You suspect someone has accidentally swallowed a toxic household cleaning chemical. What is your immediate action?",
                    "answer1": "Induce vomiting right away",
                    "answer2": "Give them large amounts of water to drink immediately",
                    "answer3": "Call emergency services or poison control immediately",
                    "answer4": "Administer activated charcoal from your kit",
                    "realanswer": "Call emergency services or poison control immediately",
                    "successmessage": "Correct! Never induce vomiting without professional guidance, as corrosive chemicals can double damage coming back up.",
                },
                {
                    "id": 13,
                    "question": "If a toxic chemical splashes directly into someone's eyes, how long should you flush them with clean water?",
                    "answer1": "At least 5 minutes",
                    "answer2": "At least 10 minutes",
                    "answer3": "At least 20 minutes",
                    "answer4": "Just wipe it with a clean towel",
                    "realanswer": "At least 20 minutes",
                    "successmessage": "Excellent! Continuous irrigation for at least 20 minutes is critical to dilute the contaminant.",
                },
                {
                    "id": 14,
                    "question": "An automated external defibrillator (AED) arrives during CPR. What is the very first thing you do with it?",
                    "answer1": "Plug in the electrode pads connector",
                    "answer2": "Turn on the AED power switch",
                    "answer3": "Apply the pads to the victim's bare chest",
                    "answer4": "Clear everyone away from the patient",
                    "realanswer": "Turn on the AED power switch",
                    "successmessage": "Correct! Turn it on first so the audio voice prompts can guide you safely through the remaining steps.",
                },
                {
                    "id": 15,
                    "question": "What acronym is universally used to identify the warning signs of a Stroke?",
                    "answer1": "R.I.C.E.",
                    "answer2": "F.A.S.T.",
                    "answer3": "P.A.S.S.",
                    "answer4": "C.A.B.D.",
                    "realanswer": "F.A.S.T.",
                    "successmessage": "Perfect! Face, Arm, Speech, Time (F.A.S.T.) saves critical time during a stroke emergency.",
                },
                {
                    "id": 16,
                    "question": "You are treating a heat stroke victim whose skin is hot, red, and dry. Which treatment is the most critical?",
                    "answer1": "Provide a sugary sports beverage to sip",
                    "answer2": "Rapidly cool the body using cold water immersion or ice packs",
                    "answer3": "Administer aspirin",
                    "answer4": "Cover them with a heavy blanket to sweat it out",
                    "realanswer": "Rapidly cool the body using cold water immersion or ice packs",
                    "successmessage": "Outstanding! Heat stroke is a true medical emergency; cooling their core temperature takes absolute priority.",
                },
            ]
            
            for row in seed_questions:
                conn.execute(text("""
                    INSERT OR IGNORE INTO Questions (
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
                """), row)

            conn.commit()
        return True
    except SQLAlchemyError as exc:
        print(f"Database initialization failed: {exc}")
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

@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("fullName")
    email = data.get("email")
    password = data.get("password")
    emergency_relation = data.get("familyType", "Family")
    emergency_phone = data.get("familyNumber")

    if not email or not password or not username:
        return jsonify({"error": "Please fill in all required fields!"}), 400

    try:
        with get_connection() as conn:
            existing = conn.execute(
                text("SELECT id FROM Users WHERE email = :email"), 
                {"email": email}
            ).fetchone()
            
            if existing:
                return jsonify({"error": "This Gmail is already registered!"}), 409

            conn.execute(text("""
                INSERT INTO Users (username, email, password, emergency_relation, emergency_phone)
                VALUES (:username, :email, :password, :emergency_relation, :emergency_phone)
            """), {
                "username": username,
                "email": email,
                "password": password,
                "emergency_relation": emergency_relation,
                "emergency_phone": emergency_phone
            })
            conn.commit()

        

        return jsonify({
            "message": "Sign up successful!",
            "user": {
                "name": username,
                "email": email,
                "emergencyContact": {
                    "relation": emergency_relation,
                    "number": emergency_phone
                }
            }
        }), 201
    except SQLAlchemyError as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if email == "shandy@gmail.com" and password == "12345":
        return jsonify({
            "message": "Demo login successful",
            "user": {
                "name": "Shandy Afrian Mashuri",
                "email": "shandy@gmail.com",
                "emergencyContact": {
                    "relation": "Mom",
                    "number": "0812 3459 3987"
                }
            }
        }), 200

    try:
        with get_connection() as conn:
            user = conn.execute(text("""
                SELECT username, email, emergency_relation, emergency_phone
                FROM Users
                WHERE email = :email AND password = :password
            """), {"email": email, "password": password}).fetchone()

            if not user:
                return jsonify({"error": "Invalid email or password!"}), 401

            return jsonify({
                "message": "Login successful",
                "user": {
                    "name": user.username,
                    "email": user.email,
                    "emergencyContact": {
                        "relation": user.emergency_relation or "Family",
                        "number": user.emergency_phone or "-"
                    }
                }
            }), 200
    except SQLAlchemyError as exc:
        return jsonify({"error": str(exc)}), 500

@app.route("/api/change-password", methods=["POST"])
def change_password():
    data = request.json
    email = data.get("email")
    old_password = data.get("oldPassword")
    new_password = data.get("newPassword")

    try:
        with get_connection() as conn:
            # Verify user and old password
            user = conn.execute(text("""
                SELECT id FROM Users 
                WHERE email = :email AND password = :old_password
            """), {"email": email, "old_password": old_password}).fetchone()

            if not user:
                return jsonify({"error": "Incorrect current password!"}), 401

            # Update to new password
            conn.execute(text("""
                UPDATE Users SET password = :new_password 
                WHERE email = :email
            """), {"new_password": new_password, "email": email})
            conn.commit()

        return jsonify({"message": "Password updated successfully!"}), 200
    except SQLAlchemyError as exc:
        return jsonify({"error": str(exc)}), 500
    
@app.route("/api/users")
def get_users():
    try:
        with get_connection() as conn:
            rows = conn.execute(text(
                "SELECT id, username, email, emergency_relation, emergency_phone FROM Users ORDER BY id"
            )).fetchall()
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
            users = [dict(zip(row._fields, row)) for row in conn.execute(text("SELECT id, username, emergency_phone FROM Users ORDER BY id")).fetchall()]
            alerts = [dict(zip(row._fields, row)) for row in conn.execute(text("SELECT id, name, area, severity FROM Alerts ORDER BY id")).fetchall()]
            questions = [dict(zip(row._fields, row)) for row in conn.execute(text(
                "SELECT id, question, answer1, answer2, answer3, answer4, realanswer, successmessage FROM Questions ORDER BY id"
            )).fetchall()]
        return jsonify({"users": users, "alerts": alerts, "questions": questions})
    except SQLAlchemyError as exc:
        return handle_db_error(str(exc))


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")