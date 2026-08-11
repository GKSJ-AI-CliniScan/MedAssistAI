"""
MedAssist AI – FastAPI Main Application Entry Point
"""
import os
# Prevent OpenBLAS memory allocation retries/crashes on Windows
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.database import Base, engine, SessionLocal
from app.api.routers import (
    auth_router,
    patients_router,
    symptoms_router,
    predictions_router,
    reports_router,
    dashboard_router,
    notifications_router,
    doctors_router,
    appointments_router,
    admin_router,
    search_router,
)

# ── Create all tables & auto-migrate columns ────────────────────────────
import app.models  # noqa: F401
from migrate_db import migrate_db
migrate_db()

# ── FastAPI App Instance ─────────────────────────────────────────────
app = FastAPI(
    title="MedAssist AI",
    description=(
        "Medical Symptom Analysis & Disease Prediction System — "
        "AI-powered healthcare platform for symptom analysis, disease prediction, "
        "risk assessment, and treatment recommendations."
    ),
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# ── CORS ──────────────────────────────────────────────────────────────
# Permissively whitelist all local development origin variations (localhost and 127.0.0.1 on ports 3000-3010, 5173-5180)
ALLOWED_ORIGINS = []
for port in range(3000, 3011):
    ALLOWED_ORIGINS.append(f"http://localhost:{port}")
    ALLOWED_ORIGINS.append(f"http://127.0.0.1:{port}")
for port in range(5173, 5181):
    ALLOWED_ORIGINS.append(f"http://localhost:{port}")
    ALLOWED_ORIGINS.append(f"http://127.0.0.1:{port}")

env_origins = os.getenv("CORS_ORIGINS", "")
if env_origins:
    ALLOWED_ORIGINS.extend(env_origins.split(","))

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Global Exception Handler ──────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {exc}"},
    )

# ── Register All Routers ──────────────────────────────────────────────
API_PREFIX = "/api"
app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(patients_router, prefix=API_PREFIX)
app.include_router(symptoms_router, prefix=API_PREFIX)
app.include_router(predictions_router, prefix=API_PREFIX)
app.include_router(reports_router, prefix=API_PREFIX)
app.include_router(dashboard_router, prefix=API_PREFIX)
app.include_router(notifications_router, prefix=API_PREFIX)
app.include_router(doctors_router, prefix=API_PREFIX)
app.include_router(appointments_router, prefix=API_PREFIX)
app.include_router(admin_router, prefix=API_PREFIX)
app.include_router(search_router, prefix=API_PREFIX)

# ── Database Seeding on Startup ───────────────────────────────────────
@app.on_event("startup")
def seed_data():
    from app.repositories import UserRepository, PatientRepository
    db = SessionLocal()
    try:
        user_repo = UserRepository(db)
        pat_repo = PatientRepository(db)
        
        # Seed Demo User
        demo_email = "demo@medassist.ai"
        if not user_repo.get_by_email(demo_email):
            user = user_repo.create(
                full_name="Demo Doctor",
                email=demo_email,
                password="Password123",
                role="doctor"
            )
            pat_repo.create(user_id=user.id)
            
        # Seed standard patient user
        patient_email = "patient@medassist.ai"
        if not user_repo.get_by_email(patient_email):
            p_user = user_repo.create(
                full_name="Jane Doe",
                email=patient_email,
                password="Password123",
                role="patient"
            )
            pat_repo.create(user_id=p_user.id)
    finally:
        db.close()

# ── Health Check ──────────────────────────────────────────────────────
@app.get("/api/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "service": "MedAssist AI Backend",
        "version": "1.0.0",
        "database": "connected",
        "ml_engine": "online",
    }

@app.get("/", tags=["System"])
def root():
    return {
        "message": "MedAssist AI API is running.",
        "docs": "/api/docs",
        "health": "/api/health",
    }
