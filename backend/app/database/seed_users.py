from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models.user import User
from app.models.doctor import Doctor
from app.models.patient import Patient
from app.utils.password import hash_password


def seed_doctor_admin_accounts():
    db = SessionLocal()
    try:
        # Doctor emails
        doctor_emails = [
            "saikiranboya123@gmail.com",
            "diksha123@gmail.com", 
            "sanvisawanth123@gmail.com",
            "drushhtikuhikar123@gmail.com",
            "visuddhijain123@gmail.com"
        ]
        
        # Admin emails
        admin_emails = [
            "saikiranboya12345@gmail.com",
            "diksha12345@gmail.com",
            "sanvisawanth12345@gmail.com",
            "drushhtikuhikar12345@gmail.com",
            "visuddhijain12345@gmail.com"
        ]
        
        # Delete existing doctor accounts and their profiles
        for email in doctor_emails:
            existing_user = db.query(User).filter(User.email == email).first()
            if existing_user:
                # Delete associated doctor profile first
                existing_doctor = db.query(Doctor).filter(Doctor.user_id == existing_user.id).first()
                if existing_doctor:
                    db.delete(existing_doctor)
                # Then delete the user
                db.delete(existing_user)
                print(f"Deleted existing doctor account: {email}")
        
        # Delete existing admin accounts
        for email in admin_emails:
            existing_user = db.query(User).filter(User.email == email).first()
            if existing_user:
                db.delete(existing_user)
                print(f"Deleted existing admin account: {email}")
        
        db.commit()

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

        # Create Doctor accounts
        for account_data in doctor_accounts:
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

            # Create associated Doctor profile
            doctor = Doctor(
                user_id=user.id,
                specialization=account_data.get("specialization", "General Medicine"),
                experience_years=account_data.get("experience_years", 0)
            )
            db.add(doctor)
            db.commit()
            print(f"Created Doctor account: {account_data['email']}")

        # Create Admin accounts
        for account_data in admin_accounts:
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

        print("Successfully seeded 5 Doctor and 5 Admin accounts!")

    except Exception as e:
        print(f"Error seeding accounts: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_doctor_admin_accounts()
