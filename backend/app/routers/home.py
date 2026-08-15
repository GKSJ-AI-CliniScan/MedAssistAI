from fastapi import APIRouter, Depends
from typing import Optional

from app.config.settings import settings
from app.utils.auth_handler import verify_token
from app.utils.role_checker import require_role

router = APIRouter(tags=["Home & Health"])


@router.get(
    "/",
    summary="Public Root & System Status",
)
def home():
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "status": "healthy",
        "version": settings.APP_VERSION,
        "docs_url": "/docs",
    }


@router.get(
    "/health",
    summary="Service Health Check",
)
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }


@router.get(
    "/patient/dashboard",
    summary="Patient Dashboard",
)
def patient_dashboard(user=Depends(require_role("patient"))):
    return {
        "message": f"Welcome Patient {user.fullname}",
        "user_id": user.id,
        "role": user.role,
    }


@router.get(
    "/doctor/dashboard",
    summary="Doctor Dashboard",
)
def doctor_dashboard(user=Depends(require_role("doctor"))):
    return {
        "message": f"Welcome Doctor {user.fullname}",
        "user_id": user.id,
        "role": user.role,
    }


@router.get(
    "/admin/dashboard",
    summary="Admin Dashboard",
)
def admin_dashboard(user=Depends(require_role("admin"))):
    return {
        "message": f"Welcome Admin {user.fullname}",
        "user_id": user.id,
        "role": user.role,
    }