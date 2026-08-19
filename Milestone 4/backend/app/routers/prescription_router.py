from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.prescription_schema import (
    PrescriptionCreate,
    PrescriptionResponse,
    PrescriptionUpdate,
)
from app.services.prescription_service import (
    create_prescription,
    get_patient_prescriptions,
    get_doctor_prescriptions,
    get_all_prescriptions,
    update_prescription,
)
from app.services.patient_service import get_patient_by_user_id
from app.utils.auth_handler import get_current_user
from app.utils.role_checker import require_role, require_roles

router = APIRouter(
    prefix="/prescriptions",
    tags=["Prescriptions"],
)


@router.post(
    "",
    response_model=PrescriptionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new prescription (Doctor)",
)
def create_new_prescription(
    data: PrescriptionCreate,
    current_user: User = Depends(require_role("doctor")),
    db: Session = Depends(get_db),
):
    from app.services.doctor_service import get_doctor_by_user_id
    doctor = get_doctor_by_user_id(db, current_user.id)
    return create_prescription(db, doctor.id, data)


@router.get(
    "/patient/{patient_id}",
    response_model=List[PrescriptionResponse],
    summary="Get prescriptions for a specific patient (Doctor, Admin, or Patient)",
)
def get_prescriptions_for_patient(
    patient_id: int,
    current_user: User = Depends(require_roles("doctor", "admin", "patient")),
    db: Session = Depends(get_db),
):
    return get_patient_prescriptions(db, patient_id)


@router.get(
    "/my",
    response_model=List[PrescriptionResponse],
    summary="Get prescriptions for current user (Patient gets own, Doctor gets authored, Admin gets all)",
)
def get_my_prescriptions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role == "patient":
        patient = get_patient_by_user_id(db, current_user.id)
        return get_patient_prescriptions(db, patient.id)
    elif current_user.role == "doctor":
        from app.services.doctor_service import get_doctor_by_user_id
        doctor = get_doctor_by_user_id(db, current_user.id)
        return get_doctor_prescriptions(db, doctor.id)
    else:
        return get_all_prescriptions(db)


@router.put(
    "/{id}",
    response_model=PrescriptionResponse,
    summary="Update prescription status or instructions (Doctor, Admin)",
)
def update_prescription_endpoint(
    id: int,
    data: PrescriptionUpdate,
    current_user: User = Depends(require_roles("doctor", "admin")),
    db: Session = Depends(get_db),
):
    return update_prescription(db, id, data)
