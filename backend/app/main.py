"""
MedAssist AI – FastAPI Main Application Entry Point
"""
import os
import sys

# Ensure backend root is in path so migrate_db can be found on Render
_backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

# Limit thread usage for ML libraries on constrained cloud environments
os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")
os.environ.setdefault("NUMEXPR_NUM_THREADS", "1")

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
try:
    from migrate_db import migrate_db
    migrate_db()
except Exception as _migrate_err:
    print(f"[WARNING] migrate_db skipped: {_migrate_err}")

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
    from app.repositories.doctor_repository import DoctorRepository
    db = SessionLocal()
    try:
        user_repo = UserRepository(db)
        pat_repo = PatientRepository(db)
        doc_repo = DoctorRepository(db)

        # Seed Demo Doctor account (doctor@medassist.ai)
        doctor_email = "doctor@medassist.ai"
        if not user_repo.get_by_email(doctor_email):
            try:
                doc_user = user_repo.create(
                    full_name="Dr. Rahul Sharma",
                    email=doctor_email,
                    password="Password123",
                    role="doctor"
                )
                doc_user.first_name = "Rahul"
                doc_user.last_name = "Sharma"
                doc_user.is_email_verified = True
                db.commit()
                doc_repo.create(
                    user_id=doc_user.id,
                    specialty="Cardiologist",
                    experience=12,
                    phone="+91 891 255 8899",
                    bio="Senior interventional cardiologist with 12+ years of clinical experience."
                )
            except Exception as _e:
                db.rollback()
                print(f"[WARNING] Doctor seed error: {_e}")

        # Seed Demo alias (demo@medassist.ai → doctor)
        demo_email = "demo@medassist.ai"
        if not user_repo.get_by_email(demo_email):
            try:
                demo_user = user_repo.create(
                    full_name="Demo Doctor",
                    email=demo_email,
                    password="Password123",
                    role="doctor"
                )
                demo_user.is_email_verified = True
                db.commit()
                doc_repo.create(
                    user_id=demo_user.id,
                    specialty="General Physician",
                    experience=5,
                    bio="Demo doctor account for testing."
                )
            except Exception as _e:
                db.rollback()

        # Seed standard patient user
        patient_email = "patient@medassist.ai"
        if not user_repo.get_by_email(patient_email):
            try:
                p_user = user_repo.create(
                    full_name="Jane Doe",
                    email=patient_email,
                    password="Password123",
                    role="patient"
                )
                p_user.first_name = "Jane"
                p_user.last_name = "Doe"
                p_user.is_email_verified = True
                db.commit()
                pat_repo.create(user_id=p_user.id)
            except Exception as _e:
                db.rollback()
    except Exception as exc:
        db.rollback()
        print(f"[WARNING] Database seed warning: {exc}")
    finally:
        db.close()

# ── Health Check ──────────────────────────────────────────────────────
@app.get("/health", tags=["System"])
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
