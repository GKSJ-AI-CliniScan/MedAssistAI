"""
Clinical Decision Engine Module.

Combines ML Risk Model probability with internal Disease Prediction API outputs
(predicted disease and confidence score) to compute composite risk scores,
determine final risk levels, assign severity grades, set emergency alerts,
and generate clinical recommendations without altering the underlying ML model prediction.
"""

from typing import Any, Dict, List
from app.schemas.response import RiskAssessmentResponse
from app.utils.logger import logger

# Critical medical conditions requiring immediate emergency alert status
CRITICAL_DISEASES = {
    "heart attack",
    "myocardial infarction",
    "stroke",
    "hypertensive crisis",
    "acute coronary syndrome",
    "pulmonary embolism",
    "pneumonia",
    "sepsis",
    "cardiac arrest",
    "anaphylaxis",
    "acute kidney failure",
    "heart failure",
    "brain hemorrhage",
    "aortic dissection",
}


class DecisionEngine:
    """Decision Layer for evaluating holistic patient health risk."""

    def evaluate_risk(
        self,
        ml_risk_output: Dict[str, Any],
        predicted_disease: str,
        prediction_confidence: float,
    ) -> RiskAssessmentResponse:
        """
        Combines ML model output with internal Disease Prediction outputs.

        Args:
            ml_risk_output: Dict containing 'risk_probability', 'raw_risk_level', etc.
            predicted_disease: Disease name predicted internally by Disease Prediction API.
            prediction_confidence: Confidence score of predicted disease (0.0 to 1.0).

        Returns:
            RiskAssessmentResponse containing:
                - risk_probability (unchanged from ML model)
                - risk_score
                - risk_level
                - severity
                - emergency_alert
                - recommendations
        """
        # 1. Preserve ML model risk probability unchanged
        risk_probability = float(ml_risk_output.get("risk_probability", 0.0))
        raw_risk_level = str(ml_risk_output.get("raw_risk_level", "Low"))

        logger.info(
            "DecisionEngine processing: ml_risk_probability=%.2f, raw_risk_level='%s', "
            "predicted_disease='%s', prediction_confidence=%.2f",
            risk_probability,
            raw_risk_level,
            predicted_disease,
            prediction_confidence,
        )

        disease_clean = predicted_disease.strip().lower()
        is_critical_disease = (
            disease_clean in CRITICAL_DISEASES or "heart" in disease_clean or "stroke" in disease_clean
        )
        high_confidence = prediction_confidence >= 0.50

        # 2. Emergency Alert Determination
        # Triggered if raw ML risk is High (or prob >= 0.75) OR if a critical disease is predicted with high confidence
        emergency_alert = False
        if raw_risk_level == "High" or risk_probability >= 0.75 or (is_critical_disease and high_confidence):
            emergency_alert = True

        # 3. Final Risk Level Determination
        # Does not alter risk_probability, but determines displayed risk_level
        if emergency_alert or raw_risk_level == "High" or risk_probability >= 0.70:
            final_risk_level = "High"
        elif raw_risk_level == "Medium" or risk_probability >= 0.40 or (prediction_confidence >= 0.60 and disease_clean != "unknown"):
            final_risk_level = "Medium"
        else:
            final_risk_level = "Low"

        # 4. Severity Determination
        if emergency_alert and (risk_probability >= 0.85 or is_critical_disease):
            severity = "Critical"
        elif final_risk_level == "High":
            severity = "Severe"
        elif final_risk_level == "Medium":
            severity = "Moderate"
        else:
            severity = "Mild"

        # 5. Composite Risk Score Calculation (0 - 100)
        # Base score derived from ML probability
        base_score = int(round(risk_probability * 100))

        # Adjust score for high confidence disease predictions if score is lower than disease risk
        disease_score_boost = 0
        if high_confidence and disease_clean != "unknown":
            if is_critical_disease:
                disease_score_boost = 20
            elif prediction_confidence >= 0.75:
                disease_score_boost = 10

        risk_score = min(100, max(0, base_score + disease_score_boost))

        # 6. Clinical Recommendations Synthesis
        recommendations: List[str] = []

        if emergency_alert:
            recommendations.append("URGENT: Seek immediate emergency medical care or visit the nearest emergency department.")

        if final_risk_level == "High":
            recommendations.append("Consult a healthcare professional or specialist immediately for comprehensive diagnostic evaluation.")
            recommendations.append("Monitor vital signs (blood pressure, heart rate, oxygen levels) closely.")
        elif final_risk_level == "Medium":
            recommendations.append("Schedule a consultation with a primary care physician to discuss reported health indicators.")
            recommendations.append("Monitor health status daily and seek medical attention if symptoms escalate.")
        else:
            recommendations.append("Maintain a healthy lifestyle, including a balanced diet and regular physical activity.")
            recommendations.append("Schedule routine annual health check-ups with your doctor.")

        if risk_score > 50 and not emergency_alert:
            recommendations.append("Consider lifestyle modifications such as stress management and dietary adjustments.")

        logger.info(
            "DecisionEngine complete: final_risk_score=%d, final_risk_level='%s', "
            "severity='%s', emergency_alert=%s",
            risk_score,
            final_risk_level,
            severity,
            emergency_alert,
        )

        return RiskAssessmentResponse(
            risk_probability=risk_probability,
            risk_score=risk_score,
            risk_level=final_risk_level,
            severity=severity,
            emergency_alert=emergency_alert,
            recommendations=recommendations,
        )


decision_engine = DecisionEngine()
