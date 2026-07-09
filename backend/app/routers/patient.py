from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.schemas.patient_schema import PatientCreate, PatientUpdate, PatientResponse
from app.services.patient_service import (
    create_patient, get_patient, get_all_patients, update_patient, delete_patient,
)
from app.utils.auth_handler import verify_token

router = APIRouter(prefix="/patients", tags=["Patients"])


@router.post("/", response_model=PatientResponse, status_code=201)
def add_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    return create_patient(db, patient, current_user)


@router.get("/", response_model=List[PatientResponse])
def list_patients(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    return get_all_patients(db, skip, limit, current_user)


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient_by_id(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    return get_patient(db, patient_id, current_user)


@router.put("/{patient_id}", response_model=PatientResponse)
def edit_patient(
    patient_id: int,
    patient_update: PatientUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    return update_patient(db, patient_id, patient_update, current_user)


@router.delete("/{patient_id}", status_code=204)
def remove_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    delete_patient(db, patient_id, current_user)
    return Response(status_code=204)
