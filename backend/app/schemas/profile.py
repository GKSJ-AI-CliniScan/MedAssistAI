from pydantic import BaseModel
from typing import Optional, List

class PatientProfileResponse(BaseModel):
    id: str
    user_id: str
    first_name: str
    last_name: str
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    blood_type: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    allergies: List[str] = []
    medical_conditions: List[str] = []

    class Config:
        from_attributes = True

class PatientProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    blood_type: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    allergies: Optional[List[str]] = None
    medical_conditions: Optional[List[str]] = None
