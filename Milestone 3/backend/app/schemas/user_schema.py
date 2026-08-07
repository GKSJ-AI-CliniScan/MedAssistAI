from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator


class UserRegister(BaseModel):
    fullname: str = Field(..., min_length=2, max_length=100, description="Full name of user")
    email: EmailStr = Field(..., description="Valid email address")
    password: str = Field(..., min_length=6, description="Password (min 6 chars)")
    role: Optional[str] = Field("patient", description="User role: patient, doctor, admin")

    @field_validator("role")
    @classmethod
    def validate_role(cls, value: Optional[str]) -> str:
        allowed = {"patient", "doctor", "admin"}
        if value and value.lower() not in allowed:
            raise ValueError(f"Role must be one of: {', '.join(allowed)}")
        return value.lower() if value else "patient"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    fullname: str
    email: EmailStr
    role: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    fullname: Optional[str] = None
    email: Optional[EmailStr] = None


class TokenResponse(BaseModel):
    message: str = "Login Successful"
    access_token: str
    token_type: str = "bearer"
    user: UserResponse