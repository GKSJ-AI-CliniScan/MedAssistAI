"""
Admin Dashboard Router

Provides system-level endpoints for user management, statistics,
audit logs, and platform-wide administration.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.api.deps import require_role
from app.repositories import UserRepository, PatientRepository
from app.repositories.doctor_repository import DoctorRepository
from app.repositories.appointment_repository import AppointmentRepository
from app.repositories.prediction_repository import PredictionRepository
from app.models.user import User
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.appointment import Appointment
from app.models.prediction import Prediction
from app.models.audit_log import AuditLog
from app.schemas import UserResponse

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats")
def get_system_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Get platform-wide statistics. Admin only."""
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_patients = db.query(func.count(Patient.id)).scalar() or 0
    total_doctors = db.query(func.count(Doctor.id)).scalar() or 0
    total_appointments = db.query(func.count(Appointment.id)).scalar() or 0
    total_predictions = db.query(func.count(Prediction.id)).scalar() or 0
    active_users = db.query(func.count(User.id)).filter(User.is_active == True).scalar() or 0

    return {
        "total_users": total_users,
        "total_patients": total_patients,
        "total_doctors": total_doctors,
        "total_appointments": total_appointments,
        "total_predictions": total_predictions,
        "active_users": active_users,
    }


@router.get("/users", response_model=List[UserResponse])
def list_all_users(
    role: Optional[str] = Query(None, description="Filter by role (patient, doctor, admin)"),
    search: Optional[str] = Query(None, description="Search by name or email"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """List all users with optional filtering. Admin only."""
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    if search:
        query = query.filter(
            (User.full_name.ilike(f"%{search}%")) | (User.email.ilike(f"%{search}%"))
        )
    users = query.offset(skip).limit(limit).all()
    return users


@router.get("/users/{user_id}", response_model=UserResponse)
def get_user_detail(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Get detailed user information. Admin only."""
    user_repo = UserRepository(db)
    user = user_repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user


@router.put("/users/{user_id}/activate", response_model=UserResponse)
def activate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Activate a user account. Admin only."""
    user_repo = UserRepository(db)
    user = user_repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    user.is_active = True
    db.commit()
    db.refresh(user)
    return user


@router.put("/users/{user_id}/deactivate", response_model=UserResponse)
def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Deactivate a user account. Admin only."""
    user_repo = UserRepository(db)
    user = user_repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot deactivate your own account.")
    user.is_active = False
    db.commit()
    db.refresh(user)
    return user


@router.put("/users/{user_id}/role")
def change_user_role(
    user_id: int,
    new_role: str = Query(..., description="New role: patient, doctor, or admin"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Change a user's role. Admin only."""
    valid_roles = ["patient", "doctor", "admin"]
    if new_role not in valid_roles:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid role. Must be one of: {', '.join(valid_roles)}",
        )
    user_repo = UserRepository(db)
    user = user_repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    user.role = new_role
    db.commit()
    db.refresh(user)
    return {"message": f"User role updated to '{new_role}'", "user_id": user.id}


@router.delete("/users/{user_id}", status_code=204)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Permanently delete a user. Admin only."""
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account.")
    user_repo = UserRepository(db)
    user = user_repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    db.delete(user)
    db.commit()


@router.get("/audit-logs")
def get_audit_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Retrieve audit log entries. Admin only."""
    logs = db.query(AuditLog).order_by(AuditLog.id.desc()).offset(skip).limit(limit).all()
    return [
        {
            "id": log.id,
            "user_id": log.user_id,
            "action": log.action,
            "endpoint": log.endpoint,
            "ip_address": log.ip_address,
            "timestamp": str(log.timestamp) if log.timestamp else None,
        }
        for log in logs
    ]
