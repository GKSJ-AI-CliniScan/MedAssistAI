from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.database.init_db import init_db
from app.ml.disease_mapping import load_disease_mapping
from app.ml.model_loader import load_model
from app.routers import (
    auth,
    home,
    patient,
    doctor,
    appointment,
    symptom,
    prediction_router,
    report_router,
    analytics_router,
)
from app.utils.logger import get_logger

logger = get_logger("MedAssistAI.Main")

# Initialize database tables and preload ML mapping on startup
try:
    init_db()
    logger.info("Database initialized successfully.")
except Exception as e:
    logger.warning("Database initialization deferred: %s", e)

try:
    load_disease_mapping()
    logger.info("Preloaded disease name mappings into memory.")
except Exception as e:
    logger.warning("Disease mapping preload warning: %s", e)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    description=(
        "MedAssistAI API: AI-powered healthcare web application for disease prediction, "
        "health risk assessment, severity analysis, medical recommendations, report management, and system analytics."
    ),
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(home.router)
app.include_router(auth.router)
app.include_router(patient.router)
app.include_router(doctor.router)
app.include_router(appointment.router)
app.include_router(symptom.router)
app.include_router(prediction_router.router)
app.include_router(report_router.router)
app.include_router(analytics_router.router)