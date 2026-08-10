from app.api.routers.auth import router as auth_router
from app.api.routers.patients import router as patients_router
from app.api.routers.symptoms import router as symptoms_router
from app.api.routers.predictions import router as predictions_router
from app.api.routers.reports import router as reports_router
from app.api.routers.dashboard import router as dashboard_router
from app.api.routers.notifications import router as notifications_router
from app.api.routers.doctors import router as doctors_router
from app.api.routers.appointments import router as appointments_router
from app.api.routers.admin import router as admin_router
from app.api.routers.search import router as search_router

__all__ = [
    "auth_router",
    "patients_router",
    "symptoms_router",
    "predictions_router",
    "reports_router",
    "dashboard_router",
    "notifications_router",
    "doctors_router",
    "appointments_router",
    "admin_router",
    "search_router",
]
