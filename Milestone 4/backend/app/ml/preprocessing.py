import logging
import re
from typing import List, Sequence, Dict
import numpy as np

from app.ml.extracted_features import MODEL_FEATURE_NAMES

logger = logging.getLogger(__name__)

# Comprehensive clinical & colloquial symptom aliases mapping to exact 377 MODEL_FEATURE_NAMES
SYMPTOM_ALIASES: Dict[str, str] = {
    # General & Systemic
    "loss_of_appetite": "decreased appetite",
    "loss_appetite": "decreased appetite",
    "no_appetite": "decreased appetite",
    "poor_appetite": "decreased appetite",
    "lack_of_appetite": "decreased appetite",
    "exhaustion": "fatigue",
    "tiredness": "fatigue",
    "lethargy": "fatigue",
    "extreme_tiredness": "fatigue",
    "feeling_cold": "feeling cold",
    "feeling_hot": "feeling hot",
    "feverish": "fever",
    "pyrexia": "fever",
    "high_temperature": "fever",
    "shivering": "chills",
    "cold_chills": "chills",
    "excessive_sweating": "sweating",
    "night_sweats": "sweating",
    "perspiration": "sweating",
    "weight_loss": "recent weight loss",
    "losing_weight": "recent weight loss",
    "weight_gain": "weight gain",
    "gaining_weight": "weight gain",
    "body_ache": "ache all over",
    "body_pain": "ache all over",
    "generalized_weakness": "weakness",

    # Respiratory & ENT
    "runny_nose": "coryza",
    "rhinorrhea": "coryza",
    "stuffy_nose": "nasal congestion",
    "blocked_nose": "nasal congestion",
    "nasal_blockage": "nasal congestion",
    "sore_throat": "sore throat",
    "throat_pain": "sore throat",
    "pharyngitis": "sore throat",
    "swollen_throat": "throat swelling",
    "tight_throat": "throat feels tight",
    "difficulty_swallowing": "difficulty in swallowing",
    "dysphagia": "difficulty in swallowing",
    "breathlessness": "shortness of breath",
    "shortness_of_breath": "shortness of breath",
    "dyspnea": "shortness of breath",
    "difficulty_breathing": "difficulty breathing",
    "labored_breathing": "difficulty breathing",
    "fast_breathing": "breathing fast",
    "tachypnea": "breathing fast",
    "chest_congestion": "congestion in chest",
    "coughing_blood": "hemoptysis",
    "spitting_blood": "hemoptysis",
    "ear_ringing": "ringing in ear",
    "tinnitus": "ringing in ear",
    "loss_of_smell": "disturbance of smell or taste",
    "loss_of_taste": "disturbance of smell or taste",
    "anosmia": "disturbance of smell or taste",
    "ageusia": "disturbance of smell or taste",
    "blurred_vision": "diminished vision",
    "blurry_vision": "diminished vision",
    "vision_loss": "diminished vision",
    "poor_vision": "diminished vision",
    "tooth_pain": "toothache",
    "dental_pain": "toothache",
    "tooth_ache": "toothache",

    # Cardiovascular
    "chest_pain": "sharp chest pain",
    "chest_pressure": "chest tightness",
    "tight_chest": "chest tightness",
    "burning_chest": "burning chest pain",
    "heart_racing": "palpitations",
    "fast_heartbeat": "palpitations",
    "irregular_pulse": "irregular heartbeat",
    "arrhythmia": "irregular heartbeat",

    # Digestive & Gastrointestinal
    "stomach_ache": "upper abdominal pain",
    "stomach_pain": "sharp abdominal pain",
    "belly_pain": "lower abdominal pain",
    "abdominal_cramps": "burning abdominal pain",
    "acid_reflux": "heartburn",
    "indigestion": "heartburn",
    "bloating": "stomach bloating",
    "abdominal_bloating": "abdominal distention",
    "distended_stomach": "swollen abdomen",
    "gas": "flatulence",
    "throwing_up": "vomiting",
    "emesis": "vomiting",
    "feeling_sick": "nausea",
    "queasiness": "nausea",
    "loose_stools": "diarrhea",
    "watery_stools": "diarrhea",
    "constipated": "constipation",
    "hard_stools": "constipation",
    "bloody_vomit": "vomiting blood",
    "hematemesis": "vomiting blood",
    "blood_in_vomit": "vomiting blood",
    "black_stools": "melena",
    "bloody_stools": "blood in stool",

    # Neurological
    "head_pain": "headache",
    "cephalalgia": "headache",
    "migraine": "frontal headache",
    "lightheadedness": "dizziness",
    "vertigo": "dizziness",
    "fainting": "fainting",
    "syncope": "fainting",
    "passing_out": "fainting",
    "loss_of_consciousness": "fainting",
    "unconsciousness": "fainting",
    "numbness": "loss of sensation",
    "tingling": "paresthesia",
    "pins_and_needles": "paresthesia",
    "tremors": "abnormal involuntary movements",
    "tremor": "abnormal involuntary movements",
    "shaking_hands": "abnormal involuntary movements",
    "convulsions": "seizures",
    "seizure": "seizures",
    "fits": "seizures",
    "memory_problems": "disturbance of memory",
    "memory_loss": "disturbance of memory",
    "forgetfulness": "disturbance of memory",
    "sleep_problems": "insomnia",
    "sleeplessness": "insomnia",
    "trouble_sleeping": "insomnia",

    # Urological & Reproductive
    "burning_urination": "painful urination",
    "pain_when_urinating": "painful urination",
    "dysuria": "painful urination",
    "difficulty_urinating": "retention of urine",
    "urinary_retention": "retention of urine",
    "urinary_hesitancy": "hesitancy",
    "frequent_urination": "frequent urination",
    "peeing_often": "frequent urination",
    "nighttime_urination": "excessive urination at night",
    "nocturia": "excessive urination at night",
    "blood_in_urine": "blood in urine",
    "hematuria": "blood in urine",
    "menstrual_pain": "painful menstruation",
    "period_cramps": "painful menstruation",
    "dysmenorrhea": "painful menstruation",
    "heavy_periods": "heavy menstrual flow",
    "missed_period": "absence of menstruation",
    "amenorrhea": "absence of menstruation",
    "pelvic_pain": "pelvic pain",
    "pelvic_pressure": "pelvic pressure",

    # Musculoskeletal
    "back_pain": "back pain",
    "lower_back_pain": "low back pain",
    "lumbago": "low back pain",
    "neck_pain": "neck pain",
    "stiff_neck": "neck stiffness or tightness",
    "joint_pain": "joint pain",
    "joint_stiffness": "joint stiffness or tightness",
    "joint_swelling": "joint swelling",
    "muscle_pain": "muscle pain",
    "myalgia": "muscle pain",
    "muscle_cramps": "muscle cramps, contractures, or spasms",
    "muscle_spasms": "muscle cramps, contractures, or spasms",
    "leg_cramps": "leg cramps or spasms",
    "knee_pain": "knee pain",
    "shoulder_pain": "shoulder pain",
    "hip_pain": "hip pain",
    "ankle_pain": "ankle pain",
    "wrist_pain": "wrist pain",

    # Skin & Dermatology
    "skin_rash": "skin rash",
    "rash": "skin rash",
    "skin_itching": "itching of skin",
    "itchy_skin": "itching of skin",
    "pruritus": "itching of skin",
    "swollen_skin": "skin swelling",
    "swelling": "skin swelling",
    "hives": "allergic reaction",
    "dry_skin": "skin dryness, peeling, scaliness, or roughness",
    "skin_peeling": "skin dryness, peeling, scaliness, or roughness",
    "skin_lesion": "skin lesion",
    "pimples": "acne or pimples",
    "acne": "acne or pimples",
    "pale_skin": "pallor",
    "paleness": "pallor",
    "facial_redness": "flushing",

    # Psychological
    "anxiety": "anxiety and nervousness",
    "nervousness": "anxiety and nervousness",
    "panic": "anxiety and nervousness",
    "depression": "depression",
    "feeling_depressed": "depression",
    "mood_swings": "emotional symptoms",
    "irritability": "temper problems",
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
    expected by the LightGBM production model.
    Validates submitted symptoms against the 377-dimensional model feature space and clinical aliases.
    Supports arbitrary symptom counts (1, 2, 3, 5, 8, 10, 15+ symptoms).
    """
    if not symptoms:
        raise InvalidSymptomsError("No valid symptoms provided. Please submit at least one symptom.")

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

    for user_sym in normalized_user_symptoms:
        user_sym_spaces = user_sym.replace("_", " ")
        user_tokens = set(user_sym_spaces.split())

        idx = feature_lookup.get(user_sym)
        if idx is None:
            idx = feature_space_lookup.get(user_sym_spaces)

        # Check alias dictionary
        if idx is None and user_sym in SYMPTOM_ALIASES:
            canonical = SYMPTOM_ALIASES[user_sym]
            idx = feature_lookup.get(normalize_symptom(canonical))
            if idx is None:
                idx = feature_space_lookup.get(canonical.lower())

        if idx is None and user_sym_spaces in SYMPTOM_ALIASES:
            canonical = SYMPTOM_ALIASES[user_sym_spaces]
            idx = feature_lookup.get(normalize_symptom(canonical))
            if idx is None:
                idx = feature_space_lookup.get(canonical.lower())

        # Check singular/plural variants (e.g. seizure vs seizures)
        if idx is None:
            if user_sym + "s" in feature_lookup:
                idx = feature_lookup[user_sym + "s"]
            elif user_sym.endswith("s") and user_sym[:-1] in feature_lookup:
                idx = feature_lookup[user_sym[:-1]]

        # Token subset match against 377 model features
        if idx is None:
            for f_idx, feat_name in enumerate(MODEL_FEATURE_NAMES):
                feat_tokens = set(normalize_symptom(feat_name).replace("_", " ").split())
                if user_tokens and (user_tokens.issubset(feat_tokens) or (len(feat_tokens) >= 2 and feat_tokens.issubset(user_tokens))):
                    idx = f_idx
                    break

        if idx is not None:
            vector[0, idx] = 1.0
            matched.append(MODEL_FEATURE_NAMES[idx])
        else:
            unknown_symptoms.append(user_sym_spaces)

    if not matched:
        unknown_str = ", ".join(unknown_symptoms) if unknown_symptoms else "provided symptoms"
        logger.warning("Rejected prediction request due to unknown symptoms: %s", unknown_str)
        raise InvalidSymptomsError(f"None of the provided symptoms could be recognized by the clinical model: {unknown_str}")

    if unknown_symptoms:
        logger.info(
            "Some submitted symptoms could not be mapped but inference proceeded with %d recognized features: %s (unmapped: %s)",
            len(matched),
            matched,
            unknown_symptoms,
        )

    logger.info("Preprocessed %d symptoms into %d active model feature(s)", len(normalized_user_symptoms), len(matched))
    return vector


def preprocess_symptoms(symptoms: Sequence[str], model=None) -> np.ndarray:
    return symptoms_to_feature_vector(symptoms)

