from fastapi import APIRouter, HTTPException
from app.schemas.patient import RiskAssessmentRequest
from app.services.prediction_service import get_prediction
from app.services.risk_service import calculate_risk

router = APIRouter()

@router.post("/predict")
async def predict_and_assess(request: RiskAssessmentRequest):
    try:
        disease, confidence = await get_prediction(request.symptoms)
    except Exception:
        raise HTTPException(status_code=502, detail="Prediction service unavailable")

    request.predicted_disease = disease
    request.prediction_confidence = confidence

    return calculate_risk(request)