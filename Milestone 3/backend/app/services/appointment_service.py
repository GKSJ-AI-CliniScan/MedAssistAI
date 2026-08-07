from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.appointment import Appointment
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.user import User
from app.schemas.appointment_schema import AppointmentCreate, AppointmentStatusUpdate
from app.services.patient_service import get_patient_by_user_id
from app.services.doctor_service import get_doctor_by_user_id, get_doctor_by_id


def create_appointment(
    db: Session, user: User, data: AppointmentCreate
) -> Appointment:
    patient = get_patient_by_user_id(db, user.id)
    doctor = get_doctor_by_id(db, data.doctor_id)

    appointment = Appointment(
        patient_id=patient.id,
        doctor_id=doctor.id,
        appointment_date=data.appointment_date,
        reason=data.reason,
        status="Pending",
        notes=data.notes,
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment


def get_patient_appointments(db: Session, user: User) -> List[Appointment]:
    patient = get_patient_by_user_id(db, user.id)
    return (
        db.query(Appointment)
        .filter(Appointment.patient_id == patient.id)
        .order_by(Appointment.appointment_date.desc())
        .all()
    )


def get_doctor_appointments(db: Session, user: User) -> List[Appointment]:
    doctor = get_doctor_by_user_id(db, user.id)
    return (
        db.query(Appointment)
        .filter(Appointment.doctor_id == doctor.id)
        .order_by(Appointment.appointment_date.desc())
        .all()
    )


def update_appointment_status(
    db: Session, appointment_id: int, user: User, data: AppointmentStatusUpdate
) -> Appointment:
    appointment = (
        db.query(Appointment).filter(Appointment.id == appointment_id).first()
    )

    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment #{appointment_id} not found",
        )

    # Allow update if user is assigned doctor, assigned patient, or admin
    if user.role != "admin":
        if user.role == "doctor":
            doctor = get_doctor_by_user_id(db, user.id)
            if appointment.doctor_id != doctor.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Unauthorized to update this appointment",
                )
        elif user.role == "patient":
            patient = get_patient_by_user_id(db, user.id)
            if appointment.patient_id != patient.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Unauthorized to update this appointment",
                )

    appointment.status = data.status
    if data.notes:
        appointment.notes = data.notes

    db.commit()
    db.refresh(appointment)
    return appointment


def get_all_appointments(db: Session, skip: int = 0, limit: int = 100) -> List[Appointment]:
    return (
        db.query(Appointment)
        .order_by(Appointment.appointment_date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
