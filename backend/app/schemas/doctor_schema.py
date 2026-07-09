from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


PHONE_PATTERN = r"^\+?[0-9]{7,15}$"


class DoctorBase(BaseModel):
    fullname: str
    specialization: str
    qualification: Optional[str] = None
    license_number: Optional[str] = None
    phone_number: Optional[str] = Field(default=None, pattern=PHONE_PATTERN)
    years_of_experience: Optional[int] = 0
    consultation_fee: Optional[float] = 0.0
    is_available: Optional[bool] = True


class DoctorCreate(DoctorBase):
    # user_id is derived from the JWT token in the service layer
    pass


class DoctorUpdate(BaseModel):
    fullname: Optional[str] = None
    specialization: Optional[str] = None
    qualification: Optional[str] = None
    license_number: Optional[str] = None
    phone_number: Optional[str] = Field(default=None, pattern=PHONE_PATTERN)
    years_of_experience: Optional[int] = None
    consultation_fee: Optional[float] = None
    is_available: Optional[bool] = None


class DoctorResponse(DoctorBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
