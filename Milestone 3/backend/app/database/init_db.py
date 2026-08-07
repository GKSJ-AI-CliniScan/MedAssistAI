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


if __name__ == "__main__":
    init_db()