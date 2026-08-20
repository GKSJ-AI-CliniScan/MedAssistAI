from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.schemas.user_schema import UserResponse


class DoctorCreate(BaseModel):
    specialization: str = "General Medicine"
    qualification: Optional[str] = None
    experience_years: Optional[int] = 0
    contact_number: Optional[str] = None
    clinic_address: Optional[str] = None
    is_available: Optional[bool] = True


class DoctorUpdate(BaseModel):
    specialization: Optional[str] = None
    qualification: Optional[str] = None
    experience_years: Optional[int] = None
    contact_number: Optional[str] = None
    clinic_address: Optional[str] = None
    is_available: Optional[bool] = None


class DoctorResponse(BaseModel):
    id: int
    user_id: int
    specialization: str
    qualification: Optional[str] = None
    experience_years: int
    contact_number: Optional[str] = None
    clinic_address: Optional[str] = None
    is_available: bool
    created_at: Optional[datetime] = None
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True
