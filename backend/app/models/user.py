from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    PATIENT = "patient"
    DOCTOR = "doctor"
    CLINIC = "clinic"
    ADMIN = "admin"

class UserDB(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    email: str
    hashed_password: str
    role: UserRole = UserRole.PATIENT
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
