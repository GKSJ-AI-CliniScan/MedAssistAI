"""
Pydantic Schemas for Patient Health Data and Risk Assessment.

Defines request structures with field validations, type hints, and OpenAPI
Swagger example schemas for risk assessment, including CDC BRFSS features and symptoms.
"""

from typing import List
from pydantic import BaseModel, Field, ConfigDict

from app.schemas.response import RiskAssessmentResponse


class RiskAssessmentRequest(BaseModel):
    """
    Request model for patient health risk assessment based on patient BRFSS clinical features
    and reported symptoms.
    """
    age: int = Field(
        ...,
        ge=0,
        le=120,
        description="Patient's age in years (0 to 120).",
        examples=[65]
    )
    gender: int = Field(
        ...,
        ge=0,
        le=1,
        description="Biological sex (1=Male, 0=Female).",
        examples=[1]
    )
    bmi: float = Field(
        ...,
        ge=10.0,
        le=100.0,
        description="Body Mass Index (BMI in kg/m²).",
        examples=[28.5]
    )
    general_health: int = Field(
        ...,
        ge=1,
        le=5,
        description="Self-reported general health status (1=Excellent, 2=Very Good, 3=Good, 4=Fair, 5=Poor).",
        examples=[3]
    )
    exercise: int = Field(
        ...,
        ge=0,
        le=1,
        description="Physical activity or exercise in past 30 days (1=Yes, 0=No).",
        examples=[1]
    )
    smoking: int = Field(
        ...,
        ge=0,
        le=1,
        description="Smoked at least 100 cigarettes in lifetime (1=Yes, 0=No).",
        examples=[0]
    )
    alcohol: int = Field(
        ...,
        ge=0,
        le=1,
        description="Alcohol consumption in past 30 days (1=Yes, 0=No).",
        examples=[1]
    )
    diabetes: int = Field(
        ...,
        ge=0,
        le=1,
        description="Ever told by a doctor that you have diabetes (1=Yes, 0=No).",
        examples=[1]
    )
    arthritis: int = Field(
        ...,
        ge=0,
        le=1,
        description="Ever told by a doctor that you have arthritis (1=Yes, 0=No).",
        examples=[1]
    )
    asthma: int = Field(
        ...,
        ge=0,
        le=1,
        description="Ever told by a doctor that you have asthma (1=Yes, 0=No).",
        examples=[0]
    )
    copd: int = Field(
        ...,
        ge=0,
        le=1,
        description="Ever told by a doctor that you have COPD or Chronic Bronchitis (1=Yes, 0=No).",
        examples=[0]
    )
    kidney_disease: int = Field(
        ...,
        ge=0,
        le=1,
        description="Ever told by a doctor that you have kidney disease (1=Yes, 0=No).",
        examples=[0]
    )
    mental_health: int = Field(
        ...,
        ge=0,
        le=30,
        description="Number of days mental health was not good in the past 30 days (0 to 30).",
        examples=[2]
    )
    physical_health: int = Field(
        ...,
        ge=0,
        le=30,
        description="Number of days physical health was not good in the past 30 days (0 to 30).",
        examples=[5]
    )
    symptoms: List[str] = Field(
        default_factory=list,
        description="List of patient-reported symptoms for Disease Prediction integration.",
        examples=[["chest_pain", "shortness_of_breath"]]
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "age": 65,
                "gender": 1,
                "bmi": 28.5,
                "general_health": 3,
                "exercise": 1,
                "smoking": 0,
                "alcohol": 1,
                "diabetes": 1,
                "arthritis": 1,
                "asthma": 0,
                "copd": 0,
                "kidney_disease": 0,
                "mental_health": 2,
                "physical_health": 5,
                "symptoms": ["chest_pain", "shortness_of_breath"]
            }
        }
    )


__all__ = ["RiskAssessmentRequest", "RiskAssessmentResponse"]