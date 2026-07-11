from fastapi import APIRouter
from app.api.endpoints import auth, profile, symptoms, history

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(profile.router, prefix="/profile", tags=["Patient Profile"])
api_router.include_router(symptoms.router, prefix="/symptoms", tags=["Symptoms Catalog"])
api_router.include_router(history.router, prefix="/history", tags=["Consultation History"])
