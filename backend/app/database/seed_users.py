from sqlalchemy.orm import Session
from app.database.session import SessionLocal
import app.models
from app.models.user import User
from app.models.doctor import Doctor
from app.models.patient import Patient
from app.utils.password import hash_password


def seed_doctor_admin_accounts(db: Session = None):
    should_close = False
    if db is None:
        db = SessionLocal()
        should_close = True

    try:
        # Doctor accounts
        doctor_accounts = [
            {
                "fullname": "DR. SAI KIRAN BOYA",
                "email": "saikiranboya123@gmail.com",
                "password": "Medassist@2D",
                "role": "doctor",
                "specialization": "General Medicine",
                "experience_years": 15
            },
            {
                "fullname": "DR. DIKSHA",
                "email": "diksha123@gmail.com",
                "password": "Medassist@2D",
                "role": "doctor",
                "specialization": "Pediatrics",
                "experience_years": 12
            },
            {
                "fullname": "DR. SANVI SAWANTH",
                "email": "sanvisawanth123@gmail.com",
                "password": "Medassist@2D",
                "role": "doctor",
                "specialization": "Cardiology",
                "experience_years": 10
            },
            {
                "fullname": "DR. DRUSHTHI KUHIKAR",
                "email": "drushhtikuhikar123@gmail.com",
                "password": "Medassist@2D",
                "role": "doctor",
                "specialization": "Neurology",
                "experience_years": 8
            },
            {
                "fullname": "DR. VISHUDDHI JAIN",
                "email": "visuddhijain123@gmail.com",
                "password": "Medassist@2D",
                "role": "doctor",
                "specialization": "Dermatology",
                "experience_years": 6
            }
        ]

        # Admin accounts
        admin_accounts = [
            {
                "fullname": "DR. SAI KIRAN BOYA",
                "email": "saikiranboya12345@gmail.com",
                "password": "Medassist@2A",
                "role": "admin"
            },
            {
                "fullname": "DR. DIKSHA",
                "email": "diksha12345@gmail.com",
                "password": "Medassist@2A",
                "role": "admin"
            },
            {
                "fullname": "DR. SANVI SAWANTH",
                "email": "sanvisawanth12345@gmail.com",
                "password": "Medassist@2A",
                "role": "admin"
            },
            {
                "fullname": "DR. DRUSHTHI KUHIKAR",
                "email": "drushhtikuhikar12345@gmail.com",
                "password": "Medassist@2A",
                "role": "admin"
            },
            {
                "fullname": "DR. VISHUDDHI JAIN",
                "email": "visuddhijain12345@gmail.com",
                "password": "Medassist@2A",
                "role": "admin"
            }
        ]

        # Safe, non-destructive upsert for Doctor accounts
        for account_data in doctor_accounts:
            existing_user = db.query(User).filter(User.email == account_data["email"]).first()
            if not existing_user:
                hashed_password = hash_password(account_data["password"])
                user = User(
                    fullname=account_data["fullname"],
                    email=account_data["email"],
                    password=hashed_password,
                    role=account_data["role"]
                )
                db.add(user)
                db.commit()
                db.refresh(user)

                doctor = Doctor(
                    user_id=user.id,
                    specialization=account_data.get("specialization", "General Medicine"),
                    experience_years=account_data.get("experience_years", 0)
                )
                db.add(doctor)
                db.commit()
                print(f"Created Doctor account: {account_data['email']}")
            else:
                # Ensure doctor role, password, and doctor profile exist
                existing_user.fullname = account_data["fullname"]
                existing_user.role = "doctor"
                existing_user.password = hash_password(account_data["password"])

                existing_doctor = db.query(Doctor).filter(Doctor.user_id == existing_user.id).first()
                if not existing_doctor:
                    doctor = Doctor(
                        user_id=existing_user.id,
                        specialization=account_data.get("specialization", "General Medicine"),
                        experience_years=account_data.get("experience_years", 0)
                    )
                    db.add(doctor)
                else:
                    existing_doctor.specialization = account_data.get("specialization", "General Medicine")
                    existing_doctor.experience_years = account_data.get("experience_years", 0)

                db.commit()
                print(f"Verified/Updated Doctor account: {account_data['email']}")

        # Safe, non-destructive upsert for Admin accounts
        for account_data in admin_accounts:
            existing_user = db.query(User).filter(User.email == account_data["email"]).first()
            if not existing_user:
                hashed_password = hash_password(account_data["password"])
                user = User(
                    fullname=account_data["fullname"],
                    email=account_data["email"],
                    password=hashed_password,
                    role=account_data["role"]
                )
                db.add(user)
                db.commit()
                print(f"Created Admin account: {account_data['email']}")
            else:
                existing_user.fullname = account_data["fullname"]
                existing_user.role = "admin"
                existing_user.password = hash_password(account_data["password"])
                db.commit()
                print(f"Verified/Updated Admin account: {account_data['email']}")

        print("Successfully ensured 5 Doctor and 5 Admin accounts exist!")

    except Exception as e:
        print(f"Error seeding accounts: {e}")
        db.rollback()
    finally:
        if should_close:
            db.close()


if __name__ == "__main__":
    seed_doctor_admin_accounts()
