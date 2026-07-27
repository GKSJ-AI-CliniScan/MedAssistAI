import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=True)
    doctor_name = Column(String(255), nullable=False)
    doctor_specialty = Column(String(100), default="General Physician")
    date_time = Column(String(100), nullable=False)
    priority = Column(String(50), default="normal")
    status = Column(String(50), default="confirmed")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")
