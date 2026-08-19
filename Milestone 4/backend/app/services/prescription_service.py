from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.models.prescription import Prescription
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.user import User
from app.schemas.prescription_schema import PrescriptionCreate, PrescriptionUpdate
from app.services.patient_service import get_patient_by_user_id


def _prescription_query(db: Session):
    return db.query(Prescription).options(
        joinedload(Prescription.doctor).joinedload(Doctor.user),
        joinedload(Prescription.patient).joinedload(Patient.user),
    )


def create_prescription(db: Session, doctor_id: int, data: PrescriptionCreate) -> Prescription:
    # Verify patient exists
    patient = db.query(Patient).filter(Patient.id == data.patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID {data.patient_id} not found",
        )

    # Verify doctor exists
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Doctor with ID {doctor_id} not found",
        )

    prescription = Prescription(
        patient_id=data.patient_id,
        doctor_id=doctor_id,
        medicine=data.medicine,
        dosage=data.dosage,
        frequency=data.frequency,
        duration=data.duration,
        instructions=data.instructions,
        status="active",
    )

    db.add(prescription)
    db.commit()
    db.refresh(prescription)
    return _prescription_query(db).filter(Prescription.id == prescription.id).first()


def get_patient_prescriptions(db: Session, patient_id: int) -> List[Prescription]:
    return (
        _prescription_query(db)
        .filter(Prescription.patient_id == patient_id)
        .order_by(Prescription.created_at.desc())
        .all()
    )


def get_doctor_prescriptions(db: Session, doctor_id: int) -> List[Prescription]:
    return (
        _prescription_query(db)
        .filter(Prescription.doctor_id == doctor_id)
        .order_by(Prescription.created_at.desc())
        .all()
    )


def get_all_prescriptions(db: Session) -> List[Prescription]:
    return _prescription_query(db).order_by(Prescription.created_at.desc()).all()


def update_prescription(db: Session, prescription_id: int, data: PrescriptionUpdate) -> Prescription:
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prescription with ID {prescription_id} not found",
        )

    update_dict = data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(prescription, field, value)

    db.commit()
    db.refresh(prescription)
    return _prescription_query(db).filter(Prescription.id == prescription.id).first()
