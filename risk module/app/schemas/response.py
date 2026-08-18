"""
Pydantic Response Schemas for Patient Risk Assessment.

Defines API response structures with validation constraints, field descriptions,
type hints, and OpenAPI Swagger documentation examples.
"""

from typing import List
from pydantic import BaseModel, Field, ConfigDict


class RiskAssessmentResponse(BaseModel):
    """
    Response schema for patient health risk assessment.

    Contains ML prediction metrics, risk score, classification level,
    severity grade, emergency alert status, and clinical recommendations.
    """
    risk_probability: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Machine Learning model predicted risk probability (0.0 to 1.0).",
        examples=[0.87]
    )
    risk_score: int = Field(
        ...,
        ge=0,
        le=100,
        description="Composite health risk score evaluated on a 0 to 100 scale.",
        examples=[87]
    )
    risk_level: str = Field(
        ...,
        description="Risk level categorization ('High', 'Medium', 'Low').",
        examples=["High"]
    )
    severity: str = Field(
        ...,
        description="Patient risk severity grade ('Severe', 'Moderate', 'Mild', 'Critical').",
        examples=["Severe"]
    )
    emergency_alert: bool = Field(
        ...,
        description="Boolean flag indicating whether immediate medical emergency intervention is needed.",
        examples=[True]
    )
    recommendations: List[str] = Field(
        ...,
        description="Prioritized clinical and lifestyle recommendations derived from holistic evaluation.",
        examples=[["Consult a healthcare professional immediately.", "Seek urgent medical evaluation if symptoms worsen."]]
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "risk_probability": 0.87,
                "risk_score": 87,
                "risk_level": "High",
                "severity": "Severe",
                "emergency_alert": True,
                "recommendations": [
                    "Consult a healthcare professional immediately.",
                    "Seek urgent medical evaluation if symptoms worsen."
                ]
            }
        }
    )
