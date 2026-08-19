from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.doctor_schema import DoctorResponse, DoctorUpdate, DoctorAccountCreate
from app.services.doctor_service import (
    get_doctor_by_user_id,
    get_doctor_by_id,
    create_doctor_account,
    update_doctor_profile,
    get_all_doctors,
)
from app.utils.auth_handler import get_current_user
from app.utils.role_checker import require_role

router = APIRouter(
    prefix="/doctor",
    tags=["Doctor Operations"],
)


@router.get(
    "/profile",
    response_model=DoctorResponse,
    summary="Get current doctor profile",
)
def get_doctor_profile(
    current_user: User = Depends(require_role("doctor")),
    db: Session = Depends(get_db),
):
    return get_doctor_by_user_id(db, current_user.id)


@router.put(
    "/profile",
    response_model=DoctorResponse,
    summary="Update current doctor profile & availability",
)
def update_profile(
    update_data: DoctorUpdate,
    current_user: User = Depends(require_role("doctor")),
    db: Session = Depends(get_db),
):
    return update_doctor_profile(db, current_user, update_data)


@router.get(
    "/all",
    response_model=List[DoctorResponse],
    summary="Get list of all doctors (Accessible to all authenticated users)",
)
def list_doctors(
    available_only: bool = False,
    skip: int = 0,
    limit: int = 100,
    search: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_all_doctors(
        db, available_only=available_only, skip=skip, limit=limit, search=search
    )


@router.post(
    "",
    response_model=DoctorResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new doctor account (Admin only)",
)
def create_doctor(
    data: DoctorAccountCreate,
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    return create_doctor_account(db, data)
