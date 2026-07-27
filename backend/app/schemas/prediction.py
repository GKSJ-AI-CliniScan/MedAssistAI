from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict

class PredictionRequest(BaseModel):
    symptoms: List[str]
    severity: Optional[str] = "mild"
    duration: Optional[int] = 3
    notes: Optional[str] = None

class DiseaseResult(BaseModel):
    id: str
    name: str
    riskLevel: str
    confidence: float
    probability: str
    description: str
    symptoms: List[str]
    matchedSymptoms: List[str]
    causes: List[str]
    complications: List[str]
    suggested_tests: List[str]
    doctor: str

class PredictionResponse(BaseModel):
    id: int
    top_disease: str
    top_confidence: float
    predictions: List[DiseaseResult]
    created_at: str

    model_config = ConfigDict(from_attributes=True)
