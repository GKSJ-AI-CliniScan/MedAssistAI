"""
BRFSS Feature Preprocessing & Artifact Management Module.

Encapsulates feature mapping, imputation, and artifact loading for the CDC BRFSS
XGBoost ML Risk Assessment model without altering feature transformations.
"""

import os
from typing import Any, Dict, Tuple
import joblib
import pandas as pd
import numpy as np

from app.config.settings import settings
from app.schemas.patient import RiskAssessmentRequest
from app.utils.logger import logger

_ML_ARTIFACT_CACHE: Dict[str, Any] = {}


def load_ml_artifact() -> Dict[str, Any]:
    """
    Loads and caches trained ML model artifact from disk.

    Raises:
        RuntimeError: If model file does not exist or fails to load.
    """
    global _ML_ARTIFACT_CACHE
    if _ML_ARTIFACT_CACHE:
        return _ML_ARTIFACT_CACHE

    model_path = settings.MODEL_PATH
    if not os.path.exists(model_path):
        logger.error("ML Model artifact file not found at path: %s", model_path)
        raise RuntimeError(
            f"ML Model file not found at '{model_path}'. "
            "Please ensure the model artifact is present."
        )

    try:
        artifact = joblib.load(model_path)
        logger.info(
            "Successfully loaded ML Risk Assessment artifact '%s' from %s",
            artifact.get("model_name", "Trained ML Model"),
            model_path,
        )
        _ML_ARTIFACT_CACHE = artifact
        return artifact
    except Exception as err:
        logger.error("Failed to load ML model artifact: %s", str(err))
        raise RuntimeError(f"Failed to load ML model artifact: {str(err)}") from err


def preprocess_brfss_features(
    request: RiskAssessmentRequest,
) -> Tuple[np.ndarray, Dict[str, Any]]:
    """
    Extracts 14 BRFSS features from patient request, constructs aligned DataFrame,
    imputes missing values, and returns preprocessed feature array along with artifact metadata.

    Returns:
        Tuple[np.ndarray, Dict[str, Any]]: (imputed_features, artifact)
    """
    artifact = load_ml_artifact()
    imputer = artifact["imputer"]
    feature_cols = artifact.get("feature_cols", [])

    # Exact BRFSS feature mapping preserved
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

    raw_df = pd.DataFrame([feature_map])
    if feature_cols:
        raw_df = raw_df[feature_cols]

    imp_features = imputer.transform(raw_df)
    return imp_features, artifact
