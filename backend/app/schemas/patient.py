from pydantic import BaseModel
from typing import List, Optional

class RiskAssessmentRequest(BaseModel):
    symptoms: List[str]
    age: int
    medical_conditions: List[str] = []          
    predicted_disease: Optional[str] = None      
    prediction_confidence: Optional[float] = None  
    systolic_bp: Optional[int] = None            
    diastolic_bp: Optional[int] = None           
    blood_sugar_level: Optional[float] = None    