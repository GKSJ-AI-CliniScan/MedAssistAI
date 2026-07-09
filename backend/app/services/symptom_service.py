from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.symptom import Symptom
from app.models.patient import Patient
from app.schemas.symptom_schema import SymptomCreate, SymptomUpdate

VALID_SEVERITIES = {"mild", "moderate", "severe"}


def _is_admin(current_user: dict) -> bool:
    return current_user.get("role") == "admin"


def _get_symptom_or_404(db: Session, symptom_id: int) -> Symptom:
    symptom = db.query(Symptom).filter(Symptom.id == symptom_id).first()
    if not symptom:
        raise HTTPException(status_code=404, detail="Symptom record not found")
    return symptom


def submit_symptoms(db: Session, data: SymptomCreate, current_user: dict):
    patient = db.query(Patient).filter(Patient.id == data.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Patient can only submit symptoms for their own profile
    if not _is_admin(current_user) and patient.user_id != current_user.get("id"):
        raise HTTPException(
            status_code=403,
            detail="You can only submit symptoms for your own patient profile"
        )

    if data.severity and data.severity not in VALID_SEVERITIES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid severity. Must be one of: {VALID_SEVERITIES}"
        )

    db_symptom = Symptom(**data.model_dump())
    db.add(db_symptom)
    db.commit()
    db.refresh(db_symptom)
    return db_symptom


def get_symptom(db: Session, symptom_id: int, current_user: dict):
    symptom = _get_symptom_or_404(db, symptom_id)

    if _is_admin(current_user):
        return symptom
    if symptom.patient.user_id == current_user.get("id"):
        return symptom

    raise HTTPException(status_code=403, detail="Access denied")


def get_symptoms_by_patient(db: Session, patient_id: int, current_user: dict):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    if not _is_admin(current_user) and patient.user_id != current_user.get("id"):
        raise HTTPException(status_code=403, detail="Access denied")

    return db.query(Symptom).filter(Symptom.patient_id == patient_id).all()


def get_all_symptoms(db: Session, skip: int = 0, limit: int = 100, current_user: dict = None):
    if not _is_admin(current_user):
        raise HTTPException(status_code=403, detail="Admin access required")
    return db.query(Symptom).offset(skip).limit(limit).all()


def update_symptom(db: Session, symptom_id: int, data: SymptomUpdate, current_user: dict):
    symptom = _get_symptom_or_404(db, symptom_id)

    if not _is_admin(current_user) and symptom.patient.user_id != current_user.get("id"):
        raise HTTPException(status_code=403, detail="You can only update your own symptoms")

    if data.severity and data.severity not in VALID_SEVERITIES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid severity. Must be one of: {VALID_SEVERITIES}"
        )

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(symptom, field, value)
    db.commit()
    db.refresh(symptom)
    return symptom


def delete_symptom(db: Session, symptom_id: int, current_user: dict):
    symptom = _get_symptom_or_404(db, symptom_id)

    if not _is_admin(current_user) and symptom.patient.user_id != current_user.get("id"):
        raise HTTPException(status_code=403, detail="You can only delete your own symptoms")

    db.delete(symptom)
    db.commit()
