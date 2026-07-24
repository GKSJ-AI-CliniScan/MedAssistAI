from pydantic import BaseModel, EmailStr
from typing import List, Dict, Optional


# ======================================================
# Disease Prediction
# ======================================================

class SymptomRequest(BaseModel):

    patient_id: str

    symptoms: List[str]


# ======================================================
# Risk Assessment
# ======================================================

class RiskRequest(BaseModel):

    prediction_id: str

    disease: str

    symptoms: List[str]

    age: int

    history: List[str]

    lifestyle: Dict


# ======================================================
# Treatment Recommendation
# ======================================================

class DiseaseRequest(BaseModel):

    disease: str


# ======================================================
# Health Report Generation
# ======================================================

class ReportRequest(BaseModel):

    prediction_id: str


# ======================================================
# Patient Registration
# ======================================================

class PatientRegister(BaseModel):

    full_name: str
    email: EmailStr
    phone: str
    password: str
    age: int
    gender: str

    blood_group: Optional[str] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    photo: Optional[str] = None


# ======================================================
# Patient Login
# ======================================================

class PatientLogin(BaseModel):

    email: EmailStr
    password: str


# ======================================================
# Login Response
# ======================================================

class LoginResponse(BaseModel):

    access_token: str
    token_type: str

    patient_id: str
    full_name: str


# ======================================================
# User Response
# ======================================================

class UserResponse(BaseModel):

    patient_id: str
    full_name: str
    email: EmailStr
    phone: str
    age: int
    gender: str

    blood_group: Optional[str] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    photo: Optional[str] = None

    class Config:
        from_attributes = True


# ======================================================
# Update Profile
# ======================================================

class UpdateProfileRequest(BaseModel):

    patient_id: str

    full_name: str

    email: EmailStr

    phone: str

    age: int

    gender: str

    blood_group: Optional[str] = None

    address: Optional[str] = None

    emergency_contact: Optional[str] = None

    photo: Optional[str] = None


# ======================================================
# Change Password
# ======================================================

class ChangePasswordRequest(BaseModel):

    patient_id: str

    current_password: str

    new_password: str
    
# ======================================================
# Admin Login
# ======================================================

class AdminLogin(BaseModel):

    email: EmailStr

    password: str


# ======================================================
# Admin Login Response
# ======================================================

class AdminLoginResponse(BaseModel):

    access_token: str

    token_type: str

    admin_id: str

    full_name: str

    role: str