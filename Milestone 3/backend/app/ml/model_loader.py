import logging
import sys
from pathlib import Path
from typing import Any, Optional
import numpy as np
from sklearn.base import BaseEstimator, ClassifierMixin
import joblib

logger = logging.getLogger(__name__)

# Register SoftVotingClassifier definition so joblib pickle deserialization succeeds
class SoftVotingClassifier(BaseEstimator, ClassifierMixin):
    def predict_proba(self, X):
        probas = []
        if hasattr(self, "rf_model") and self.rf_model is not None:
            probas.append(self.rf_model.predict_proba(X))
        if hasattr(self, "xgb_model") and self.xgb_model is not None:
            probas.append(self.xgb_model.predict_proba(X))
        if hasattr(self, "lgb_model") and self.lgb_model is not None:
            probas.append(self.lgb_model.predict_proba(X))
        
        if probas:
            return np.mean(probas, axis=0)
        raise ValueError("No estimators initialized in SoftVotingClassifier")

    def predict(self, X):
        proba = self.predict_proba(X)
        return np.argmax(proba, axis=1)

# Ensure SoftVotingClassifier is present in __main__ and app.ml.model_loader
sys.modules['__main__'].SoftVotingClassifier = SoftVotingClassifier
sys.modules['app.ml.model_loader'] = sys.modules[__name__]

import warnings
warnings.filterwarnings("ignore")

ML_DIR = Path(__file__).resolve().parent
MODEL_FILENAME = "voting_classifier_rf_xgb_lgb.pkl"

def find_model_path() -> Path:
    candidates = [
        ML_DIR / MODEL_FILENAME,
        ML_DIR.parent.parent.parent / MODEL_FILENAME,
        ML_DIR.parent.parent / MODEL_FILENAME,
        Path.cwd() / MODEL_FILENAME,
        Path.cwd() / "backend" / "app" / "ml" / MODEL_FILENAME,
    ]
    for candidate in candidates:
        if candidate.exists() and candidate.is_file():
            return candidate
    return ML_DIR / MODEL_FILENAME

MODEL_PATH = find_model_path()

_model: Optional[Any] = None


class ModelNotFoundError(Exception):
    """Raised when voting_classifier_rf_xgb_lgb.pkl is missing."""


class ModelLoadError(Exception):
    """Raised when the model file cannot be loaded."""


def is_model_available() -> bool:
    path = find_model_path()
    return path.exists() and path.is_file()


def load_model(force_reload: bool = False) -> Any:
    global _model

    if _model is not None and not force_reload:
        return _model

    model_file = find_model_path()
    if not model_file.exists() or not model_file.is_file():
        logger.error("Model file not found at %s", model_file)
        raise ModelNotFoundError(
            f"Trained model file '{MODEL_FILENAME}' not found. Looked in {ML_DIR} and project root."
        )

    try:
        logger.info("Loading trained disease prediction model from %s", model_file)
        _model = joblib.load(model_file)
        logger.info("Trained model loaded successfully from %s", model_file)
        return _model

    except Exception as exc:
        logger.exception("Failed to load trained model from %s", MODEL_PATH)
        raise ModelLoadError(f"Unable to load disease model: {exc}") from exc


def clear_model_cache() -> None:
    global _model
    _model = None
    logger.info("Model cache cleared")
