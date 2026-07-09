from datetime import date, datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


PHONE_PATTERN = r"^\+?[0-9]{7,15}$"


class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class BloodGroup(str, Enum):
    A_POS = "A+"
    A_NEG = "A-"
    B_POS = "B+"
    B_NEG = "B-"
    AB_POS = "AB+"
    AB_NEG = "AB-"
    O_POS = "O+"
    O_NEG = "O-"


class PatientBase(BaseModel):
    date_of_birth: Optional[date] = None
    gender: Optional[Gender] = None
    phone_number: Optional[str] = Field(default=None, pattern=PHONE_PATTERN)
    blood_group: Optional[BloodGroup] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = Field(default=None, pattern=PHONE_PATTERN)
    medical_history: Optional[str] = None
    allergies: Optional[str] = None


class PatientCreate(PatientBase):
    # user_id is derived from the JWT token in the service layer
    pass


class PatientUpdate(BaseModel):
    date_of_birth: Optional[date] = None
    gender: Optional[Gender] = None
    phone_number: Optional[str] = Field(default=None, pattern=PHONE_PATTERN)
    blood_group: Optional[BloodGroup] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = Field(default=None, pattern=PHONE_PATTERN)
    medical_history: Optional[str] = None
    allergies: Optional[str] = None


class PatientResponse(PatientBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
