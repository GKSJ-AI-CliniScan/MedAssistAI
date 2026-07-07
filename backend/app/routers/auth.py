from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.user_schema import UserRegister
from app.database.session import get_db
from app.services.user_service import create_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
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