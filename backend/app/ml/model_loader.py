import logging
import sys
from pathlib import Path
from typing import Any, Optional

import numpy as np
from sklearn.base import BaseEstimator, ClassifierMixin
import joblib
from huggingface_hub import hf_hub_download

logger = logging.getLogger(__name__)


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


# Make the class available during pickle deserialization
sys.modules["__main__"].SoftVotingClassifier = SoftVotingClassifier
sys.modules["app.ml.model_loader"] = sys.modules[__name__]


ML_DIR = Path(__file__).resolve().parent
MODEL_FILENAME = "voting_classifier_rf_xgb_lgb.pkl"

# Hugging Face repository containing the trained model
HF_REPO_ID = "saikiran955013/medassistai-model"

MODEL_PATH = ML_DIR / MODEL_FILENAME

_model: Optional[Any] = None


class ModelNotFoundError(Exception):
    """Raised when the trained model cannot be found."""


class ModelLoadError(Exception):
    """Raised when the trained model cannot be loaded."""


def get_model_path() -> Path:
    """
    Download the model from Hugging Face if it is not already
    available locally.
    """

    if MODEL_PATH.exists() and MODEL_PATH.is_file():
        logger.info("ML model already exists at %s", MODEL_PATH)
        return MODEL_PATH

    logger.info(
        "ML model not found locally. Downloading from Hugging Face: %s",
        HF_REPO_ID,
    )

    try:
        downloaded_path = hf_hub_download(
            repo_id=HF_REPO_ID,
            filename=MODEL_FILENAME,
            repo_type="model",
        )

        logger.info(
            "ML model downloaded successfully to %s",
            downloaded_path,
        )

        return Path(downloaded_path)

    except Exception as exc:
        logger.exception("Failed to download ML model from Hugging Face")
        raise ModelNotFoundError(
            f"Unable to download trained model '{MODEL_FILENAME}' "
            f"from Hugging Face repository '{HF_REPO_ID}': {exc}"
        ) from exc


def is_model_available() -> bool:
    return MODEL_PATH.exists() and MODEL_PATH.is_file()


def load_model(force_reload: bool = False) -> Any:
    global _model

    if _model is not None and not force_reload:
        return _model

    try:
        model_path = get_model_path()

        logger.info(
            "Loading trained disease prediction model from %s",
            model_path,
        )

        _model = joblib.load(model_path, mmap_mode="r")

        logger.info(
            "Trained model loaded successfully from %s",
            model_path,
        )

        return _model

    except ModelNotFoundError:
        raise

    except Exception as exc:
        logger.exception(
            "Failed to load trained model from Hugging Face/local cache"
        )

        raise ModelLoadError(
            f"Unable to load disease model: {exc}"
        ) from exc


def clear_model_cache() -> None:
    global _model
    _model = None
    logger.info("Model cache cleared")