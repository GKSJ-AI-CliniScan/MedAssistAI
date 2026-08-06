from datetime import datetime
from typing import List, Optional, Union
from pydantic import BaseModel, field_validator
import json


class ReportCreate(BaseModel):
    predicted_disease: str
    confidence: Optional[float] = None
    risk_level: str
    severity_level: str
    severity_score: int = 0
    emergency: bool = False
    symptoms_submitted: Union[List[str], str]
    recommendations: Optional[str] = None
    doctor_notes: Optional[str] = None

    @field_validator("symptoms_submitted")
    @classmethod
    def validate_symptoms(cls, value: Union[List[str], str]) -> str:
        if isinstance(value, list):
            return json.dumps(value)
        return str(value)


class ReportUpdate(BaseModel):
    doctor_notes: Optional[str] = None
    recommendations: Optional[str] = None


class ReportResponse(BaseModel):
    id: int
    patient_id: int
    predicted_disease: str
    confidence: Optional[float] = None
    risk_level: str
    severity_level: str
    severity_score: int
    emergency: bool
    symptoms_submitted: str
    recommendations: Optional[str] = None
    doctor_notes: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
