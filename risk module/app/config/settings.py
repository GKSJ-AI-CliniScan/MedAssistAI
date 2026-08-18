"""
Application Settings & Configuration.

Centralized management of environment variables, external API endpoints,
model artifact paths, and default system timeouts.
"""

import os


class Settings:
    """Application configuration settings."""

    # Disease Prediction API endpoint configuration
    DISEASE_PREDICTION_API_URL: str = os.getenv(
        "DISEASE_PREDICTION_API_URL",
        "http://localhost:8000/api/history/check",
    )
    DISEASE_PREDICTION_TIMEOUT: float = float(
        os.getenv("DISEASE_PREDICTION_TIMEOUT", "5.0")
    )

    # Risk Assessment ML Model artifact path
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    MODEL_PATH: str = os.getenv(
        "RISK_MODEL_PATH",
        os.path.join(BASE_DIR, "models", "risk_model.pkl"),
    )

    # General configuration
    APP_NAME: str = "MedAssist AI API"
    APP_VERSION: str = "1.0.0"
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")


settings = Settings()
