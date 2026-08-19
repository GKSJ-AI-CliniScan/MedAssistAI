import json
from fastapi.testclient import TestClient
from app.main import app
from app.utils.jwt_handler import create_access_token
from app.ml.preprocessing import symptoms_to_feature_vector, InvalidSymptomsError
from app.ml.extracted_features import MODEL_FEATURE_NAMES

client = TestClient(app)
token = create_access_token(data={"sub": "saikiranboya123@gmail.com"})
headers = {"Authorization": f"Bearer {token}"}

test_cases = [
    ("1 Symptom", ["Fever"]),
    ("2 Symptoms", ["Fever", "Cough"]),
    ("3 Symptoms", ["Fever", "Cough", "Shortness of breath"]),
    ("4 Symptoms", ["Fever", "Cough", "Shortness of breath", "Sharp chest pain"]),
    ("5 Symptoms", ["Fever", "Cough", "Shortness of breath", "Sharp chest pain", "Fatigue"]),
    ("8 Symptoms", ["Fever", "Cough", "Shortness of breath", "Sharp chest pain", "Fatigue", "Decreased appetite", "Headache", "Dizziness"]),
    ("10 Symptoms", ["Fever", "Cough", "Shortness of breath", "Sharp chest pain", "Fatigue", "Decreased appetite", "Headache", "Dizziness", "Nausea", "Vomiting"]),
    ("15 Symptoms", ["Fever", "Cough", "Shortness of breath", "Sharp chest pain", "Fatigue", "Decreased appetite", "Headache", "Dizziness", "Nausea", "Vomiting", "Back pain", "Joint pain", "Skin rash", "Insomnia", "Nasal congestion"]),
    ("Combination A", ["fever", "cough", "headache"]),
    ("Combination B", ["fever", "cough", "chills", "fatigue", "weakness"]),
    ("Combination C", ["fever", "cough", "sore throat", "headache", "fatigue", "chills"]),
    ("Partially Unknown", ["fever", "cough", "some_unrecognized_symptom_xyz"]),
    ("Completely Unknown", ["completely_fake_symptom_123"])
]

print("==========================================================================================")
print("AUDIT: MULTI-SYMPTOM INFERENCE & PREPROCESSING TRACE")
print("==========================================================================================")

for label, symptoms in test_cases:
    print(f"\n--- Test: {label} ---")
    print(f"Request Payload: {json.dumps({'symptoms': symptoms})}")
    
    # 1. Test preprocessing directly
    prep_succeeded = False
    active_features = 0
    prep_error = None
    try:
        vec = symptoms_to_feature_vector(symptoms)
        prep_succeeded = True
        active_features = int(vec.sum())
    except Exception as e:
        prep_error = str(e)
    
    # 2. Test API Endpoint
    response = client.post("/predict", json={"symptoms": symptoms}, headers=headers)
    status_code = response.status_code
    response_body = response.json()
    
    print(f"HTTP Status: {status_code}")
    print(f"Preprocessing Succeeded: {prep_succeeded} (Active Feature Vector Columns: {active_features})")
    if prep_error:
        print(f"Preprocessing Error: {prep_error}")
    
    if status_code == 200:
        print(f"Predicted Disease: {response_body.get('predicted_disease')}")
        print(f"Confidence: {response_body.get('confidence')}%")
        print(f"Risk Level: {response_body.get('risk_level')}")
        print(f"Severity Level: {response_body.get('severity_level')} (Score: {response_body.get('severity_score')}, Emergency: {response_body.get('emergency')})")
        print(f"Recommendation: {response_body.get('recommendation')[:80]}...")
    else:
        print(f"Error Detail: {response_body.get('detail')}")

print("\n==========================================================================================")
print("AUDIT COMPLETED")
print("==========================================================================================")
