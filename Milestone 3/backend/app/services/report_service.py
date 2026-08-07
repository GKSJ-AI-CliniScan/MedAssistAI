from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.report import Report
from app.models.patient import Patient
from app.models.user import User
from app.schemas.report_schema import ReportCreate, ReportUpdate
from app.services.patient_service import get_patient_by_user_id, get_patient_by_id


def create_report(db: Session, patient_id: int, data: ReportCreate) -> Report:
    patient = get_patient_by_id(db, patient_id)
    report = Report(
        patient_id=patient.id,
        predicted_disease=data.predicted_disease,
        confidence=data.confidence,
        risk_level=data.risk_level,
        severity_level=data.severity_level,
        severity_score=data.severity_score,
        emergency=data.emergency,
        symptoms_submitted=data.symptoms_submitted,
        recommendations=data.recommendations,
        doctor_notes=data.doctor_notes,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


def get_patient_reports(db: Session, user: User) -> List[Report]:
    patient = get_patient_by_user_id(db, user.id)
    return (
        db.query(Report)
        .filter(Report.patient_id == patient.id)
        .order_by(Report.created_at.desc())
        .all()
    )


def get_reports_by_patient_id(db: Session, patient_id: int) -> List[Report]:
    return (
        db.query(Report)
        .filter(Report.patient_id == patient_id)
        .order_by(Report.created_at.desc())
        .all()
    )


def get_report_by_id(db: Session, report_id: int) -> Report:
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report with ID #{report_id} not found",
        )
    return report


def update_report_notes(
    db: Session, report_id: int, user: User, data: ReportUpdate
) -> Report:
    report = get_report_by_id(db, report_id)

    if data.doctor_notes:
        report.doctor_notes = data.doctor_notes
    if data.recommendations:
        report.recommendations = data.recommendations

    db.commit()
    db.refresh(report)
    return report


def generate_printable_report_text(report: Report, patient_user: Optional[User] = None) -> str:
    """
    Generate clean, printable formatted medical text report for download.
    Always retrieves the patient information belonging to the report owner (Report -> Patient -> User).
    """
    # Retrieve report owner patient user from relationship
    if report.patient and report.patient.user:
        patient_owner = report.patient.user
    else:
        patient_owner = patient_user

    patient_name = patient_owner.fullname if patient_owner else f"Patient #{report.patient_id}"
    patient_email = patient_owner.email if patient_owner else "N/A"
    confidence_str = f"{report.confidence:.1f}%" if report.confidence is not None else "N/A"
    emergency_str = "YES (EMERGENCY)" if report.emergency else "NO"

    report_text = f"""
================================================================================
                         MEDASSISTAI MEDICAL HEALTH REPORT
================================================================================
Report Reference ID : #{report.id}
Date Generated      : {report.created_at.strftime('%Y-%m-%d %H:%M:%S') if report.created_at else 'N/A'}

--------------------------------------------------------------------------------
PATIENT INFORMATION
--------------------------------------------------------------------------------
Patient Name        : {patient_name}
Email               : {patient_email}
Patient ID          : #{report.patient_id}

--------------------------------------------------------------------------------
AI DISEASE PREDICTION RESULTS
--------------------------------------------------------------------------------
Predicted Disease   : {report.predicted_disease}
Prediction Confidence: {confidence_str}
Assessed Risk Level : {report.risk_level}
Symptom Severity    : {report.severity_level} (Score: {report.severity_score})
Emergency Detected  : {emergency_str}

Submitted Symptoms  : {report.symptoms_submitted}

--------------------------------------------------------------------------------
HEALTHCARE RECOMMENDATIONS & INSTRUCTIONS
--------------------------------------------------------------------------------
{report.recommendations or 'No specific recommendations recorded.'}

--------------------------------------------------------------------------------
DOCTOR EVALUATION & NOTES
--------------------------------------------------------------------------------
{report.doctor_notes or 'No doctor notes attached yet.'}

================================================================================
Disclaimer: MedAssistAI provides AI-generated health risk assessments for informational
purposes. Always consult a certified medical professional for formal clinical diagnosis.
================================================================================
"""
    return report_text.strip()
