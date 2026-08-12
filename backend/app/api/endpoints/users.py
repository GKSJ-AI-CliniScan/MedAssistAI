from fastapi import APIRouter, Depends
from app.core.database import get_database
from app.core.security import get_current_user

router = APIRouter()


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    db = get_database()

    user = await db.users.find_one({
        "email": current_user["email"]
    })

    if not user:
        return {}

    user.pop("_id", None)

    return user


@router.put("/me")
async def update_me(
    data: dict,
    current_user: dict = Depends(get_current_user)
):
    db = get_database()

    await db.users.update_one(
        {"email": current_user["email"]},
        {"$set": data}
    )

    user = await db.users.find_one({
        "email": current_user["email"]
    })

    user.pop("_id", None)

    return {
        "user": user
    }


@router.put("/me/settings")
async def update_settings(
    data: dict,
    current_user: dict = Depends(get_current_user)
):
    db = get_database()

    await db.users.update_one(
        {"email": current_user["email"]},
        {
            "$set": {
                "settings": data
            }
        }
    )

    return {
        "message": "Settings updated successfully"
    }