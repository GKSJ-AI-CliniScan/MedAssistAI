"""
Comprehensive Test Suite for Service-Based Risk Assessment Module.

Tests:
1. PredictionClient HTTP communication and fallback error handling.
2. BRFSS feature preprocessing and artifact loading.
3. XGBoost ML Risk Service inference without model modification.
4. Clinical DecisionEngine combination logic and emergency alert triggers.
5. Integration test for FastAPI POST /risk-assessment endpoint response schema compliance.
"""

import unittest
from unittest.mock import patch, MagicMock
import requests
from fastapi.testclient import TestClient

from app.main import app
from app.schemas.patient import RiskAssessmentRequest
from app.schemas.response import RiskAssessmentResponse
from app.services.prediction_client import PredictionClient, prediction_client
from app.services.preprocessing import load_ml_artifact, preprocess_brfss_features
from app.services.risk_service import calculate_ml_risk
from app.services.decision_engine import DecisionEngine, decision_engine


class TestPredictionClient(unittest.TestCase):
    """Unit tests for Disease Prediction API client."""

    def test_empty_symptoms_returns_default(self):
        client = PredictionClient()
        disease, confidence = client.get_disease_prediction([])
        self.assertEqual(disease, "Unknown")
        self.assertEqual(confidence, 0.0)

    @patch("requests.post")
    def test_successful_api_response(self, mock_post):
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            "predicted_disease": "Hypertension",
            "prediction_confidence": 0.85,
        }
        mock_post.return_value = mock_resp

        client = PredictionClient(api_url="http://test-server/api/history/check")
        disease, confidence = client.get_disease_prediction(["chest_pain"])

        self.assertEqual(disease, "Hypertension")
        self.assertEqual(confidence, 0.85)

    @patch("requests.post")
    def test_api_failure_fallback(self, mock_post):
        mock_post.side_effect = requests.exceptions.ConnectionError("Connection refused")

        client = PredictionClient(api_url="http://invalid-url/api/history/check")
        disease, confidence = client.get_disease_prediction(["chest_pain"])

        self.assertEqual(disease, "Unknown")
        self.assertEqual(confidence, 0.0)


class TestPreprocessingAndRiskService(unittest.TestCase):
    """Unit tests for ML feature preprocessing and risk service."""

    def setUp(self):
        self.req = RiskAssessmentRequest(
            age=65,
            gender=1,
            bmi=28.5,
            general_health=3,
            exercise=1,
            smoking=0,
            alcohol=1,
            diabetes=1,
            arthritis=1,
            asthma=0,
            copd=0,
            kidney_disease=0,
            mental_health=2,
            physical_health=5,
            symptoms=["shortness_of_breath"],
        )

    def test_load_ml_artifact(self):
        artifact = load_ml_artifact()
        self.assertIn("model", artifact)
        self.assertIn("imputer", artifact)
        self.assertIn("feature_cols", artifact)

    def test_preprocess_brfss_features(self):
        features, artifact = preprocess_brfss_features(self.req)
        self.assertEqual(features.ndim, 2)
        self.assertEqual(features.shape[1], len(artifact.get("feature_cols", [])))

    def test_calculate_ml_risk(self):
        ml_out = calculate_ml_risk(self.req)
        self.assertIn("risk_probability", ml_out)
        self.assertIn("raw_risk_level", ml_out)
        self.assertIsInstance(ml_out["risk_probability"], float)
        self.assertGreaterEqual(ml_out["risk_probability"], 0.0)
        self.assertLessEqual(ml_out["risk_probability"], 1.0)


class TestDecisionEngine(unittest.TestCase):
    """Unit tests for Clinical DecisionEngine combination logic."""

    def setUp(self):
        self.engine = DecisionEngine()
        self.ml_output = {
            "risk_probability": 0.45,
            "raw_risk_level": "Medium",
        }

    def test_decision_engine_preserves_ml_probability(self):
        resp = self.engine.evaluate_risk(self.ml_output, "Influenza", 0.70)
        self.assertEqual(resp.risk_probability, 0.45)

    def test_critical_disease_triggers_emergency_alert(self):
        resp = self.engine.evaluate_risk(self.ml_output, "Heart Attack", 0.85)
        self.assertTrue(resp.emergency_alert)
        self.assertEqual(resp.risk_level, "High")

    def test_low_risk_disease_normal_alert(self):
        resp = self.engine.evaluate_risk(
            {"risk_probability": 0.20, "raw_risk_level": "Low"},
            "Common Cold",
            0.50,
        )
        self.assertFalse(resp.emergency_alert)
        self.assertEqual(resp.risk_level, "Low")
        self.assertEqual(resp.severity, "Mild")


class TestRiskAssessmentAPI(unittest.TestCase):
    """Integration test suite for POST /risk-assessment endpoint."""

    def setUp(self):
        self.client = TestClient(app)

    @patch("app.services.prediction_client.prediction_client.get_disease_prediction")
    def test_api_returns_only_required_fields(self, mock_disease_client):
        mock_disease_client.return_value = ("Hypertension", 0.75)

        payload = {
            "age": 65,
            "gender": 1,
            "bmi": 28.5,
            "general_health": 3,
            "exercise": 1,
            "smoking": 0,
            "alcohol": 1,
            "diabetes": 1,
            "arthritis": 1,
            "asthma": 0,
            "copd": 0,
            "kidney_disease": 0,
            "mental_health": 2,
            "physical_health": 5,
            "symptoms": ["chest_pain"],
        }
        response = self.client.post("/risk-assessment", json=payload)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        expected_keys = {
            "risk_probability",
            "risk_score",
            "risk_level",
            "severity",
            "emergency_alert",
            "recommendations",
        }
        self.assertEqual(set(data.keys()), expected_keys)

        # Confirm internal disease prediction values are NOT exposed
        self.assertNotIn("predicted_disease", data)
        self.assertNotIn("prediction_confidence", data)

        # Check types
        self.assertIsInstance(data["risk_probability"], float)
        self.assertIsInstance(data["risk_score"], int)
        self.assertIsInstance(data["risk_level"], str)
        self.assertIsInstance(data["severity"], str)
        self.assertIsInstance(data["emergency_alert"], bool)
        self.assertIsInstance(data["recommendations"], list)

    def test_validation_error_invalid_input(self):
        payload = {"age": -5}
        response = self.client.post("/risk-assessment", json=payload)
        self.assertEqual(response.status_code, 422)


if __name__ == "__main__":
    unittest.main()
