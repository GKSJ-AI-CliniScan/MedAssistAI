from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator
from app.schemas.patient_schema import PatientResponse
from app.schemas.doctor_schema import DoctorResponse


class AppointmentCreate(BaseModel):
    doctor_id: Optional[int] = None
    patient_id: Optional[int] = None
    appointment_date: datetime
    reason: Optional[str] = None
    notes: Optional[str] = None


class AppointmentStatusUpdate(BaseModel):
    status: str  # Pending, Confirmed, Scheduled, Completed, Cancelled
    notes: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, value: str) -> str:
        allowed = {
            "pending", "confirmed", "scheduled", "completed", "cancelled", "canceled"
        }
        val = value.strip().lower()
        if val not in allowed:
            raise ValueError(f"Status must be one of: {', '.join(allowed)}")
        if val == "canceled":
            return "Cancelled"
        return val.capitalize()


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
