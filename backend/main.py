from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.database import Base, engine
from backend import models

from backend.routes.auth import router as auth_router
from backend.routes.prediction import router as prediction_router
from backend.routes.risk import router as risk_router
from backend.routes.recommendation import router as recommendation_router
from backend.routes.report import router as report_router

from backend.routes import medical_history
from backend.routes import profile
from backend.routes import analytics
from backend.routes import admin


# =====================================================
# BASE DIRECTORY
# =====================================================

BASE_DIR = Path(__file__).resolve().parent


# =====================================================
# CREATE DATABASE TABLES
# =====================================================

Base.metadata.create_all(bind=engine)


# =====================================================
# FASTAPI APPLICATION
# =====================================================

app = FastAPI(
    title="MedAssist AI Backend",
    description="Medical Symptom Analysis and Disease Prediction System",
    version="1.0"
)


# =====================================================
# UPLOAD DIRECTORIES
# =====================================================

UPLOADS_DIR = BASE_DIR / "uploads"
PROFILE_UPLOADS_DIR = UPLOADS_DIR / "profile"

REPORTS_DIR = BASE_DIR.parent / "reports"


# =====================================================
# CREATE DIRECTORIES IF THEY DON'T EXIST
# =====================================================

UPLOADS_DIR.mkdir(
    parents=True,
    exist_ok=True
)

PROFILE_UPLOADS_DIR.mkdir(
    parents=True,
    exist_ok=True
)

REPORTS_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# =====================================================
# SERVE PROFILE UPLOADS
# =====================================================

app.mount(
    "/uploads",
    StaticFiles(
        directory=str(UPLOADS_DIR)
    ),
    name="uploads"
)


# =====================================================
# SERVE GENERATED PDF REPORTS
# =====================================================

app.mount(
    "/reports",
    StaticFiles(
        directory=str(REPORTS_DIR)
    ),
    name="reports"
)


# =====================================================
# CORS CONFIGURATION
# =====================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",

    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =====================================================
# HOME API
# =====================================================

@app.get("/")
def home():

    return {
        "message": "Welcome to MedAssist AI Backend"
    }


# =====================================================
# AUTHENTICATION API
# =====================================================

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)


# =====================================================
# DISEASE PREDICTION API
# =====================================================

app.include_router(
    prediction_router,
    prefix="/prediction",
    tags=["Disease Prediction"]
)


# =====================================================
# RISK ASSESSMENT API
# =====================================================

app.include_router(
    risk_router,
    prefix="/risk",
    tags=["Risk Assessment"]
)


# =====================================================
# TREATMENT RECOMMENDATION API
# =====================================================

app.include_router(
    recommendation_router,
    prefix="/recommendation",
    tags=["Treatment Recommendation"]
)


# =====================================================
# HEALTH REPORT API
# =====================================================

app.include_router(
    report_router,
    prefix="/report",
    tags=["Health Report"]
)


# =====================================================
# MEDICAL HISTORY API
# =====================================================

app.include_router(
    medical_history.router,
    prefix="/medical-history",
    tags=["Medical History"]
)


# =====================================================
# PROFILE SETTINGS API
# =====================================================

app.include_router(
    profile.router,
    prefix="/profile",
    tags=["Profile Settings"]
)


# =====================================================
# ANALYTICS API
# =====================================================

app.include_router(
    analytics.router,
    prefix="/analytics",
    tags=["Analytics"]
)


# =====================================================
# ADMIN API
# =====================================================

app.include_router(
    admin.router,
    prefix="/admin",
    tags=["Admin"]
)