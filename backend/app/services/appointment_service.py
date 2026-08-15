from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.models.appointment import Appointment
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.user import User
from app.schemas.appointment_schema import AppointmentCreate, AppointmentStatusUpdate
from app.services.patient_service import get_patient_by_user_id, get_patient_by_id
from app.services.doctor_service import get_doctor_by_user_id, get_doctor_by_id


def _appointment_query(db: Session):
    return db.query(Appointment).options(
        joinedload(Appointment.doctor).joinedload(Doctor.user),
        joinedload(Appointment.patient).joinedload(Patient.user),
    )


def create_appointment(
    db: Session, user: User, data: AppointmentCreate
) -> Appointment:
    if user.role == "patient":
        patient = get_patient_by_user_id(db, user.id)
        if not data.doctor_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="doctor_id is required to book an appointment",
            )
        doctor = get_doctor_by_id(db, data.doctor_id)
        initial_status = "Pending"
    elif user.role == "doctor":
        doctor = get_doctor_by_user_id(db, user.id)
        if not data.patient_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="patient_id is required to create an appointment",
            )
        patient = get_patient_by_id(db, data.patient_id)
        initial_status = "Confirmed"
    elif user.role == "admin":
        if not data.patient_id or not data.doctor_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Both patient_id and doctor_id are required",
            )
        patient = get_patient_by_id(db, data.patient_id)
        doctor = get_doctor_by_id(db, data.doctor_id)
        initial_status = "Confirmed"
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized to create appointments",
        )

    appointment = Appointment(
        patient_id=patient.id,
        doctor_id=doctor.id,
        appointment_date=data.appointment_date,
        reason=data.reason or "General Consultation",
        status=initial_status,
        notes=data.notes,
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    # Return with eager loaded relationships
    return _appointment_query(db).filter(Appointment.id == appointment.id).first()


def get_patient_appointments(db: Session, user: User) -> List[Appointment]:
    patient = get_patient_by_user_id(db, user.id)
    return (
        _appointment_query(db)
        .filter(Appointment.patient_id == patient.id)
        .order_by(Appointment.appointment_date.desc())
        .all()
    )


def get_doctor_appointments(db: Session, user: User, status_filter: Optional[str] = None) -> List[Appointment]:
    doctor = get_doctor_by_user_id(db, user.id)
    query = _appointment_query(db).filter(Appointment.doctor_id == doctor.id)
    if status_filter and status_filter.lower() != "all":
        query = query.filter(func.lower(Appointment.status) == status_filter.lower())
    return query.order_by(Appointment.appointment_date.desc()).all()


def update_appointment_status(
    db: Session, appointment_id: int, user: User, data: AppointmentStatusUpdate
) -> Appointment:
    appointment = (
        _appointment_query(db).filter(Appointment.id == appointment_id).first()
    )

    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment #{appointment_id} not found",
        )

    # Authorization checks
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
    return _appointment_query(db).filter(Appointment.id == appointment.id).first()


def get_all_appointments(db: Session, skip: int = 0, limit: int = 100, status: str = None) -> List[Appointment]:
    query = _appointment_query(db)
    if status and status.lower() != "all":
        query = query.filter(func.lower(Appointment.status) == status.lower())
    return (
        query.order_by(Appointment.appointment_date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_appointment_by_id(db: Session, appointment_id: int, user: User) -> Appointment:
    appointment = _appointment_query(db).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment #{appointment_id} not found",
        )

    # Authorization check
    if user.role != "admin":
        if user.role == "doctor":
            doctor = get_doctor_by_user_id(db, user.id)
            if appointment.doctor_id != doctor.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Unauthorized to view this appointment",
                )
        elif user.role == "patient":
            patient = get_patient_by_user_id(db, user.id)
            if appointment.patient_id != patient.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Unauthorized to view this appointment",
                )

    return appointment
