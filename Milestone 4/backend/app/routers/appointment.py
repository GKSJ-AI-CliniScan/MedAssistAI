from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.appointment_schema import (
    AppointmentCreate,
    AppointmentResponse,
    AppointmentStatusUpdate,
)
from app.services.appointment_service import (
    create_appointment,
    get_patient_appointments,
    get_doctor_appointments,
    update_appointment_status,
    get_all_appointments,
    get_appointment_by_id,
)
from app.utils.auth_handler import get_current_user
from app.utils.role_checker import require_roles

router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"],
)


@router.post(
    "",
    response_model=AppointmentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Schedule a new appointment (Patient, Doctor, Admin)",
)
def schedule_appointment(
    data: AppointmentCreate,
    current_user: User = Depends(require_roles("patient", "doctor", "admin")),
    db: Session = Depends(get_db),
):
    return create_appointment(db, current_user, data)


@router.get(
    "/my",
    response_model=List[AppointmentResponse],
    summary="Get my appointments (Patient, Doctor, Admin)",
)
def get_my_appointments(
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role == "patient":
        return get_patient_appointments(db, current_user)
    elif current_user.role == "doctor":
        return get_doctor_appointments(db, current_user, status_filter=status)
    else:
        return get_all_appointments(db, status=status)


@router.put(
    "/{id}/status",
    response_model=AppointmentResponse,
    summary="Update appointment status (Doctor, Patient, Admin)",
)
def update_status(
    id: int,
    data: AppointmentStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return update_appointment_status(db, id, current_user, data)


@router.get(
    "",
    response_model=List[AppointmentResponse],
    summary="Get all appointments (Admin, Doctor)",
)
@router.get(
    "/all",
    response_model=List[AppointmentResponse],
    summary="Get all appointments (Admin, Doctor)",
)
def list_all_appointments(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    current_user: User = Depends(require_roles("admin", "doctor")),
    db: Session = Depends(get_db),
):
    return get_all_appointments(db, skip=skip, limit=limit, status=status)


@router.get(
    "/{id}",
    response_model=AppointmentResponse,
    summary="Get appointment details",
)
def get_appointment_details(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_appointment_by_id(db, id, current_user)
