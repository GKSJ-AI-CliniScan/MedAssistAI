from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.models.doctor import Doctor
from app.models.user import User
from app.schemas.doctor_schema import DoctorUpdate, DoctorAccountCreate
from app.utils.password import hash_password


def get_doctor_by_user_id(db: Session, user_id: int) -> Doctor:
    doctor = db.query(Doctor).options(joinedload(Doctor.user)).filter(Doctor.user_id == user_id).first()
    if not doctor:
        doctor = Doctor(user_id=user_id)
        db.add(doctor)
        db.commit()
        db.refresh(doctor)
        doctor = db.query(Doctor).options(joinedload(Doctor.user)).filter(Doctor.user_id == user_id).first()
    return doctor


def get_doctor_by_id(db: Session, doctor_id: int) -> Doctor:
    doctor = db.query(Doctor).options(joinedload(Doctor.user)).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Doctor with ID {doctor_id} not found",
        )
    return doctor


def create_doctor_account(db: Session, data: DoctorAccountCreate) -> Doctor:
    email = data.email.strip().lower()
    
    # 1. Check if email already exists
    existing_user = db.query(User).filter(User.email.ilike(email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address is already registered.",
        )
    
    # 2. Check password length
    if len(data.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long.",
        )
    
    # 3. Create User account with role 'doctor'
    hashed_pwd = hash_password(data.password)
    user = User(
        fullname=data.fullname.strip(),
        email=email,
        password=hashed_pwd,
        role="doctor",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # 4. Create Doctor Profile
    doctor = Doctor(
        user_id=user.id,
        specialization=data.specialization.strip() if data.specialization else "General Medicine",
        experience_years=int(data.experience_years) if data.experience_years is not None else 0,
        qualification=data.qualification.strip() if data.qualification else None,
        contact_number=data.contact_number.strip() if data.contact_number else None,
        clinic_address=data.clinic_address.strip() if data.clinic_address else None,
        is_available=True,
    )
    db.add(doctor)
    db.commit()
    db.refresh(doctor)
    
    # 5. Return fully loaded doctor with user
    return db.query(Doctor).options(joinedload(Doctor.user)).filter(Doctor.id == doctor.id).first()


def update_doctor_profile(
    db: Session, user: User, update_data: DoctorUpdate
) -> Doctor:
    doctor = get_doctor_by_user_id(db, user.id)

    update_dict = update_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(doctor, field, value)

    db.commit()
    db.refresh(doctor)
    return db.query(Doctor).options(joinedload(Doctor.user)).filter(Doctor.id == doctor.id).first()


def get_all_doctors(
    db: Session, available_only: bool = False, skip: int = 0, limit: int = 100, search: str = None
) -> List[Doctor]:
    query = db.query(Doctor).options(joinedload(Doctor.user))
    if available_only:
        query = query.filter(Doctor.is_available == True)
    if search:
        search_term = search.strip()
        query = query.join(Doctor.user).filter(
            (User.fullname.ilike(f"%{search_term}%")) | 
            (User.email.ilike(f"%{search_term}%")) |
            (Doctor.specialization.ilike(f"%{search_term}%"))
        )
    return query.offset(skip).limit(limit).all()
