"""
Machine Learning Risk Assessment Service Module.

Pure Machine Learning implementation for patient health risk assessment.
Uses a trained ML model (Random Forest / XGBoost trained on CDC BRFSS 2024 dataset)
to predict patient health risk probability, risk level ('High', 'Medium', 'Low'),
severity ('Severe', 'Moderate', 'Mild'), risk score, and recommendations.

Zero external constants files or rule-based scoring logic used.
"""

import os
from typing import Any, Dict
import joblib
import pandas as pd

from app.schemas.patient import RiskAssessmentRequest
from app.utils.logger import logger

# Model artifact path
MODEL_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "models",
    "risk_model.pkl",
)

# Global variables for loaded model artifacts
_ML_ARTIFACT: Dict[str, Any] = {}


def load_ml_model() -> Dict[str, Any]:
    """
    Loads and caches the trained ML model artifact from disk.
    Raises RuntimeError if the model file is not found or fails to load.
    """
    global _ML_ARTIFACT
    if _ML_ARTIFACT:
        return _ML_ARTIFACT

    if not os.path.exists(MODEL_PATH):
        logger.error("ML Model artifact not found at %s", MODEL_PATH)
        raise RuntimeError(
            f"ML Model file not found at '{MODEL_PATH}'. "
            "Please run 'python scripts/train_risk_model.py' to train the model."
        )

    try:
        artifact = joblib.load(MODEL_PATH)
        logger.info(
            "Successfully loaded ML Risk Assessment model '%s' from %s",
            artifact.get("model_name", "Trained ML Model"),
            MODEL_PATH,
        )
        _ML_ARTIFACT = artifact
        return artifact
    except Exception as err:
        logger.error("Failed to load ML model artifact: %s", str(err))
        raise RuntimeError(f"Failed to load ML model artifact: {str(err)}") from err


# Load model on startup
try:
    load_ml_model()
except Exception as e:
    logger.warning("Could not pre-load model artifact on startup: %s", str(e))


def calculate_risk(request: RiskAssessmentRequest) -> Dict[str, Any]:
    """
    Calculates patient risk assessment strictly using the trained ML model.

    Extracts 14 patient-friendly features from request and converts them to
    DataFrame matching the model's 14 feature columns.
    """
    logger.info(
        "Starting ML Risk Assessment for patient (age=%d, bmi=%.1f)",
        request.age,
        request.bmi,
    )

    # 1. Load ML Model Artifacts
    artifact = load_ml_model()
    model = artifact["model"]
    imputer = artifact["imputer"]
    feature_cols = artifact.get("feature_cols", [])
    target_labels = artifact.get("target_labels", {0: "Low", 1: "Medium", 2: "High"})
    model_name = artifact.get("model_name", "Trained ML Model")

    # 2. Build feature mapping dict using 14 patient-friendly request fields
    feature_map = {
        "_AGE80": float(request.age),
        "_SEX": float(request.gender),
        "_BMI5": float(request.bmi),
        "GENHLTH": float(request.general_health),
        "PHYSHLTH": float(request.physical_health),
        "MENTHLTH": float(request.mental_health),
        "EXERANY2": float(request.exercise),
        "SMOKE100": float(request.smoking),
        "DRNKANY6": float(request.alcohol),
        "DIABETE4": float(request.diabetes),
        "CHCKDNY2": float(request.kidney_disease),
        "ASTHMA3": float(request.asthma),
        "CHCCOPD3": float(request.copd),
        "HAVARTH4": float(request.arthritis),
    }

    # Create DataFrame ensuring columns match model feature_cols order
    raw_df = pd.DataFrame([feature_map])
    if feature_cols:
        raw_df = raw_df[feature_cols]

    # Preprocess features using saved imputer
    imp_features = imputer.transform(raw_df)

    # 3. Model Inference: predict() and predict_proba()
    probs = model.predict_proba(imp_features)[0]
    pred_class_idx = int(model.predict(imp_features)[0])

    max_prob = float(probs[pred_class_idx])
    risk_probability = round(max_prob, 2)
    risk_score = int(round(risk_probability * 100))

    # Convert predicted class index (0 -> Low, 1 -> Medium, 2 -> High)
    risk_level = target_labels.get(pred_class_idx, "Low")

    # Severity Mapping based on Risk Level
    if risk_level == "High":
        severity = "Severe"
    elif risk_level == "Medium":
        severity = "Moderate"
    else:
        severity = "Mild"

    # Recommendations Mapping based on Risk Level
    if risk_level == "High":
        recommendations = ["Consult a healthcare professional immediately."]
    elif risk_level == "Medium":
        recommendations = ["Monitor health and consult a physician if symptoms persist."]
    else:
        recommendations = ["Maintain healthy lifestyle."]

    logger.info(
        "ML Risk Assessment Complete: risk_probability=%.2f, risk_level=%s, severity=%s",
        risk_probability,
        risk_level,
        severity,
    )

    return {
        "risk_probability": risk_probability,
        "risk_level": risk_level,
        "risk_score": risk_score,
        "severity": severity,
        "recommendations": recommendations,
        "model_name": model_name,
    }