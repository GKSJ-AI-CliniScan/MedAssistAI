from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.patient_schema import PatientResponse, PatientUpdate
from app.services.patient_service import (
    get_patient_by_user_id,
    update_patient_profile,
    get_all_patients,
)
from app.utils.auth_handler import get_current_user
from app.utils.role_checker import require_role, require_roles

router = APIRouter(
    prefix="/patient",
    tags=["Patient Operations"],
)


@router.get(
    "/profile",
    response_model=PatientResponse,
    summary="Get current patient profile",
)
def get_patient_profile(
    current_user: User = Depends(require_role("patient")),
    db: Session = Depends(get_db),
):
    return get_patient_by_user_id(db, current_user.id)


@router.put(
    "/profile",
    response_model=PatientResponse,
    summary="Update current patient profile",
)
def update_profile(
    update_data: PatientUpdate,
    current_user: User = Depends(require_role("patient")),
    db: Session = Depends(get_db),
):
    return update_patient_profile(db, current_user, update_data)


@router.get(
    "/all",
    response_model=List[PatientResponse],
    summary="Get list of all patients (Doctor or Admin only)",
)
def list_patients(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(require_roles("doctor", "admin")),
    db: Session = Depends(get_db),
):
    return get_all_patients(db, skip=skip, limit=limit)
