from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from app.models.user import UserRole

class UserRegister(BaseModel):
    email: str
    password: str = Field(..., min_length=6)
    first_name: str
    last_name: str
    role: Optional[UserRole] = UserRole.PATIENT

class UserLogin(BaseModel):
    username: str  # OAuth2 password bearer expects 'username' (which is the email)
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class UserResponse(BaseModel):
    id: str
    email: str
    role: UserRole

    class Config:
        from_attributes = True
