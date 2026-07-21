from pydantic import BaseModel
from datetime import datetime
from typing import List

class SymptomCheckRequest(BaseModel):
    symptoms: List[str]

class PredictedDiseaseResponse(BaseModel):
    disease: str
    probability: float

class ConsultationResponse(BaseModel):
    id: str
    patient_id: str
    symptoms: List[str]
    predicted_diseases: List[PredictedDiseaseResponse]
    risk_level: str
    risk_score: float
    recommendations: List[str]
    created_at: datetime

    class Config:
        from_attributes = True
