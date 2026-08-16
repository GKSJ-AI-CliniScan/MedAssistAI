"""
Auth Router – Complete Authentication Engine:
Register, Login, Google OAuth, Email Verification, Password Reset, Password Change, Token Refresh, Me
"""
import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
import urllib.parse
import requests
from app.core.database import get_db
from app.core.config import settings
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token, decode_token
from app.api.deps import get_current_user
from app.repositories import UserRepository, PatientRepository, NotificationRepository
from app.schemas import UserRegister, UserLogin, Token, RefreshTokenInput
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

class ForgotPasswordInput(BaseModel):
    email: EmailStr

class ResetPasswordInput(BaseModel):
    token: str
    new_password: str

class ChangePasswordInput(BaseModel):
    old_password: str
    new_password: str

class VerifyEmailInput(BaseModel):
    token: str

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    user_repo = UserRepository(db)
    clean_email = (payload.email or "").strip().lower()
    clean_role = (payload.role or "patient").strip().lower()

    existing_user = user_repo.get_by_email(clean_email)
    if existing_user:
        existing_role = (existing_user.role or "patient").strip().lower()
        if existing_role != clean_role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This email is already registered with another role."
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This email is already registered. Please use another email or log in."
            )

    name_parts = payload.full_name.strip().split(" ", 1)
    first_name = name_parts[0]
    last_name = name_parts[1] if len(name_parts) > 1 else ""

    user = user_repo.create(
        full_name=payload.full_name,
        email=clean_email,
        password=payload.password,
        role=clean_role,
    )
    user.first_name = first_name
    user.last_name = last_name
    user.is_email_verified = True
    user.last_login_at = datetime.datetime.utcnow()
    db.commit()

    if clean_role == "patient":
        pat_repo = PatientRepository(db)
        if not user.patient:
            pat_repo.create(user_id=user.id)
    elif clean_role == "doctor":
        from app.repositories.doctor_repository import DoctorRepository
        doc_repo = DoctorRepository(db)
        if not user.doctor:
            doc_repo.create(
                user_id=user.id,
                specialty="General Physician",
                experience=5,
                bio="Registered Medical Practitioner"
            )

    notif_repo = NotificationRepository(db)
    notif_repo.create(
        user_id=user.id,
        title="Welcome to MedAssist AI 🎉",
        message=f"Hello {user.full_name}! Your clinical account has been created. Explore disease prediction and health diagnostics.",
        type="info",
    )

    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token({"sub": str(user.id), "role": user.role})
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        user={
            "id": user.id,
            "full_name": user.full_name,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": user.role,
            "avatar_url": user.avatar_url,
            "login_provider": user.login_provider,
            "is_email_verified": user.is_email_verified,
        },
    )

@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user_repo = UserRepository(db)
    clean_email = (payload.email or "").strip().lower()
    clean_role = (payload.role or "").strip().lower() if payload.role else None

    user = user_repo.get_by_email(clean_email)
    
    # 1. Check whether email exists
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found. Please create an account first."
        )

    user_role = (user.role or "patient").strip().lower()

    # 2. Check role mismatch
    if clean_role and user_role != clean_role:
        if user_role == "patient":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This account is registered as a Patient. Please use Patient Login."
            )
        elif user_role == "doctor":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This account is registered as a Doctor. Please use Doctor Login."
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Role mismatch. Please use the correct login portal."
            )

    # 3. Check password
    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    # 4. Check active status
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Contact clinical support."
        )

    # Ensure profile records exist
    if user_role == "patient" and not user.patient:
        pat_repo = PatientRepository(db)
        pat_repo.create(user_id=user.id)
    elif user_role == "doctor" and not user.doctor:
        from app.repositories.doctor_repository import DoctorRepository
        doc_repo = DoctorRepository(db)
        doc_repo.create(
            user_id=user.id,
            specialty="General Physician",
            experience=5,
            bio="Registered Medical Practitioner"
        )

    user.last_login_at = datetime.datetime.utcnow()
    db.commit()

    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token({"sub": str(user.id), "role": user.role})
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        user={
            "id": user.id,
            "full_name": user.full_name,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": user.role,
            "avatar_url": user.avatar_url,
            "login_provider": user.login_provider,
            "is_email_verified": user.is_email_verified,
        },
    )

