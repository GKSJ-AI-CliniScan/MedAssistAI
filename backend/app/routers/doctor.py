from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.schemas.doctor_schema import DoctorCreate, DoctorUpdate, DoctorResponse
from app.services.doctor_service import (
    create_doctor, get_doctor, get_all_doctors, update_doctor, delete_doctor,
)
from app.utils.auth_handler import verify_token

router = APIRouter(prefix="/doctors", tags=["Doctors"])


@router.post("/", response_model=DoctorResponse, status_code=201)
def add_doctor(
    doctor: DoctorCreate,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    return create_doctor(db, doctor, current_user)


@router.get("/", response_model=List[DoctorResponse])
def list_doctors(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    return get_all_doctors(db, skip, limit, current_user)


@router.get("/{doctor_id}", response_model=DoctorResponse)
def get_doctor_by_id(
    doctor_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    return get_doctor(db, doctor_id, current_user)


@router.put("/{doctor_id}", response_model=DoctorResponse)
def edit_doctor(
    doctor_id: int,
    doctor_update: DoctorUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    return update_doctor(db, doctor_id, doctor_update, current_user)


@router.delete("/{doctor_id}", status_code=204)
def remove_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):
    delete_doctor(db, doctor_id, current_user)
    return Response(status_code=204)
