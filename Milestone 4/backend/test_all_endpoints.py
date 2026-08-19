import json
import time
from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models.user import User
from app.models.doctor import Doctor
from app.models.patient import Patient
from app.models.appointment import Appointment
from app.models.prescription import Prescription
from app.models.report import Report
from app.services.user_service import authenticate_user
from app.schemas.user_schema import UserLogin
from app.schemas.prediction_schema import PredictionRequest
from app.services.prediction_service import predict_from_symptoms
from app.ml.model_loader import load_model
from app.ml.disease_mapping import load_disease_mapping

def run_tests():
    print("=== STARTING BACKEND INTEGRATION TESTS ===")
    db: Session = SessionLocal()
    try:
        # 1. Test Disease Mapping speed
        t0 = time.time()
        mapping = load_disease_mapping()
        t1 = time.time()
        print(f"[PASS] Disease Mapping loaded {len(mapping)} diseases in {t1-t0:.4f}s")

        # 2. Test Model Loading speed
        m = load_model()
        t2 = time.time()
        print(f"[PASS] ML Model ready in {t2-t1:.4f}s")

        # 3. Test Prediction
        pred_req = PredictionRequest(symptoms=["Fever", "Headache", "Cough"])
        patient_user = db.query(User).filter(User.role == "patient").first()
        res = predict_from_symptoms(pred_req, db=db, current_user=patient_user)
        t3 = time.time()
        print(f"[PASS] Prediction result: disease='{res.predicted_disease}', confidence={res.confidence}%, risk={res.risk_level} in {t3-t2:.2f}s")

        # 4. Test 5 Doctor logins
        docs = [
            ("saikiranboya123@gmail.com", "Medassist@2D", "DR. SAI KIRAN BOYA"),
            ("diksha123@gmail.com", "Medassist@2D", "DR. DIKSHA"),
            ("sanvisawanth123@gmail.com", "Medassist@2D", "DR. SANVI SAWANTH"),
            ("drushhtikuhikar123@gmail.com", "Medassist@2D", "DR. DRUSHTHI KUHIKAR"),
            ("visuddhijain123@gmail.com", "Medassist@2D", "DR. VISHUDDHI JAIN"),
        ]
        for email, pwd, expected_name in docs:
            user = authenticate_user(db, UserLogin(email=email, password=pwd, role="doctor"))
            assert user.fullname == expected_name, f"Expected {expected_name}, got {user.fullname}"
            print(f"[PASS] Doctor Auth verified: {email} -> {user.fullname}")

        # 5. Test 5 Admin logins
        admins = [
            ("saikiranboya12345@gmail.com", "Medassist@2A", "DR. SAI KIRAN BOYA"),
            ("diksha12345@gmail.com", "Medassist@2A", "DR. DIKSHA"),
            ("sanvisawanth12345@gmail.com", "Medassist@2A", "DR. SANVI SAWANTH"),
            ("drushhtikuhikar12345@gmail.com", "Medassist@2A", "DR. DRUSHTHI KUHIKAR"),
            ("visuddhijain12345@gmail.com", "Medassist@2A", "DR. VISHUDDHI JAIN"),
        ]
        for email, pwd, expected_name in admins:
            user = authenticate_user(db, UserLogin(email=email, password=pwd, role="admin"))
            assert user.fullname == expected_name, f"Expected {expected_name}, got {user.fullname}"
            print(f"[PASS] Admin Auth verified: {email} -> {user.fullname}")

        print("=== ALL BACKEND INTEGRATION TESTS PASSED SUCCESSFULLY ===")
    finally:
        db.close()

if __name__ == "__main__":
    run_tests()