@router.post("/google", response_model=Token)
def google_login(payload: dict, db: Session = Depends(get_db)):
    user_repo = UserRepository(db)
    pat_repo = PatientRepository(db)
    notif_repo = NotificationRepository(db)

    email = None
    name = "Google User"
    picture = None
    google_id = payload.get("google_id", "")
    role = payload.get("role", "patient")

    id_token_str = payload.get("id_token")
    if id_token_str:
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
        email = payload.get("email")
        name = payload.get("name", "Google User")
        picture = payload.get("picture")
        google_id = payload.get("google_id", "")

    if not email:
        raise HTTPException(status_code=400, detail="Could not retrieve email from Google account credential")

    name_parts = name.strip().split(" ", 1)
    first_name = name_parts[0]
    last_name = name_parts[1] if len(name_parts) > 1 else ""

    user = user_repo.get_by_email(email)
    is_new_user = False
    if not user:
        is_new_user = True
        user = user_repo.create(
            full_name=name,
            email=email,
            password="GoogleOAuth_" + (google_id[:16] if google_id else "NoID"),
            role=role
        )
        user.first_name = first_name
        user.last_name = last_name
        user.is_email_verified = True
        if role == "patient":
            pat_repo.create(user_id=user.id)
        elif role == "doctor":
            from app.repositories.doctor_repository import DoctorRepository
            doc_repo = DoctorRepository(db)
            doc_repo.create(
                user_id=user.id,
                specialty="General Physician",
                experience=5,
                phone=user.phone,
                bio="Clinical practitioner registered via Google OAuth."
            )
    else:
        # Check role mismatch
        if user.role != role:
            if user.role == "patient":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="This account is registered as a Patient. Please use Patient Login."
                )
            elif user.role == "doctor":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="This account is registered as a Doctor. Please use Doctor Login."
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Role mismatch. Please use the correct login portal."
                )

    user.google_id = google_id or user.google_id
    user.login_provider = "google"
    user.last_login_at = datetime.datetime.utcnow()
    if picture:
        user.avatar_url = picture
    db.commit()
    db.refresh(user)

    if is_new_user:
        notif_repo.create(
            user_id=user.id,
            title="Welcome to MedAssist AI 🎉",
            message=f"Hello {user.full_name}! Your Google account has been linked successfully.",
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
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": user.role,
            "avatar_url": user.avatar_url,
            "login_provider": user.login_provider,
            "is_email_verified": user.is_email_verified,
        },
    )

