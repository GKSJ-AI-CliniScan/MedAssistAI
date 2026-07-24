from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.schemas import SymptomRequest
from backend.predict import predict_disease

from backend.database import get_db
from backend.crud import save_prediction

router = APIRouter()


@router.get("/")
def prediction_home():
    return {"message": "Prediction API"}


@router.post("/predict")
def predict(
    request: SymptomRequest,
    db: Session = Depends(get_db)
):

    # Predict Disease
    result = predict_disease(request.symptoms)

    # Save Prediction into Database
    prediction = save_prediction(
        db=db,
        patient_id=request.patient_id,
        symptoms=request.symptoms,
        disease=result["Predicted Disease"],
        confidence=result["Confidence Score"]
    )

    # Return Prediction Result
    return {
        "prediction_id": prediction.prediction_id,
        **result
    }