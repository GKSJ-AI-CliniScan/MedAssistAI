from typing import Dict, Any
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.appointment import Appointment
from app.models.report import Report


def get_system_analytics_summary(db: Session) -> Dict[str, Any]:
    total_users = db.query(User).count()
    total_patients = db.query(Patient).count()
    total_doctors = db.query(Doctor).count()
    total_appointments = db.query(Appointment).count()
    total_reports = db.query(Report).count()
    total_emergencies = db.query(Report).filter(Report.emergency == True).count()

    # Appointment status breakdown
    status_counts = (
        db.query(Appointment.status, func.count(Appointment.id))
        .group_by(Appointment.status)
        .all()
    )
    appointment_stats = {status: count for status, count in status_counts}

    # Risk level breakdown
    risk_counts = (
        db.query(Report.risk_level, func.count(Report.id))
        .group_by(Report.risk_level)
        .all()
    )
    risk_stats = {risk: count for risk, count in risk_counts}

    return {
        "overview": {
            "total_users": total_users,
            "total_patients": total_patients,
            "total_doctors": total_doctors,
            "total_appointments": total_appointments,
            "total_reports": total_reports,
            "total_emergency_alerts": total_emergencies,
        },
        "appointments_by_status": appointment_stats,
        "reports_by_risk_level": risk_stats,
    }


def get_disease_distribution_stats(db: Session) -> Dict[str, Any]:
    disease_counts = (
        db.query(Report.predicted_disease, func.count(Report.id))
        .group_by(Report.predicted_disease)
        .order_by(func.count(Report.id).desc())
        .limit(20)
        .all()
    )
    return {
        "top_predicted_diseases": [
            {"disease": disease, "count": count} for disease, count in disease_counts
        ]
    }
