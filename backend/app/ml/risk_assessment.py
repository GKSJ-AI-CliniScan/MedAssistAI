import logging
from typing import Optional, Tuple

logger = logging.getLogger(__name__)

RECOMMENDATIONS = {
    "Emergency": "EMERGENCY ALERT: Immediate hospital or urgent care visit is required. Consult an emergency physician immediately.",
    "High": "HIGH RISK: Consult a doctor immediately. Schedule an urgent physician evaluation within 24 hours.",
    "Medium": "MODERATE RISK: Schedule a medical consultation soon for proper clinical evaluation.",
    "Low": "LOW RISK: Monitor your symptoms and maintain healthy habits. Consult a doctor if symptoms persist.",
    "Unknown": "Unable to assess risk confidently. Please consult a healthcare professional.",
}


def assess_risk(
    confidence: Optional[float],
    severity_score: int = 0,
    severity_level: str = "Mild",
    emergency: bool = False,
) -> Tuple[str, str]:
    """
    Assess health risk level by evaluating emergency status, symptom severity score/level,
    and prediction confidence.

    Emergency / High severity rules override prediction confidence:
        - Emergency=True OR Severity="Severe" OR severity_score >= 10 -> Risk Level = "High"
        - Severity="Moderate" OR severity_score >= 4 OR confidence >= 70 -> Risk Level = "Medium"
        - Mild symptoms & low severity score -> Risk Level = "Low"
    """
    if emergency or severity_level == "Severe" or severity_score >= 10:
        risk_level = "High"
        recommendation = RECOMMENDATIONS["Emergency"] if emergency else RECOMMENDATIONS["High"]
    elif severity_level == "Moderate" or severity_score >= 4 or (confidence is not None and confidence >= 70.0):
        risk_level = "Medium"
        recommendation = RECOMMENDATIONS["Medium"]
    else:
        risk_level = "Low"
        recommendation = RECOMMENDATIONS["Low"]

    logger.info(
        "Risk assessed | confidence=%s | severity_score=%s | severity_level=%s | emergency=%s | risk_level=%s",
        confidence,
        severity_score,
        severity_level,
        emergency,
        risk_level,
    )
    return risk_level, recommendation
