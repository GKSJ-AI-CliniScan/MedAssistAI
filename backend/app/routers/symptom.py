from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.schemas.symptom_schema import SymptomCreate, SymptomUpdate, SymptomResponse
from app.services.symptom_service import (
    submit_symptoms, get_symptom, get_symptoms_by_patient,
    get_all_symptoms, update_symptom, delete_symptom,
)
from app.utils.auth_handler import verify_token

router = APIRouter(prefix="/symptoms", tags=["Symptoms"])


@router.post("/", response_model=SymptomResponse, status_code=201)
def collect_symptoms(
    data: SymptomCreate,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    """Patient submits their symptoms for analysis"""
    return submit_symptoms(db, data, current_user)


@router.get("/", response_model=List[SymptomResponse])
def list_all_symptoms(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    return get_all_symptoms(db, skip, limit, current_user)


@router.get("/patient/{patient_id}", response_model=List[SymptomResponse])
def list_symptoms_by_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    return get_symptoms_by_patient(db, patient_id, current_user)


@router.get("/{symptom_id}", response_model=SymptomResponse)
def get_symptom_by_id(
    symptom_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    return get_symptom(db, symptom_id, current_user)


@router.put("/{symptom_id}", response_model=SymptomResponse)
def edit_symptom(
    symptom_id: int,
    data: SymptomUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    return update_symptom(db, symptom_id, data, current_user)


@router.delete("/{symptom_id}", status_code=204)
def remove_symptom(
    symptom_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    delete_symptom(db, symptom_id, current_user)
    return Response(status_code=204)
