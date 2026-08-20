import logging
from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models.user import User
from app.models.doctor import Doctor
from app.models.patient import Patient
from app.models.appointment import Appointment
from app.models.report import Report
from app.models.prescription import Prescription
from app.ml.disease_mapping import get_disease_name, load_disease_mapping
from app.database.seed_users import seed_doctor_admin_accounts
from app.database.seed_symptoms import seed_symptoms

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("CleanData")

APPROVED_DOCTOR_EMAILS = {
    "saikiranboya123@gmail.com",
    "diksha123@gmail.com",
    "sanvisawanth123@gmail.com",
    "drushhtikuhikar123@gmail.com",
    "visuddhijain123@gmail.com",
}

APPROVED_ADMIN_EMAILS = {
    "saikiranboya12345@gmail.com",
    "diksha12345@gmail.com",
    "sanvisawanth12345@gmail.com",
    "drushhtikuhikar12345@gmail.com",
    "visuddhijain12345@gmail.com",
}

TEST_EMAILS_PATTERNS = [
    "@example.com",
    "sanvisawanth@gmail.com",
    "sanvisawanth45@gmail.com",
    "saikiranboya35@gmail.com",
    "naveenboya35@gmail.com",
    "userxample1233@gmail.com",
    "infosys123@gmail.com",
    "test001@gmail.com",
    "shivasai123@gmail.com",
]


def clean_database():
    db: Session = SessionLocal()
    try:
        logger.info("Starting safe database cleanup...")

        # 1. Clean junk prescriptions (e.g. "dfg", "seragrhb", "string")
        junk_rx = db.query(Prescription).filter(
            Prescription.medicine.in_(["dfg", "seragrhb", "string", "test", "demo"])
        ).all()
        for rx in junk_rx:
            logger.info("Deleting junk prescription ID #%s (%s)", rx.id, rx.medicine)
            db.delete(rx)
        db.commit()

        # 2. Clean junk appointments (e.g. reason is "string" or invalid)
        junk_apts = db.query(Appointment).filter(
            Appointment.reason.in_(["string", "test", "demo"])
        ).all()
        for apt in junk_apts:
            logger.info("Deleting junk appointment ID #%s (%s)", apt.id, apt.reason)
            db.delete(apt)
        db.commit()

        # 3. Clean test users
        users = db.query(User).all()
        for u in users:
            is_approved_doc = u.email in APPROVED_DOCTOR_EMAILS
            is_approved_admin = u.email in APPROVED_ADMIN_EMAILS
            
            # Check if user matches test junk
            is_test_email = any(pat in u.email.lower() for pat in TEST_EMAILS_PATTERNS)
            is_test_name = u.fullname and u.fullname.strip().lower() in ["string", "charlie staff", "diana admin", "test patient", "doc milestone3", "pat milestone3", "admin milestone3"]
            is_unapproved_doc = u.role == "doctor" and not is_approved_doc
            is_unapproved_admin = u.role == "admin" and not is_approved_admin and u.email not in ["naveen123@gmail.com", "ravichandra99@gmail.com", "naveen11@gmail.com"]

            if is_test_email or is_test_name or is_unapproved_doc:
                logger.info("Purging test user ID #%s | %s | %s | %s", u.id, u.email, u.fullname, u.role)
                
                # Delete appointments
                patient = db.query(Patient).filter(Patient.user_id == u.id).first()
                if patient:
                    db.query(Appointment).filter(Appointment.patient_id == patient.id).delete()
                    db.query(Report).filter(Report.patient_id == patient.id).delete()
                    db.query(Prescription).filter(Prescription.patient_id == patient.id).delete()
                    db.delete(patient)

                doctor = db.query(Doctor).filter(Doctor.user_id == u.id).first()
                if doctor:
                    db.query(Appointment).filter(Appointment.doctor_id == doctor.id).delete()
                    db.query(Prescription).filter(Prescription.doctor_id == doctor.id).delete()
                    db.delete(doctor)

                db.delete(u)

        db.commit()

        # 4. Clean up any "Medical Condition #xxx" in Reports and replace with real disease names if mappable
        load_disease_mapping()
        reports = db.query(Report).all()
        for rep in reports:
            if rep.predicted_disease and rep.predicted_disease.startswith("Medical Condition #"):
                try:
                    target_id = int(rep.predicted_disease.replace("Medical Condition #", "").strip())
                    real_name = get_disease_name(target_id)
                    if not real_name.startswith("Medical Condition #"):
                        logger.info("Correcting Report #%s label from '%s' to '%s'", rep.id, rep.predicted_disease, real_name)
                        rep.predicted_disease = real_name
                except Exception:
                    pass
        db.commit()

        # 5. Ensure the 5 Doctors and 5 Admins are properly seeded
        seed_doctor_admin_accounts()
        
        # 6. Ensure 54 symptoms are seeded
        seed_symptoms()

        # Summary count
        doc_count = db.query(Doctor).count()
        pat_count = db.query(Patient).count()
        apt_count = db.query(Appointment).count()
        rep_count = db.query(Report).count()
        rx_count = db.query(Prescription).count()

        logger.info("Cleanup Complete! Current DB state: Doctors=%d, Patients=%d, Appointments=%d, Reports=%d, Prescriptions=%d",
                    doc_count, pat_count, apt_count, rep_count, rx_count)

    except Exception as e:
        logger.exception("Error during database cleanup: %s", e)
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    clean_database()
