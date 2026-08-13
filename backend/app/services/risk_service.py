from typing import Any, Dict

from app.schemas.patient import RiskAssessmentRequest
from app.services.preprocessing import preprocess_brfss_features
from app.utils.logger import logger


def calculate_ml_risk(
    request: RiskAssessmentRequest,
) -> Dict[str, Any]:

    logger.info(
        "Executing ML risk model inference for patient "
        "(age=%d, bmi=%.1f)",
        request.age,
        request.bmi,
    )
    # 1. PREPROCESS PATIENT FEATURES

    imp_features, artifact = preprocess_brfss_features(request)

    # 2. LOAD TRAINED MODEL

    model = artifact["model"]

    target_labels = artifact.get(
        "target_labels",
        {
            0: "Low",
            1: "Medium",
            2: "High",
        },
    )

    # 3. MODEL PREDICTION

    probs = model.predict_proba(imp_features)[0]

    pred_class_idx = int(
        model.predict(imp_features)[0]
    )

    # Probability corresponding to predicted class
    max_prob = float(
        probs[pred_class_idx]
    )

    risk_probability = round(
        max_prob,
        2,
    )

    # 4. CONVERT CLASS TO RISK LEVEL

    raw_risk_level = target_labels.get(
        pred_class_idx,
        "Low",
    )

    logger.info(
        "ML inference complete: "
        "risk_probability=%.2f, "
        "predicted_class=%d, "
        "risk_level=%s",
        risk_probability,
        pred_class_idx,
        raw_risk_level,
    )
    # 5. RETURN ONLY INFORMATION REQUIRED BY DECISION ENGINE

    return {
        "risk_probability": risk_probability,
        "pred_class_idx": pred_class_idx,
        "raw_risk_level": raw_risk_level,
    }


def calculate_risk(
    request: RiskAssessmentRequest,
) -> Dict[str, Any]:
    """
    Legacy helper function maintained for backward compatibility.
    """

    return calculate_ml_risk(request)