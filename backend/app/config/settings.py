import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "MedAssistAI Backend")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")

    # Database URL with postgres:// -> postgresql:// normalization for Render/managed PostgreSQL
    _raw_db_url: str = os.getenv(
        "DATABASE_URL", "postgresql://postgres:sai123@localhost:5432/medassistai"
    )
    if _raw_db_url.startswith("postgres://"):
        DATABASE_URL: str = _raw_db_url.replace("postgres://", "postgresql://", 1)
    else:
        DATABASE_URL: str = _raw_db_url

    SECRET_KEY: str = os.getenv(
        "SECRET_KEY", "MedAssistAI@2026$JWT#Secure%Key!987654321"
    )
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
    )

    # Dynamic CORS Origins from environment (comma-separated)
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "")
    PORT: int = int(os.getenv("PORT", "8000"))


settings = Settings()