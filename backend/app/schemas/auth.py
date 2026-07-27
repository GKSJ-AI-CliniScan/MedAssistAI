from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict

class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[str] = None

class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: Optional[str] = "patient"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ForgotPassword(BaseModel):
    email: EmailStr

class ResetPassword(BaseModel):
    token: str
    new_password: str = Field(..., min_length=6)

class RefreshTokenInput(BaseModel):
    refresh_token: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)
