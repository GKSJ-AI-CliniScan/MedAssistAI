"""
Pydantic Schemas Package.
"""

from app.schemas.patient import RiskAssessmentRequest
from app.schemas.response import RiskAssessmentResponse

__all__ = ["RiskAssessmentRequest", "RiskAssessmentResponse"]
