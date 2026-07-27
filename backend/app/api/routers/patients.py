"""
Patient & Medical History Router
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.repositories import PatientRepository
from app.schemas import PatientUpdate, PatientResponse, MedicalHistoryCreate, MedicalHistoryResponse
from app.models.user import User

router = APIRouter(prefix="/patients", tags=["Patients"])


def _get_patient_or_404(user: User, db: Session):
    repo = PatientRepository(db)
    patient = repo.get_by_user_id(user.id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found. Please complete registration.")
    return patient


@router.get("/me", response_model=PatientResponse)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return _get_patient_or_404(current_user, db)


@router.put("/me", response_model=PatientResponse)
def update_my_profile(
    payload: PatientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    patient = _get_patient_or_404(current_user, db)
    repo = PatientRepository(db)
    updated = repo.update(patient, payload.model_dump(exclude_none=True))
    return updated


@router.get("/me/medical-history", response_model=List[MedicalHistoryResponse])
def get_medical_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    patient = _get_patient_or_404(current_user, db)
    repo = PatientRepository(db)
    return repo.get_medical_histories(patient.id)


@router.post("/me/medical-history", response_model=MedicalHistoryResponse, status_code=201)
def add_medical_history(
    payload: MedicalHistoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    patient = _get_patient_or_404(current_user, db)
    repo = PatientRepository(db)
    return repo.add_medical_history(patient.id, payload.model_dump())


@router.delete("/me/medical-history/{history_id}", status_code=204)
def delete_medical_history(
    history_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    patient = _get_patient_or_404(current_user, db)
    repo = PatientRepository(db)
    deleted = repo.delete_medical_history(history_id, patient.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Medical history entry not found")
