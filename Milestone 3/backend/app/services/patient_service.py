from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.patient import Patient
from app.models.user import User
from app.schemas.patient_schema import PatientUpdate


def get_patient_by_user_id(db: Session, user_id: int) -> Patient:
    patient = db.query(Patient).filter(Patient.user_id == user_id).first()
    if not patient:
        # Auto-create patient profile if missing
        patient = Patient(user_id=user_id)
        db.add(patient)
        db.commit()
        db.refresh(patient)
    return patient


def get_patient_by_id(db: Session, patient_id: int) -> Optional[Patient]:
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient record with ID {patient_id} not found",
        )
    return patient


def update_patient_profile(
    db: Session, user: User, update_data: PatientUpdate
) -> Patient:
    patient = get_patient_by_user_id(db, user.id)

    update_dict = update_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(patient, field, value)

    db.commit()
    db.refresh(patient)
    return patient


def get_all_patients(db: Session, skip: int = 0, limit: int = 100) -> List[Patient]:
    return db.query(Patient).offset(skip).limit(limit).all()
