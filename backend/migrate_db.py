import os
import sqlite3
from app.core.database import engine, Base
import app.models

def migrate_db():
    # 1. Create tables if they don't exist
    Base.metadata.create_all(bind=engine)

    # 2. If using SQLite, check and add any missing columns automatically
    db_file = "medassist_local.db"
    if os.path.exists(db_file):
        try:
            conn = sqlite3.connect(db_file)
            cursor = conn.cursor()
            # Migrate 'users' columns
            cursor.execute("PRAGMA table_info(users)")
            existing_user_cols = [col[1] for col in cursor.fetchall()]
            columns_to_add = [
                ("google_id", "VARCHAR(255)"),
                ("microsoft_id", "VARCHAR(255)"),
                ("login_provider", "VARCHAR(50) DEFAULT 'email'"),
                ("first_name", "VARCHAR(128)"),
                ("last_name", "VARCHAR(128)"),
                ("phone", "VARCHAR(50)"),
                ("address", "VARCHAR(500)"),
                ("is_email_verified", "BOOLEAN DEFAULT 0"),
                ("verification_token", "VARCHAR(255)"),
                ("reset_token", "VARCHAR(255)"),
                ("last_login_at", "DATETIME"),
            ]
            for col_name, col_type in columns_to_add:
                if col_name not in existing_user_cols:
                    print(f"Adding column '{col_name}' to 'users' table...")
                    cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}")

            # Migrate 'appointments' columns
            cursor.execute("PRAGMA table_info(appointments)")
            existing_appt_cols = [col[1] for col in cursor.fetchall()]
            appt_columns_to_add = [
                ("doctor_id", "INTEGER"),
                ("doctor_specialty", "VARCHAR(100) DEFAULT 'General Physician'"),
                ("priority", "VARCHAR(50) DEFAULT 'normal'"),
                ("status", "VARCHAR(50) DEFAULT 'confirmed'"),
            ]
            for col_name, col_type in appt_columns_to_add:
                if col_name not in existing_appt_cols:
                    print(f"Adding column '{col_name}' to 'appointments' table...")
                    cursor.execute(f"ALTER TABLE appointments ADD COLUMN {col_name} {col_type}")

            conn.commit()
            conn.close()
            print("SQLite schema migration finished successfully!")
        except Exception as e:
            print("Migration warning:", e)

if __name__ == "__main__":
    migrate_db()
