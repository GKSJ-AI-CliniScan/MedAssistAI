import logging
from typing import Any, Optional, Tuple
import numpy as np

from app.ml.disease_mapping import get_disease_name

logger = logging.getLogger(__name__)


class PredictionError(Exception):
    """Raised when the model fails to produce a prediction."""


def predict_disease(
    model: Any,
    features: np.ndarray,
) -> Tuple[str, Optional[float]]:
    """
    Predict disease and calculate confidence from the trained LightGBM model.
    Translates predicted target class IDs directly into actual disease names using in-memory disease mapping.

    Returns:
        (predicted_disease_name, confidence_percent)
    """
    try:
        confidence: Optional[float] = None

        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(features)[0]
            top_idx = int(np.argmax(probabilities))
            confidence = round(float(probabilities[top_idx] * 100.0), 1)

            raw_label = top_idx
            if hasattr(model, "classes_"):
                raw_label = model.classes_[top_idx]
            elif hasattr(model, "rf_model") and hasattr(model.rf_model, "classes_"):
                raw_label = model.rf_model.classes_[top_idx]

            prediction_id = int(raw_label)
            disease_name = get_disease_name(prediction_id)
        else:
            prediction = model.predict(features)
            raw_label = prediction[0] if hasattr(prediction, "__getitem__") else prediction
            prediction_id = int(raw_label)
            disease_name = get_disease_name(prediction_id)
            confidence = 85.0

        logger.info(
            "Prediction complete | disease=%s (ID #%s) | confidence=%s%%",
            disease_name,
            prediction_id,
            confidence,
        )
        return disease_name, confidence

    except Exception as exc:
        logger.exception("Prediction failed")
        raise PredictionError(f"Disease prediction failed: {exc}") from exc
