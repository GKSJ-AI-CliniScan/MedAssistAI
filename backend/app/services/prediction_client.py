"""
Disease Prediction API Client Module.

Handles HTTP communication with the external Disease Prediction API (POST /api/history/check).
Extracts predicted disease and prediction confidence internally and handles API failures gracefully.
"""

from typing import List, Tuple
import requests

from app.config.settings import settings
from app.utils.logger import logger


class PredictionClient:
    """HTTP Client for interacting with Disease Prediction Service."""

    def __init__(self, api_url: str = None, timeout: float = None):
        self.api_url = api_url or settings.DISEASE_PREDICTION_API_URL
        self.timeout = timeout or settings.DISEASE_PREDICTION_TIMEOUT

    def get_disease_prediction(
        self, symptoms: List[str]
    ) -> Tuple[str, float]:
        """
        Calls POST /api/history/check with patient symptoms.

        Returns:
            Tuple[str, float]: (predicted_disease, prediction_confidence)
            Defaults to ("Unknown", 0.0) on missing symptoms or API failure.
        """
        if not symptoms:
            logger.info("No symptoms provided; skipping Disease Prediction API call.")
            return "Unknown", 0.0

        payload = {"symptoms": symptoms}
        logger.info(
            "Calling Disease Prediction API at %s with %d symptoms",
            self.api_url,
            len(symptoms),
        )

        try:
            response = requests.post(
                self.api_url,
                json=payload,
                timeout=self.timeout,
            )
            response.raise_for_status()
            data = response.json()

            # Parse Disease Prediction API response
            predicted_list = data.get("predicted_diseases", [])

            if predicted_list and len(predicted_list) > 0:
                predicted_disease = predicted_list[0].get(
                    "disease", "Unknown"
                )

                try:
                    prediction_confidence = float(
                        predicted_list[0].get("probability", 0.0)
                    )
                except (ValueError, TypeError):
                    prediction_confidence = 0.0
            else:
                predicted_disease = "Unknown"
                prediction_confidence = 0.0

            logger.info(
                "Disease Prediction API success: predicted_disease='%s', confidence=%.2f",
                predicted_disease,
                prediction_confidence,
            )

            return str(predicted_disease), prediction_confidence

        except requests.exceptions.RequestException as req_err:
            logger.warning(
                "Disease Prediction API communication failed (%s): %s. Falling back to defaults.",
                type(req_err).__name__,
                str(req_err),
            )
            return "Unknown", 0.0

        except Exception as exc:
            logger.warning(
                "Unexpected error during Disease Prediction API parsing: %s. Falling back to defaults.",
                str(exc),
            )
            return "Unknown", 0.0


prediction_client = PredictionClient()