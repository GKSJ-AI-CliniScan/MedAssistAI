from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.doctor import Doctor
from app.schemas.doctor_schema import DoctorCreate, DoctorUpdate


def _is_admin(current_user: dict) -> bool:
    return current_user.get("role") == "admin"


def _is_self(current_user: dict, target_user_id: int) -> bool:
    return current_user.get("id") == target_user_id


def _get_doctor_or_404(db: Session, doctor_id: int) -> Doctor:
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor


def create_doctor(db: Session, doctor: DoctorCreate, current_user: dict):
    # user_id always comes from the verified JWT token
    user_id = current_user.get("id")

    existing = db.query(Doctor).filter(Doctor.user_id == user_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Doctor profile already exists for this user")

    db_doctor = Doctor(user_id=user_id, **doctor.model_dump())
    db.add(db_doctor)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="A doctor with this license number or phone number already exists"
        )

    db.refresh(db_doctor)
    return db_doctor


def get_doctor(db: Session, doctor_id: int, current_user: dict):
    # Doctor directory is readable by any authenticated user
    return _get_doctor_or_404(db, doctor_id)


def get_all_doctors(db: Session, skip: int = 0, limit: int = 100, current_user: dict = None):
    return db.query(Doctor).offset(skip).limit(limit).all()


def update_doctor(db: Session, doctor_id: int, doctor_update: DoctorUpdate, current_user: dict):
    doctor = _get_doctor_or_404(db, doctor_id)

    if not _is_admin(current_user) and not _is_self(current_user, doctor.user_id):
        raise HTTPException(status_code=403, detail="You can only update your own doctor profile")

    for field, value in doctor_update.model_dump(exclude_unset=True).items():
        setattr(doctor, field, value)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="A doctor with this license number or phone number already exists"
        )

    db.refresh(doctor)
    return doctor


def delete_doctor(db: Session, doctor_id: int, current_user: dict):
    doctor = _get_doctor_or_404(db, doctor_id)

    if not _is_admin(current_user) and not _is_self(current_user, doctor.user_id):
        raise HTTPException(status_code=403, detail="You can only delete your own doctor profile")

    db.delete(doctor)
    db.commit()
