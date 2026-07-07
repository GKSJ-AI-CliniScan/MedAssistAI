from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user_schema import UserRegister
from app.utils.password import hash_password


def create_user(db: Session, user: UserRegister):

    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Email already registered"
        )

    db_user = User(
        fullname=user.name,
        email=user.email,
        password=hash_password(user.password),
        role="patient"
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user