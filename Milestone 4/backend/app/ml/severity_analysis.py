import logging
from dataclasses import dataclass
from typing import Dict, List

from app.ml.preprocessing import normalize_symptom

logger = logging.getLogger(__name__)


# Severity weights used by the rule-based severity engine.
SYMPTOM_WEIGHTS: Dict[str, int] = {
    # Emergency / Critical symptoms (Weight 5)
    "unconsciousness": 5,
    "fainting": 5,
    "seizure": 5,
    "seizures": 5,
    "severe_bleeding": 5,
    "vomiting_blood": 5,
    "hemoptysis": 5,
    "apnea": 5,
    "blindness": 5,
    "sharp_chest_pain": 5,
    "chest_pain": 5,
    "difficulty_breathing": 5,

    # High-priority symptoms (Weight 4)
    "shortness_of_breath": 4,
    "chest_tightness": 4,
    "burning_chest_pain": 4,
    "blood_in_urine": 4,
    "blood_in_stool": 4,
    "rectal_bleeding": 4,
    "melena": 4,
    "high_fever": 4,
    "persistent_vomiting": 4,
    "severe_headache": 4,
    "jaundice": 4,

    # Moderate-priority symptoms (Weight 3)
    "fever": 3,
    "sharp_abdominal_pain": 3,
    "abdominal_pain": 3,
    "upper_abdominal_pain": 3,
    "lower_abdominal_pain": 3,
    "dizziness": 3,
    "wheezing": 3,
    "palpitations": 3,
    "irregular_heartbeat": 3,
    "persistent_cough": 3,
    "throat_swelling": 3,
    "difficulty_in_swallowing": 3,
    "swollen_lymph_nodes": 3,

    # Common lower-priority symptoms (Weight 2)
    "cough": 2,
    "vomiting": 2,
    "diarrhea": 2,
    "back_pain": 2,
    "low_back_pain": 2,
    "joint_pain": 2,
    "muscle_pain": 2,
    "weakness": 2,
    "headache": 2,
    "nausea": 2,
    "insomnia": 2,
    "chills": 2,
    "sweating": 2,
    "fatigue": 2,
    "sore_throat": 2,
    "nasal_congestion": 2,
}

EMERGENCY_SYMPTOMS = {
    "chest_pain",
    "sharp_chest_pain",
    "difficulty_breathing",
    "shortness_of_breath",
    "unconsciousness",
    "fainting",
    "seizure",
    "seizures",
    "severe_bleeding",
    "vomiting_blood",
    "hemoptysis",
    "apnea",
    "blindness",
}


@dataclass
class SeverityResult:
    severity_level: str
    severity_score: int
    emergency: bool
    matched_symptoms: List[str]
    unknown_symptoms: List[str]


def calculate_severity_score(symptoms: List[str]) -> int:
    """
    Calculate the total severity score for known symptoms.
    """
    score = 0
    for symptom in symptoms:
        normalized = normalize_symptom(symptom)
        score += SYMPTOM_WEIGHTS.get(normalized, 1)

    return score


def identify_emergency(symptoms: List[str]) -> bool:
    """
    Check whether any emergency symptom is present.
    """

    normalized_symptoms = {
        normalize_symptom(symptom)
        for symptom in symptoms
        if symptom
    }

    return bool(normalized_symptoms & EMERGENCY_SYMPTOMS)


def categorize_severity(score: int, emergency: bool) -> str:
    """
    Convert severity score into a severity category.
    """

    if emergency:
        return "Severe"

    if score >= 7:
        return "Severe"

    if score >= 3:
        return "Moderate"

    return "Mild"


def assess_severity(symptoms: List[str]) -> SeverityResult:
    """
    Run the complete symptom severity assessment.

    Pipeline:
        normalize symptoms
        -> calculate weighted score
        -> identify emergency symptoms
        -> categorize severity
        -> return structured result
    """

    if not symptoms:
        logger.warning("Severity assessment received empty symptom list")

        return SeverityResult(
            severity_level="Unknown",
            severity_score=0,
            emergency=False,
            matched_symptoms=[],
            unknown_symptoms=[],
        )

    matched_symptoms = []
    unknown_symptoms = []

    for symptom in symptoms:
        if not symptom:
            continue

        normalized = normalize_symptom(symptom)

        if normalized in SYMPTOM_WEIGHTS:
            matched_symptoms.append(normalized)
        else:
            unknown_symptoms.append(normalized)

    score = calculate_severity_score(symptoms)

    emergency = identify_emergency(symptoms)

    severity_level = categorize_severity(
        score=score,
        emergency=emergency,
    )

    result = SeverityResult(
        severity_level=severity_level,
        severity_score=score,
        emergency=emergency,
        matched_symptoms=matched_symptoms,
        unknown_symptoms=unknown_symptoms,
    )

    logger.info(
        "Severity assessment completed | "
        "score=%s | severity=%s | emergency=%s | "
        "matched=%s | unknown=%s",
        result.severity_score,
        result.severity_level,
        result.emergency,
        result.matched_symptoms,
        result.unknown_symptoms,
    )

    return result