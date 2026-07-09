from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.patient import Patient
from app.schemas.patient_schema import PatientCreate, PatientUpdate


def _is_admin(current_user: dict) -> bool:
    return current_user.get("role") == "admin"


def _is_self(current_user: dict, target_user_id: int) -> bool:
    return current_user.get("id") == target_user_id


def _get_patient_or_404(db: Session, patient_id: int) -> Patient:
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


def create_patient(db: Session, patient: PatientCreate, current_user: dict):
    # user_id always comes from the verified JWT token
    user_id = current_user.get("id")

    existing_patient = db.query(Patient).filter(Patient.user_id == user_id).first()
    if existing_patient:
        raise HTTPException(status_code=409, detail="Patient profile already exists for this user")

    db_patient = Patient(user_id=user_id, **patient.model_dump())
    db.add(db_patient)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="A patient with this phone number already exists"
        )

    db.refresh(db_patient)
    return db_patient


def get_patient(db: Session, patient_id: int, current_user: dict):
    patient = _get_patient_or_404(db, patient_id)

    if _is_admin(current_user):
        return patient

    if _is_self(current_user, patient.user_id):
        return patient

    if current_user.get("role") == "doctor":
        treated_by_doctor = any(
            appt.doctor and appt.doctor.user_id == current_user.get("id")
            for appt in patient.appointments
        )
        if treated_by_doctor:
            return patient

    raise HTTPException(status_code=403, detail="Access denied")


def get_all_patients(db: Session, skip: int, limit: int, current_user: dict):
    if not _is_admin(current_user):
        raise HTTPException(status_code=403, detail="Admin access required")
    return db.query(Patient).offset(skip).limit(limit).all()


def update_patient(db: Session, patient_id: int, patient_update: PatientUpdate, current_user: dict):
    patient = _get_patient_or_404(db, patient_id)

    if not _is_admin(current_user) and not _is_self(current_user, patient.user_id):
        raise HTTPException(status_code=403, detail="You can only update your own patient profile")

    update_data = patient_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(patient, field, value)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="A patient with this phone number already exists"
        )

    db.refresh(patient)
    return patient


def delete_patient(db: Session, patient_id: int, current_user: dict):
    patient = _get_patient_or_404(db, patient_id)

    if not _is_admin(current_user) and not _is_self(current_user, patient.user_id):
        raise HTTPException(status_code=403, detail="You can only delete your own patient profile")

    db.delete(patient)
    db.commit()
