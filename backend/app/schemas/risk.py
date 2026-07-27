from typing import List, Dict, Any, Optional
from pydantic import BaseModel, ConfigDict

class RiskAssessmentRequest(BaseModel):
    symptoms: List[str]
    severity: Optional[str] = "mild"
    duration: Optional[int] = 3

class RiskFactor(BaseModel):
    label: str
    value: str
    status: str
    color: str

class RiskAssessmentResponse(BaseModel):
    riskScore: float
    riskLevel: str
    healthScore: float
    severityIndicator: str
    emergencyAlert: bool
    message: str
    factors: List[RiskFactor]
    evaluatedAt: str

    model_config = ConfigDict(from_attributes=True)
