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
        "Evaluates patient health risk using patient symptoms and "
        "health-related features. The system predicts a disease, "
        "assesses overall patient risk, and produces a personalized "
        "risk assessment."
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
                    "example": {
                        "detail": "Invalid patient data provided "
                                 "for risk assessment."
                    }
                }
            },
        },
        422: {
            "description": "Request validation failed.",
        },
        500: {
            "description": "Internal Server Error.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "An unexpected error occurred "
                                 "while processing risk assessment."
                    }
                }
            },
        },
    },
)
async def assess_risk(
    request: RiskAssessmentRequest,
) -> RiskAssessmentResponse:
    

    logger.info(
        "Received POST /risk-assessment request "
        "(age=%d, bmi=%.1f, symptoms_count=%d)",
        request.age,
        request.bmi,
        len(request.symptoms),
    )

    try:
        # STEP 1: DISEASE PREDICTION
    

        predicted_disease, prediction_confidence = (
            prediction_client.get_disease_prediction(
                request.symptoms
            )
        )

        logger.info(
            "Disease prediction completed: disease=%s, confidence=%.2f",
            predicted_disease,
            prediction_confidence,
        )

        # STEP 2: OVERALL PATIENT RISK
    

        ml_risk_output = calculate_ml_risk(request)

        logger.info(
            "Patient risk assessment completed."
        )

        
        # STEP 3: PERSONALIZED DECISION ENGINE
    

        final_assessment = decision_engine.evaluate_risk(
            ml_risk_output=ml_risk_output,
            predicted_disease=predicted_disease,
            prediction_confidence=prediction_confidence,
        )

    
        # STEP 4: RETURN PATIENT-FACING RESPONSE

        return final_assessment

    except ValueError as ve:

        logger.warning(
            "Validation error in risk assessment: %s",
            str(ve),
        )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve),
        )

    except RuntimeError as re:

        logger.error(
            "Runtime error in risk assessment service: %s",
            str(re),
            exc_info=True,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(re),
        )

    except Exception as exc:

        logger.error(
            "Internal failure in risk assessment endpoint: %s",
            str(exc),
            exc_info=True,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "An unexpected error occurred while processing "
                "risk assessment."
            ),
        )