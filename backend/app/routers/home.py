from fastapi import APIRouter, Depends

from app.utils.auth_handler import verify_token
from app.utils.role_checker import require_role

router = APIRouter()


@router.get("/")
def home(user=Depends(verify_token)):
    return {
        "message": "Welcome to MedAssistAI Backend",
        "logged_in_user": user
    }


@router.get("/patient/dashboard")
def patient_dashboard(user=Depends(require_role("patient"))):
    return {
        "message": "Welcome Patient",
        "user": user
    }


@router.get("/doctor/dashboard")
def doctor_dashboard(user=Depends(require_role("doctor"))):
    return {
        "message": "Welcome Doctor",
        "user": user
    }


@router.get("/admin/dashboard")
def admin_dashboard(user=Depends(require_role("admin"))):
    return {
        "message": "Welcome Admin",
        "user": user
    }