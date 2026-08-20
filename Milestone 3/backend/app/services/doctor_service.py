from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.doctor import Doctor
from app.models.user import User
from app.schemas.doctor_schema import DoctorUpdate


def get_doctor_by_user_id(db: Session, user_id: int) -> Doctor:
    doctor = db.query(Doctor).filter(Doctor.user_id == user_id).first()
    if not doctor:
        doctor = Doctor(user_id=user_id)
        db.add(doctor)
        db.commit()
        db.refresh(doctor)
    return doctor


def get_doctor_by_id(db: Session, doctor_id: int) -> Doctor:
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Doctor with ID {doctor_id} not found",
        )
    return doctor


def update_doctor_profile(
    db: Session, user: User, update_data: DoctorUpdate
) -> Doctor:
    doctor = get_doctor_by_user_id(db, user.id)

    update_dict = update_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(doctor, field, value)

    db.commit()
    db.refresh(doctor)
    return doctor


def get_all_doctors(
    db: Session, available_only: bool = False, skip: int = 0, limit: int = 100
) -> List[Doctor]:
    query = db.query(Doctor)
    if available_only:
        query = query.filter(Doctor.is_available == True)
    return query.offset(skip).limit(limit).all()
