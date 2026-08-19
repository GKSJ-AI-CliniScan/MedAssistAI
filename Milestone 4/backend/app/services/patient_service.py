from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.models.patient import Patient
from app.models.user import User
from app.models.doctor import Doctor
from app.models.report import Report
from app.models.appointment import Appointment
from app.models.prescription import Prescription
from app.schemas.patient_schema import PatientUpdate


def get_patient_by_user_id(db: Session, user_id: int) -> Patient:
    patient = db.query(Patient).options(joinedload(Patient.user)).filter(Patient.user_id == user_id).first()
    if not patient:
        # Auto-create patient profile if missing
        patient = Patient(user_id=user_id)
        db.add(patient)
        db.commit()
        db.refresh(patient)
        patient = db.query(Patient).options(joinedload(Patient.user)).filter(Patient.user_id == user_id).first()
    return patient


def get_patient_by_id(db: Session, patient_id: int) -> Patient:
    patient = db.query(Patient).options(joinedload(Patient.user)).filter(Patient.id == patient_id).first()
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
    return db.query(Patient).options(joinedload(Patient.user)).filter(Patient.id == patient.id).first()


def get_all_patients(db: Session, skip: int = 0, limit: int = 100, search: str = None) -> List[Patient]:
    query = db.query(Patient).options(joinedload(Patient.user))
    if search:
        search_term = search.strip()
        query = query.join(User).filter(
            (User.fullname.ilike(f"%{search_term}%")) | 
            (User.email.ilike(f"%{search_term}%"))
        )
    return query.offset(skip).limit(limit).all()


def get_patient_history_data(db: Session, patient_id: int) -> dict:
    """Get complete patient history including reports, appointments with doctor details, and prescriptions"""
    patient = get_patient_by_id(db, patient_id)

    # Get reports
    reports = (
        db.query(Report)
        .filter(Report.patient_id == patient_id)
        .order_by(Report.created_at.desc())
        .all()
    )

    # Get appointments with doctor details
    appointments = (
        db.query(Appointment)
        .options(joinedload(Appointment.doctor).joinedload(Doctor.user))
        .filter(Appointment.patient_id == patient_id)
        .order_by(Appointment.appointment_date.desc())
        .all()
    )

    # Get prescriptions with doctor details
    prescriptions = (
        db.query(Prescription)
        .options(joinedload(Prescription.doctor).joinedload(Doctor.user))
        .filter(Prescription.patient_id == patient_id)
        .order_by(Prescription.created_at.desc())
        .all()
    )

    return {
        "patient": {
            "id": patient.id,
            "fullname": patient.user.fullname if patient.user else "Unknown Patient",
            "email": patient.user.email if patient.user else "N/A",
            "age": patient.age,
            "gender": patient.gender,
            "blood_group": patient.blood_group,
            "contact_number": patient.contact_number,
            "address": patient.address,
            "medical_history": patient.medical_history,
            "created_at": patient.created_at,
        },
        "reports": [
            {
                "id": report.id,
                "predicted_disease": report.predicted_disease,
                "confidence": report.confidence,
                "risk_level": report.risk_level,
                "severity_level": report.severity_level,
                "severity_score": report.severity_score,
                "emergency": report.emergency,
                "recommendations": report.recommendations,
                "doctor_notes": report.doctor_notes,
                "created_at": report.created_at,
                "symptoms_submitted": report.symptoms_submitted,
            }
            for report in reports
        ],
        "appointments": [
            {
                "id": apt.id,
                "doctor_id": apt.doctor_id,
                "doctor_name": apt.doctor.user.fullname if apt.doctor and apt.doctor.user else f"Doctor #{apt.doctor_id}",
                "specialization": apt.doctor.specialization if apt.doctor else "General Medicine",
                "appointment_date": apt.appointment_date,
                "reason": apt.reason,
                "status": apt.status,
                "notes": apt.notes,
                "created_at": apt.created_at,
            }
            for apt in appointments
        ],
        "prescriptions": [
            {
                "id": rx.id,
                "doctor_id": rx.doctor_id,
                "doctor_name": rx.doctor.user.fullname if rx.doctor and rx.doctor.user else f"Doctor #{rx.doctor_id}",
                "medicine": rx.medicine,
                "dosage": rx.dosage,
                "frequency": rx.frequency,
                "duration": rx.duration,
                "instructions": rx.instructions,
                "status": rx.status,
                "created_at": rx.created_at,
            }
            for rx in prescriptions
        ],
        "total_reports": len(reports),
        "total_appointments": len(appointments),
        "total_prescriptions": len(prescriptions),
    }
