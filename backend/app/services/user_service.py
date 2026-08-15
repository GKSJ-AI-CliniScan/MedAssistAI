from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.schemas.user_schema import UserRegister, UserLogin, PasswordChangeRequest, UserUpdate
from app.utils.password import hash_password, verify_password


def create_user(db: Session, user_data: UserRegister) -> User:
    existing_user = db.query(User).filter(User.email == user_data.email).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email address is already registered",
        )

    db_user = User(
        fullname=user_data.fullname,
        email=user_data.email,
        password=hash_password(user_data.password),
        role=user_data.role,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Automatically create associated Patient or Doctor profile
    if db_user.role == "patient":
        patient = Patient(
            user_id=db_user.id,
            age=getattr(user_data, "age", None),
            gender=getattr(user_data, "gender", None),
            blood_group=getattr(user_data, "blood_group", None),
            contact_number=getattr(user_data, "contact_number", None),
            address=getattr(user_data, "address", None),
        )
        db.add(patient)
        db.commit()
    elif db_user.role == "doctor":
        doctor = Doctor(
            user_id=db_user.id,
            specialization=getattr(user_data, "specialization", "General Medicine") or "General Medicine",
            experience_years=getattr(user_data, "experience_years", 0) or 0,
        )
        db.add(doctor)
        db.commit()

    return db_user


def authenticate_user(db: Session, login_data: UserLogin) -> User:
    db_user = db.query(User).filter(User.email == login_data.email).first()

    if not db_user or not verify_password(login_data.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Login failed. Please check your email, password, and selected role.",
        )

    return db_user


def change_user_password(db: Session, user: User, data: PasswordChangeRequest) -> dict:
    if not verify_password(data.current_password, user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect.",
        )

    user.password = hash_password(data.new_password)
    db.commit()
    return {"message": "Password updated successfully."}


def update_user_account(db: Session, user: User, data: UserUpdate) -> User:
    if data.fullname is not None:
        user.fullname = data.fullname
    if data.email is not None and data.email != user.email:
        existing = db.query(User).filter(User.email == data.email).first()
        if existing and existing.id != user.id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email address is already in use.",
            )
        user.email = data.email

    db.commit()
    db.refresh(user)
    return user


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()