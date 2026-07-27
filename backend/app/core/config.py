import os
from typing import List, Union
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, field_validator, ConfigDict

class Settings(BaseSettings):
    model_config = ConfigDict(case_sensitive=True)

    PROJECT_NAME: str = "MedAssist AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    SECRET_KEY: str = "medassist_super_secret_jwt_key_987654321_prod_quality"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "medassist_db")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")
    SQLALCHEMY_DATABASE_URI: Union[str, None] = None

    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))

    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"]

    MODEL_PATH: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ml", "saved_models", "disease_model.joblib")
    DATASET_PATH: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ml", "saved_models", "disease_symptoms.csv")

    @field_validator("SQLALCHEMY_DATABASE_URI", mode="before")
    def assemble_db_connection(cls, v: Union[str, None], info) -> str:
        if isinstance(v, str):
            return v
        server = info.data.get("POSTGRES_SERVER")
        user = info.data.get("POSTGRES_USER")
        password = info.data.get("POSTGRES_PASSWORD")
        db = info.data.get("POSTGRES_DB")
        port = info.data.get("POSTGRES_PORT")
        return f"postgresql://{user}:{password}@{server}:{port}/{db}"

settings = Settings()
