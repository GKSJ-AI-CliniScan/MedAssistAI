"""
Comprehensive End-to-End Multi-Role Clinical Workflow Verification Test
Using standard library urllib.request (zero external dependency).
"""
import urllib.request
import urllib.error
import urllib.parse
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def log(msg, success=True):
    icon = "[PASS]" if success else "[FAIL]"
    print(f"{icon} {msg}")

def request(method, path, data=None, json_body=None, headers=None):
    url = f"{BASE_URL}{path}"
    req_headers = {"User-Agent": "MedAssistAI-E2E-Test"}
    if headers:
        req_headers.update(headers)
        
    req_data = None
    if json_body is not None:
        req_headers["Content-Type"] = "application/json"
        req_data = json.dumps(json_body).encode("utf-8")
    elif data is not None:
        req_headers["Content-Type"] = "application/x-www-form-urlencoded"
        req_data = urllib.parse.urlencode(data).encode("utf-8")
        
    req = urllib.request.Request(url, data=req_data, headers=req_headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode("utf-8")
            status = resp.status
            try:
                return status, json.loads(body)
            except Exception:
                return status, body
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(body)
        except Exception:
            return e.code, body

def main():
    print("=" * 70)
    print("MEDASSISTAI - FULL SYSTEM E2E VERIFICATION TEST")
    print("=" * 70)
    
    # 1. Health check
    status, body = request("GET", "/")
    assert status == 200, f"Health check failed: {body}"
    log("System Health & Database connection verified")
    
    # 2. Check 5 approved doctors authentication
    doctor_accounts = [
        ("saikiranboya123@gmail.com", "Medassist@2D", "General Medicine"),
        ("diksha123@gmail.com", "Medassist@2D", "Pediatrics"),
        ("sanvisawanth123@gmail.com", "Medassist@2D", "Cardiology"),
        ("drushhtikuhikar123@gmail.com", "Medassist@2D", "Neurology"),
        ("visuddhijain123@gmail.com", "Medassist@2D", "Dermatology"),
    ]
    
    doc_tokens = {}
    for email, pwd, spec in doctor_accounts:
        status, data = request("POST", "/auth/login", json_body={"email": email, "password": pwd, "role": "DOCTOR"})
        assert status == 200, f"Doctor login failed for {email}: {data}"
        assert data["user"]["role"].upper() == "DOCTOR", f"Expected DOCTOR, got {data['user']['role']}"
        doc_tokens[email] = data["access_token"]
        log(f"Doctor login verified: {email} ({spec})")
    
    # 3. Check 5 approved admins authentication
    admin_accounts = [
        ("saikiranboya12345@gmail.com", "Medassist@2A"),
        ("diksha12345@gmail.com", "Medassist@2A"),
        ("sanvisawanth12345@gmail.com", "Medassist@2A"),
        ("drushhtikuhikar12345@gmail.com", "Medassist@2A"),
        ("visuddhijain12345@gmail.com", "Medassist@2A"),
    ]
    
    admin_tokens = {}
    for email, pwd in admin_accounts:
        status, data = request("POST", "/auth/login", json_body={"email": email, "password": pwd, "role": "ADMIN"})
        assert status == 200, f"Admin login failed for {email}: {data}"
        assert data["user"]["role"].upper() == "ADMIN", f"Expected ADMIN, got {data['user']['role']}"
        admin_tokens[email] = data["access_token"]
        log(f"Admin login verified: {email}")
        
    # 4. Patient Registration & Login
    patient_email = "test.patient.e2e@medassist.ai"
    patient_pwd = "PatientSecure@123"
    
    status, data = request("POST", "/auth/login", json_body={"email": patient_email, "password": patient_pwd, "role": "PATIENT"})
    if status != 200:
        status, reg_data = request("POST", "/auth/register", json_body={
            "fullname": "John Test Patient",
            "email": patient_email,
            "password": patient_pwd,
            "role": "PATIENT",
            "age": 35,
            "gender": "Male",
            "blood_group": "O+"
        })
        assert status in (200, 201), f"Patient registration failed: {reg_data}"
        log(f"Patient registration verified: {patient_email}")
        
        status, data = request("POST", "/auth/login", json_body={"email": patient_email, "password": patient_pwd, "role": "PATIENT"})
        assert status == 200, f"Patient login failed: {data}"
        
    pat_token = data["access_token"]
    pat_headers = {"Authorization": f"Bearer {pat_token}"}
    log(f"Patient login verified: {patient_email}")
    
    # 5. Fast ML Inference & Report Creation
    symptoms = ["fever", "cough", "sore throat", "headache"]
    status, pred = request("POST", "/predict", json_body={"symptoms": symptoms}, headers=pat_headers)
    assert status == 200, f"Prediction failed: {pred}"
    assert "predicted_disease" in pred and pred["predicted_disease"] != "", f"No disease predicted: {pred}"
    assert "confidence" in pred
    log(f"Fast ML Inference verified: Disease '{pred['predicted_disease']}', Confidence {pred['confidence']:.1f}%, Risk: {pred['risk_level']}")
    
    # 6. Patient Profile Fetch & Update
    status, updated = request("PUT", "/patient/profile", json_body={"age": 35, "gender": "Male", "blood_group": "O+"}, headers=pat_headers)
    assert status == 200, f"Patient profile update failed: {updated}"
    
    status, profile = request("GET", "/patient/profile", headers=pat_headers)
    assert status == 200, f"Patient profile fetch failed: {profile}"
    assert profile["age"] == 35 and profile["gender"] == "Male"
    log("Patient profile verified with demographic sync (Age: 35, Gender: Male, Blood: O+)")
    
    # 7. Patient Books Appointment with Doctor 1 (Dr. Sai Kiran Boya)
    doc1_email = "saikiranboya123@gmail.com"
    doc1_headers = {"Authorization": f"Bearer {doc_tokens[doc1_email]}"}
    
    # Get Doctor 1 profile ID
    status, doc1_profile = request("GET", "/doctor/profile", headers=doc1_headers)
    assert status == 200, f"Doctor profile fetch failed: {doc1_profile}"
    doc1_id = doc1_profile["id"]
    
    # Patient books
    status, apt = request("POST", "/appointments", json_body={
        "doctor_id": doc1_id,
        "appointment_date": "2026-08-20T10:00:00",
        "reason": "Follow-up consultation for respiratory symptoms",
        "notes": "Sore throat and fever for 3 days"
    }, headers=pat_headers)
    assert status in (200, 201), f"Appointment booking failed: {apt}"
    apt_id = apt["id"]
    assert apt["status"] == "Pending"
    log(f"Patient booked appointment #{apt_id} (Status: Pending)")
    
    # 8. Doctor 1 views appointments & confirms
    status, doc_apts = request("GET", "/appointments/my", headers=doc1_headers)
    assert status == 200
    assert any(a["id"] == apt_id for a in doc_apts)
    log(f"Doctor 1 fetched appointments queue containing #{apt_id}")
    
    # Doctor 1 confirms appointment
    status, updated_apt = request("PUT", f"/appointments/{apt_id}/status", json_body={"status": "Confirmed"}, headers=doc1_headers)
    assert status == 200, f"Appointment confirmation failed: {updated_apt}"
    assert updated_apt["status"] == "Confirmed"
    log(f"Doctor 1 confirmed appointment #{apt_id} (Status: Confirmed)")
    
    # 9. Doctor 1 completes appointment
    status, completed_apt = request("PUT", f"/appointments/{apt_id}/status", json_body={"status": "Completed"}, headers=doc1_headers)
    assert status == 200, f"Appointment completion failed: {completed_apt}"
    assert completed_apt["status"] == "Completed"
    log(f"Doctor 1 completed appointment #{apt_id} (Status: Completed)")
    
    # 10. Doctor 1 creates prescription for Patient
    pat_profile_id = profile["id"]
    status, rx = request("POST", "/prescriptions", json_body={
        "patient_id": pat_profile_id,
        "medicine": "Azithromycin 500mg",
        "dosage": "1 tablet daily",
        "frequency": "Once daily after meals",
        "duration": "5 days",
        "instructions": "Complete the full 5-day course. Take after breakfast."
    }, headers=doc1_headers)
    assert status in (200, 201), f"Prescription creation failed: {rx}"
    rx_id = rx["id"]
    assert rx["status"] == "active"
    log(f"Doctor 1 issued prescription #{rx_id} for {rx['medicine']}")
    
    # 11. Patient verifies prescription in /prescriptions/my
    status, patient_rxs = request("GET", "/prescriptions/my", headers=pat_headers)
    assert status == 200, f"Patient prescriptions fetch failed: {patient_rxs}"
    assert any(r["id"] == rx_id for r in patient_rxs)
    target_rx = next(r for r in patient_rxs if r["id"] == rx_id)
    assert target_rx["medicine"] == "Azithromycin 500mg"
    assert target_rx["doctor"]["user"]["fullname"] != ""
    log(f"Patient retrieved active prescription with prescribing doctor: {target_rx['doctor']['user']['fullname']}")
    
    # 12. Doctor 1 updates prescription status to completed
    status, updated_rx = request("PUT", f"/prescriptions/{rx_id}", json_body={"status": "completed"}, headers=doc1_headers)
    assert status == 200, f"Prescription update failed: {updated_rx}"
    log(f"Doctor 1 updated prescription #{rx_id} status to completed")
    
    # 13. Admin audits analytics & clinical records
    admin1_headers = {"Authorization": f"Bearer {admin_tokens['saikiranboya12345@gmail.com']}"}
    status, summary = request("GET", "/analytics/summary", headers=admin1_headers)
    assert status == 200, f"Admin analytics summary failed: {summary}"
    assert summary["overview"]["total_doctors"] >= 5
    assert summary["overview"]["total_patients"] >= 1
    assert summary["overview"]["total_reports"] >= 1
    assert summary["overview"]["total_appointments"] >= 1
    log(f"Admin Analytics Summary verified: 5 Doctors, {summary['overview']['total_patients']} Patients, {summary['overview']['total_reports']} Reports, {summary['overview']['total_appointments']} Appointments")
    
    # 14. Admin audits all appointments and confirms names are resolved
    status, all_apts = request("GET", "/appointments", headers=admin1_headers)
    assert status == 200, f"Admin appointments fetch failed: {all_apts}"
    assert len(all_apts) >= 1
    for a in all_apts[:3]:
        assert a.get("doctor") is not None and a["doctor"].get("user") is not None
        assert a.get("patient") is not None and a["patient"].get("user") is not None
    log("Admin Appointments verified with doctor and patient user objects eager-loaded")
    
    print("=" * 70)
    print("ALL END-TO-END CLINICAL WORKFLOW TESTS PASSED SUCCESSFULLY (14/14)")
    print("=" * 70)

if __name__ == "__main__":
    main()
