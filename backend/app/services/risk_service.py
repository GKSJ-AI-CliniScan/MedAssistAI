"""
Machine Learning Risk Assessment Service Module.

Runs inference using the existing XGBoost ML model (trained on CDC BRFSS dataset)
strictly on patient BRFSS features without modifying or retraining the model.
Returns raw ML prediction probability and class mappings for downstream Decision Layer processing.
"""

from typing import Any, Dict
from app.schemas.patient import RiskAssessmentRequest
from app.services.preprocessing import preprocess_brfss_features, load_ml_artifact
from app.utils.logger import logger


def calculate_ml_risk(request: RiskAssessmentRequest) -> Dict[str, Any]:
    """
    Executes XGBoost ML model prediction strictly using patient BRFSS features.

    Returns:
        Dict[str, Any]: Dictionary containing raw ML risk probability, predicted class index,
                        target labels, and model metadata.
    """
    logger.info(
        "Executing XGBoost ML risk model inference for patient (age=%d, bmi=%.1f)",
        request.age,
        request.bmi,
    )

    # 1. Preprocess BRFSS features using preprocessing service
    imp_features, artifact = preprocess_brfss_features(request)

    model = artifact["model"]
    target_labels = artifact.get("target_labels", {0: "Low", 1: "Medium", 2: "High"})
    model_name = artifact.get("model_name", "XGBoost Classifier")

    # 2. Model Inference: predict() and predict_proba()
    probs = model.predict_proba(imp_features)[0]
    pred_class_idx = int(model.predict(imp_features)[0])

    max_prob = float(probs[pred_class_idx])
    risk_probability = round(max_prob, 2)

    # Raw risk level derived from ML model class index
    raw_risk_level = target_labels.get(pred_class_idx, "Low")

    logger.info(
        "ML inference complete: raw_risk_probability=%.2f, pred_class_idx=%d, raw_risk_level=%s",
        risk_probability,
        pred_class_idx,
        raw_risk_level,
    )

    return {
        "risk_probability": risk_probability,
        "pred_class_idx": pred_class_idx,
        "raw_risk_level": raw_risk_level,
        "target_labels": target_labels,
        "model_name": model_name,
    }


def calculate_risk(request: RiskAssessmentRequest) -> Dict[str, Any]:
    """
    Legacy helper function maintained for backward compatibility.
    Runs ML risk calculation.
    """
    return calculate_ml_risk(request)