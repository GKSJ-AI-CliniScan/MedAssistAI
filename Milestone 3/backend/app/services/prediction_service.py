import json
import logging
from typing import Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.ml.model_loader import ModelLoadError, ModelNotFoundError, load_model
from app.ml.predictor import PredictionError, predict_disease
from app.ml.preprocessing import InvalidSymptomsError, preprocess_symptoms
from app.ml.risk_assessment import assess_risk
from app.ml.severity_analysis import assess_severity
from app.models.user import User
from app.models.report import Report
from app.schemas.prediction_schema import PredictionRequest, PredictionResponse
from app.services.health_risk_service import generate_health_risk_report
from app.services.patient_service import get_patient_by_user_id

logger = logging.getLogger(__name__)


def predict_from_symptoms(
    request: PredictionRequest,
    db: Optional[Session] = None,
    current_user: Optional[User] = None,
) -> PredictionResponse:
    """
    Run full disease prediction pipeline using voting_classifier_rf_xgb_lgb.pkl:
    - Load real trained model
    - Preprocess symptoms against 377 model features
    - Calculate disease prediction and confidence percentage
    - Calculate symptom severity score and emergency status
    - Calculate health risk level evaluating severity and confidence
    - Generate health risk report summary
    - Save Report record in database if authenticated patient
    """
    logger.info("Prediction request received | symptoms=%s", request.symptoms)

    try:
        model = load_model()
        features = preprocess_symptoms(request.symptoms, model=model)
        disease, confidence = predict_disease(model, features)
        
        # Assess severity first
        severity = assess_severity(request.symptoms)

        # Assess risk combining confidence, severity score, severity level, and emergency flag
        risk_level, recommendation = assess_risk(
            confidence=confidence,
            severity_score=severity.severity_score,
            severity_level=severity.severity_level,
            emergency=severity.emergency,
        )

        health_report = generate_health_risk_report(
            predicted_disease=disease,
            confidence=confidence,
            risk_level=risk_level,
            severity_level=severity.severity_level,
            severity_score=severity.severity_score,
            emergency=severity.emergency,
            recommendation=recommendation,
        )

        response = PredictionResponse(
            predicted_disease=disease,
            confidence=confidence,
            risk_level=risk_level,
            severity_level=severity.severity_level,
            severity_score=severity.severity_score,
            emergency=severity.emergency,
            recommendation=recommendation,
            health_risk_report=health_report.summary,
        )

        # Automatically record report for patient if db & user are available
        if db is not None and current_user is not None and current_user.role and current_user.role.lower() == "patient":
            try:
                patient = get_patient_by_user_id(db, current_user.id)
                report = Report(
                    patient_id=patient.id,
                    predicted_disease=disease,
                    confidence=confidence,
                    risk_level=risk_level,
                    severity_level=severity.severity_level,
                    severity_score=severity.severity_score,
                    emergency=severity.emergency,
                    symptoms_submitted=json.dumps(request.symptoms),
                    recommendations=recommendation,
                )
                db.add(report)
                db.commit()
                db.refresh(report)
                logger.info("Saved prediction report ID #%s for Patient ID #%s (User ID #%s)", report.id, patient.id, current_user.id)
            except Exception as e:
                db.rollback()
                logger.error("Failed to auto-save prediction report for User ID #%s: %s", current_user.id, e, exc_info=True)

        return response

    except ModelNotFoundError as exc:
        logger.error("Prediction failure | missing model | %s", exc)
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except ModelLoadError as exc:
        logger.error("Prediction failure | model load error | %s", exc)
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except InvalidSymptomsError as exc:
        logger.warning("Prediction failure | invalid symptoms | %s", exc)
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except PredictionError as exc:
        logger.error("Prediction failure | prediction error | %s", exc)
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Prediction failure | internal error")
        raise HTTPException(
            status_code=500,
            detail="Internal server error during disease prediction",
        ) from exc
