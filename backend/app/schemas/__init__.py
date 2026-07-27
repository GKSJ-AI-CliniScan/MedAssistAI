from app.schemas.auth import Token, TokenData, UserRegister, UserLogin, UserResponse, ForgotPassword, ResetPassword, RefreshTokenInput
from app.schemas.patient import PatientUpdate, PatientResponse, MedicalHistoryCreate, MedicalHistoryResponse
from app.schemas.symptom import SymptomResponse, SymptomSearchQuery
from app.schemas.prediction import PredictionRequest, PredictionResponse, DiseaseResult
from app.schemas.risk import RiskAssessmentRequest, RiskAssessmentResponse, RiskFactor
from app.schemas.recommendation import RecommendationResponse, MedicineAdvice
from app.schemas.report import ReportResponse
from app.schemas.dashboard import DashboardStatsResponse, PatientDashboardResponse, DoctorDashboardResponse, AdminDashboardResponse
from app.schemas.doctor import DoctorCreate, DoctorUpdate, DoctorResponse
from app.schemas.appointment import AppointmentCreate, AppointmentUpdate, AppointmentResponse

__all__ = [
    "Token", "TokenData", "UserRegister", "UserLogin", "UserResponse", "ForgotPassword", "ResetPassword", "RefreshTokenInput",
    "PatientUpdate", "PatientResponse", "MedicalHistoryCreate", "MedicalHistoryResponse",
    "SymptomResponse", "SymptomSearchQuery",
    "PredictionRequest", "PredictionResponse", "DiseaseResult",
    "RiskAssessmentRequest", "RiskAssessmentResponse", "RiskFactor",
    "RecommendationResponse", "MedicineAdvice",
    "ReportResponse",
    "DashboardStatsResponse", "PatientDashboardResponse", "DoctorDashboardResponse", "AdminDashboardResponse",
    "DoctorCreate", "DoctorUpdate", "DoctorResponse",
    "AppointmentCreate", "AppointmentUpdate", "AppointmentResponse"
]
