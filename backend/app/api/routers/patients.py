"""
Patient & Medical History Router – Full Patient Management CRUD & Personal Health Record Sync
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.repositories import PatientRepository, UserRepository
from app.schemas import PatientUpdate, PatientResponse, MedicalHistoryCreate, MedicalHistoryResponse
from app.models.user import User
from app.models.patient import Patient

router = APIRouter(prefix="/patients", tags=["Patients"])

def _get_patient_or_404(user: User, db: Session):
    repo = PatientRepository(db)
    patient = repo.get_by_user_id(user.id)
    if not patient:
        patient = repo.create(user_id=user.id)
    return patient

@router.get("/", response_model=List[dict])
def list_patients(
    search: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Patient, User).join(User, Patient.user_id == User.id)
    if search:
        s = f"%{search.strip()}%"
        query = query.filter(User.full_name.ilike(s) | User.email.ilike(s) | Patient.gender.ilike(s))
    
    results = query.order_by(Patient.created_at.desc()).offset(offset).limit(limit).all()
    
    return [
        {
            "id": p.Patient.id,
            "user_id": p.User.id,
            "full_name": p.User.full_name,
            "email": p.User.email,
            "age": p.Patient.age,
            "gender": p.Patient.gender,
            "blood_type": p.Patient.blood_type,
            "height": p.Patient.height,
            "weight": p.Patient.weight,
            "bmi": p.Patient.bmi,
            "smoking": p.Patient.smoking,
            "alcohol": p.Patient.alcohol,
            "bp_systolic": p.Patient.bp_systolic,
            "bp_diastolic": p.Patient.bp_diastolic,
            "fasting_sugar": p.Patient.fasting_sugar,
            "emergency_contact": p.Patient.emergency_contact,
            "allergies": p.Patient.allergies,
            "created_at": p.Patient.created_at.isoformat() if p.Patient.created_at else None,
        }
        for p in results
    ]

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

@router.get("/{patient_id}", response_model=dict)
def get_patient_by_id(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    user = db.query(User).filter(User.id == patient.user_id).first()
    return {
        "id": patient.id,
        "full_name": user.full_name if user else "Patient",
        "email": user.email if user else "",
        "age": patient.age,
        "gender": patient.gender,
        "blood_type": patient.blood_type,
        "height": patient.height,
        "weight": patient.weight,
        "bp_systolic": patient.bp_systolic,
        "bp_diastolic": patient.bp_diastolic,
        "fasting_sugar": patient.fasting_sugar,
        "emergency_contact": patient.emergency_contact,
        "allergies": patient.allergies,
    }

@router.delete("/{patient_id}", status_code=204)
def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in ["doctor", "admin"]:
        raise HTTPException(status_code=403, detail="Only clinical doctors or administrators can remove patient records")
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient record not found")
    db.delete(patient)
    db.commit()
