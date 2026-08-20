from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.user_schema import UserRegister, UserLogin, UserResponse, TokenResponse
from app.services.user_service import create_user, authenticate_user
from app.utils.auth_handler import get_current_user
from app.utils.jwt_handler import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register new user (Patient, Doctor, or Admin)",
)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    new_user = create_user(db, user_data)
    access_token = create_access_token(
        data={"sub": new_user.email, "role": new_user.role, "user_id": new_user.id}
    )

    return TokenResponse(
        message="User Registered Successfully",
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(new_user),
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Authenticate user and return JWT access token",
)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    db_user = authenticate_user(db, login_data)
    access_token = create_access_token(
        data={"sub": db_user.email, "role": db_user.role, "user_id": db_user.id}
    )

    return TokenResponse(
        message="Login Successful",
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(db_user),
    )


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get currently authenticated user details",
)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user