from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.user_schema import UserRegister, UserLogin
from app.services.user_service import create_user, authenticate_user
from app.utils.jwt_handler import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register", status_code=201)
def register(user: UserRegister, db: Session = Depends(get_db)):
    new_user = create_user(db, user)
    return {
        "message": "User Registered Successfully",
        "user": {
            "id": new_user.id,
            "fullname": new_user.fullname,
            "email": new_user.email,
            "role": new_user.role
        }
    }


@router.post("/login", status_code=200)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = authenticate_user(db, user)
    access_token = create_access_token(
        data={"id": db_user.id, "sub": db_user.email, "role": db_user.role}
    )
    return {
        "message": "Login Successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "fullname": db_user.fullname,
            "email": db_user.email,
            "role": db_user.role
        }
    }
