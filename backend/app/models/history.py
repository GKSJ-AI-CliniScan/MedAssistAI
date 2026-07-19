from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class PredictedDisease(BaseModel):
    disease: str
    probability: float

class ConsultationDB(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    patient_id: str  # Linked to UserDB._id
    symptoms: List[str]  # List of symptom keys selected
    predicted_diseases: List[PredictedDisease]
    risk_level: str  # "low", "medium", "high"
    risk_score: float  # 0 to 100
    recommendations: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)
