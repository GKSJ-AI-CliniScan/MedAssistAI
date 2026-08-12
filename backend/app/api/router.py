from fastapi import APIRouter
from app.api.endpoints import auth, profile, history, symptoms, predictions

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(profile.router, prefix="/profile", tags=["Patient Profile"])
api_router.include_router(symptoms.router, prefix="/symptoms", tags=["Symptoms Catalog"])
api_router.include_router(history.router, prefix="/history", tags=["Consultation History"])

from app.api.endpoints import (
    auth,
    profile,
    symptoms,
    history,
    dashboard,
    users,
    reports,
    notifications
)

api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(predictions.router, prefix="/predictions", tags=["Predictions"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])