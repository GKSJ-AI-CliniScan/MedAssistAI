from fastapi import APIRouter, Depends, status
from pydantic import BaseModel

from app.schemas.auth import UserRegister, UserResponse, Token, UserLogin
from app.services.auth_service import (
    register_user,
    authenticate_user,
    google_login
)

from app.core.security import get_current_user

router = APIRouter()



@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
async def register(user_data: UserRegister):
    return await register_user(user_data)


@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    return await authenticate_user(
        user.username,
        user.password
    )


from app.services.auth_service import google_login as google_auth


@router.post("/google")
async def google(data: dict):
    return await google_auth(data)



@router.get("/me")
async def get_me(
    current_user: dict = Depends(get_current_user)
):
    return current_user