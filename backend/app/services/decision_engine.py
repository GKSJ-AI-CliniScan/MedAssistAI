from typing import Any, Dict, List

from app.schemas.response import RiskAssessmentResponse
from app.utils.logger import logger


# Diseases/conditions that may require urgent medical attention.
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

    def evaluate_risk(
        self,
        ml_risk_output: Dict[str, Any],
        predicted_disease: str,
        prediction_confidence: float,
    ) -> RiskAssessmentResponse:

        # 1. READ OVERALL PATIENT RISK

        try:
            patient_risk_probability = float(
                ml_risk_output.get(
                    "risk_probability",
                    0.0
                )
            )
        except (ValueError, TypeError):
            patient_risk_probability = 0.0

        patient_risk_probability = max(
            0.0,
            min(1.0, patient_risk_probability)
        )

        patient_risk_level = str(
            ml_risk_output.get(
                "raw_risk_level",
                "Low"
            )
        ).strip().title()


        # 2. READ DISEASE PREDICTION

        disease = (
            predicted_disease.strip()
            if predicted_disease
            else "Unknown"
        )

        disease_lower = disease.lower()

        # Safely convert disease confidence
        try:
            disease_confidence = float(
                prediction_confidence
            )
        except (ValueError, TypeError):
            disease_confidence = 0.0

        disease_confidence = max(
            0.0,
            min(1.0, disease_confidence)
        )

        # 3. DISEASE CONFIDENCE CATEGORY

        if disease_confidence >= 0.80:
            disease_confidence_level = "High"

        elif disease_confidence >= 0.50:
            disease_confidence_level = "Moderate"

        else:
            disease_confidence_level = "Low"

        # 4. CRITICAL DISEASE DETECTION

        is_critical_disease = any(
            term in disease_lower
            for term in CRITICAL_DISEASES
        )

        logger.info(
            "Decision Engine input: "
            "disease=%s | "
            "disease_confidence=%.2f | "
            "patient_risk_probability=%.2f | "
            "patient_risk_level=%s",
            disease,
            disease_confidence,
            patient_risk_probability,
            patient_risk_level,
        )
        # 5. PERSONALIZED FINAL RISK LEVEL

        final_risk_level = patient_risk_level
        # HIGH BASELINE PATIENT RISK

        if patient_risk_level == "High":

            final_risk_level = "High"

        # MEDIUM BASELINE PATIENT RISK

        elif patient_risk_level == "Medium":

            if (
                is_critical_disease
                and disease_confidence >= 0.80
            ):
                final_risk_level = "High"

            else:
                final_risk_level = "Medium"

        # LOW BASELINE PATIENT RISK

        else:

            if (
                is_critical_disease
                and disease_confidence >= 0.80
            ):
                final_risk_level = "High"

            elif (
                disease_confidence >= 0.90
                and patient_risk_probability >= 0.30
            ):
                final_risk_level = "Medium"

            else:
                final_risk_level = "Low"
        # 6. RISK SCORE

        risk_score = int(
            round(
                patient_risk_probability * 100
            )
        )

        risk_score = max(
            0,
            min(100, risk_score)
        )

        # 7. EMERGENCY ALERT

        # Critical disease + high confidence + high final risk
        emergency_alert = (
            is_critical_disease
            and disease_confidence >= 0.80
            and final_risk_level == "High"
        )

        if patient_risk_probability >= 0.90:
            emergency_alert = True
        # 8. SEVERITY

        if emergency_alert:

            severity = "Critical"

        elif final_risk_level == "High":

            severity = "Severe"

        elif final_risk_level == "Medium":

            severity = "Moderate"

        else:

            severity = "Mild"

        # 9. GENERAL RECOMMENDATIONS

        recommendations: List[str] = []

        if emergency_alert:

            recommendations.append(
                "Urgent medical evaluation is recommended. "
                "Seek emergency care if severe or rapidly "
                "worsening symptoms are present."
            )

        elif final_risk_level == "High":

            recommendations.append(
                "Prompt consultation with a healthcare "
                "professional is recommended for further evaluation."
            )

            recommendations.append(
                "Monitor symptoms and relevant health indicators "
                "and seek medical attention if they worsen."
            )

        elif final_risk_level == "Medium":

            recommendations.append(
                "Schedule a healthcare consultation to discuss "
                "the patient's symptoms and health indicators."
            )

            recommendations.append(
                "Continue monitoring the patient's health status."
            )

        else:

            recommendations.append(
                "Maintain a healthy lifestyle including balanced "
                "nutrition and regular physical activity."
            )

            recommendations.append(
                "Continue routine health check-ups."
            )

        # 10. DISEASE-SPECIFIC INFORMATION

        if "diabetes" in disease_lower:

            recommendations.append(
                "Discuss blood glucose monitoring and appropriate "
                "lifestyle management with a healthcare professional."
            )

        elif (
            "hypertension" in disease_lower
            or "high blood pressure" in disease_lower
        ):

            recommendations.append(
                "Consider regular blood pressure monitoring and "
                "discuss appropriate lifestyle measures with a "
                "healthcare professional."
            )

        elif "asthma" in disease_lower:

            recommendations.append(
                "Monitor respiratory symptoms and follow the "
                "patient's existing healthcare plan."
            )

        elif "heart" in disease_lower:

            recommendations.append(
                "Discuss cardiovascular symptoms and risk factors "
                "with a healthcare professional."
            )
        # 11. INTERNAL LOGGING

        logger.info(
            "Decision Engine completed: "
            "disease=%s | "
            "disease_confidence=%.2f (%s) | "
            "overall_risk=%.2f (%s) | "
            "final_risk=%s | "
            "risk_score=%d | "
            "severity=%s | "
            "emergency=%s",
            disease,
            disease_confidence,
            disease_confidence_level,
            patient_risk_probability,
            patient_risk_level,
            final_risk_level,
            risk_score,
            severity,
            emergency_alert,
        )
        # 12. USER-FACING RESPONSE

        return RiskAssessmentResponse(
            risk_probability=patient_risk_probability,
            risk_score=risk_score,
            risk_level=final_risk_level,
            severity=severity,
            emergency_alert=emergency_alert,
            recommendations=recommendations,
        )


# Global Decision Engine instance
decision_engine = DecisionEngine()