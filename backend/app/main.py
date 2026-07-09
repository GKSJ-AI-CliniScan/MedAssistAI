from fastapi import FastAPI

from app.config.settings import settings
import app.models
from app.routers import home, auth, patient, doctor, appointment, report, symptom

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG
)

app.include_router(home.router)
app.include_router(auth.router)
app.include_router(patient.router)
app.include_router(doctor.router)
app.include_router(appointment.router)
app.include_router(report.router)
app.include_router(symptom.router)
