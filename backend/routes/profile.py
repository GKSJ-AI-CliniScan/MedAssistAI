from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import User
from backend.schemas import (
    UpdateProfileRequest,
    ChangePasswordRequest
)

from backend.core.security import (
    verify_password,
    get_password_hash
)

router = APIRouter()


# =====================================================
# Home
# =====================================================

@router.get("/")
def profile_home():

    return {
        "message": "Profile Settings API"
    }


# =====================================================
# Get Patient Profile
# =====================================================

@router.get("/{patient_id}")
def get_profile(
    patient_id: str,
    db: Session = Depends(get_db)
):

    patient = db.query(User).filter(
        User.patient_id == patient_id
    ).first()

    if patient is None:

        raise HTTPException(
            status_code=404,
            detail="Patient not found."
        )

    return {

        "patient_id": patient.patient_id,

        "full_name": patient.full_name,

        "email": patient.email,

        "phone": patient.phone,

        "age": patient.age,

        "gender": patient.gender,

        "blood_group": patient.blood_group,

        "address": patient.address,

        "emergency_contact": patient.emergency_contact,

        "photo": patient.photo,

        "created_at": patient.created_at

    }


# =====================================================
# Update Patient Profile
# =====================================================

@router.put("/update")
def update_profile(
    request: UpdateProfileRequest,
    db: Session = Depends(get_db)
):

    patient = db.query(User).filter(
        User.patient_id == request.patient_id
    ).first()

    if patient is None:

        raise HTTPException(
            status_code=404,
            detail="Patient not found."
        )

    # =====================================================
    # Update Editable Fields
    # =====================================================

    patient.full_name = request.full_name
    patient.email = request.email
    patient.phone = request.phone
    patient.age = request.age
    patient.gender = request.gender
    patient.blood_group = request.blood_group
    patient.address = request.address
    patient.emergency_contact = request.emergency_contact
    patient.photo = request.photo

    db.commit()
    db.refresh(patient)

    return {

        "message": "Profile updated successfully.",

        "patient": {

            "patient_id": patient.patient_id,

            "full_name": patient.full_name,

            "email": patient.email,

            "phone": patient.phone,

            "age": patient.age,

            "gender": patient.gender,

            "blood_group": patient.blood_group,

            "address": patient.address,

            "emergency_contact": patient.emergency_contact,

            "photo": patient.photo,

            "created_at": patient.created_at

        }

    }


# =====================================================
# Change Password
# =====================================================

@router.put("/change-password")
def change_password(
    request: ChangePasswordRequest,
    db: Session = Depends(get_db)
):

    patient = db.query(User).filter(
        User.patient_id == request.patient_id
    ).first()

    if patient is None:

        raise HTTPException(
            status_code=404,
            detail="Patient not found."
        )

    # =====================================================
    # Verify Current Password
    # =====================================================

    if not verify_password(
        request.current_password,
        patient.password
    ):

        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect."
        )

    # =====================================================
    # Prevent Same Password
    # =====================================================

    if request.current_password == request.new_password:

        raise HTTPException(
            status_code=400,
            detail="New password must be different from current password."
        )

    # =====================================================
    # Hash New Password
    # =====================================================

    patient.password = get_password_hash(
        request.new_password
    )

    db.commit()

    return {

        "message": "Password changed successfully."

    }