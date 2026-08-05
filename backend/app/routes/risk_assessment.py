"""
Risk Assessment API Routes.

Exposes endpoints for calculating patient health risk based on 18 CDC BRFSS ML model features.
"""

from fastapi import APIRouter, HTTPException, status
from app.schemas.patient import RiskAssessmentRequest, RiskAssessmentResponse
from app.services.risk_service import calculate_risk
from app.utils.logger import logger

router = APIRouter(tags=["Risk Assessment"])


@router.post(
    "/risk-assessment",
    response_model=RiskAssessmentResponse,
    status_code=status.HTTP_200_OK,
    summary="Assess Patient Health Risk",
    description=(
        "Evaluates comprehensive patient health risk using a trained Machine Learning model "
        "(XGBoost / Random Forest) trained on the CDC BRFSS dataset. Accepts 18 patient demographic, "
        "health status, and lifestyle features and returns predicted risk probability, risk level "
        "('High', 'Medium', 'Low'), risk score (0-100), severity, clinical recommendations, and model details."
    ),
    responses={
        200: {
            "description": "Risk assessment calculated successfully.",
            "model": RiskAssessmentResponse,
        },
        400: {
            "description": "Invalid input payload or calculation error.",
            "content": {
                "application/json": {
                    "example": {"detail": "Invalid patient data provided for risk assessment."}
                }
            },
        },
        422: {
            "description": "Unprocessable Entity - Request validation failed.",
        },
        500: {
            "description": "Internal Server Error - Unexpected server error during calculation.",
            "content": {
                "application/json": {
                    "example": {"detail": "An unexpected error occurred while processing risk assessment."}
                }
            },
        },
    },
)
async def assess_risk(request: RiskAssessmentRequest) -> RiskAssessmentResponse:
    """
    POST /risk-assessment

    Calculates risk score, risk level, severity, recommendations, and model_name using pure ML inference.
    """
    logger.info("Received POST /risk-assessment request")

    try:
        result = calculate_risk(request)
        return result
    except ValueError as ve:
        logger.warning("Validation error in risk assessment: %s", str(ve))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve),
        )
    except Exception as exc:
        logger.error("Internal failure in risk assessment endpoint: %s", str(exc), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while processing risk assessment.",
        )