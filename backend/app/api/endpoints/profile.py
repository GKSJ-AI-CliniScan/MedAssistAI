from fastapi import APIRouter, Depends, HTTPException, status
from app.core.database import get_database
from app.core.security import get_current_user
from app.schemas.profile import PatientProfileResponse, PatientProfileUpdate
from datetime import datetime

router = APIRouter()

@router.get("", response_model=PatientProfileResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    db = get_database()
    profile = await db.profiles.find_one({"user_id": current_user["id"]})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found"
        )
    # Map _id to id for Response schema matching
    profile["id"] = profile["_id"]
    return profile

@router.put("", response_model=PatientProfileResponse)
async def update_profile(
    profile_data: PatientProfileUpdate,
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    profile = await db.profiles.find_one({"user_id": current_user["id"]})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found"
        )
        
    update_dict = {k: v for k, v in profile_data.model_dump(exclude_unset=True).items() if v is not None}
    if update_dict:
        update_dict["updated_at"] = datetime.utcnow()
        await db.profiles.update_one(
            {"user_id": current_user["id"]},
            {"$set": update_dict}
        )
        
    updated_profile = await db.profiles.find_one({"user_id": current_user["id"]})
    updated_profile["id"] = updated_profile["_id"]
    return updated_profile