@router.post("/microsoft", response_model=Token)
def microsoft_login(payload: dict, db: Session = Depends(get_db)):
    user_repo = UserRepository(db)
    pat_repo = PatientRepository(db)
    notif_repo = NotificationRepository(db)

    email = None
    name = "Microsoft User"
    picture = None
    microsoft_id = payload.get("microsoft_id", "")
    role = payload.get("role", "patient")
    access_token_str = payload.get("access_token") or payload.get("id_token")

    if access_token_str and not payload.get("email"):
        try:
            import requests
            headers = {"Authorization": f"Bearer {access_token_str}"}
            ms_res = requests.get("https://graph.microsoft.com/v1.0/me", headers=headers, timeout=5)
            if ms_res.status_code == 200:
                data = ms_res.json()
                email = data.get("mail") or data.get("userPrincipalName")
                name = data.get("displayName", "Microsoft User")
                microsoft_id = data.get("id", "")
        except Exception:
            pass

    if not email:
        email = payload.get("email")
        name = payload.get("name", "Microsoft User")
        picture = payload.get("picture")
        microsoft_id = payload.get("microsoft_id", "") or payload.get("sub", "")

    if not email:
        raise HTTPException(status_code=400, detail="Could not retrieve email from Microsoft account credential")

    name_parts = name.strip().split(" ", 1)
    first_name = name_parts[0]
    last_name = name_parts[1] if len(name_parts) > 1 else ""

    user = user_repo.get_by_email(email)
    is_new_user = False
    if not user:
        is_new_user = True
        user = user_repo.create(
            full_name=name,
            email=email,
            password="MicrosoftOAuth_" + (microsoft_id[:16] if microsoft_id else "NoID"),
            role=role
        )
        user.first_name = first_name
        user.last_name = last_name
        user.is_email_verified = True
        if role == "patient":
            pat_repo.create(user_id=user.id)
        elif role == "doctor":
            from app.repositories.doctor_repository import DoctorRepository
            doc_repo = DoctorRepository(db)
            doc_repo.create(
                user_id=user.id,
                specialty="General Physician",
                experience=5,
                phone=user.phone,
                bio="Clinical practitioner registered via Microsoft OAuth."
            )
    else:
        # Check role mismatch
        if user.role != role:
            if user.role == "patient":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="This account is registered as a Patient. Please use Patient Login."
                )
            elif user.role == "doctor":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="This account is registered as a Doctor. Please use Doctor Login."
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Role mismatch. Please use the correct login portal."
                )

    user.microsoft_id = microsoft_id or getattr(user, "microsoft_id", None)
    user.login_provider = "microsoft"
    user.last_login_at = datetime.datetime.utcnow()
    if picture:
        user.avatar_url = picture
    db.commit()
    db.refresh(user)

    if is_new_user:
        notif_repo.create(
            user_id=user.id,
            title="Welcome to MedAssist AI 🎉",
            message=f"Hello {user.full_name}! Your Microsoft account has been linked successfully.",
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
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": user.role,
            "avatar_url": user.avatar_url,
            "login_provider": user.login_provider,
            "is_email_verified": user.is_email_verified,
        },
    )

@router.get("/google/url")
def get_google_auth_url():
    """Generates the official Google OAuth2 consent URL."""
    if not settings.GOOGLE_CLIENT_ID:
        return {"url": "", "configured": False, "message": "GOOGLE_CLIENT_ID environment variable is not configured."}
    
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_CALLBACK_URL,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
    }
    url = f"https://accounts.google.com/o/oauth2/v2/auth?{urllib.parse.urlencode(params)}"
    return {"url": url, "configured": True}

