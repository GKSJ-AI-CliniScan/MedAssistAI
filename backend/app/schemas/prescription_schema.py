from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.schemas.patient_schema import PatientResponse
from app.schemas.doctor_schema import DoctorResponse


class PrescriptionCreate(BaseModel):
    patient_id: int
    medicine: str
    dosage: str
    frequency: str
    duration: str
    instructions: Optional[str] = None


class PrescriptionUpdate(BaseModel):
    status: Optional[str] = None
    instructions: Optional[str] = None


class PrescriptionResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    medicine: str
    dosage: str
    frequency: str
    duration: str
    instructions: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    patient: Optional[PatientResponse] = None
    doctor: Optional[DoctorResponse] = None

    class Config:
        from_attributes = True
