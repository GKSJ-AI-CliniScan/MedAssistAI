from fastapi.testclient import TestClient
from app.main import app
from app.utils.jwt_handler import create_access_token

client = TestClient(app)
token = create_access_token(data={"sub": "saikiranboya123@gmail.com"})
headers = {"Authorization": f"Bearer {token}"}

print("======================================================================")
print("1. TEST GET /symptoms CATALOGUE (370+ SYMPTOMS)")
print("======================================================================")
res = client.get("/symptoms?limit=500", headers=headers)
assert res.status_code == 200, f"Status: {res.status_code}"
symptoms = res.json()
print(f"Total symptoms returned from API: {len(symptoms)}")
assert len(symptoms) >= 370, f"Expected >= 370 symptoms, got {len(symptoms)}"
print("[PASS] Symptom catalogue verification successful\n")

print("======================================================================")
print("2. TEST PREVIOUSLY FAILING 16 SYMPTOMS")
print("======================================================================")
previously_failing = [
    "Loss of appetite", "Runny nose", "Blurred vision", "Tinnitus",
    "Loss of smell", "Loss of taste", "Numbness", "Tingling",
    "Tremors", "Memory problems", "Burning urination", "Difficulty urinating",
    "High blood pressure", "Low blood pressure", "Tooth pain", "Menstrual pain"
]
for sym in previously_failing:
    payload = {"symptoms": [sym]}
    r = client.post("/predict", json=payload, headers=headers)
    assert r.status_code == 200, f"Failed on {sym}: {r.status_code} - {r.text}"
    data = r.json()
    print(f"  [PASS] {sym:<22} -> Disease: {data['predicted_disease']:<28} | Conf: {data['confidence']}% | Severity: {data['severity_level']}")

print("\n======================================================================")
print("3. TEST MULTI-SYMPTOM COMBINATIONS (1, 2, 3, 4, 5, 8, 10, 15 SYMPTOMS)")
print("======================================================================")
test_combos = [
    ("1 Symptom", ["Fever"]),
    ("2 Symptoms", ["Fever", "Cough"]),
    ("3 Symptoms", ["Fever", "Cough", "Shortness of breath"]),
    ("4 Symptoms", ["Fever", "Cough", "Shortness of breath", "Chest pain"]),
    ("5 Symptoms", ["Fever", "Cough", "Shortness of breath", "Chest pain", "Fatigue"]),
    ("8 Symptoms", ["Fever", "Cough", "Shortness of breath", "Chest pain", "Fatigue", "Loss of appetite", "Headache", "Dizziness"]),
    ("10 Symptoms", ["Fever", "Cough", "Shortness of breath", "Chest pain", "Fatigue", "Loss of appetite", "Headache", "Dizziness", "Nausea", "Vomiting"]),
    ("15 Symptoms", ["Fever", "Cough", "Shortness of breath", "Chest pain", "Fatigue", "Loss of appetite", "Headache", "Dizziness", "Nausea", "Vomiting", "Back pain", "Joint pain", "Skin rash", "Insomnia", "Nasal congestion"])
]

for label, sym_list in test_combos:
    payload = {"symptoms": sym_list}
    r = client.post("/predict", json=payload, headers=headers)
    assert r.status_code == 200, f"Failed on {label}: {r.status_code} - {r.text}"
    data = r.json()
    print(f"  [PASS] {label:<12} ({len(sym_list):>2} items) -> Disease: {data['predicted_disease']:<28} | Conf: {data['confidence']}% | Severity: {data['severity_level']:<8} | Risk: {data['risk_level']}")

print("\n======================================================================")
print("ALL MULTI-SYMPTOM INFERENCE TESTS PASSED WITH 100% SUCCESS!")
print("======================================================================")
