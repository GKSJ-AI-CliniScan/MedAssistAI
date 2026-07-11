from fastapi import APIRouter

from backend.schemas import SymptomRequest
from backend.predict import predict_disease

router = APIRouter()

@router.get("/")
def prediction_home():
    return {"message": "Prediction API"}

@router.post("/predict")
def predict(request: SymptomRequest):

    result = predict_disease(request.symptoms)

    return result