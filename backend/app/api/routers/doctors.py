"""
Doctor Management Router

Handles doctor profile CRUD operations, availability scheduling,
and doctor directory lookups.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user, require_role
from app.repositories.doctor_repository import DoctorRepository
from app.schemas import DoctorCreate, DoctorUpdate, DoctorResponse
from app.models.user import User

router = APIRouter(prefix="/doctors", tags=["Doctors"])


@router.get("/", response_model=List[DoctorResponse])
def list_doctors(
    specialty: Optional[str] = Query(None, description="Filter by specialty"),
    search: Optional[str] = Query(None, description="Search by doctor name"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all doctors. Optionally filter by specialty or search by name."""
    repo = DoctorRepository(db)
    return repo.list_all(specialty=specialty, search=search)


@router.get("/me", response_model=DoctorResponse)
def get_my_doctor_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("doctor", "admin")),
):
    """Get the authenticated doctor's own profile."""
    repo = DoctorRepository(db)
    doctor = repo.get_by_user_id(current_user.id)
    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor profile not found. Please complete your profile setup.",
        )
    return doctor


@router.post("/me", response_model=DoctorResponse, status_code=201)
def create_my_doctor_profile(
    payload: DoctorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("doctor", "admin")),
):
    """Create the authenticated doctor's profile (one-time setup)."""
    repo = DoctorRepository(db)
    existing = repo.get_by_user_id(current_user.id)
    if existing:
        raise HTTPException(
            status_code=409,
            detail="Doctor profile already exists. Use PUT to update.",
        )
    doctor = repo.create(
        user_id=current_user.id,
        specialty=payload.specialty,
        experience=payload.experience,
        phone=payload.phone,
        address=payload.address,
        bio=payload.bio,
        availability=payload.availability,
    )
    return doctor


@router.put("/me", response_model=DoctorResponse)
def update_my_doctor_profile(
    payload: DoctorUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("doctor", "admin")),
):
    """Update the authenticated doctor's profile."""
    repo = DoctorRepository(db)
    doctor = repo.get_by_user_id(current_user.id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile not found.")
    updated = repo.update(doctor, payload.model_dump(exclude_none=True))
    return updated


@router.get("/{doctor_id}", response_model=DoctorResponse)
def get_doctor_by_id(
    doctor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific doctor's public profile."""
    repo = DoctorRepository(db)
    doctor = repo.get_by_id(doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found.")
    return doctor


@router.delete("/{doctor_id}", status_code=204)
def delete_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Delete a doctor profile. Admin only."""
    repo = DoctorRepository(db)
    deleted = repo.delete(doctor_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Doctor not found.")
