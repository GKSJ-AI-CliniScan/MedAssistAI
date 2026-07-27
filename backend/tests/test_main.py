"""
MedAssist AI – Pytest Test Suite
Tests: Auth, Predictions ML, Risk Engine, Recommendations
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app as fastapi_app
from app.core.database import Base, get_db

# ── Test Database (SQLite in-memory with StaticPool for single connection) ──
TEST_DATABASE_URL = "sqlite://"
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

import app.models  # noqa: E402


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


fastapi_app.dependency_overrides[get_db] = override_get_db

# Clean/Rebuild tables in memory
Base.metadata.drop_all(bind=test_engine)
Base.metadata.create_all(bind=test_engine)

client = TestClient(fastapi_app)

# ── Fixtures ──────────────────────────────────────────────────────────
@pytest.fixture(scope="module")
def registered_user():
    resp = client.post("/api/auth/register", json={
        "full_name": "Test Patient",
        "email": "testpatient@medassist.ai",
        "password": "TestPass123!",
        "role": "patient",
    })
    assert resp.status_code == 201, resp.text
    return resp.json()


@pytest.fixture(scope="module")
def auth_headers(registered_user):
    return {"Authorization": f"Bearer {registered_user['access_token']}"}


# ── Auth Tests ────────────────────────────────────────────────────────
class TestAuth:
    def test_register_success(self):
        resp = client.post("/api/auth/register", json={
            "full_name": "New User",
            "email": "newuser@medassist.ai",
            "password": "NewPass123!",
            "role": "patient",
        })
        assert resp.status_code == 201
        data = resp.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["user"]["role"] == "patient"

    def test_register_duplicate_email(self):
        client.post("/api/auth/register", json={
            "full_name": "Dup User",
            "email": "dup@medassist.ai",
            "password": "Pass123!",
        })
        resp = client.post("/api/auth/register", json={
            "full_name": "Dup User 2",
            "email": "dup@medassist.ai",
            "password": "Pass123!",
        })
        assert resp.status_code == 400
        assert "already registered" in resp.json()["detail"]

    def test_login_success(self, registered_user):
        resp = client.post("/api/auth/login", json={
            "email": "testpatient@medassist.ai",
            "password": "TestPass123!",
        })
        assert resp.status_code == 200
        assert "access_token" in resp.json()

    def test_login_wrong_password(self):
        resp = client.post("/api/auth/login", json={
            "email": "testpatient@medassist.ai",
            "password": "WrongPassword",
        })
        assert resp.status_code == 401

    def test_refresh_token(self, registered_user):
        resp = client.post("/api/auth/refresh", json={
            "refresh_token": registered_user["refresh_token"],
        })
        assert resp.status_code == 200
        assert "access_token" in resp.json()


# ── Patient Profile Tests ─────────────────────────────────────────────
class TestPatient:
    def test_get_profile(self, auth_headers):
        resp = client.get("/api/patients/me", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "age" in data

    def test_update_profile(self, auth_headers):
        resp = client.put("/api/patients/me", headers=auth_headers, json={
            "age": 30,
            "gender": "Male",
            "blood_type": "O+",
        })
        assert resp.status_code == 200
        assert resp.json()["age"] == 30

    def test_add_medical_history(self, auth_headers):
        resp = client.post("/api/patients/me/medical-history", headers=auth_headers, json={
            "condition": "Asthma",
            "diagnosed_year": 2018,
            "category": "Respiratory",
            "status": "Managed",
        })
        assert resp.status_code == 201
        assert resp.json()["condition"] == "Asthma"

    def test_get_medical_history(self, auth_headers):
        resp = client.get("/api/patients/me/medical-history", headers=auth_headers)
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)


# ── Symptom Tests ──────────────────────────────────────────────────────
class TestSymptoms:
    def test_list_all_symptoms(self):
        resp = client.get("/api/symptoms/")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data) >= 50

    def test_search_symptoms(self):
        resp = client.get("/api/symptoms/?q=fever")
        assert resp.status_code == 200
        data = resp.json()
        assert any("fever" in s["name"].lower() for s in data)

    def test_body_parts(self):
        resp = client.get("/api/symptoms/body-parts")
        assert resp.status_code == 200
        assert "General" in resp.json()


# ── Prediction Tests ───────────────────────────────────────────────────
class TestPredictions:
    def test_analyze_symptoms(self, auth_headers):
        resp = client.post("/api/predictions/analyze", headers=auth_headers, json={
            "symptoms": ["fever", "cough", "body aches", "fatigue"],
            "severity": "moderate",
            "duration": 3,
        })
        assert resp.status_code == 201
        data = resp.json()
        assert "prediction_id" in data
        assert "top_disease" in data
        assert "predictions" in data
        assert len(data["predictions"]) > 0
        assert "risk" in data
        assert "recommendation" in data

    def test_analyze_emergency_symptoms(self, auth_headers):
        resp = client.post("/api/predictions/analyze", headers=auth_headers, json={
            "symptoms": ["chest pain", "shortness of breath", "irregular heartbeat"],
            "severity": "severe",
            "duration": 1,
        })
        assert resp.status_code == 201
        data = resp.json()
        assert data["risk"]["emergencyAlert"] is True

    def test_prediction_history(self, auth_headers):
        resp = client.get("/api/predictions/history", headers=auth_headers)
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)
        assert len(resp.json()) > 0

    def test_get_prediction_detail(self, auth_headers):
        # First create a prediction
        analyze_resp = client.post("/api/predictions/analyze", headers=auth_headers, json={
            "symptoms": ["headache", "nausea"],
            "severity": "mild",
            "duration": 2,
        })
        pred_id = analyze_resp.json()["prediction_id"]
        resp = client.get(f"/api/predictions/{pred_id}", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["id"] == pred_id


# ── ML Engine Unit Tests ───────────────────────────────────────────────
class TestMLEngine:
    def test_predict_flu_symptoms(self):
        from app.ml.predictor import predict_diseases
        result = predict_diseases(
            symptoms=["fever", "cough", "body aches", "chills", "fatigue"],
            severity="moderate",
            duration=3,
        )
        assert "predictions" in result
        assert len(result["predictions"]) > 0
        assert result["top_disease"] != ""
        assert 0 <= result["top_confidence"] <= 1

    def test_predict_diabetes_symptoms(self):
        from app.ml.predictor import predict_diseases
        result = predict_diseases(
            symptoms=["frequent urination", "increased thirst", "fatigue", "blurred vision"],
            severity="moderate",
            duration=14,
        )
        assert any("Diabetes" in p["name"] for p in result["predictions"])

    def test_risk_engine_emergency(self):
        from app.ml.risk_engine import assess_risk
        result = assess_risk(
            symptoms=["chest pain", "shortness of breath"],
            severity="severe",
            duration=1,
        )
        assert result["emergencyAlert"] is True
        assert result["riskLevel"] in ("High", "Critical")

    def test_risk_engine_low_risk(self):
        from app.ml.risk_engine import assess_risk
        result = assess_risk(
            symptoms=["runny nose", "sneezing"],
            severity="mild",
            duration=2,
        )
        assert result["riskLevel"] in ("Low", "Medium")
        assert result["emergencyAlert"] is False

    def test_recommendation_engine(self):
        from app.ml.recommendation_engine import generate_recommendation
        rec = generate_recommendation("influenza", "Influenza (Flu)")
        assert "lifestyle" in rec
        assert "medicines" in rec
        assert "disclaimer" in rec
        assert len(rec["medicines"]) > 0


# ── Dashboard Tests ────────────────────────────────────────────────────
class TestDashboard:
    def test_get_stats(self, auth_headers):
        resp = client.get("/api/dashboard/stats", headers=auth_headers)
        assert resp.status_code == 200

    def test_get_analytics(self, auth_headers):
        resp = client.get("/api/dashboard/analytics", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "totalAnalyses" in data


# ── Notifications Tests ────────────────────────────────────────────────
class TestNotifications:
    def test_list_notifications(self, auth_headers):
        resp = client.get("/api/notifications/", headers=auth_headers)
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_unread_count(self, auth_headers):
        resp = client.get("/api/notifications/unread-count", headers=auth_headers)
        assert resp.status_code == 200
        assert "count" in resp.json()

    def test_mark_all_read(self, auth_headers):
        resp = client.put("/api/notifications/mark-all-read", headers=auth_headers)
        assert resp.status_code == 200


# ── Health Check ───────────────────────────────────────────────────────
def test_health_check():
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "healthy"
