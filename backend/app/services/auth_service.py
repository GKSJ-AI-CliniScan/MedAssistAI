from fastapi import HTTPException, status
from app.core.database import get_database
from app.core.security import get_password_hash, verify_password, create_access_token
from app.schemas.auth import UserRegister, Token
from app.models.user import UserDB, UserRole
from app.models.profile import PatientProfileDB
from bson import ObjectId
from datetime import datetime

async def register_user(register_data: UserRegister):
    db = get_database()
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": register_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
        
    # Create user document
    hashed_pw = get_password_hash(register_data.password)
    user_id = str(ObjectId())
    
    user_doc = {
        "_id": user_id,
        "email": register_data.email,
        "hashed_password": hashed_pw,
        "role": register_data.role or UserRole.PATIENT,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    await db.users.insert_one(user_doc)
    
    # Create patient profile if user is a patient
    if user_doc["role"] == UserRole.PATIENT:
        profile_id = str(ObjectId())
        profile_doc = {
            "_id": profile_id,
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
        await db.profiles.insert_one(profile_doc)
        
    return {
        "id": user_doc["_id"],
        "email": user_doc["email"],
        "role": user_doc["role"]
    }

async def authenticate_user(email: str, password: str) -> Token:
    db = get_database()
    user = await db.users.find_one({"email": email})
    
    if not user or not verify_password(password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = create_access_token(
        data={"sub": user["_id"], "email": user["email"], "role": user["role"]}
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        role=user["role"]
    )