@router.get("/google/callback")
def google_callback(code: str = Query(...), db: Session = Depends(get_db)):
    """Handles Google OAuth authorization code exchange."""
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        frontend_err = f"{settings.FRONTEND_URL}/auth/login?error=Google+OAuth+credentials+not+configured+on+backend"
        return RedirectResponse(url=frontend_err)
    
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": settings.GOOGLE_CALLBACK_URL,
        "grant_type": "authorization_code",
    }
    
    try:
        res = requests.post(token_url, data=data, timeout=10)
        if res.status_code != 200:
            return RedirectResponse(url=f"{settings.FRONTEND_URL}/auth/login?error=Google+token+exchange+failed")
        
        token_json = res.json()
        id_token_str = token_json.get("id_token")
        access_token_str = token_json.get("access_token")
        
        # Get user profile from Google
        user_info_res = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {access_token_str}"},
            timeout=10
        )
        if user_info_res.status_code != 200:
            return RedirectResponse(url=f"{settings.FRONTEND_URL}/auth/login?error=Failed+to+fetch+Google+user+profile")
        
        user_info = user_info_res.json()
        email = user_info.get("email")
        name = user_info.get("name", "Google User")
        picture = user_info.get("picture")
        google_id = user_info.get("sub", "")
        
        if not email:
            return RedirectResponse(url=f"{settings.FRONTEND_URL}/auth/login?error=Google+account+email+not+provided")
        
        user_repo = UserRepository(db)
        pat_repo = PatientRepository(db)
        notif_repo = NotificationRepository(db)
        
        name_parts = name.strip().split(" ", 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ""
        
        user = user_repo.get_by_email(email)
        if not user:
            user = user_repo.create(
                full_name=name,
                email=email,
                password="GoogleOAuth_" + (google_id[:16] if google_id else "NoID"),
                role="patient"
            )
            user.first_name = first_name
            user.last_name = last_name
            user.is_email_verified = True
            pat_repo.create(user_id=user.id)
            notif_repo.create(
                user_id=user.id,
                title="Welcome to MedAssist AI 🎉",
                message=f"Hello {user.full_name}! Your Google account has been linked successfully.",
                type="info"
            )
            
        user.google_id = google_id or user.google_id
        user.login_provider = "google"
        user.last_login_at = datetime.datetime.utcnow()
        if picture:
            user.avatar_url = picture
        db.commit()
        
        jwt_access = create_access_token({"sub": str(user.id), "role": user.role})
        jwt_refresh = create_refresh_token({"sub": str(user.id), "role": user.role})
        
        redirect_target = f"{settings.FRONTEND_URL}/auth/callback?access_token={jwt_access}&refresh_token={jwt_refresh}"
        return RedirectResponse(url=redirect_target)
    except Exception as e:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/auth/login?error={urllib.parse.quote(str(e))}")

@router.get("/microsoft/url")
def get_microsoft_auth_url():
    """Generates the official Microsoft Azure AD OAuth2 consent URL."""
    if not settings.MICROSOFT_CLIENT_ID:
        return {"url": "", "configured": False, "message": "MICROSOFT_CLIENT_ID environment variable is not configured."}
    
    tenant = settings.MICROSOFT_TENANT_ID or "common"
    params = {
        "client_id": settings.MICROSOFT_CLIENT_ID,
        "response_type": "code",
        "redirect_uri": settings.MICROSOFT_CALLBACK_URL,
        "response_mode": "query",
        "scope": "openid profile email User.Read",
    }
    url = f"https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?{urllib.parse.urlencode(params)}"
    return {"url": url, "configured": True}

@router.get("/microsoft/callback")
def microsoft_callback(code: str = Query(...), db: Session = Depends(get_db)):
    """Handles Microsoft OAuth authorization code exchange."""
    if not settings.MICROSOFT_CLIENT_ID or not settings.MICROSOFT_CLIENT_SECRET:
        frontend_err = f"{settings.FRONTEND_URL}/auth/login?error=Microsoft+OAuth+credentials+not+configured+on+backend"
        return RedirectResponse(url=frontend_err)
    
    tenant = settings.MICROSOFT_TENANT_ID or "common"
    token_url = f"https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token"
    data = {
        "client_id": settings.MICROSOFT_CLIENT_ID,
        "client_secret": settings.MICROSOFT_CLIENT_SECRET,
        "code": code,
        "redirect_uri": settings.MICROSOFT_CALLBACK_URL,
        "grant_type": "authorization_code",
    }
    
    try:
        res = requests.post(token_url, data=data, timeout=10)
        if res.status_code != 200:
            return RedirectResponse(url=f"{settings.FRONTEND_URL}/auth/login?error=Microsoft+token+exchange+failed")
        
        token_json = res.json()
        ms_access_token = token_json.get("access_token")
        
        # Fetch profile from Microsoft Graph
        headers = {"Authorization": f"Bearer {ms_access_token}"}
        ms_res = requests.get("https://graph.microsoft.com/v1.0/me", headers=headers, timeout=10)
        if ms_res.status_code != 200:
            return RedirectResponse(url=f"{settings.FRONTEND_URL}/auth/login?error=Failed+to+fetch+Microsoft+user+profile")
        
        profile_data = ms_res.json()
        email = profile_data.get("mail") or profile_data.get("userPrincipalName")
        name = profile_data.get("displayName", "Microsoft User")
        microsoft_id = profile_data.get("id", "")
        
        if not email:
            return RedirectResponse(url=f"{settings.FRONTEND_URL}/auth/login?error=Microsoft+account+email+not+provided")
        
        user_repo = UserRepository(db)
        pat_repo = PatientRepository(db)
        notif_repo = NotificationRepository(db)
        
        name_parts = name.strip().split(" ", 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ""
        
        user = user_repo.get_by_email(email)
        if not user:
            user = user_repo.create(
                full_name=name,
                email=email,
                password="MicrosoftOAuth_" + (microsoft_id[:16] if microsoft_id else "NoID"),
                role="patient"
            )
            user.first_name = first_name
            user.last_name = last_name
            user.is_email_verified = True
            pat_repo.create(user_id=user.id)
            notif_repo.create(
                user_id=user.id,
                title="Welcome to MedAssist AI 🎉",
                message=f"Hello {user.full_name}! Your Microsoft account has been linked successfully.",
                type="info"
            )
            
        user.microsoft_id = microsoft_id or getattr(user, "microsoft_id", None)
        user.login_provider = "microsoft"
        user.last_login_at = datetime.datetime.utcnow()
        db.commit()
        
        jwt_access = create_access_token({"sub": str(user.id), "role": user.role})
        jwt_refresh = create_refresh_token({"sub": str(user.id), "role": user.role})
        
        redirect_target = f"{settings.FRONTEND_URL}/auth/callback?access_token={jwt_access}&refresh_token={jwt_refresh}"
        return RedirectResponse(url=redirect_target)
    except Exception as e:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/auth/login?error={urllib.parse.quote(str(e))}")

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "email": current_user.email,
        "phone": current_user.phone,
        "address": current_user.address,
        "role": current_user.role,
        "avatar_url": current_user.avatar_url,
        "login_provider": current_user.login_provider,
        "is_email_verified": current_user.is_email_verified,
        "last_login_at": current_user.last_login_at.isoformat() if current_user.last_login_at else None,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
    }

@router.post("/refresh", response_model=Token)
def refresh_token(payload: RefreshTokenInput, db: Session = Depends(get_db)):
    token_data = decode_token(payload.refresh_token)
    if not token_data:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    user_repo = UserRepository(db)
    user = user_repo.get_by_id(int(token_data.get("sub", 0)))
    if not user:
        raise HTTPException(status_code=401, detail="User session not found")
    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    new_refresh = create_refresh_token({"sub": str(user.id), "role": user.role})
    return Token(
        access_token=access_token,
        refresh_token=new_refresh,
        user={
            "id": user.id,
            "full_name": user.full_name,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": user.role,
            "avatar_url": user.avatar_url,
            "login_provider": user.login_provider,
            "is_email_verified": user.is_email_verified,
        },
    )

@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordInput, db: Session = Depends(get_db)):
    user_repo = UserRepository(db)
    user = user_repo.get_by_email(payload.email)
    if not user:
        return {"message": "If an account exists with that email, a password reset link has been issued."}
    import uuid
    reset_token = str(uuid.uuid4())
    user.reset_token = reset_token
    db.commit()
    return {"message": "Password reset token generated.", "reset_token": reset_token}

@router.post("/reset-password")
def reset_password(payload: ResetPasswordInput, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.reset_token == payload.token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired password reset token")
    user.hashed_password = get_password_hash(payload.new_password)
    user.reset_token = None
    db.commit()
    return {"message": "Password reset successfully. You may now log in."}

@router.post("/change-password")
def change_password(payload: ChangePasswordInput, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not verify_password(payload.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    current_user.hashed_password = get_password_hash(payload.new_password)
    db.commit()
    return {"message": "Password updated successfully."}

@router.post("/verify-email")
def verify_email(payload: VerifyEmailInput, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.verification_token == payload.token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email verification token")
    user.is_email_verified = True
    user.verification_token = None
    db.commit()
    return {"message": "Email verified successfully."}

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Logout recorded successfully."}
