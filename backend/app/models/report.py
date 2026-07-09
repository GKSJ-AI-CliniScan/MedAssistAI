from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=True)
    appointment_id = Column(Integer, ForeignKey("appointments.id"), nullable=True)

    report_type = Column(String, nullable=False, default="disease_prediction")
    title = Column(String, nullable=True)
    diagnosis = Column(Text, nullable=True)
    risk_level = Column(String, nullable=True)
    recommendations = Column(Text, nullable=True)
    file_url = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    patient = relationship("Patient", back_populates="reports")
    doctor = relationship("Doctor", back_populates="reports")
    appointment = relationship("Appointment", back_populates="reports")
