import logging
from dataclasses import dataclass
from typing import Dict, List

from app.ml.preprocessing import normalize_symptom

logger = logging.getLogger(__name__)


# Severity weights used by the rule-based severity engine.
# These can later be replaced or extended using the final dataset.
SYMPTOM_WEIGHTS: Dict[str, int] = {
    # High-priority symptoms
    "chest_pain": 5,
    "difficulty_breathing": 5,
    "shortness_of_breath": 5,
    "unconsciousness": 5,
    "seizure": 5,
    "severe_bleeding": 5,

    # Moderate-priority symptoms
    "high_fever": 3,
    "persistent_vomiting": 3,
    "severe_headache": 3,
    "abdominal_pain": 3,
    "dizziness": 3,
    "persistent_cough": 3,

    # Common lower-priority symptoms
    "fever": 2,
    "vomiting": 2,
    "headache": 1,
    "cough": 1,
    "fatigue": 1,
    "nausea": 1,
}


EMERGENCY_SYMPTOMS = {
    "chest_pain",
    "difficulty_breathing",
    "shortness_of_breath",
    "unconsciousness",
    "seizure",
    "severe_bleeding",
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
        score += SYMPTOM_WEIGHTS.get(normalized, 0)

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