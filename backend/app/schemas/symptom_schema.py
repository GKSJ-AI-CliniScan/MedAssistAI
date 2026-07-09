from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class SymptomCreate(BaseModel):
    patient_id: int
    symptoms_list: str              # e.g. "fever, cough, fatigue"
    duration_days: Optional[int] = None
    severity: Optional[str] = None  # mild / moderate / severe
    additional_notes: Optional[str] = None


class SymptomUpdate(BaseModel):
    symptoms_list: Optional[str] = None
    duration_days: Optional[int] = None
    severity: Optional[str] = None
    additional_notes: Optional[str] = None


class SymptomResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    patient_id: int
    symptoms_list: str
    duration_days: Optional[int]
    severity: Optional[str]
    additional_notes: Optional[str]
    created_at: Optional[datetime]