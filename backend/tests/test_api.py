import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add parent directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from app.main import app
from app.core.database import connect_to_mongo, close_mongo_connection

# Initialize TestClient
client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_teardown():
    # Lifespan events are handled automatically by TestClient when using 'with TestClient'
    # but since we initialized client globally, we trigger startup/shutdown events explicitly
    # to connect to the database.
    with client:
        yield

def test_health():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_login_and_profile():
    # 1. Log in with default patient credentials
    response = client.post(
        "/api/auth/login",
        data={"username": "patient@medassist.ai", "password": "patientpassword"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    token = data["access_token"]
    assert data["role"] == "patient"
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Get current user session
    response = client.get("/api/auth/me", headers=headers)
    assert response.status_code == 200
    assert response.json()["email"] == "patient@medassist.ai"
    
    # 3. Get patient profile
    response = client.get("/api/profile", headers=headers)
    assert response.status_code == 200
    profile = response.json()
    assert profile["first_name"] == "John"
    assert profile["last_name"] == "Doe"
    
    # 4. Update profile fields
    response = client.put(
        "/api/profile",
        headers=headers,
        json={"weight": 82.5, "allergies": ["Peanuts", "Dust"]}
    )
    assert response.status_code == 200
    updated_profile = response.json()
    assert updated_profile["weight"] == 82.5
    assert "Dust" in updated_profile["allergies"]

def test_symptoms_catalog():
    # Log in
    response = client.post(
        "/api/auth/login",
        data={"username": "patient@medassist.ai", "password": "patientpassword"}
    )
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get all symptoms
    response = client.get("/api/symptoms", headers=headers)
    assert response.status_code == 200
    symptoms = response.json()
    # There should be exactly 377 symptoms seeded from the Kaggle dataset
    assert len(symptoms) == 377
    # Verify that first symptom is alphabetical
    assert symptoms[0]["key"] is not None

def test_symptom_check_consultation():
    # Log in
    response = client.post(
        "/api/auth/login",
        data={"username": "patient@medassist.ai", "password": "patientpassword"}
    )
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Submit typical panic disorder symptoms
    symptoms_to_check = [
        "anxiety and nervousness",
        "depression",
        "dizziness",
        "insomnia",
        "chest tightness",
        "breathing fast"
    ]
    response = client.post(
        "/api/history/check",
        headers=headers,
        json={
            "symptoms": symptoms_to_check,
            "age": 30,
            "gender": "Male",
            "height": 175.0,
            "weight": 70.0
        }
    )
    assert response.status_code == 201
    result = response.json()
    assert result["risk_level"] in ["low", "medium", "high"]
    assert len(result["predicted_diseases"]) > 0
    # Our baseline prediction engine should rank panic disorder highly given these inputs
    assert result["predicted_diseases"][0]["disease"] == "panic disorder"
    
    # 5. Fetch consultation history list
    response = client.get("/api/history", headers=headers)
    assert response.status_code == 200
    history = response.json()
    assert len(history) > 0
    assert history[0]["symptoms"] == symptoms_to_check
    
    # 6. Fetch single consultation details
    consultation_id = history[0]["id"]
    response = client.get(f"/api/history/{consultation_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["id"] == consultation_id
