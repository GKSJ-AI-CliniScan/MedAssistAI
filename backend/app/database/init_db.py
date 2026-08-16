from sqlalchemy import text
from app.database.database import engine, Base
import app.models  # Ensures all models are registered with Base.metadata


def init_db(reset: bool = False):
    with engine.connect() as conn:
        if reset:
            Base.metadata.drop_all(bind=engine)
            print("Dropped all existing database tables.")

        # Ensure schema compatibility for existing tables (e.g. adding missing timestamp columns)
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;"))
            conn.commit()
        except Exception:
            pass  # SQLite or syntax fallback handled by create_all

    Base.metadata.create_all(bind=engine)
    print("Database tables initialized successfully!")

    # Auto-seed predefined doctor and admin accounts safely & idempotently
    try:
        from app.database.seed_users import seed_doctor_admin_accounts
        seed_doctor_admin_accounts()
    except Exception as e:
        print(f"Warning: Failed to seed predefined doctor/admin accounts: {e}")

    # Auto-seed standard symptoms safely & idempotently
    try:
        from app.database.seed_symptoms import seed_symptoms
        seed_symptoms()
    except Exception as e:
        print(f"Warning: Failed to seed symptoms: {e}")


if __name__ == "__main__":
    init_db()