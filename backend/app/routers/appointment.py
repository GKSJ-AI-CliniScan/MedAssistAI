from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.schemas.appointment_schema import AppointmentCreate, AppointmentUpdate, AppointmentResponse
from app.services.appointment_service import (
    create_appointment, get_appointment, get_all_appointments,
    get_appointments_by_patient, get_appointments_by_doctor,
    update_appointment, delete_appointment,
)
from app.utils.auth_handler import verify_token

router = APIRouter(prefix="/appointments", tags=["Appointments"])


@router.post("/", response_model=AppointmentResponse, status_code=201)
def add_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    return create_appointment(db, appointment, current_user)


@router.get("/", response_model=List[AppointmentResponse])
def list_appointments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    return get_all_appointments(db, skip, limit, current_user)


@router.get("/patient/{patient_id}", response_model=List[AppointmentResponse])
def list_appointments_by_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    return get_appointments_by_patient(db, patient_id, current_user)


@router.get("/doctor/{doctor_id}", response_model=List[AppointmentResponse])
def list_appointments_by_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    return get_appointments_by_doctor(db, doctor_id, current_user)


@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment_by_id(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    return get_appointment(db, appointment_id, current_user)


@router.put("/{appointment_id}", response_model=AppointmentResponse)
def edit_appointment(
    appointment_id: int,
    appointment_update: AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    return update_appointment(db, appointment_id, appointment_update, current_user)


@router.delete("/{appointment_id}", status_code=204)
def remove_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    delete_appointment(db, appointment_id, current_user)
    return Response(status_code=204)
