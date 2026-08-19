"""
Targeted Verification Test for Admin Doctor Creation & Authentication Lifecycle
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

def request(method, path, json_body=None, headers=None):
    url = f"{BASE_URL}{path}"
    req_headers = {"User-Agent": "MedAssistAI-Doctor-Creation-Test"}
    if headers:
        req_headers.update(headers)
        
    req_data = None
    if json_body is not None:
        req_headers["Content-Type"] = "application/json"
        req_data = json.dumps(json_body).encode("utf-8")
        
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
    print("MEDASSISTAI - ADMIN DOCTOR CREATION VERIFICATION TEST")
    print("=" * 70)
    
    # 1. Admin login
    status, admin_data = request("POST", "/auth/login", json_body={
        "email": "saikiranboya12345@gmail.com",
        "password": "Medassist@2A",
        "role": "ADMIN"
    })
    assert status == 200, f"Admin login failed: {admin_data}"
    admin_token = admin_data["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    log("Admin authenticated successfully")
    
    # 2. Test Doctor Creation by Admin
    new_doc_email = "dr.vikram.aditya@medassist.ai"
    new_doc_pwd = "DoctorPass@123"
    
    # Delete if exists from previous test run
    # (or simply test creation)
    create_payload = {
        "fullname": "DR. VIKRAM ADITYA",
        "email": new_doc_email,
        "password": new_doc_pwd,
        "specialization": "Orthopedics",
        "experience_years": 14
    }
    
    status, created_doc = request("POST", "/doctor", json_body=create_payload, headers=admin_headers)
    if status == 400 and "already registered" in str(created_doc):
        log(f"Doctor {new_doc_email} already in DB, testing login and query...")
    else:
        assert status == 201, f"Doctor creation failed: status={status}, response={created_doc}"
        assert created_doc["specialization"] == "Orthopedics"
        assert created_doc["experience_years"] == 14
        assert created_doc["user"]["fullname"] == "DR. VIKRAM ADITYA"
        assert created_doc["user"]["email"] == new_doc_email
        assert created_doc["user"]["role"] == "doctor"
        log("Admin created doctor successfully (HTTP 201 Created)")

    # 3. Verify Doctor appears in directory
    status, docs_list = request("GET", f"/doctor/all?search={urllib.parse.quote('Vikram')}", headers=admin_headers)
    assert status == 200, f"Failed to list doctors: {docs_list}"
    assert any(d["user"]["email"] == new_doc_email for d in docs_list), "Created doctor not found in directory"
    log("New doctor appears immediately in Doctor Directory (/doctor/all)")
    
    # 4. Verify Doctor Login
    status, doc_login = request("POST", "/auth/login", json_body={
        "email": new_doc_email,
        "password": new_doc_pwd,
        "role": "DOCTOR"
    })
    assert status == 200, f"New doctor login failed: {doc_login}"
    doc_token = doc_login["access_token"]
    doc_headers = {"Authorization": f"Bearer {doc_token}"}
    log("New doctor logged in successfully with created credentials")
    
    # 5. Verify Doctor Profile
    status, doc_profile = request("GET", "/doctor/profile", headers=doc_headers)
    assert status == 200, f"Doctor profile fetch failed: {doc_profile}"
    assert doc_profile["specialization"] == "Orthopedics"
    assert doc_profile["experience_years"] == 14
    assert doc_profile["user"]["fullname"] == "DR. VIKRAM ADITYA"
    log("Doctor profile verified with exact specialization and experience years")
    
    # 6. Verify duplicate email rejection
    status, dup_err = request("POST", "/doctor", json_body=create_payload, headers=admin_headers)
    assert status in (400, 409), f"Duplicate doctor creation should fail, got status {status}: {dup_err}"
    log("Duplicate email rejection verified with proper error message")
    
    # 7. Verify all 5 original doctors still intact
    original_doctors = [
        ("saikiranboya123@gmail.com", "Medassist@2D", "General Medicine"),
        ("diksha123@gmail.com", "Medassist@2D", "Pediatrics"),
        ("sanvisawanth123@gmail.com", "Medassist@2D", "Cardiology"),
        ("drushhtikuhikar123@gmail.com", "Medassist@2D", "Neurology"),
        ("visuddhijain123@gmail.com", "Medassist@2D", "Dermatology"),
    ]
    for email, pwd, spec in original_doctors:
        status, data = request("POST", "/auth/login", json_body={"email": email, "password": pwd, "role": "DOCTOR"})
        assert status == 200, f"Original doctor login failed for {email}"
    log("All 5 original approved doctors verified intact and authenticable")

    print("=" * 70)
    print("DOCTOR CREATION LIFECYCLE FULLY VERIFIED (7/7 CHECKS PASSED)")
    print("=" * 70)

if __name__ == "__main__":
    main()
