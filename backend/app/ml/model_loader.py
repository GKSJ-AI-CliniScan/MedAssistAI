import logging
import sys
from pathlib import Path
from typing import Any, Optional, Dict

import joblib
from sklearn.base import BaseEstimator, ClassifierMixin

logger = logging.getLogger(__name__)


class SoftVotingClassifier(BaseEstimator, ClassifierMixin):
    """
    Legacy/dev compatibility class for deserializing the original multi-model ensemble if needed.
    """
    def predict_proba(self, X):
        probas = []
        if hasattr(self, "rf_model") and self.rf_model is not None:
            probas.append(self.rf_model.predict_proba(X))
        if hasattr(self, "xgb_model") and self.xgb_model is not None:
            probas.append(self.xgb_model.predict_proba(X))
        if hasattr(self, "lgb_model") and self.lgb_model is not None:
            probas.append(self.lgb_model.predict_proba(X))
        if probas:
            import numpy as np
            return np.mean(probas, axis=0)
        raise ValueError("No estimators initialized in SoftVotingClassifier")

    def predict(self, X):
        import numpy as np
        proba = self.predict_proba(X)
        return np.argmax(proba, axis=1)


# Register class for pickle compatibility
sys.modules["__main__"].SoftVotingClassifier = SoftVotingClassifier
sys.modules["app.ml.model_loader"] = sys.modules[__name__]


ML_DIR = Path(__file__).resolve().parent

# Production model: Lightweight, high-accuracy LightGBM model (~726 KB, ~13 MB RAM delta)
MODEL_FILENAME = "lgb_model.pkl"
MODEL_PATH = ML_DIR / MODEL_FILENAME

# Reference ensemble path (dev/analysis reference only, NEVER loaded in production)
ENSEMBLE_FILENAME = "voting_classifier_rf_xgb_lgb.pkl"
ENSEMBLE_PATH = ML_DIR / ENSEMBLE_FILENAME

_model: Optional[Any] = None


class ModelNotFoundError(Exception):
    """Raised when the trained model cannot be found on disk."""


class ModelLoadError(Exception):
    """Raised when the trained model cannot be loaded."""


def is_model_available() -> bool:
    """Check if the production LightGBM model file exists on disk."""
    return MODEL_PATH.exists() and MODEL_PATH.is_file()


def load_model(force_reload: bool = False) -> Any:
    """
    Load the production LightGBM disease classification model into memory.
    Uses cached in-memory instance for instant O(1) inference.
    
    Model Specs:
      - File: backend/app/ml/lgb_model.pkl
      - Disk size: ~726 KB
      - Runtime RAM: ~13 MB delta (total process ~133 MB)
      - Classes: 773 disease targets
      - Features: 377 symptom inputs
    """
    global _model

    if _model is not None and not force_reload:
        return _model

    if not is_model_available():
        logger.error("Production model file not found at %s", MODEL_PATH)
        raise ModelNotFoundError(
            f"Production LightGBM model file '{MODEL_FILENAME}' not found at {MODEL_PATH}."
        )

    try:
        logger.info("Loading production LightGBM model from %s", MODEL_PATH)
        _model = joblib.load(MODEL_PATH)
        logger.info(
            "LightGBM model loaded successfully | type=%s | classes=%d",
            type(_model).__name__,
            len(_model.classes_) if hasattr(_model, "classes_") else 0,
        )
        return _model

    except Exception as exc:
        logger.exception("Failed to load LightGBM disease model from %s", MODEL_PATH)
        raise ModelLoadError(f"Unable to load disease model: {exc}") from exc


def clear_model_cache() -> None:
    """Clear in-memory cached model instance."""
    global _model
    _model = None
    logger.info("ML model cache cleared")


def get_model_info() -> Dict[str, Any]:
    """Retrieve metadata about the loaded production model."""
    if not is_model_available():
        return {
            "status": "not_found",
            "model_file": MODEL_FILENAME,
            "path": str(MODEL_PATH),
        }
    
    size_bytes = MODEL_PATH.stat().st_size
    return {
        "status": "ready",
        "model_type": "LightGBM (LGBMClassifier)",
        "model_file": MODEL_FILENAME,
        "disk_size_kb": round(size_bytes / 1024, 2),
        "target_classes": 773,
        "feature_dim": 377,
        "is_loaded": _model is not None,
    }