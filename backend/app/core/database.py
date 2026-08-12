import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# ── Database URL resolution ────────────────────────────────────────────
# Priority: DATABASE_URL env var > PostgreSQL config > SQLite fallback
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Try assembling PostgreSQL URL from individual components
    pg_user = os.getenv("POSTGRES_USER", "postgres")
    pg_pass = os.getenv("POSTGRES_PASSWORD", "postgres")
    pg_host = os.getenv("POSTGRES_SERVER", "localhost")
    pg_port = os.getenv("POSTGRES_PORT", "5432")
    pg_db = os.getenv("POSTGRES_DB", "medassist_db")
    DATABASE_URL = f"postgresql://{pg_user}:{pg_pass}@{pg_host}:{pg_port}/{pg_db}"

if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# ── Create engine with SQLite fallback ─────────────────────────────────
try:
    if "sqlite" in DATABASE_URL:
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    else:
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    # Test the connection
    with engine.connect() as conn:
        conn.execute(__import__("sqlalchemy").text("SELECT 1"))
except Exception:
    # Fallback to SQLite for zero-dependency local development
    DATABASE_URL = "sqlite:///./medassist_local.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
