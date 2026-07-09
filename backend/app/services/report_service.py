from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.report import Report
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.schemas.report_schema import ReportCreate, ReportUpdate


def _is_admin(current_user: dict) -> bool:
    return current_user.get("role") == "admin"


def _owns_report(current_user: dict, report: Report) -> bool:
    role = current_user.get("role")
    uid = current_user.get("id")

    if role == "patient" and report.patient.user_id == uid:
        return True
    if role == "doctor" and report.doctor_id is not None and report.doctor.user_id == uid:
        return True
    return False


def _get_report_or_404(db: Session, report_id: int) -> Report:
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


def create_report(db: Session, report: ReportCreate, current_user: dict):
    patient = db.query(Patient).filter(Patient.id == report.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    if report.doctor_id is not None:
        doctor = db.query(Doctor).filter(Doctor.id == report.doctor_id).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")

    if not _is_admin(current_user):
        role = current_user.get("role")
        if role == "patient" and patient.user_id != current_user.get("id"):
            raise HTTPException(
                status_code=403,
                detail="You can only create a report for your own patient profile"
            )
        if role == "doctor" and report.doctor_id is not None and doctor.user_id != current_user.get("id"):
            raise HTTPException(
                status_code=403,
                detail="You can only create a report under your own doctor profile"
            )

    db_report = Report(**report.model_dump())
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report


def get_report(db: Session, report_id: int, current_user: dict):
    report = _get_report_or_404(db, report_id)

    if _is_admin(current_user) or _owns_report(current_user, report):
        return report

    raise HTTPException(status_code=403, detail="Access denied")


def get_all_reports(db: Session, skip: int, limit: int, current_user: dict):
    if not _is_admin(current_user):
        raise HTTPException(status_code=403, detail="Admin access required")

    return db.query(Report).offset(skip).limit(limit).all()


def get_reports_by_patient(db: Session, patient_id: int, current_user: dict):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    if _is_admin(current_user):
        return db.query(Report).filter(Report.patient_id == patient_id).all()

    if current_user.get("role") == "patient" and patient.user_id == current_user.get("id"):
        return db.query(Report).filter(Report.patient_id == patient_id).all()

    if current_user.get("role") == "doctor":
        return (
            db.query(Report)
            .join(Doctor, Report.doctor_id == Doctor.id)
            .filter(Report.patient_id == patient_id, Doctor.user_id == current_user.get("id"))
            .all()
        )

    raise HTTPException(status_code=403, detail="Access denied")


def update_report(db: Session, report_id: int, report_update: ReportUpdate, current_user: dict):
    report = _get_report_or_404(db, report_id)

    if not _is_admin(current_user) and not _owns_report(current_user, report):
        raise HTTPException(status_code=403, detail="Access denied")

    for field, value in report_update.model_dump(exclude_unset=True).items():
        setattr(report, field, value)

    db.commit()
    db.refresh(report)
    return report


def delete_report(db: Session, report_id: int, current_user: dict):
    report = _get_report_or_404(db, report_id)

    if not _is_admin(current_user) and not _owns_report(current_user, report):
        raise HTTPException(status_code=403, detail="Access denied")

    db.delete(report)
    db.commit()
    return {"message": "Report deleted successfully"}
