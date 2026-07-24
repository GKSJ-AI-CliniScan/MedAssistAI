from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy.orm import Session

from backend.database import get_db

from backend import models
from backend import schemas

from backend.core.security import (
    get_password_hash,
    verify_password,
    create_access_token
)

from backend.core.dependencies import get_current_user

router = APIRouter()


# ======================================================
# Patient Registration
# ======================================================

@router.post(
    "/register",
    response_model=schemas.UserResponse
)
def register_user(
    user: schemas.PatientRegister,
    db: Session = Depends(get_db)
):

    # ==========================================
    # Check Email
    # ==========================================

    existing_email = (
        db.query(models.User)
        .filter(models.User.email == user.email)
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )

    # ==========================================
    # Check Phone Number
    # ==========================================

    existing_phone = (
        db.query(models.User)
        .filter(models.User.phone == user.phone)
        .first()
    )

    if existing_phone:
        raise HTTPException(
            status_code=400,
            detail="Phone number already registered."
        )

    # ==========================================
    # Generate Patient ID
    # ==========================================

    total_users = db.query(models.User).count()

    patient_id = f"PT{total_users + 1:06d}"

    # ==========================================
    # Hash Password
    # ==========================================

    hashed_password = get_password_hash(user.password)

    # ==========================================
    # Create User
    # ==========================================

    new_user = models.User(

        patient_id=patient_id,

        full_name=user.full_name,

        email=user.email,

        phone=user.phone,

        password=hashed_password,

        age=user.age,

        gender=user.gender,

        blood_group=user.blood_group,

        address=user.address,

        emergency_contact=user.emergency_contact,

        photo=user.photo
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ======================================================
# Patient Login (OAuth2)
# ======================================================

@router.post(
    "/login",
    response_model=schemas.LoginResponse
)
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    # ==========================================
    # Find User
    # ==========================================

    db_user = (
        db.query(models.User)
        .filter(models.User.email == form_data.username)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    # ==========================================
    # Verify Password
    # ==========================================

    if not verify_password(
        form_data.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    # ==========================================
    # Generate JWT Token
    # ==========================================

    access_token = create_access_token(
        data={
            "sub": db_user.email
        }
    )

    return {

        "access_token": access_token,

        "token_type": "bearer",

        "patient_id": db_user.patient_id,

        "full_name": db_user.full_name

    }


# ======================================================
# Get Current Logged-in User
# ======================================================

@router.get(
    "/me",
    response_model=schemas.UserResponse
)
def get_logged_in_user(
    current_user: models.User = Depends(get_current_user)
):

    return current_user