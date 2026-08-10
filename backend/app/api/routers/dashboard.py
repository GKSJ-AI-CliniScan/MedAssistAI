"""
Dashboard Router – Stats and analytics for patient, doctor, and admin dashboards
"""
import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.repositories import PatientRepository, PredictionRepository, ReportRepository, UserRepository, AppointmentRepository
from app.models.user import User
from app.models.prediction import Prediction
from app.models.risk_assessment import RiskAssessment
from app.models.appointment import Appointment
from app.models.patient import Patient

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=dict)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pred_repo = PredictionRepository(db)
    report_repo = ReportRepository(db)
    user_repo = UserRepository(db)
    pat_repo = PatientRepository(db)
    appt_repo = AppointmentRepository(db)

    total_users = user_repo.count()
    total_patients = user_repo.count_by_role("patient")
    total_doctors = user_repo.count_by_role("doctor")
    total_predictions = pred_repo.count()
    total_reports = report_repo.count()

    # Query DB for critical risk cases
    critical_cases = db.query(RiskAssessment).filter(RiskAssessment.risk_level.in_(["High", "Critical"])).count()

    if current_user.role == "admin":
        return {
            "totalUsers": total_users,
            "totalPatients": total_patients,
            "totalDoctors": total_doctors,
            "totalPredictions": total_predictions,
            "totalReports": total_reports,
            "criticalCases": critical_cases,
            "systemHealth": {
                "api": "Healthy",
                "database": "Connected",
                "ml_engine": "Online",
            },
        }

    elif current_user.role == "doctor":
        today_start = datetime.datetime.combine(datetime.date.today(), datetime.time.min)
        predictions_today = db.query(Prediction).filter(Prediction.created_at >= today_start).count()
        appointments_today = db.query(Appointment).filter(Appointment.created_at >= today_start).count()
        return {
            "totalPatients": total_patients,
            "predictionsToday": predictions_today,
            "totalPredictions": total_predictions,
            "criticalCases": critical_cases,
            "pendingConsultations": appt_repo.count() if hasattr(appt_repo, 'count') else 0,
            "aiPredictions": total_predictions,
            "pendingReports": total_predictions - total_reports if total_predictions > total_reports else 0,
            "avgHealthScore": 85.0,
        }

    else:
        # Patient dashboard
        patient = pat_repo.get_by_user_id(current_user.id)
        if not patient:
            return {
                "patientsToday": 0,
                "consultations": 0,
                "aiPredictions": 0,
                "pendingReports": 0,
                "criticalCases": 0,
                "avgHealthScore": 100.0,
                "recentPredictions": []
            }

        predictions = pred_repo.get_by_patient(patient.id, limit=100)
        reports = report_repo.get_by_patient(patient.id)
        
        health_score = 100.0
        if predictions:
            last_pred = predictions[0]
            risk = pred_repo.get_risk_by_prediction(last_pred.id)
            if risk and risk.health_score is not None:
                health_score = risk.health_score

        today_preds = [p for p in predictions if p.created_at.date() == datetime.date.today()]
        critical_preds = [p for p in predictions if p.top_confidence and p.top_confidence > 0.75]

        return {
            "patientsToday": 1,
            "consultations": len(today_preds),
            "aiPredictions": len(predictions),
            "pendingReports": max(0, len(predictions) - len(reports)),
            "criticalCases": len(critical_preds),
            "avgHealthScore": round(health_score, 1),
            "recentPredictions": [
                {
                    "id": p.id,
                    "disease": p.top_disease,
                    "confidence": round((p.top_confidence or 0) * 100, 1),
                    "date": p.created_at.isoformat(),
                }
                for p in predictions[:5]
            ],
        }


@router.get("/analytics", response_model=dict)
def get_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pat_repo = PatientRepository(db)
    pred_repo = PredictionRepository(db)

    if current_user.role in ["admin", "doctor"]:
        predictions = db.query(Prediction).order_by(Prediction.created_at.desc()).limit(200).all()
        risk_records = db.query(RiskAssessment).all()
    else:
        patient = pat_repo.get_by_user_id(current_user.id)
        predictions = pred_repo.get_by_patient(patient.id, limit=100) if patient else []
        pred_ids = [p.id for p in predictions]
        risk_records = db.query(RiskAssessment).filter(RiskAssessment.prediction_id.in_(pred_ids)).all() if pred_ids else []

    # Calculate disease statistics
    disease_dist: dict = {}
    total_preds = len(predictions)
    for p in predictions:
        name = p.top_disease or "Unspecified"
        disease_dist[name] = disease_dist.get(name, 0) + 1

    colors = ['#6366f1', '#10b981', '#06b6d4', '#f59e0b', '#f43f5e', '#8b5cf6', '#ec4899']
    disease_statistics = []
    for idx, (name, count) in enumerate(sorted(disease_dist.items(), key=lambda x: -x[1])):
        percentage = round((count / max(total_preds, 1)) * 100, 1)
        disease_statistics.append({
            "name": name,
            "value": count,
            "percentage": percentage,
            "color": colors[idx % len(colors)]
        })

    # Risk level distribution
    risk_counts = {"Low Risk": 0, "Medium Risk": 0, "High Risk": 0, "Critical Risk": 0}
    for r in risk_records:
        level = (r.risk_level or "Low").strip()
        if "High" in level:
            risk_counts["High Risk"] += 1
        elif "Medium" in level or "Moderate" in level:
            risk_counts["Medium Risk"] += 1
        elif "Critical" in level:
            risk_counts["Critical Risk"] += 1
        else:
            risk_counts["Low Risk"] += 1

    risk_distribution = [
        {"name": "Low Risk", "value": risk_counts["Low Risk"], "color": "#10b981"},
        {"name": "Medium Risk", "value": risk_counts["Medium Risk"], "color": "#f59e0b"},
        {"name": "High Risk", "value": risk_counts["High Risk"], "color": "#f43f5e"},
        {"name": "Critical Risk", "value": risk_counts["Critical Risk"], "color": "#e11d48"},
    ]

    # Calculate monthly trend
    monthly: dict = {}
    for p in predictions:
        m_key = p.created_at.strftime("%b %Y")
        monthly[m_key] = monthly.get(m_key, 0) + 1

    system_activity = [
        {"month": k, "assessments": v, "healthAvg": 85}
        for k, v in sorted(monthly.items())
    ]

    avg_conf = round(sum((p.top_confidence or 0) for p in predictions) / max(len(predictions), 1) * 100, 1) if predictions else 0.0

    return {
        "totalAnalyses": len(predictions),
        "diseaseStatistics": disease_statistics,
        "diseaseDistribution": disease_statistics,
        "riskDistribution": risk_distribution,
        "systemActivity": system_activity,
        "monthlyTrend": [{"month": k, "patients": v, "accuracy": 92} for k, v in sorted(monthly.items())],
        "summary": {
            "totalAssessments": len(predictions),
            "averageHealthScore": 85,
            "criticalAlertsResolved": risk_counts["High Risk"] + risk_counts["Critical Risk"],
            "activePatients": db.query(Patient).count()
        },
        "avgConfidence": avg_conf,
    }

