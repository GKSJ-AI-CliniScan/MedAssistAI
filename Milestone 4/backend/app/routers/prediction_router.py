from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.prediction_schema import PredictionRequest, PredictionResponse
from app.services.prediction_service import predict_from_symptoms
from app.utils.auth_handler import get_current_user

router = APIRouter(tags=["Disease Prediction"])


@router.post(
    "/predict",
    response_model=PredictionResponse,
    summary="Predict disease from symptoms",
    description=(
        "Accepts a list of symptoms and returns predicted disease, "
        "confidence score, risk level, severity analysis, and medical recommendation. "
        "Requires a valid JWT access token."
    ),
)
def predict_disease(
    request: PredictionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return predict_from_symptoms(request, db=db, current_user=current_user)
