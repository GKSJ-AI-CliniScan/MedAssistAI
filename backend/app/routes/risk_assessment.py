"""
Risk Assessment API Routes.

Exposes endpoints for calculating patient health risk using a modular service architecture.
Combines XGBoost ML inference on BRFSS features with internal Disease Prediction API outputs
via a dedicated Decision Layer.
"""

from fastapi import APIRouter, HTTPException, status

from app.schemas.patient import RiskAssessmentRequest
from app.schemas.response import RiskAssessmentResponse
from app.services.prediction_client import prediction_client
from app.services.risk_service import calculate_ml_risk
from app.services.decision_engine import decision_engine
from app.utils.logger import logger

router = APIRouter(tags=["Risk Assessment"])


@router.post(
    "/risk-assessment",
    response_model=RiskAssessmentResponse,
    status_code=status.HTTP_200_OK,
    summary="Assess Patient Health Risk",
    description=(
        "Evaluates comprehensive patient health risk using a service-based architecture. "
        "Accepts patient symptoms and 14 CDC BRFSS demographic and lifestyle features. "
        "Internally queries the Disease Prediction API, executes the XGBoost ML model on BRFSS features, "
        "and synthesizes the final risk assessment via a dedicated Decision Layer. "
        "Returns risk probability, composite risk score, risk level, severity, emergency alert flag, "
        "and clinical recommendations."
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

    Orchestrates Disease Prediction client, ML Risk model execution, and Decision Engine evaluation.
    Returns only the final Risk Assessment.
    """
    logger.info(
        "Received POST /risk-assessment request for patient (age=%d, bmi=%.1f, symptoms_count=%d)",
        request.age,
        request.bmi,
        len(request.symptoms),
    )

    try:
        # Step 1: Call Disease Prediction API using symptoms (internal)
        predicted_disease, prediction_confidence = prediction_client.get_disease_prediction(
            request.symptoms
        )

        # Step 2: Run XGBoost ML Model using ONLY BRFSS features
        ml_risk_output = calculate_ml_risk(request)

        # Step 3: Combine outputs via Decision Layer
        final_assessment = decision_engine.evaluate_risk(
            ml_risk_output=ml_risk_output,
            predicted_disease=predicted_disease,
            prediction_confidence=prediction_confidence,
        )

        return final_assessment

    except ValueError as ve:
        logger.warning("Validation error in risk assessment: %s", str(ve))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve),
        )
    except RuntimeError as re:
        logger.error("Runtime error in risk assessment service: %s", str(re), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(re),
        )
    except Exception as exc:
        logger.error("Internal failure in risk assessment endpoint: %s", str(exc), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while processing risk assessment.",
        )