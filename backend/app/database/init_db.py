from app.database.database import engine, Base
from app.models.user import User
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.appointment import Appointment
from app.models.report import Report
from app.models.symptom import Symptom

Base.metadata.create_all(bind=engine)

print("Database tables created successfully!")