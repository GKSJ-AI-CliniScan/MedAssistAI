from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class SymptomCheckRequest(BaseModel):
    symptoms: List[str]
    age: int
    gender: str
    height: float
    weight: float


class PredictedDiseaseResponse(BaseModel):
    disease: str
    probability: float


class ConsultationResponse(BaseModel):
    id: str
    patient_id: str

    symptoms: List[str]

    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None

    predicted_diseases: List[PredictedDiseaseResponse]

    risk_level: str
    risk_score: float

    recommendations: List[str]

    created_at: datetime

    class Config:
        from_attributes = True