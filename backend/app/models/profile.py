from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class PatientProfileDB(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str  # Linked to UserDB._id
    first_name: str
    last_name: str
    date_of_birth: Optional[str] = None  # YYYY-MM-DD
    gender: Optional[str] = None
    blood_type: Optional[str] = None
    height: Optional[float] = None  # in cm
    weight: Optional[float] = None  # in kg
    allergies: List[str] = Field(default_factory=list)
    medical_conditions: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
