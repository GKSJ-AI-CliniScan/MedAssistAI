from typing import List, Optional
from pydantic import BaseModel, ConfigDict

class MedicineAdvice(BaseModel):
    name: str
    dosage: str
    purpose: str

class RecommendationResponse(BaseModel):
    lifestyle: str
    diet: str
    exercise: str
    waterIntake: str
    sleep: str
    followUp: str
    doctor: str
    medicines: List[MedicineAdvice]
    disclaimer: str

    model_config = ConfigDict(from_attributes=True)
