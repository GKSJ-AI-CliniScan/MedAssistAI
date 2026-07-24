from fastapi import FastAPI

from backend.database import Base
from backend.database import engine

from backend import models

from backend.routes.prediction import router as prediction_router
from backend.routes.risk import router as risk_router
from backend.routes.recommendation import router as recommendation_router
from backend.routes.auth import router as auth_router
from backend.routes.report import router as report_router
from backend.routes import medical_history
from backend.routes import profile
from backend.routes import analytics
from backend.routes import admin


# ==========================================
# Create Database Tables
# ==========================================

Base.metadata.create_all(bind=engine)


# ==========================================
# FastAPI Application
# ==========================================

app = FastAPI()


@app.get("/")
def home():
    return {
        "message": "Welcome to MedAssist AI Backend"
    }


# ==========================================
# Disease Prediction API
# ==========================================

app.include_router(
    prediction_router,
    prefix="/prediction",
    tags=["Disease Prediction"]
)


# ==========================================
# Risk Assessment API
# ==========================================

app.include_router(
    risk_router,
    prefix="/risk",
    tags=["Risk Assessment"]
)


# ==========================================
# Treatment Recommendation API
# ==========================================

app.include_router(
    recommendation_router,
    prefix="/recommendation",
    tags=["Treatment Recommendation"]
)


# ==========================================
# Health Report API
# ==========================================

app.include_router(
    report_router,
    prefix="/report",
    tags=["Health Report"]
)


# ==========================================
# Authentication API
# ==========================================

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)

app.include_router(
    medical_history.router,
    prefix="/medical-history",
    tags=["Medical History"]
)

app.include_router(
    profile.router,
    prefix="/profile",
    tags=["Profile Settings"]
)

app.include_router(
    analytics.router,
    prefix="/analytics",
    tags=["Analytics"]
)

app.include_router(
    admin.router,
    prefix="/admin",
    tags=["Admin"]
)