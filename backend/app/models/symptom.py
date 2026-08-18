from pydantic import BaseModel, Field
from typing import Dict, Optional

class SymptomMetadataDB(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    key: str  # e.g., "anxiety_and_nervousness"
    display_name: str  # e.g., "Anxiety and nervousness"
    category: Optional[str] = "General"

class DiseaseProfileDB(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    disease: str  # e.g., "panic disorder"
    symptom_probabilities: Dict[str, float]  # symptom_key -> probability of having it (0.0 to 1.0)
    base_rate: float  # prior probability P(disease)
    occurrences: int  # count of occurrences in the dataset
