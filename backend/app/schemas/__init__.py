from app.schemas.user_schema import UserRegister, UserLogin, UserResponse, UserUpdate, TokenResponse
from app.schemas.patient_schema import PatientCreate, PatientUpdate, PatientResponse
from app.schemas.doctor_schema import DoctorCreate, DoctorUpdate, DoctorResponse
from app.schemas.appointment_schema import AppointmentCreate, AppointmentStatusUpdate, AppointmentResponse
from app.schemas.symptom_schema import SymptomCreate, SymptomResponse
from app.schemas.prediction_schema import PredictionRequest, PredictionResponse
from app.schemas.report_schema import ReportCreate, ReportResponse, ReportUpdate

__all__ = [
    "UserRegister",
    "UserLogin",
    "UserResponse",
    "UserUpdate",
    "TokenResponse",
    "PatientCreate",
    "PatientUpdate",
    "PatientResponse",
    "DoctorCreate",
    "DoctorUpdate",
    "DoctorResponse",
    "AppointmentCreate",
    "AppointmentStatusUpdate",
    "AppointmentResponse",
    "SymptomCreate",
    "SymptomResponse",
    "PredictionRequest",
    "PredictionResponse",
    "ReportCreate",
    "ReportResponse",
    "ReportUpdate",
]
