import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker


# ===============================
# Load Environment Variables
# ===============================

load_dotenv()


# ===============================
# PostgreSQL Database URL
# ===============================

DATABASE_URL = os.getenv("DATABASE_URL")


# ===============================
# Create Engine
# ===============================

engine = create_engine(DATABASE_URL)


# ===============================
# Session Factory
# ===============================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# ===============================
# Base Class
# ===============================

Base = declarative_base()


# ===============================
# Database Dependency
# ===============================

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()