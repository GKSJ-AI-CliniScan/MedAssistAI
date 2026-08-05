"""
Unit and Integration Test Suite for ML Risk Assessment Module.

Tests:
1. ML Model artifact loading and payload key verification
2. ML Risk prediction, predict_proba(), risk_level, severity, and risk_score calculation
3. Clinical recommendations mapping based on risk level
4. FastAPI /risk-assessment endpoint returning pure ML payload
"""

import unittest
from fastapi.testclient import TestClient

from app.main import app
from app.schemas.patient import RiskAssessmentRequest
from app.services.risk_service import calculate_risk, load_ml_model


class TestMLRiskService(unittest.TestCase):
    """Tests for ML model loading and risk assessment calculation service."""

    def test_model_loading(self):
        """Tests that load_ml_model loads and returns model artifact dictionary."""
        artifact = load_ml_model()
        self.assertIn("model", artifact)
        self.assertIn("imputer", artifact)
        self.assertIn("feature_cols", artifact)
        self.assertIn("target_labels", artifact)

    def test_calculate_risk_prediction_and_proba(self):
        """Tests ML risk prediction using 14 patient fields and internal survey defaults."""
        req = RiskAssessmentRequest(
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
        )
        res = calculate_risk(req)
        self.assertIn("risk_probability", res)
        self.assertIn("risk_level", res)
        self.assertIn("risk_score", res)
        self.assertIn("severity", res)
        self.assertIn("recommendations", res)
        self.assertIn("model_name", res)

        # Check probability bounds
        self.assertIsInstance(res["risk_probability"], float)
        self.assertGreaterEqual(res["risk_probability"], 0.0)
        self.assertLessEqual(res["risk_probability"], 1.0)

        # Check risk level and severity choices
        self.assertIn(res["risk_level"], ["High", "Medium", "Low"])
        self.assertIn(res["severity"], ["Severe", "Moderate", "Mild"])
        self.assertIsInstance(res["risk_score"], int)
        self.assertEqual(res["risk_score"], int(round(res["risk_probability"] * 100)))

        # Check severity threshold logic
        if res["risk_level"] == "High":
            self.assertEqual(res["severity"], "Severe")
        elif res["risk_level"] == "Medium":
            self.assertEqual(res["severity"], "Moderate")
        else:
            self.assertEqual(res["severity"], "Mild")

        # Check recommendations
        self.assertIsInstance(res["recommendations"], list)
        self.assertGreater(len(res["recommendations"]), 0)


class TestRiskAssessmentAPIEndpoint(unittest.TestCase):
    """Integration tests for FastAPI /risk-assessment endpoint."""

    def setUp(self):
        self.client = TestClient(app)

    def test_api_success_response_includes_required_fields(self):
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
        }
        response = self.client.post("/risk-assessment", json=payload)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertIn("risk_probability", data)
        self.assertIn("risk_level", data)
        self.assertIn("risk_score", data)
        self.assertIn("severity", data)
        self.assertIn("recommendations", data)
        self.assertIn("model_name", data)

        # Check data types
        self.assertIsInstance(data["risk_probability"], float)
        self.assertIsInstance(data["risk_level"], str)
        self.assertIsInstance(data["risk_score"], int)
        self.assertIsInstance(data["severity"], str)
        self.assertIsInstance(data["recommendations"], list)
        self.assertIsInstance(data["model_name"], str)

    def test_api_validation_error_invalid_age(self):
        payload = {
            "age": 150,  # invalid age > 120
            "gender": 1,
            "bmi": 25.0,
            "general_health": 1,
            "exercise": 1,
            "smoking": 0,
            "alcohol": 0,
            "diabetes": 0,
            "arthritis": 0,
            "asthma": 0,
            "copd": 0,
            "kidney_disease": 0,
            "mental_health": 0,
            "physical_health": 0,
        }
        response = self.client.post("/risk-assessment", json=payload)
        self.assertEqual(response.status_code, 422)


if __name__ == "__main__":
    unittest.main()
