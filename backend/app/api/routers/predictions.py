"""
Predictions Router – Symptom analysis, disease prediction, risk assessment, recommendations
"""
import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.repositories import PatientRepository, PredictionRepository, NotificationRepository
from app.schemas import PredictionRequest, PredictionResponse
from app.ml.predictor import predict_diseases
from app.ml.risk_engine import assess_risk
from app.ml.recommendation_engine import generate_recommendation
from app.models.user import User

router = APIRouter(prefix="/predictions", tags=["Predictions"])


def _get_patient_or_404(user: User, db: Session):
    repo = PatientRepository(db)
    patient = repo.get_by_user_id(user.id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")
    return patient


@router.post("/analyze", response_model=dict, status_code=201)
def analyze_symptoms(
    payload: PredictionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    patient = _get_patient_or_404(current_user, db)
    pred_repo = PredictionRepository(db)
    notif_repo = NotificationRepository(db)

    # Run ML prediction
    ml_result = predict_diseases(
        symptoms=payload.symptoms,
        severity=payload.severity or "mild",
        duration=payload.duration or 3,
    )

    # Persist prediction
    prediction = pred_repo.create(
        patient_id=patient.id,
        symptoms=payload.symptoms,
        severity=payload.severity or "mild",
        duration=payload.duration or 3,
        notes=payload.notes or "",
        predicted_diseases=ml_result["predictions"],
        top_disease=ml_result["top_disease"],
        top_confidence=ml_result["top_confidence"],
    )

    # Run risk assessment
    risk_data_raw = assess_risk(
        symptoms=payload.symptoms,
        severity=payload.severity or "mild",
        duration=payload.duration or 3,
        patient=patient,
    )
    risk = pred_repo.save_risk_assessment(
        prediction_id=prediction.id,
        risk_data={
            "risk_score": risk_data_raw["riskScore"],
            "risk_level": risk_data_raw["riskLevel"],
            "health_score": risk_data_raw["healthScore"],
            "emergency_alert": risk_data_raw["emergencyAlert"],
            "message": risk_data_raw["message"],
            "factors_json": risk_data_raw["factors"],
        },
    )

    # Generate recommendation
    top_id = ml_result["predictions"][0]["id"] if ml_result["predictions"] else "common_cold"
    rec_data = generate_recommendation(top_id, ml_result["top_disease"])
    rec = pred_repo.save_recommendation(
        prediction_id=prediction.id,
        rec_data={
            "lifestyle": rec_data["lifestyle"],
            "diet": rec_data["diet"],
            "exercise": rec_data["exercise"],
            "water_intake": rec_data["waterIntake"],
            "sleep": rec_data["sleep"],
            "follow_up": rec_data["followUp"],
            "doctor": rec_data["doctor"],
            "medicines": rec_data["medicines"],
            "disclaimer": rec_data["disclaimer"],
        },
    )

    # Notify user
    notif_repo.create(
        user_id=current_user.id,
        title=f"Analysis Complete: {ml_result['top_disease']}",
        message=f"AI analysis identified {ml_result['top_disease']} with {round(ml_result['top_confidence']*100,1)}% confidence. Risk Level: {risk_data_raw['riskLevel']}.",
        type="warning" if risk_data_raw["riskLevel"] in ("High", "Critical") else "info",
    )

    return {
        "prediction_id": prediction.id,
        "top_disease": ml_result["top_disease"],
        "top_confidence": ml_result["top_confidence"],
        "predictions": ml_result["predictions"],
        "risk": {
            "riskScore": risk.risk_score,
            "riskLevel": risk.risk_level,
            "healthScore": risk.health_score,
            "emergencyAlert": risk.emergency_alert,
            "message": risk.message,
            "factors": risk.factors_json,
            "severityIndicator": risk_data_raw["severityIndicator"],
            "evaluatedAt": risk_data_raw["evaluatedAt"],
        },
        "recommendation": {
            "lifestyle": rec.lifestyle,
            "diet": rec.diet,
            "exercise": rec.exercise,
            "waterIntake": rec.water_intake,
            "sleep": rec.sleep,
            "followUp": rec.follow_up,
            "doctor": rec.doctor,
            "medicines": rec.medicines,
            "disclaimer": rec.disclaimer,
        },
        "created_at": prediction.created_at.isoformat(),
    }


@router.get("/history", response_model=List[dict])
def get_prediction_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    patient = _get_patient_or_404(current_user, db)
    pred_repo = PredictionRepository(db)
    predictions = pred_repo.get_by_patient(patient.id)
    results = []
    for p in predictions:
        results.append({
            "id": p.id,
            "top_disease": p.top_disease,
            "top_confidence": p.top_confidence,
            "symptoms": p.symptoms_input,
            "severity": p.severity_input,
            "duration": p.duration_input,
            "created_at": p.created_at.isoformat(),
        })
    return results


@router.get("/{prediction_id}", response_model=dict)
def get_prediction_detail(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    patient = _get_patient_or_404(current_user, db)
    pred_repo = PredictionRepository(db)
    prediction = pred_repo.get_by_id(prediction_id)
    if not prediction or prediction.patient_id != patient.id:
        raise HTTPException(status_code=404, detail="Prediction not found")
    risk = pred_repo.get_risk_by_prediction(prediction_id)
    rec = pred_repo.get_recommendation_by_prediction(prediction_id)
    return {
        "id": prediction.id,
        "top_disease": prediction.top_disease,
        "top_confidence": prediction.top_confidence,
        "predictions": prediction.predicted_diseases,
        "symptoms": prediction.symptoms_input,
        "severity": prediction.severity_input,
        "duration": prediction.duration_input,
        "notes": prediction.notes_input,
        "created_at": prediction.created_at.isoformat(),
        "risk": {
            "riskScore": risk.risk_score if risk else 0,
            "riskLevel": risk.risk_level if risk else "Unknown",
            "healthScore": risk.health_score if risk else 100,
            "emergencyAlert": risk.emergency_alert if risk else False,
            "message": risk.message if risk else "",
            "factors": risk.factors_json if risk else [],
        } if risk else None,
        "recommendation": {
            "lifestyle": rec.lifestyle,
            "diet": rec.diet,
            "exercise": rec.exercise,
            "waterIntake": rec.water_intake,
            "sleep": rec.sleep,
            "followUp": rec.follow_up,
            "doctor": rec.doctor,
            "medicines": rec.medicines,
            "disclaimer": rec.disclaimer,
        } if rec else None,
    }
