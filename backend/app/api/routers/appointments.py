"""
Appointment Management Router

Handles creating, listing, updating, and cancelling appointments
for patients and doctors.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user, require_role
from app.repositories.appointment_repository import AppointmentRepository
from app.repositories.patient_repository import PatientRepository
from app.repositories.doctor_repository import DoctorRepository
from app.schemas import AppointmentCreate, AppointmentUpdate, AppointmentResponse
from app.models.user import User

router = APIRouter(prefix="/appointments", tags=["Appointments"])


def _get_patient_id_for_user(user: User, db: Session) -> int:
    """Resolve the patient record for the current user."""
    repo = PatientRepository(db)
    patient = repo.get_by_user_id(user.id)
    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not found. Please complete registration.",
        )
    return patient.id


@router.get("/", response_model=List[AppointmentResponse])
def list_my_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List appointments for the current user.
    - Patients see their own appointments.
    - Doctors see appointments assigned to them.
    - Admins see all appointments.
    """
    repo = AppointmentRepository(db)

    if current_user.role == "admin":
        return repo.list_all()
    elif current_user.role == "doctor":
        doctor_repo = DoctorRepository(db)
        doctor = doctor_repo.get_by_user_id(current_user.id)
        if not doctor:
            return []
        return repo.get_by_doctor(doctor.id)
    else:
        patient_id = _get_patient_id_for_user(current_user, db)
        return repo.get_by_patient(patient_id)


@router.post("/", response_model=AppointmentResponse, status_code=201)
def create_appointment(
    payload: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new appointment for the current patient."""
    patient_id = _get_patient_id_for_user(current_user, db)

    doctor_name = payload.doctor_name
    if payload.doctor_id:
        doctor_repo = DoctorRepository(db)
        doctor = doctor_repo.get_by_id(payload.doctor_id)
        if not doctor:
            raise HTTPException(status_code=404, detail="Specified doctor not found.")
        doctor_name = doctor.user.full_name if doctor.user else payload.doctor_name

    repo = AppointmentRepository(db)
    appointment = repo.create(
        patient_id=patient_id,
        doctor_id=payload.doctor_id,
        doctor_name=doctor_name,
        doctor_specialty=payload.doctor_specialty or "General Physician",
        date_time=payload.date_time,
        priority=payload.priority or "normal",
        status=payload.status or "confirmed",
    )
    return appointment


@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific appointment by ID."""
    repo = AppointmentRepository(db)
    appointment = repo.get_by_id(appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found.")
    return appointment


@router.put("/{appointment_id}", response_model=AppointmentResponse)
def update_appointment(
    appointment_id: int,
    payload: AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an existing appointment."""
    repo = AppointmentRepository(db)
    appointment = repo.get_by_id(appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found.")
    updated = repo.update(appointment, payload.model_dump(exclude_none=True))
    return updated


@router.delete("/{appointment_id}", status_code=204)
def cancel_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cancel (delete) an appointment."""
    repo = AppointmentRepository(db)
    deleted = repo.delete(appointment_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Appointment not found.")
