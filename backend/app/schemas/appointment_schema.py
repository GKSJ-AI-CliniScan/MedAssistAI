from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator
from app.schemas.patient_schema import PatientResponse
from app.schemas.doctor_schema import DoctorResponse


class AppointmentCreate(BaseModel):
    doctor_id: int
    appointment_date: datetime
    reason: Optional[str] = None
    notes: Optional[str] = None


class AppointmentStatusUpdate(BaseModel):
    status: str  # Pending, Confirmed, Completed, Cancelled
    notes: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, value: str) -> str:
        allowed = {"Pending", "Confirmed", "Completed", "Cancelled"}
        if value not in allowed:
            raise ValueError(f"Status must be one of: {', '.join(allowed)}")
        return value


class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    appointment_date: datetime
    reason: Optional[str] = None
    status: str
    notes: Optional[str] = None
    created_at: Optional[datetime] = None
    patient: Optional[PatientResponse] = None
    doctor: Optional[DoctorResponse] = None

    class Config:
        from_attributes = True
