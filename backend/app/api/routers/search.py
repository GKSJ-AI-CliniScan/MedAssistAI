"""
Global Search Router – Unified Search across Patients, Doctors, Reports, Predictions, and Appointments
"""
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models import User, Patient, Doctor, Report, Prediction, Appointment

router = APIRouter(prefix="/search", tags=["Global Search"])

@router.get("/", response_model=Dict[str, Any])
def global_search(
    q: str = Query(..., min_length=1, description="Search query string"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query_str = f"%{q.strip()}%"

    # Search Patients
    patients = (
        db.query(Patient, User)
        .join(User, Patient.user_id == User.id)
        .filter(User.full_name.ilike(query_str) | User.email.ilike(query_str))
        .limit(10)
        .all()
    )
    patient_results = [
        {
            "id": p.Patient.id,
            "title": p.User.full_name,
            "subtitle": f"Age {p.Patient.age} • {p.Patient.gender} • {p.User.email}",
            "type": "Patient",
            "url": "/profile",
        }
        for p in patients
    ]

    # Search Doctors
    doctors = (
        db.query(Doctor, User)
        .join(User, Doctor.user_id == User.id)
        .filter(User.full_name.ilike(query_str) | Doctor.specialty.ilike(query_str))
        .limit(10)
        .all()
    )
    doctor_results = [
        {
            "id": d.Doctor.id,
            "title": d.User.full_name,
            "subtitle": f"Specialty: {d.Doctor.specialty} • Experience: {d.Doctor.experience_years} yrs",
            "type": "Doctor",
            "url": "/appointments",
        }
        for d in doctors
    ]

    # Search Reports
    reports = (
        db.query(Report)
        .filter(Report.file_name.ilike(query_str) | Report.report_type.ilike(query_str))
        .limit(10)
        .all()
    )
    report_results = [
        {
            "id": r.id,
            "title": r.file_name,
            "subtitle": f"Type: {r.report_type} • Size: {r.size_kb} KB",
            "type": "Report",
            "url": "/reports",
        }
        for r in reports
    ]

    # Search Predictions
    predictions = (
        db.query(Prediction)
        .filter(Prediction.top_disease.ilike(query_str))
        .limit(10)
        .all()
    )
    prediction_results = [
        {
            "id": pred.id,
            "title": f"Prediction: {pred.top_disease}",
            "subtitle": f"Confidence: {round(pred.top_confidence * 100, 1)}%",
            "type": "Prediction",
            "url": "/prediction",
        }
        for pred in predictions
    ]

    # Search Appointments
    appointments = (
        db.query(Appointment)
        .filter(Appointment.doctor_name.ilike(query_str) | Appointment.notes.ilike(query_str))
        .limit(10)
        .all()
    )
    appointment_results = [
        {
            "id": appt.id,
            "title": f"Appointment: {appt.doctor_name}",
            "subtitle": f"Date/Time: {appt.date_time} • Status: {appt.status}",
            "type": "Appointment",
            "url": "/appointments",
        }
        for appt in appointments
    ]

    total_matches = len(patient_results) + len(doctor_results) + len(report_results) + len(prediction_results) + len(appointment_results)

    return {
        "query": q,
        "total": total_matches,
        "results": {
            "patients": patient_results,
            "doctors": doctor_results,
            "reports": report_results,
            "predictions": prediction_results,
            "appointments": appointment_results,
        },
    }
