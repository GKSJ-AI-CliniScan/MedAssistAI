from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.schemas.user_schema import UserResponse


class DoctorCreate(BaseModel):
    specialization: str = "General Medicine"
    qualification: Optional[str] = None
    experience_years: Optional[int] = 0
    contact_number: Optional[str] = None
    clinic_address: Optional[str] = None
    is_available: Optional[bool] = True


class DoctorAccountCreate(BaseModel):
    fullname: str = Field(..., min_length=2, description="Full name of the doctor")
    email: str = Field(..., description="Doctor login email address")
    password: str = Field(..., min_length=6, description="Initial doctor account password")
    specialization: str = Field(default="General Medicine", description="Medical specialty")
    experience_years: Optional[int] = Field(default=0, ge=0, description="Years of clinical experience")
    qualification: Optional[str] = Field(default=None, description="Degrees and credentials")
    contact_number: Optional[str] = Field(default=None, description="Contact phone number")
    clinic_address: Optional[str] = Field(default=None, description="Clinic or office address")


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
