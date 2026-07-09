from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class ReportBase(BaseModel):
    patient_id: int
    doctor_id: Optional[int] = None
    appointment_id: Optional[int] = None
    report_type: Optional[str] = "disease_prediction"
    title: Optional[str] = None
    diagnosis: Optional[str] = None
    risk_level: Optional[str] = None       # low / medium / high
    recommendations: Optional[str] = None
    file_url: Optional[str] = None


class ReportCreate(ReportBase):
    pass


class ReportUpdate(BaseModel):
    title: Optional[str] = None
    diagnosis: Optional[str] = None
    risk_level: Optional[str] = None
    recommendations: Optional[str] = None
    file_url: Optional[str] = None


class ReportResponse(ReportBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None