from typing import List, Optional

from pydantic import BaseModel, Field, field_validator


class PredictionRequest(BaseModel):
    symptoms: List[str] = Field(
        ...,
        min_length=1,
        description="List of patient symptoms used for disease prediction",
        examples=[["fever", "cough", "vomiting"]],
    )

    @field_validator("symptoms")
    @classmethod
    def validate_symptoms(cls, value: List[str]) -> List[str]:
        if not value:
            raise ValueError("symptoms list cannot be empty")

        cleaned = []

        for item in value:
            if item is None:
                continue

            text = str(item).strip()

            if text:
                cleaned.append(text)

        if not cleaned:
            raise ValueError(
                "symptoms must contain at least one non-empty value"
            )

        return cleaned


class PredictionResponse(BaseModel):
    predicted_disease: str

    confidence: Optional[float] = Field(
        default=None,
        description=(
            "Prediction confidence percentage (0-100). "
            "Null if unavailable."
        ),
    )

    risk_level: str = Field(
        description="Calculated health risk level"
    )

    severity_level: str = Field(
        description="Calculated symptom severity level"
    )

    severity_score: int = Field(
        description="Numerical symptom severity score"
    )

    emergency: bool = Field(
        description="Indicates whether emergency symptoms were detected"
    )

    recommendation: str = Field(
        description="Healthcare recommendation based on assessed risk"
    )

    health_risk_report: str = Field(
        description=(
            "Generated summary of the disease prediction, "
            "risk assessment, and symptom severity"
        )
    )