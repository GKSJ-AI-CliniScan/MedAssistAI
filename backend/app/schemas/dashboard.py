from typing import List, Dict, Any
from pydantic import BaseModel

class DashboardStatsResponse(BaseModel):
    patientsToday: int
    consultations: int
    aiPredictions: int
    pendingReports: int
    criticalCases: int
    avgHealthScore: float
    recoveryRate: float
    predictionAccuracy: float

class PatientDashboardResponse(BaseModel):
    stats: DashboardStatsResponse
    recentPatients: List[Dict[str, Any]]
    activities: List[Dict[str, Any]]
    aiInsights: List[Dict[str, Any]]

class DoctorDashboardResponse(BaseModel):
    totalPatients: int
    criticalPatients: int
    pendingConsultations: int
    recentCases: List[Dict[str, Any]]

class AdminDashboardResponse(BaseModel):
    totalUsers: int
    totalPatients: int
    totalDoctors: int
    totalPredictions: int
    systemHealth: Dict[str, Any]
