from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.database.init_db import init_db
from app.ml.disease_mapping import load_disease_mapping
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
    prescription_router,
)
from app.utils.logger import get_logger


logger = get_logger("MedAssistAI.Main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ---------------------------------------------------------
    # Startup
    # ---------------------------------------------------------

    # 1. Initialize database tables
    try:
        init_db()
        logger.info("Database initialized successfully.")
    except Exception as e:
        logger.warning("Database initialization deferred: %s", e)

    # 2. Preload disease name mappings into memory
    try:
        load_disease_mapping()
        logger.info("Preloaded disease name mappings into memory.")
    except Exception as e:
        logger.warning("Disease mapping preload warning: %s", e)

    # 3. Preload production LightGBM model into memory (fast & lightweight, ~13 MB RAM)
    try:
        from app.ml.model_loader import load_model
        load_model()
        logger.info("Preloaded production LightGBM model into memory.")
    except Exception as e:
        logger.warning("ML model preload warning: %s", e)

    # ---------------------------------------------------------
    # Application is ready
    # ---------------------------------------------------------
    yield

    # ---------------------------------------------------------
    # Shutdown
    # ---------------------------------------------------------
    logger.info("Shutting down MedAssistAI API server.")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    lifespan=lifespan,
    description=(
        "MedAssistAI API: AI-powered healthcare web application for disease prediction, "
        "health risk assessment, severity analysis, medical recommendations, "
        "report management, and system analytics."
    ),
)


# -------------------------------------------------------------
# CORS
# -------------------------------------------------------------

default_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
    "http://127.0.0.1:5176",
    "http://127.0.0.1:5177",
    "http://127.0.0.1:3000",
]


# Add production origins from environment variable
if settings.ALLOWED_ORIGINS:
    extra_origins = [
        origin.strip()
        for origin in settings.ALLOWED_ORIGINS.split(",")
        if origin.strip()
    ]
    default_origins.extend(extra_origins)


app.add_middleware(
    CORSMiddleware,
    allow_origins=default_origins,
    allow_origin_regex=r"^https://.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------------------------------------------
# API Routers
# -------------------------------------------------------------

app.include_router(home.router)
app.include_router(auth.router)
app.include_router(patient.router)
app.include_router(doctor.router)
app.include_router(appointment.router)
app.include_router(symptom.router)
app.include_router(prediction_router.router)
app.include_router(report_router.router)
app.include_router(analytics_router.router)
app.include_router(prescription_router.router)