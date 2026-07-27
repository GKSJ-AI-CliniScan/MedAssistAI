from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict

class PatientUpdate(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_type: Optional[str] = None
    height: Optional[str] = None
    weight: Optional[str] = None
    bmi: Optional[float] = None
    smoking: Optional[str] = None
    alcohol: Optional[str] = None
    bp_systolic: Optional[int] = None
    bp_diastolic: Optional[int] = None
    fasting_sugar: Optional[int] = None
    emergency_contact: Optional[Dict[str, Any]] = None
    allergies: Optional[List[str]] = None

class PatientResponse(BaseModel):
    id: int
    user_id: int
    age: int
    gender: str
    blood_type: str
    height: str
    weight: str
    bmi: float
    smoking: str
    alcohol: str
    bp_systolic: int
    bp_diastolic: int
    fasting_sugar: int
    emergency_contact: Dict[str, Any]
    allergies: List[str]

    model_config = ConfigDict(from_attributes=True)

class MedicalHistoryCreate(BaseModel):
    condition: str
    diagnosed_year: int
    category: Optional[str] = "Condition"
    status: Optional[str] = "Active"
    notes: Optional[str] = None

class MedicalHistoryResponse(BaseModel):
    id: int
    patient_id: int
    condition: str
    diagnosed_year: int
    category: str
    status: str
    notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
