import logging
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

TREATMENT_GUIDELINES: Dict[str, Dict[str, Any]] = {
    "Cardiovascular": {
        "precautions": [
            "Avoid physical exertion until cleared by a physician",
            "Monitor blood pressure and pulse rate regularly",
            "Limit sodium and saturated fat intake"
        ],
        "treatment_suggestions": [
            "Immediate clinical evaluation by a cardiologist",
            "Electrocardiogram (ECG) and cardiac enzyme panel test",
            "Prescribed antihypertensive / antiarrhythmic management"
        ],
        "lifestyle": "Rest in an elevated position, stay hydrated, and maintain a calm environment."
    },
    "Respiratory": {
        "precautions": [
            "Avoid exposure to airborne irritants, smoke, and cold air",
            "Monitor oxygen saturation (SpO2) levels",
            "Practice controlled deep breathing exercises"
        ],
        "treatment_suggestions": [
            "Pulmonary function evaluation and chest X-ray",
            "Inhalation therapy or bronchodilators if prescribed",
            "Hydration and steam inhalation"
        ],
        "lifestyle": "Elevate head while sleeping and avoid smoking environments."
    },
    "General": {
        "precautions": [
            "Get adequate bed rest (7-9 hours daily)",
            "Maintain proper hydration with water and oral rehydration fluids",
            "Isolate if infectious symptoms develop"
        ],
        "treatment_suggestions": [
            "Complete blood count (CBC) and basic metabolic panel",
            "Symptomatic management as directed by a healthcare provider",
            "Follow-up consultation if symptoms persist over 48 hours"
        ],
        "lifestyle": "Balanced nutrition, rest, and fluid intake."
    }
}


def get_recommendations(
    predicted_disease: str,
    risk_level: str,
    severity_level: str,
    emergency: bool,
) -> Dict[str, Any]:
    """
    Generate comprehensive healthcare recommendations, treatment suggestions,
    and precautions based on prediction results.
    """
    category = "General"
    disease_lower = predicted_disease.lower()

    if "cardio" in disease_lower or "heart" in disease_lower or "chest" in disease_lower:
        category = "Cardiovascular"
    elif "respirat" in disease_lower or "lung" in disease_lower or "breath" in disease_lower or "cough" in disease_lower:
        category = "Respiratory"

    guidelines = TREATMENT_GUIDELINES.get(category, TREATMENT_GUIDELINES["General"])

    if emergency:
        urgent_note = "EMERGENCY ALERT: Immediate hospital or urgent care visit is required. Seek emergency medical attention immediately."
    elif severity_level == "Severe" or risk_level == "High":
        urgent_note = "HIGH RISK ALERT: Please schedule an urgent physician evaluation within 24 hours."
    elif severity_level == "Moderate" or risk_level == "Medium":
        urgent_note = "MODERATE RISK: Schedule a medical consultation soon for proper diagnosis."
    else:
        urgent_note = "LOW RISK: Monitor symptoms. Consult a doctor if condition worsens."

    return {
        "category": category,
        "urgent_note": urgent_note,
        "precautions": guidelines["precautions"],
        "treatment_suggestions": guidelines["treatment_suggestions"],
        "lifestyle_recommendations": guidelines["lifestyle"],
    }
