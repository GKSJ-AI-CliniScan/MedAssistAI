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
            cursor.execute("PRAGMA table_info(users)")
            existing_columns = [col[1] for col in cursor.fetchall()]

            if "google_id" not in existing_columns:
                print("Adding column 'google_id' to 'users' table...")
                cursor.execute("ALTER TABLE users ADD COLUMN google_id VARCHAR(255)")
                print("Added google_id column.")

            if "login_provider" not in existing_columns:
                print("Adding column 'login_provider' to 'users' table...")
                cursor.execute("ALTER TABLE users ADD COLUMN login_provider VARCHAR(50) DEFAULT 'email'")
                print("Added login_provider column.")

            conn.commit()
            conn.close()
            print("SQLite schema migration finished successfully!")
        except Exception as e:
            print("Migration warning:", e)

if __name__ == "__main__":
    migrate_db()
