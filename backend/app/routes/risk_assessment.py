from fastapi import APIRouter
from app.schemas.patient import RiskAssessmentRequest
from app.services.risk_service import calculate_risk

router = APIRouter()

@router.post("/risk-assessment")
async def assess_risk(request: RiskAssessmentRequest):
    result = calculate_risk(request)
    return result