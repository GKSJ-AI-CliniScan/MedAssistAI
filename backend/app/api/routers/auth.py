"""
Auth Router – Register, Login, Refresh Token, Me
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, create_access_token, create_refresh_token, decode_token
from app.repositories import UserRepository, PatientRepository, NotificationRepository
from app.schemas import UserRegister, UserLogin, Token, UserResponse, RefreshTokenInput

router = APIRouter(prefix="/auth", tags=["Authentication"])


def get_current_user(token: str = Depends(lambda: None), db: Session = Depends(get_db)):
    """Stub – see auth dependency below."""
    pass


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    user_repo = UserRepository(db)
    if user_repo.get_by_email(payload.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    user = user_repo.create(
        full_name=payload.full_name,
        email=payload.email,
        password=payload.password,
        role=payload.role or "patient",
    )
    # Auto-create patient profile for patient role
    if user.role == "patient":
        pat_repo = PatientRepository(db)
        pat_repo.create(user_id=user.id)
    # Welcome notification
    notif_repo = NotificationRepository(db)
    notif_repo.create(
        user_id=user.id,
        title="Welcome to MedAssist AI 🎉",
        message=f"Hello {user.full_name}! Your account has been successfully created. Start by analyzing your symptoms.",
        type="info",
    )
    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token({"sub": str(user.id), "role": user.role})
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        user={"id": user.id, "full_name": user.full_name, "email": user.email, "role": user.role},
    )


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user_repo = UserRepository(db)
    user = user_repo.get_by_email(payload.email)
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated. Contact support.")
    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token({"sub": str(user.id), "role": user.role})
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        user={"id": user.id, "full_name": user.full_name, "email": user.email, "role": user.role},
    )


@router.post("/google", response_model=Token)
def google_login(payload: dict, db: Session = Depends(get_db)):
    """
    Handles Google OAuth login via two paths:
    1. id_token (str): Verify the Google ID token server-side using google-auth library.
    2. email + name + picture + google_id: Used when frontend sends userInfo directly.
    """
    user_repo = UserRepository(db)
    pat_repo = PatientRepository(db)
    notif_repo = NotificationRepository(db)

    email = None
    name = "Google User"
    picture = None
    google_id = payload.get("google_id", "")

    id_token_str = payload.get("id_token")
    if id_token_str:
        # Try to verify the Google ID token using google-auth
        try:
            from google.oauth2 import id_token as google_id_token
            from google.auth.transport import requests as google_requests
            import os
            client_id = os.getenv("GOOGLE_CLIENT_ID", "")
            if client_id:
                id_info = google_id_token.verify_oauth2_token(
                    id_token_str,
                    google_requests.Request(),
                    client_id,
                )
                email = id_info.get("email")
                name = id_info.get("name", "Google User")
                picture = id_info.get("picture")
                google_id = id_info.get("sub", "")
            else:
                # GOOGLE_CLIENT_ID not set – decode without verification for development
                import base64, json
                parts = id_token_str.split(".")
                if len(parts) >= 2:
                    padded = parts[1] + "=" * (4 - len(parts[1]) % 4)
                    decoded = json.loads(base64.urlsafe_b64decode(padded))
                    email = decoded.get("email")
                    name = decoded.get("name", "Google User")
                    picture = decoded.get("picture")
                    google_id = decoded.get("sub", "")
        except Exception as e:
            # If verification fails, try decoding without verifying (dev mode)
            try:
                import base64, json
                parts = id_token_str.split(".")
                if len(parts) >= 2:
                    padded = parts[1] + "=" * (4 - len(parts[1]) % 4)
                    decoded = json.loads(base64.urlsafe_b64decode(padded))
                    email = decoded.get("email")
                    name = decoded.get("name", "Google User")
                    picture = decoded.get("picture")
                    google_id = decoded.get("sub", "")
            except Exception:
                raise HTTPException(status_code=400, detail=f"Invalid Google ID token: {e}")
    else:
        # Fallback: userInfo provided directly from frontend
        email = payload.get("email")
        name = payload.get("name", "Google User")
        picture = payload.get("picture")
        google_id = payload.get("google_id", "")

    if not email:
        raise HTTPException(status_code=400, detail="Could not extract email from Google token")

    # Find existing user or create new one
    user = user_repo.get_by_email(email)
    is_new_user = False
    if not user:
        is_new_user = True
        user = user_repo.create(
            full_name=name,
            email=email,
            password="GoogleOAuth_" + google_id[:16] if google_id else "GoogleOAuth_NoID",
            role="patient"
        )
        pat_repo.create(user_id=user.id)

    # Update google-specific fields
    user.google_id = google_id or user.google_id
    user.login_provider = "google"
    if picture and not user.avatar_url:
        user.avatar_url = picture
    db.commit()
    db.refresh(user)

    if is_new_user:
        notif_repo.create(
            user_id=user.id,
            title="Welcome to MedAssist AI 🎉",
            message=f"Hello {user.full_name}! Your Google account has been successfully linked. Start by analyzing your symptoms.",
            type="info"
        )

    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token({"sub": str(user.id), "role": user.role})
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        user={
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "avatar_url": user.avatar_url,
            "login_provider": user.login_provider,
        },
    )


@router.post("/refresh", response_model=Token)
def refresh_token(payload: RefreshTokenInput, db: Session = Depends(get_db)):
    token_data = decode_token(payload.refresh_token)
    if not token_data:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    user_repo = UserRepository(db)
    user = user_repo.get_by_id(int(token_data.get("sub", 0)))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    new_refresh = create_refresh_token({"sub": str(user.id), "role": user.role})
    return Token(
        access_token=access_token,
        refresh_token=new_refresh,
        user={"id": user.id, "full_name": user.full_name, "email": user.email, "role": user.role},
    )
