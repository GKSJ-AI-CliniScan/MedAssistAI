import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "MedAssistAI Backend")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"

    # Default to local SQLite database if PostgreSQL URL is missing or unreachable during development
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "sqlite:///./medassistai.db"
    )

    SECRET_KEY: str = os.getenv(
        "SECRET_KEY", "MedAssistAI@2026$JWT#Secure%Key!987654321"
    )
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
    )


settings = Settings()