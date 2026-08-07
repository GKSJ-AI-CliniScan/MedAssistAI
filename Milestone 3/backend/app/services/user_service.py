from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.schemas.user_schema import UserRegister, UserLogin
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
        patient = Patient(user_id=db_user.id)
        db.add(patient)
        db.commit()
    elif db_user.role == "doctor":
        doctor = Doctor(user_id=db_user.id)
        db.add(doctor)
        db.commit()

    return db_user


def authenticate_user(db: Session, login_data: UserLogin) -> User:
    db_user = db.query(User).filter(User.email == login_data.email).first()

    if not db_user or not verify_password(login_data.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return db_user


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()