"""
MedAssist AI - Main FastAPI Application Entry Point.

Initializes FastAPI application instance, sets up Swagger documentation metadata,
and mounts API routers.
"""

from fastapi import FastAPI
from app.routes import health, risk_assessment
from app.utils.logger import logger

# Initialize logger startup message
logger.info("Initializing MedAssist AI FastAPI Application")

app = FastAPI(
    title="MedAssist AI API",
    description=(
        "Medical Symptom Analysis & Patient Risk Assessment System API. "
        "Provides endpoints for health checking and patient risk assessment."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Mount Routers
app.include_router(health.router)
app.include_router(risk_assessment.router)
# app.include_router(predict.router)  # Reserved for Disease Prediction team


@app.get("/", tags=["Health"])
def home():
    """Root endpoint for API sanity check."""
    return {
        "message": "Welcome to MedAssist AI Backend",
        "status": "online",
        "docs": "/docs",
    }