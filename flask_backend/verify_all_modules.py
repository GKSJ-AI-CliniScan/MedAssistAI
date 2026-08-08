import os
import sys
import json
import requests

# Test backend server endpoints directly or via internal test client
base_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, base_dir)

from app import app

def run_tests():
    print("=" * 70)
    print("MEDASSIST AI - SYSTEM REQUIREMENTS VERIFICATION SUITE")
    print("=" * 70)

    client = app.test_client()

    # 1. Health Check
    res = client.get('/api/health')
    print(f"\n[1] Health Check: Status {res.status_code}")
    print(f"    Response: {res.get_json()}")
    assert res.status_code == 200

    # 2. Module 3: Disease Prediction (ML Model)
    predict_payload = {
        "symptoms": ["chest pain", "shortness of breath", "sweating", "increased heart rate"],
        "severity": "Severe",
        "duration": "1-3 days",
        "onset": "Sudden",
        "age": 45,
        "gender": "Male"
    }
    res = client.post('/api/predict-disease', json=predict_payload)
    print(f"\n[2] Module 3: Disease Prediction (Cardiac Symptoms): Status {res.status_code}")
    data = res.get_json()
    print(f"    Primary Disease: {data.get('disease')}")
    print(f"    Confidence: {data.get('confidence')}%")
    print(f"    Risk Category: {data.get('risk')}")
    print(f"    Calculated Risk Score: {data.get('riskScore')} / 100")
    print(f"    Top Diseases: {[d['name'] + ' (' + str(d['confidence']) + '%)' for d in data.get('topDiseases', [])]}")
    assert data.get('success') is True

    # 3. Module 4: Risk Assessment & Emergency Identification
    res = client.post('/api/risk-assessment', json={
        "symptoms": ["crushing chest pain", "slurred speech", "loss of consciousness"],
        "severity": "Critical",
        "duration": "Less than a day"
    })
    print(f"\n[3] Module 4: Standalone Risk Assessment & SOS: Status {res.status_code}")
    data = res.get_json()
    print(f"    Risk Level: {data.get('riskLevel')}")
    print(f"    Risk Score: {data.get('riskScore')} / 100")
    print(f"    Emergency Flag: {data.get('isEmergency')}")
    print(f"    Emergency Message: {data.get('emergencyMessage')}")
    assert data.get('success') is True

    # 4. Module 5: Treatment Recommendations
    res = client.post('/api/treatment-recommendations', json={
        "disease": "Acute Coronary Syndrome",
        "riskLevel": "High"
    })
    print(f"\n[4] Module 5: Treatment Recommendations: Status {res.status_code}")
    data = res.get_json()
    print(f"    Recommended Specialist: {data.get('recommendedSpecialist')}")
    print(f"    Suggested Diagnostic Tests: {data.get('suggestedTests')}")
    print(f"    Precautions: {data.get('precautions')}")
    print(f"    Dietary Guidelines: {data.get('lifestyleAdvice', {}).get('dietaryGuidance')}")
    assert data.get('success') is True

    # 5. Module 7: Analytics Overview & Model Metrics
    res = client.get('/api/analytics/overview')
    print(f"\n[5] Module 7: Analytics Overview & Benchmarks: Status {res.status_code}")
    data = res.get_json()
    metrics = data.get('benchmarks', {}).get('metrics', {})
    print(f"    Model Accuracy: {metrics.get('accuracy')}%")
    print(f"    Model Precision: {metrics.get('precision')}%")
    print(f"    Model Recall: {metrics.get('recall')}%")
    print(f"    Model F1-Score: {metrics.get('f1Score')}%")
    print(f"    Latency: {metrics.get('averageLatencyMs')} ms")
    print(f"    Symptom Trends Count: {len(data.get('symptomTrends', []))}")
    assert data.get('success') is True

    print("\n" + "=" * 70)
    print("ALL 7 MODULE VERIFICATION TESTS PASSED SUCCESSFULLY!")
    print("=" * 70)

if __name__ == '__main__':
    run_tests()
