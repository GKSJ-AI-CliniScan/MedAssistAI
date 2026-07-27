from typing import Optional
from pydantic import BaseModel, ConfigDict

class AppointmentCreate(BaseModel):
    doctor_id: Optional[int] = None
    doctor_name: str
    doctor_specialty: Optional[str] = "General Physician"
    date_time: str
    priority: Optional[str] = "normal"
    status: Optional[str] = "confirmed"

class AppointmentUpdate(BaseModel):
    doctor_name: Optional[str] = None
    doctor_specialty: Optional[str] = None
    date_time: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None

class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: Optional[int] = None
    doctor_name: str
    doctor_specialty: str
    date_time: str
    priority: str
    status: str

    model_config = ConfigDict(from_attributes=True)
