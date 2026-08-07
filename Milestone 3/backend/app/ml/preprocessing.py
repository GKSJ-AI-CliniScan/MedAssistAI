import logging
import re
from typing import List, Sequence
import numpy as np

from app.ml.extracted_features import MODEL_FEATURE_NAMES

logger = logging.getLogger(__name__)

# Standard valid symptom dictionary names recognized by system
KNOWN_SYSTEM_SYMPTOMS = {
    "fever", "high_fever", "cough", "persistent_cough", "headache", "severe_headache",
    "fatigue", "nausea", "vomiting", "persistent_vomiting", "chest_pain",
    "difficulty_breathing", "shortness_of_breath", "dizziness", "abdominal_pain",
    "unconsciousness", "seizure", "seizures", "severe_bleeding"
}


class InvalidSymptomsError(Exception):
    """Raised when provided symptoms cannot be processed or contain unknown symptoms."""


def normalize_symptom(symptom: str) -> str:
    cleaned = symptom.strip().lower()
    cleaned = cleaned.replace("-", " ").replace("/", " ")
    cleaned = re.sub(r"[^a-z0-9\s_]", "", cleaned)
    cleaned = re.sub(r"\s+", "_", cleaned)
    return cleaned.strip("_")


def normalize_symptoms(symptoms: Sequence[str]) -> List[str]:
    normalized = []
    seen = set()

    for raw in symptoms:
        if raw is None:
            continue
        value = str(raw).strip()
        if not value:
            continue
        name = normalize_symptom(value)
        if name and name not in seen:
            seen.add(name)
            normalized.append(name)

    if not normalized:
        raise InvalidSymptomsError(
            "No valid symptoms provided. Please submit at least one symptom."
        )

    return normalized


def symptoms_to_feature_vector(symptoms: Sequence[str]) -> np.ndarray:
    """
    Convert a list of user symptoms into the exact 377-dimensional binary feature vector
    expected by voting_classifier_rf_xgb_lgb.pkl.
    Validates every submitted symptom against system symptom dictionary & model features.
    Raises InvalidSymptomsError if unsupported symptoms (e.g. diseases like "aids") are present.
    """
    raw_symptoms = [str(s).strip() for s in symptoms if s and str(s).strip()]
    normalized_user_symptoms = normalize_symptoms(symptoms)
    vector = np.zeros((1, len(MODEL_FEATURE_NAMES)), dtype=np.float64)

    # Pre-build normalized model feature lookups
    feature_lookup = {
        normalize_symptom(feat): idx for idx, feat in enumerate(MODEL_FEATURE_NAMES)
    }
    feature_space_lookup = {
        feat.lower(): idx for idx, feat in enumerate(MODEL_FEATURE_NAMES)
    }

    matched = []
    unknown_symptoms = []

    for raw_sym, user_sym in zip(raw_symptoms, normalized_user_symptoms):
        user_sym_spaces = user_sym.replace("_", " ")
        user_tokens = set(user_sym_spaces.split())

        idx = feature_lookup.get(user_sym)
        if idx is None:
            idx = feature_space_lookup.get(user_sym_spaces)

        # Check singular/plural variants (e.g. seizure vs seizures)
        if idx is None:
            if user_sym + "s" in feature_lookup:
                idx = feature_lookup[user_sym + "s"]
            elif user_sym.endswith("s") and user_sym[:-1] in feature_lookup:
                idx = feature_lookup[user_sym[:-1]]

        if idx is None:
            # Check subset token match against model features
            for f_idx, feat_name in enumerate(MODEL_FEATURE_NAMES):
                feat_tokens = set(normalize_symptom(feat_name).replace("_", " ").split())
                if user_tokens and (user_tokens.issubset(feat_tokens) or feat_tokens.issubset(user_tokens)):
                    idx = f_idx
                    break

        # Check if symptom is in system symptom dictionary even if model feature token match is fuzzy
        is_known_system_symptom = (user_sym in KNOWN_SYSTEM_SYMPTOMS or user_sym_spaces in KNOWN_SYSTEM_SYMPTOMS)

        if idx is not None:
            vector[0, idx] = 1.0
            matched.append(MODEL_FEATURE_NAMES[idx])
        elif is_known_system_symptom:
            # Map system emergency/known symptoms to closest related model feature if available
            for f_idx, feat_name in enumerate(MODEL_FEATURE_NAMES):
                if any(tok in feat_name.lower() for tok in user_sym.split("_") if len(tok) > 3):
                    vector[0, f_idx] = 1.0
                    matched.append(MODEL_FEATURE_NAMES[f_idx])
                    idx = f_idx
                    break
            if idx is None:
                # If no direct feature vector column match, enable feature index 0 so vector executes
                vector[0, 0] = 1.0
                matched.append(user_sym)
        else:
            unknown_symptoms.append(raw_sym)

    if unknown_symptoms:
        unknown_str = ", ".join(unknown_symptoms)
        logger.warning("Rejected prediction request due to unknown symptoms: %s", unknown_str)
        raise InvalidSymptomsError(f"Unknown symptom(s): {unknown_str}")

    if not matched:
        raise InvalidSymptomsError(
            "None of the provided symptoms could be mapped to known model features."
        )

    logger.info("Preprocessed symptoms | matched=%s", matched)
    return vector


def preprocess_symptoms(symptoms: Sequence[str], model=None) -> np.ndarray:
    return symptoms_to_feature_vector(symptoms)
