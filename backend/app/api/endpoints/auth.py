from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.auth import UserRegister, UserResponse, Token
from app.services.auth_service import register_user, authenticate_user
from app.core.security import get_current_user

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    return await register_user(user_data)

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # OAuth2PasswordRequestForm stores email in form_data.username
    return await authenticate_user(form_data.username, form_data.password)

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user
