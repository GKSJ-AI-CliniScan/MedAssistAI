from pydantic import BaseModel
from typing import List, Dict


# ==========================
# Disease Prediction
# ==========================

class SymptomRequest(BaseModel):
    symptoms: List[str]


# ==========================
# Risk Assessment
# ==========================

class RiskRequest(BaseModel):
    disease: str
    symptoms: List[str]
    age: int
    history: List[str]
    lifestyle: Dict


# ==========================
# Treatment Recommendation
# ==========================

class DiseaseRequest(BaseModel):
    disease: str