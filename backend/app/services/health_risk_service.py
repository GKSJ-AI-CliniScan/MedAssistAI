import logging
from dataclasses import dataclass
from typing import Optional

logger = logging.getLogger(__name__)


@dataclass
class HealthRiskReport:
    predicted_disease: str
    confidence: Optional[float]
    risk_level: str
    severity_level: str
    severity_score: int
    emergency: bool
    recommendation: str
    summary: str


def generate_health_risk_report(
    predicted_disease: str,
    confidence: Optional[float],
    risk_level: str,
    severity_level: str,
    severity_score: int,
    emergency: bool,
    recommendation: str,
) -> HealthRiskReport:
    """
    Generate a structured health risk report using the
    disease prediction, risk assessment, and severity results.
    """

    if confidence is None:
        confidence_text = "Unavailable"
    else:
        confidence_text = f"{confidence:.1f}%"

    if emergency:
        emergency_text = "Emergency symptoms detected"
    else:
        emergency_text = "No emergency symptoms detected"

    summary = (
        f"Predicted disease: {predicted_disease}. "
        f"Prediction confidence: {confidence_text}. "
        f"Risk level: {risk_level}. "
        f"Symptom severity: {severity_level} "
        f"(score: {severity_score}). "
        f"{emergency_text}. "
        f"Recommendation: {recommendation}"
    )

    report = HealthRiskReport(
        predicted_disease=predicted_disease,
        confidence=confidence,
        risk_level=risk_level,
        severity_level=severity_level,
        severity_score=severity_score,
        emergency=emergency,
        recommendation=recommendation,
        summary=summary,
    )

    logger.info(
        "Health risk report generated | "
        "disease=%s | risk=%s | severity=%s | "
        "score=%s | emergency=%s",
        report.predicted_disease,
        report.risk_level,
        report.severity_level,
        report.severity_score,
        report.emergency,
    )

    return report