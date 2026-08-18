from fastapi import HTTPException, status
from app.core.database import get_database
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
)
from app.schemas.auth import UserRegister, Token
from app.models.user import UserRole
from bson import ObjectId
from datetime import datetime


async def register_user(register_data: UserRegister):
    db = get_database()

    existing_user = await db.users.find_one({"email": register_data.email})

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    user_id = str(ObjectId())

    user = {
        "_id": user_id,
        "email": register_data.email,
        "hashed_password": get_password_hash(register_data.password),
        "role": register_data.role or UserRole.PATIENT,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    await db.users.insert_one(user)

    profile = {
        "_id": str(ObjectId()),
        "user_id": user_id,
        "first_name": register_data.first_name,
        "last_name": register_data.last_name,
        "date_of_birth": None,
        "gender": None,
        "blood_type": None,
        "height": None,
        "weight": None,
        "allergies": [],
        "medical_conditions": [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    await db.profiles.insert_one(profile)

    return {
        "id": user_id,
        "email": user["email"],
        "role": user["role"]
    }


async def authenticate_user(email: str, password: str) -> Token:
    db = get_database()

    user = await db.users.find_one({"email": email})

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )

    if not verify_password(password, user["hashed_password"]):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )

    # Support legacy users that don't have an _id
    if "_id" not in user:
        user["_id"] = str(ObjectId())

    if "role" not in user:
        user["role"] = UserRole.PATIENT

    token = create_access_token(
        data={
            "sub": str(user["_id"]),
            "email": user["email"],
            "role": user["role"]
        }
    )

    return Token(
        access_token=token,
        token_type="bearer",
        role=user["role"]
    )


async def google_login(data: dict):
    db = get_database()

    email = data.get("email")
    name = data.get("name", "")

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Email is required"
        )

    user = await db.users.find_one({"email": email})

    if user is None:

        user_id = str(ObjectId())

        user = {
            "_id": user_id,
            "email": email,
            "hashed_password": "",
            "role": UserRole.PATIENT,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        await db.users.insert_one(user)

        profile = {
            "_id": str(ObjectId()),
            "user_id": user_id,
            "first_name": name,
            "last_name": "",
            "date_of_birth": None,
            "gender": None,
            "blood_type": None,
            "height": None,
            "weight": None,
            "allergies": [],
            "medical_conditions": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        await db.profiles.insert_one(profile)

    if "_id" not in user:
        user["_id"] = str(ObjectId())

    if "role" not in user:
        user["role"] = UserRole.PATIENT

        # Ensure legacy/local users have an ID
    if "_id" not in user:
        user["_id"] = str(ObjectId())

    if "role" not in user:
        user["role"] = UserRole.PATIENT

    token = create_access_token(
        data={
            "sub": str(user["_id"]),
            "email": user["email"],
            "role": user["role"]
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user["role"],
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "role": user["role"]
        }
    }